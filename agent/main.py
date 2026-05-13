import socket
import pandas as pd
import re
import os
import joblib
import requests
import psycopg2
import threading
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from collections import Counter
from sklearn.ensemble import IsolationForest
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env
load_dotenv()

# --- CONFIGURAÇÕES DO AGENTE ---
IP_LISTEN = os.getenv("IP_LISTEN", "0.0.0.0")
PORT_LISTEN = int(os.getenv("PORT_LISTEN", 5140))
BUFFER_SIZE = 2048
ARQUIVO_MODELO = "modelo_ia.pkl"
ARQUIVO_FREQUENCIAS = "frequencia_rotas.pkl"
LIMITE_LOGS_TREINO = 1000 

# --- CONFIGURAÇÕES REST (FLASK) ---
FLASK_PORT = int(os.getenv("FLASK_PORT", 5000))
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "SuperSenha2026") 

# --- API E BANCO ---
API_ENDPOINT = os.getenv("API_ENDPOINT", "http://localhost:8080/api/v1/events")
BEARER_TOKEN = os.getenv("API_TOKEN", "") 

# Configuração do DB
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": os.getenv("DB_PORT", "5432"),
    "database": os.getenv("DB_NAME", "db"),
    "user": os.getenv("DB_USER", "admin"),
    "password": os.getenv("DB_PASSWORD", "admin")
}

MIN_PORCENTAGEM_ROTA = 0.05 

# --- INICIALIZAÇÃO DO FLASK (API EMBUTIDA) ---
app = Flask(__name__)
CORS(app) # Habilita o CORS para todas as rotas do Flask

@app.route('/api/config/token', methods=['POST', 'OPTIONS'])
def update_token():
    """Endpoint REST para atualizar o token em tempo real via Body."""
    global BEARER_TOKEN 
    
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    dados = request.get_json()

    if not dados or 'token' not in dados or 'adminPassword' not in dados:
        return jsonify({"erro": "Os campos 'token' e 'adminPassword' são obrigatórios no corpo da requisição."}), 400

    if dados['adminPassword'] != ADMIN_PASSWORD:
        print("⚠️ Tentativa de atualização de token falhou: Senha incorreta.")
        return jsonify({"erro": "Acesso negado: Senha incorreta."}), 401

    BEARER_TOKEN = dados['token']
    print(f"\n🔐 Sucesso! Token atualizado via REST. Novo tamanho: {len(BEARER_TOKEN)} caracteres.")
    return jsonify({"mensagem": "Token atualizado com sucesso!"}), 200

def run_flask():
    """Roda o servidor web na porta definida, desativando os logs padrões."""
    import logging
    log = logging.getLogger('werkzeug')
    log.setLevel(logging.ERROR)
    app.run(host='0.0.0.0', port=FLASK_PORT, debug=False, use_reloader=False)

# --- FUNÇÕES DE APOIO ---

def verificar_whitelist_banco(endpoint, status, tamanho_atual):
    """Verifica a whitelist com uma margem de tolerância de 15% no tamanho do body."""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # Pega o tamanho base que o admin salvou como "normal" na Whitelist
        query = "SELECT body_size FROM whitelist WHERE endpoint = %s AND status_code = %s"
        cur.execute(query, (endpoint, str(status)))
        resultado = cur.fetchone()
        cur.close()
        conn.close()
        
        # Se encontrou a rota e o status na whitelist
        if resultado:
            tamanho_salvo = int(resultado[0])
            
            # Se o tamanho for 0 (caso queira uma regra coringa que ignora tamanho)
            if tamanho_salvo == 0:
                return True
                
            # Calcula a diferença percentual entre o log atual e o salvo na regra
            diferenca = abs(tamanho_atual - tamanho_salvo)
            margem_tolerancia = tamanho_salvo * 0.15 # 15% de tolerância
            
            if diferenca <= margem_tolerancia:
                return True # É só a variação normal da página (Falso Positivo)
            else:
                print(f"⚠️ Whitelist ignorada para {endpoint}: Variação suspeita! (Esperado: ~{tamanho_salvo}, Atual: {tamanho_atual})")
                return False # Saiu da margem, deixa a IA analisar!
                
        return False
    except Exception as e:
        print(f"⚠️ Erro ao consultar banco: {e}")
        return False

def extrair_dados_log(log_msg):
    dados_extras = {
        "host": "unknown", "service": "unknown", "ip": "0.0.0.0", 
        "method": "UNKNOWN", "protocol": "HTTP/1.1", "user_agent": "Unknown"
    }
    
    syslog_match = re.search(r'<\d+>[A-Za-z]+\s+\d+\s+\d{2}:\d{2}:\d{2}\s+([^\s]+)\s+([^:]+):\s+([\d\.]+)', log_msg)
    if syslog_match:
        dados_extras["host"], dados_extras["service"], dados_extras["ip"] = syslog_match.groups()

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

