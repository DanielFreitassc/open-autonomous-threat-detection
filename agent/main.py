import socket
import pandas as pd
import re
import os
import joblib
import time
import requests
import math
from datetime import datetime
from collections import Counter
from sklearn.ensemble import IsolationForest

# --- CONFIGURAÇÕES ---
IP_LISTEN = "0.0.0.0"
PORT_LISTEN = 5140
BUFFER_SIZE = 2048
ARQUIVO_MODELO = "modelo_ia.pkl"
ARQUIVO_TREINO = "dataset_treino.csv"
ARQUIVO_FREQUENCIAS = "frequencia_rotas.pkl"
WHITELIST_FILE = "whitelist_features.csv"
LIMITE_LOGS_TREINO = 1000  

# REST API do CSIRT
API_ENDPOINT = "http://localhost:8080/api/v1/events"
BEARER_TOKEN = os.getenv("CSIRT_API_TOKEN", "")

MIN_PORCENTAGEM_ROTA = 0.05 

# --- FUNÇÕES DE APOIO ---

def obter_geolocalizacao(ip):
    """Consulta o IP e retorna Localização, Lat e Lon (com fallback para local)."""
    # Se o IP for local ou de rede interna do Docker (172.x)
    if ip in ["127.0.0.1", "0.0.0.0"] or ip.startswith(("192.168.", "172.", "10.")):
        # Retorna as coordenadas manuais solicitadas
        return "Brasil (Local)", -28.6775, -49.3697
    
    try:
        response = requests.get(f"http://ip-api.com/json/{ip}", timeout=2)
        if response.status_code == 200:
            d = response.json()
            if d.get("status") == "success":
                loc = f"{d.get('city', 'Desconhecida')}, {d.get('country', 'Desconhecido')}"
                return loc, float(d.get('lat', 0.0)), float(d.get('lon', 0.0))
    except Exception as e:
        print(f"⚠️ Erro ao buscar GeoIP: {e}")
    
    # Fallback caso a API falhe mas seja um IP externo
    return "Desconhecido", 0.0, 0.0

def extrair_dados_log(log_msg):
    """Extrai Rota, Status Code, Tamanho e metadados do Syslog/Nginx."""
    dados_extras = {
        "host": "unknown",
        "service": "unknown",
        "ip": "0.0.0.0",
        "method": "UNKNOWN",
        "protocol": "HTTP/1.1",
        "user_agent": "Unknown"
    }
    
    # Extração de cabeçalho Syslog (Host, Serviço e IP)
    syslog_match = re.search(r'<\d+>[A-Za-z]+\s+\d+\s+\d{2}:\d{2}:\d{2}\s+([^\s]+)\s+([^:]+):\s+([\d\.]+)', log_msg)
    if syslog_match:
        dados_extras["host"] = syslog_match.group(1)
        dados_extras["service"] = syslog_match.group(2)
        dados_extras["ip"] = syslog_match.group(3)
    else:
        match_ip = re.search(r'(\d+\.\d+\.\d+\.\d+)', log_msg)
        if match_ip: dados_extras["ip"] = match_ip.group(1)

    # Extração da requisição HTTP
    req_match = re.search(r'\"([A-Z]+) (.*?) (HTTP/\d\.\d)\" (\d{3}) (\d+)', log_msg)
    if req_match:
        dados_extras["method"] = req_match.group(1)
        rota = req_match.group(2).split('?')[0]
        dados_extras["protocol"] = req_match.group(3)
        status, tamanho = int(req_match.group(4)), int(req_match.group(5))
        
        ua_match = re.search(r'\"[A-Z]+ .*? HTTP/.*?\".*?\".*?\"\s+\"(.*?)\"', log_msg)
        if ua_match: dados_extras["user_agent"] = ua_match.group(1)
            
        return rota, [status, tamanho], dados_extras
        
    return None, None, None

