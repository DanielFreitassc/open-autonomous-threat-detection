import socket
import math
import pandas as pd
import re
import os
import joblib
import requests
import psycopg2
import threading
import time
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
ARQUIVO_ROTAS = "rotas_conhecidas.pkl"
LIMITE_LOGS_TREINO = 500          # Quantidade de logs para treinar a baseline inicial

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

MIN_PORCENTAGEM_ROTA = 0.0005     # Threshold para rota muito rara

EXTENSOES_ESTATICAS = (
    ".css", ".js", ".png", ".jpg", ".jpeg", ".gif",
    ".svg", ".ico", ".woff", ".woff2", ".ttf",
    ".eot", ".map", ".webp"
)

ROTAS_IGNORADAS = (
    "/health",
    "/actuator/health",
    "/metrics",
    "/favicon.ico"
)

# --- VARIÁVEIS DE CACHE DA WHITELIST ---
whitelist_cache = {}
ultimo_update_whitelist = 0
TEMPO_CACHE_SEGUNDOS = 30
lock_whitelist = threading.Lock()

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
        return jsonify({"erro": "Os campos 'token' e 'adminPassword' são obrigatórios."}), 400
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

def atualizar_cache_whitelist():
    global whitelist_cache, ultimo_update_whitelist
    agora = time.time()

    if agora - ultimo_update_whitelist < TEMPO_CACHE_SEGUNDOS:
        return

    try:
        conn = psycopg2.connect(**DB_CONFIG, connect_timeout=3)
        cur = conn.cursor()
        cur.execute("SELECT endpoint, status_code, body_size FROM whitelist")
        resultados = cur.fetchall()

        novo_cache = {}
        for endpoint, status, tamanho in resultados:
            if endpoint is None:
                continue
            rota_db = endpoint.strip().lower().rstrip('/')
            if not rota_db:
                rota_db = '/'
            chave = (rota_db, int(status))
            novo_cache[chave] = int(tamanho)

        with lock_whitelist:
            whitelist_cache = novo_cache
            ultimo_update_whitelist = agora

        cur.close()
        conn.close()
    except Exception as e:
        print(f"❌ ERRO WHITELIST: {e}")

def verificar_whitelist_banco(endpoint, status, tamanho_atual):
    """Verifica a whitelist usando o cache em memória (alta performance)."""
    atualizar_cache_whitelist()
    chave = (endpoint, int(status))

    if chave not in whitelist_cache:
        return False

    tamanho_salvo = whitelist_cache[chave]
    # Tamanho zero = curinga (qualquer tamanho é aceito)
    if tamanho_salvo == 0:
        return True

    # Margem de 15% para variações normais de conteúdo dinâmico
    diferenca = abs(tamanho_atual - tamanho_salvo)
    margem = tamanho_salvo * 0.15
    return diferenca <= margem

def extrair_dados_log(log_msg):
    """Extrai features do log, com tratamento correto para tamanho (-) e rotas."""
    dados_extras = {
        "host": "unknown", "service": "nginx", "ip": "0.0.0.0",
        "method": "UNKNOWN", "protocol": "HTTP/1.1", "user_agent": "N/A"
    }

    syslog_match = re.search(r'nginx_access:\s+([\d\.]+)', log_msg)
    if syslog_match:
        dados_extras["ip"] = syslog_match.group(1)

    req_match = re.search(r'\"([A-Z]+)\s+(.*?)\s+(HTTP/\d\.\d)\"\s+(\d{3})\s+(\d+|-)', log_msg)
    if req_match:
        dados_extras["method"] = req_match.group(1)
        rota_bruta = req_match.group(2).split('?')[0]
        rota = rota_bruta.strip().lower().rstrip('/')
        if not rota:
            rota = '/'
        dados_extras["protocol"] = req_match.group(3)
        status = int(req_match.group(4))
        tamanho_str = req_match.group(5)
        tamanho = 0 if tamanho_str == '-' else int(tamanho_str)

        campos = re.findall(r'"([^"]*)"', log_msg)
        if campos:
            dados_extras["user_agent"] = campos[-1]

        return rota, [status, tamanho], dados_extras

    return None, None, None

def enviar_alerta_rest(log_line, rota, features_ia, motivo, dados_extras):
    """Monta o payload JSON e envia para o backend centralizado."""
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
            "requestRate": features_ia[2],
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

# --- INICIALIZAÇÃO DOS MODELOS DE ML (BASELINE CONGELADA) ---

if os.path.exists(ARQUIVO_MODELO):
    model = joblib.load(ARQUIVO_MODELO)
    frequencia_rotas = joblib.load(ARQUIVO_FREQUENCIAS)
    if os.path.exists(ARQUIVO_ROTAS):
        rotas_conhecidas = joblib.load(ARQUIVO_ROTAS)
    else:
        rotas_conhecidas = set()
    fase_treino_ativa = False
else:
    model = IsolationForest(contamination=0.005, random_state=42, n_estimators=300)
    rotas_conhecidas = set()
    frequencia_rotas = {}
    fase_treino_ativa = True

coletados_treino, rotas_treino = [], []
ultimo_acesso_ip = {}
contador_limpeza = 0

# --- INICIANDO AS THREADS E O SOCKET UDP ---

