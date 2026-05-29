import socket
import pandas as pd
import re
import os
import joblib
import requests
import psycopg2
import threading
import time # Importado para calcular os milissegundos
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
CORS(app) 

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
        
        query = "SELECT body_size FROM whitelist WHERE endpoint = %s AND status_code = %s"
        cur.execute(query, (endpoint, str(status)))
        resultado = cur.fetchone()
        cur.close()
        conn.close()
        
        if resultado:
            tamanho_salvo = int(resultado[0])
            if tamanho_salvo == 0:
                return True
                
            diferenca = abs(tamanho_atual - tamanho_salvo)
            margem_tolerancia = tamanho_salvo * 0.15 
            
            if diferenca <= margem_tolerancia:
                return True 
            else:
                print(f"⚠️ Whitelist ignorada para {endpoint}: Variação suspeita! (Esperado: ~{tamanho_salvo}, Atual: {tamanho_atual})")
                return False 
                
        return False
    except Exception as e:
        print(f"⚠️ Erro ao consultar banco: {e}")
        return False

def extrair_dados_log(log_msg):
    dados_extras = {
        "host": "unknown", "service": "nginx", "ip": "0.0.0.0", 
        "method": "UNKNOWN", "protocol": "HTTP/1.1", "user_agent": "N/A"
    }
    
    # Regex robusto para o log: busca o IP após 'nginx_access:'
    # Captura: 1. Host, 2. IP
    syslog_match = re.search(r'nginx_access:\s+([\d\.]+)', log_msg)
    if syslog_match:
        dados_extras["ip"] = syslog_match.group(1)

    # Regex para a requisição HTTP: busca Método, Rota, Protocolo, Status e Tamanho
    # Formato: "GET /rota HTTP/1.1" 200 1234
    req_match = re.search(r'\"([A-Z]+)\s+(.*?)\s+(HTTP/\d\.\d)\"\s+(\d{3})\s+(\d+)', log_msg)
    if req_match:
        dados_extras["method"] = req_match.group(1)
        rota = req_match.group(2).split('?')[0] # Remove query strings
        dados_extras["protocol"] = req_match.group(3)
        status = int(req_match.group(4))
        tamanho = int(req_match.group(5))
        
        # Tenta pegar User Agent se existir no final da string
        ua_match = re.search(r'\"Mozilla.*?\"', log_msg)
        if ua_match: 
            dados_extras["user_agent"] = ua_match.group(0)
            
        return rota, [status, tamanho], dados_extras
    
    # Retorna None se não conseguir identificar a requisição
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
            "requestRate": features_ia[2], # Delta-T enviado para o Spring Boot
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
            "description": f"A rota {rota} disparou um alerta. Motivo: {motivo}",
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
ultimo_acesso_ip = {} # Memória agora vai guardar um dicionário com "tempo" e "burst"
contador_limpeza = 0  # Controla a frequência da limpeza de memória

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

        # --- LÓGICA DE TEMPO E MEMÓRIA (DELTA-T E BURST) ---
        agora = time.time()
        ip_origem = dados_extras["ip"]
        
        delta_t = 10.0 
        burst_atual = 0 # Inicia o contador de rajada
        
        if ip_origem in ultimo_acesso_ip:
            delta_t = agora - ultimo_acesso_ip[ip_origem]["tempo"]
            burst_atual = ultimo_acesso_ip[ip_origem]["burst"]
            
        # Avalia se a requisição faz parte de uma rajada rápida
        if delta_t < 0.5:
            burst_atual += 1
        else:
            burst_atual = 0 # Humano pausou para ler a tela, reseta o contador
            
        # Salva o tempo e a rajada atualizada na memória
        ultimo_acesso_ip[ip_origem] = {"tempo": agora, "burst": burst_atual}
        features_ia.append(delta_t) # features_ia agora é: [status, tamanho, delta_t]

        # Limpeza periódica do dicionário para evitar estouro de RAM
        contador_limpeza += 1
        if contador_limpeza >= 5000:
            limite_inatividade = agora - 3600 # Remove IPs inativos há mais de 1 hora
            ultimo_acesso_ip = {ip: dados for ip, dados in ultimo_acesso_ip.items() if dados["tempo"] > limite_inatividade}
            contador_limpeza = 0

        # --- FASE DE TREINAMENTO ---
        if fase_treino_ativa:
            coletados_treino.append(features_ia)
            rotas_treino.append(rota)
            print(f"📖 Aprendendo: {len(coletados_treino)}/{LIMITE_LOGS_TREINO}", end='\r')
            if len(coletados_treino) >= LIMITE_LOGS_TREINO:
                df_treino = pd.DataFrame(coletados_treino, columns=['status', 'tamanho', 'delta_t'])
                model.fit(df_treino)
                joblib.dump(model, ARQUIVO_MODELO)
                c = Counter(rotas_treino)
                frequencia_rotas = {r: (q / len(rotas_treino)) for r, q in c.items()}
                joblib.dump(frequencia_rotas, ARQUIVO_FREQUENCIAS)
                fase_treino_ativa = False
                print("\n✅ Treino concluído!")
            continue

        # --- ESTRATÉGIA DE DEFESA EM PROFUNDIDADE ---
        
        is_anomalia = False
        motivo = ""
        LIMITE_BURST = 15 # Limite de requisições super rápidas aceitáveis em um carregamento de página

        # 1. ESCUDO ANTI-BOT (Prioridade Máxima)
        # Se a rajada passar do limite humano aceitável, é ataque.
        if burst_atual > LIMITE_BURST:
            is_anomalia = True
            motivo = f"COMPORTAMENTO DE BOT (Rajada abusiva de {burst_atual} requisições seguidas. Delta-T: {delta_t:.3f}s)"

        # 2. VERIFICAÇÃO DE WHITELIST (Aplicada apenas para comportamento não-bot)
        if not is_anomalia:
            if verificar_whitelist_banco(rota, features_ia[0], features_ia[1]):
                print(f"✅ Ignorado (Whitelist): {rota}")
                continue # Pula o fluxo, pois é acesso humano em rota confiável

        # 3. DETECÇÃO DA IA (Aplicada em rotas que não estão na whitelist)
        if not is_anomalia:
            if frequencia_rotas.get(rota, 0.0) < MIN_PORCENTAGEM_ROTA:
                is_anomalia, motivo = True, f"ROTA INCOMUM (Acessada {frequencia_rotas.get(rota, 0.0)*100:.2f}% das vezes)"
            else:
                # O IsolationForest analisa status, tamanho e o delta_t para encontrar variações mais sutis
                df_feat = pd.DataFrame([features_ia], columns=['status', 'tamanho', 'delta_t'])
                if model.predict(df_feat)[0] == -1:
                    is_anomalia, motivo = True, "COMPORTAMENTO ANÔMALO (Isolation Forest: Status, Tamanho ou Tempo suspeito)"

        # 4. ENVIO DO ALERTA FORMATADO
        if is_anomalia:
            print(f"⚠️ ANOMALIA DETECTADA: {rota} - {motivo}")
            enviar_alerta_rest(log_line, rota, features_ia, motivo, dados_extras)

except KeyboardInterrupt:
    print("\n🛑 Encerrado.")
finally:
    sock.close()