def enviar_alerta_rest(log_line, rota, features_ia, motivo, dados_extras):
    """Monta o payload JSON atualizado e envia para o backend centralizado."""
    global BEARER_TOKEN
    timestamp = datetime.now().isoformat()
    
    payload = {
        "events": {
            "timestamp": timestamp,
            "category": "web_attack",
            "type": "comportamento_suspeito", 
            "outcome": "detected"
        },
        "features": {
            "requestRate": 0.0,
            "failedLoginCount": 0,
            "geoDistanceKm": 0.0
        },
        "httpRequests": [
            {
                "method": dados_extras["method"],
                "endpoint": rota,
                "statusCode": str(features_ia[0]), 
                "bodySize": str(features_ia[1]),  
                "protocol": dados_extras["protocol"]
            }
        ],
        "rawLogs": {
            "raw": log_line.strip()
        },
        "sourcers": {
            "service": dados_extras["service"],
            "engine": "IA-Central", 
            "host": dados_extras["host"], 
            "clientIp": dados_extras["ip"],
            "userAgent": dados_extras["user_agent"]
        },
        "anomaly": {
            "rule": "Regra IA - Desvio de Padrão",
            "severity": "HIGH",
            "title": motivo,
            "description": f"A rota {rota} disparou um alerta. Modelo de ML classificou como anomalia.",
            "timestamp": timestamp
        }
    }

    headers = {"Authorization": f"Bearer {BEARER_TOKEN}", "Content-Type": "application/json"}
    
    try:
        response = requests.post(API_ENDPOINT, json=payload, headers=headers, timeout=5)
        if response.status_code in [200, 201, 202]:
            print(f"📡 Alerta enviado via REST! Status: {response.status_code}")
        elif response.status_code in [401, 403]:
            print(f"⚠️ Erro na API (Não Autorizado): O Token atual expirou ou é inválido!")
        else:
            print(f"⚠️ Erro na API: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Falha de conexão ao enviar alerta: {e}")

# --- INICIALIZAÇÃO DOS MODELOS DE ML ---

if os.path.exists(ARQUIVO_MODELO):
    model = joblib.load(ARQUIVO_MODELO)
    frequencia_rotas = joblib.load(ARQUIVO_FREQUENCIAS)
    fase_treino_ativa = False
else:
    model = IsolationForest(contamination=0.05, random_state=42)
    fase_treino_ativa = True

coletados_treino, rotas_treino = [], []

# --- INICIANDO AS THREADS E O SOCKET UDP ---

threading.Thread(target=run_flask, daemon=True).start()
print(f"🌐 Servidor de Configuração (Flask) ativo na porta {FLASK_PORT}")

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind((IP_LISTEN, PORT_LISTEN))
print(f"🚀 Agente IA escutando logs UDP em {IP_LISTEN}:{PORT_LISTEN}")

# --- LOOP PRINCIPAL (SYSLOG) ---

try:
    while True:
        data, addr = sock.recvfrom(BUFFER_SIZE)
        log_line = data.decode('utf-8', errors='ignore')
        rota, features_ia, dados_extras = extrair_dados_log(log_line)

        if not features_ia: continue

        if fase_treino_ativa:
            coletados_treino.append(features_ia)
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

        # 1. VERIFICAÇÃO DE WHITELIST NO BANCO COM TOLERÂNCIA
        if verificar_whitelist_banco(rota, features_ia[0], features_ia[1]):
            print(f"✅ Ignorado (Whitelist): {rota}")
            continue

        # 2. DETECÇÃO
        is_anomalia = False
        if frequencia_rotas.get(rota, 0.0) < MIN_PORCENTAGEM_ROTA:
            is_anomalia, motivo = True, f"ROTA INCOMUM (Acessada {frequencia_rotas.get(rota, 0.0)*100:.2f}% das vezes)"
        else:
            df_feat = pd.DataFrame([features_ia], columns=['status', 'tamanho'])
            if model.predict(df_feat)[0] == -1:
                is_anomalia, motivo = True, "COMPORTAMENTO ANÔMALO (Isolation Forest)"

        # 3. ENVIO DO ALERTA FORMATADO
        if is_anomalia:
            print(f"⚠️ ANOMALIA DETECTADA: {rota}")
            enviar_alerta_rest(log_line, rota, features_ia, motivo, dados_extras)

except KeyboardInterrupt:
    print("\n🛑 Encerrado.")
finally:
    sock.close()