def enviar_alerta_rest(log_line, rota, features, motivo_anomalia, dados_extras):
    """Monta o payload JSON e envia para o backend centralizado."""
    timestamp_agora = datetime.now().isoformat()
    localizacao, lat, lon = obter_geolocalizacao(dados_extras["ip"])

    payload = {
        "events": {
            "timestamp": timestamp_agora,
            "category": "web_attack", 
            "type": "comportamento_suspeito", 
            "outcome": "detected" 
        },
        "httpRequests": [
            {
                "method": dados_extras["method"],
                "endpoint": rota,
                "statusCode": features[0],
                "protocol": dados_extras["protocol"]
            }
        ],
        "rawLogs": {
            "raw": log_line.strip()
        },
        "sourcers": {
            "service": dados_extras["service"], 
            "engine": "IA-CSIRT-Central",
            "host": dados_extras["host"],
            "clientIp": dados_extras["ip"],
            "userAgent": dados_extras["user_agent"],
            "location": localizacao,
            "latitude": lat,
            "longitude": lon
        },
        "anomaly": {
            "rule": "Regra IA - Desvio de Padrão",
            "severity": "HIGH",
            "title": motivo_anomalia,
            "description": f"A rota {rota} disparou um alerta detectado por Isolation Forest.",
            "timestamp": timestamp_agora
        }
    }

    headers = {"Authorization": f"Bearer {BEARER_TOKEN}", "Content-Type": "application/json"}

    try:
        response = requests.post(API_ENDPOINT, json=payload, headers=headers, timeout=5)
        if response.status_code in [200, 201, 202]:
            print(f"📡 Alerta enviado via REST! Status: {response.status_code}")
        else:
            print(f"⚠️ Erro na API: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Falha de conexão: {e}")

def carregar_whitelist():
    if os.path.exists(WHITELIST_FILE):
        return pd.read_csv(WHITELIST_FILE).values.tolist()
    return []

def salvar_na_whitelist(features):
    novo_dado = pd.DataFrame([features], columns=['status', 'tamanho'])
    novo_dado.to_csv(WHITELIST_FILE, mode='a', index=False, header=not os.path.exists(WHITELIST_FILE))

# --- INICIALIZAÇÃO ---

if os.path.exists(ARQUIVO_MODELO) and os.path.exists(ARQUIVO_FREQUENCIAS):
    model = joblib.load(ARQUIVO_MODELO)
    frequencia_rotas = joblib.load(ARQUIVO_FREQUENCIAS)
    fase_treino_ativa = False
    print("🧠 Modelo carregado e monitorando.")
else:
    model = IsolationForest(contamination=0.05, random_state=42)
    frequencia_rotas = {}
    fase_treino_ativa = True

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind((IP_LISTEN, PORT_LISTEN))
whitelist = carregar_whitelist()
coletados_treino, rotas_treino = [], []

print(f"🚀 Agente IA ativo em {IP_LISTEN}:{PORT_LISTEN}")

# --- LOOP PRINCIPAL ---

try:
    while True:
        data, addr = sock.recvfrom(BUFFER_SIZE)
        log_line = data.decode('utf-8', errors='ignore')
        rota, features, dados_extras = extrair_dados_log(log_line)

        if not features: continue

        if fase_treino_ativa:
            coletados_treino.append(features)
            rotas_treino.append(rota)
            print(f"📖 Aprendendo: {len(coletados_treino)}/{LIMITE_LOGS_TREINO}", end='\r')
            if len(coletados_treino) >= LIMITE_LOGS_TREINO:
                df_treino = pd.DataFrame(coletados_treino, columns=['status', 'tamanho'])
                model.fit(df_treino)
                joblib.dump(model, ARQUIVO_MODELO)
                c = Counter(rotas_treino)
                frequencia_rotas = {r: (q / len(rotas_treino)) for r, q in c.items()}
                joblib.dump(frequencia_rotas, ARQUIVO_FREQUENCIAS)
                fase_treino_ativa = False
                print("\n✅ Treino concluído!")
            continue

        is_anomalia, motivo = False, ""
        if frequencia_rotas.get(rota, 0.0) < MIN_PORCENTAGEM_ROTA:
            is_anomalia, motivo = True, f"ROTA INCOMUM ({frequencia_rotas.get(rota, 0.0)*100:.2f}%)"
        elif features not in whitelist:
            df_features = pd.DataFrame([features], columns=['status', 'tamanho'])
            if model.predict(df_features)[0] == -1:
                is_anomalia, motivo = True, "COMPORTAMENTO ANÔMALO (IA)"

        if is_anomalia:
            print(f"\n⚠️ ANOMALIA: {log_line.strip()}")
            enviar_alerta_rest(log_line, rota, features, motivo, dados_extras)
            feedback = input("❓ Falso positivo? (s/n): ").lower()
            if feedback == 's':
                salvar_na_whitelist(features)
                whitelist.append(features)
                print("✔️ Whitelisted.")
            else:
                print("🚨 Incidente confirmado.")
        else:
            print(f"✅ NORMAL: {rota} -> {features}")

except KeyboardInterrupt:
    print("\n🛑 Encerrado.")
finally:
    sock.close()