threading.Thread(target=run_flask, daemon=True).start()
print(f"🌐 Servidor de Configuração (Flask) ativo na porta {FLASK_PORT}")

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
try:
    sock.bind((IP_LISTEN, PORT_LISTEN))
except OSError as e:
    print(f"Erro ao abrir UDP {PORT_LISTEN}: {e}")
    exit(1)
print(f"🚀 Agente IA escutando logs UDP em {IP_LISTEN}:{PORT_LISTEN}")

# --- LOOP PRINCIPAL (SYSLOG) ---

try:
    while True:
        data, addr = sock.recvfrom(BUFFER_SIZE)
        log_line = data.decode('utf-8', errors='ignore')
        rota, features_ia, dados_extras = extrair_dados_log(log_line)

        if not features_ia:
            continue

        # IGNORA ARQUIVOS ESTÁTICOS E ROTAS DE INFRA
        if rota and rota.endswith(EXTENSOES_ESTATICAS) or rota in ROTAS_IGNORADAS:
            continue

        # --- LÓGICA DE TEMPO E MEMÓRIA (DELTA-T E BURST) ---
        agora = time.time()
        ip_origem = dados_extras["ip"]
        delta_t = 10.0
        burst_atual = 0

        if ip_origem in ultimo_acesso_ip:
            delta_t = agora - ultimo_acesso_ip[ip_origem]["tempo"]
            burst_atual = ultimo_acesso_ip[ip_origem]["burst"]

        if delta_t < 0.5:
            burst_atual += 1
        else:
            burst_atual = 0

        ultimo_acesso_ip[ip_origem] = {"tempo": agora, "burst": burst_atual}
        features_ia.append(math.log(delta_t + 1))

        # Limpeza periódica do dicionário de IPs inativos
        contador_limpeza += 1
        if contador_limpeza >= 5000:
            limite_inatividade = agora - 3600
            ultimo_acesso_ip = {ip: dados for ip, dados in ultimo_acesso_ip.items()
                                if dados["tempo"] > limite_inatividade}
            contador_limpeza = 0

        # --- FASE DE TREINAMENTO INICIAL (CONSTRÓI A BASELINE) ---
        if fase_treino_ativa:
            rotas_conhecidas.add(rota)
            coletados_treino.append(features_ia)
            rotas_treino.append(rota)

            if len(coletados_treino) >= LIMITE_LOGS_TREINO:
                # Treina o Isolation Forest com os dados coletados
                df_treino = pd.DataFrame(coletados_treino, columns=['status', 'tamanho', 'delta_t'])
                model.fit(df_treino)
                joblib.dump(model, ARQUIVO_MODELO)

                # Calcula frequências das rotas
                c = Counter(rotas_treino)
                frequencia_rotas = {r: (q / len(rotas_treino)) for r, q in c.items()}
                joblib.dump(frequencia_rotas, ARQUIVO_FREQUENCIAS)

                # Salva o conjunto de rotas conhecidas
                joblib.dump(rotas_conhecidas, ARQUIVO_ROTAS)

                fase_treino_ativa = False
                print("\n✅ Baseline congelada – o modelo NÃO será mais atualizado automaticamente.")
                # Libera memória
                coletados_treino.clear()
                rotas_treino.clear()
            continue

        # --- ESTRATÉGIA DE DEFESA EM PROFUNDIDADE ---
        is_anomalia = False
        motivo = ""
        LIMITE_BURST = 15

        # 1. ESCUDO ANTI-BOT
        if burst_atual > LIMITE_BURST:
            is_anomalia = True
            motivo = f"COMPORTAMENTO DE BOT (Rajada abusiva de {burst_atual} requisições. Delta-T: {delta_t:.3f}s)"

        # 2. VERIFICAÇÃO DE WHITELIST (IGNORA COMPLETAMENTE SE FOR CONFIÁVEL)
        if not is_anomalia:
            if verificar_whitelist_banco(rota, features_ia[0], features_ia[1]):
                continue

        # 3. DETECÇÃO DE ROTA NUNCA VISTA NA BASELINE
        if not is_anomalia and rota not in rotas_conhecidas:
            is_anomalia = True
            motivo = f"NOVA ROTA DETECTADA: {rota} (ausente na baseline de treinamento)"

        # 4. PARA ROTAS CONHECIDAS, AVALIA RARIDADE E ANOMALIA DO MODELO
        if not is_anomalia:
            freq = frequencia_rotas.get(rota, 0.0)
            if freq < MIN_PORCENTAGEM_ROTA:
                is_anomalia = True
                motivo = f"ROTA INCOMUM (frequência de {freq*100:.2f}% – abaixo do limiar)"
            else:
                df_feat = pd.DataFrame([features_ia], columns=['status', 'tamanho', 'delta_t'])
                if model.predict(df_feat)[0] == -1:
                    is_anomalia = True
                    motivo = "COMPORTAMENTO ANÔMALO (Isolation Forest: status/tamanho/timing suspeitos)"

        # 5. ENVIO DO ALERTA FORMATADO
        if is_anomalia:
            print(f"⚠️ ANOMALIA DETECTADA: {rota} - {motivo}")
            enviar_alerta_rest(log_line, rota, features_ia, motivo, dados_extras)

except KeyboardInterrupt:
    print("\n🛑 Encerrado.")
finally:
    sock.close()