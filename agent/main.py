import socket
import pandas as pd
import re
import os
import joblib
import time
from sklearn.ensemble import IsolationForest

# --- CONFIGURAÇÕES ---
IP_LISTEN = "0.0.0.0"
PORT_LISTEN = 5140
BUFFER_SIZE = 1024
ARQUIVO_MODELO = "modelo_ia_csirt.pkl"
ARQUIVO_TREINO = "dataset_treino.csv"
WHITELIST_FILE = "whitelist_features.csv"
LIMITE_LOGS_TREINO = 1000  # Aumente para 10000+ para treinos de longa duração

# --- FUNÇÕES DE APOIO ---

def extrair_features(log_msg):
    """Extrai Status Code e Tamanho do Log usando Regex."""
    match = re.search(r'HTTP/\d\.\d\" (\d{3}) (\d+)', log_msg)
    if match:
        return [int(match.group(1)), int(match.group(2))]
    return None

def carregar_whitelist():
    """Carrega assinaturas que o humano validou como 'Normal'."""
    if os.path.exists(WHITELIST_FILE):
        df = pd.read_csv(WHITELIST_FILE)
        return df.values.tolist()
    return []

def salvar_na_whitelist(features):
    """Adiciona uma característica à whitelist para evitar falsos positivos."""
    novo_dado = pd.DataFrame([features], columns=['status', 'tamanho'])
    header = not os.path.exists(WHITELIST_FILE)
    novo_dado.to_csv(WHITELIST_FILE, mode='a', index=False, header=header)

# --- INICIALIZAÇÃO ---

# 1. Tenta carregar modelo existente, senão cria um novo
if os.path.exists(ARQUIVO_MODELO):
    model = joblib.load(ARQUIVO_MODELO)
    fase_treino_ativa = False
    print("🧠 Modelo de IA carregado e pronto para monitoramento.")
else:
    model = IsolationForest(contamination=0.05, random_state=42)
    fase_treino_ativa = True

# 2. Configura o Socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind((IP_LISTEN, PORT_LISTEN))

whitelist = carregar_whitelist()
coletados_treino = []

print(f"🚀 Sistema Iniciado em {IP_LISTEN}:{PORT_LISTEN}")

# --- LOOP PRINCIPAL ---

try:
    while True:
        data, addr = sock.recvfrom(BUFFER_SIZE)
        log_line = data.decode('utf-8', errors='ignore')
        features = extrair_features(log_line)

        if not features:
            continue

        # --- FASE DE APRENDIZADO ---
        if fase_treino_ativa:
            coletados_treino.append(features)
            print(f"📖 Aprendendo: {len(coletados_treino)}/{LIMITE_LOGS_TREINO}", end='\r')

            if len(coletados_treino) >= LIMITE_LOGS_TREINO:
                df_treino = pd.DataFrame(coletados_treino, columns=['status', 'tamanho'])
                df_treino.to_csv(ARQUIVO_TREINO, index=False)
                model.fit(df_treino)
                joblib.dump(model, ARQUIVO_MODELO)
                fase_treino_ativa = False
                print("\n✅ Treinamento concluído e modelo salvo!")
            continue

        # --- FASE DE MONITORAMENTO COM FEEDBACK ---

        # 1. Checa a Whitelist (Decisão Humana prévia)
        if features in whitelist:
            print(f"✅ NORMAL (Whitelist): {features}")
            continue

        # 2. Predição da IA
        pred = model.predict([features])

        if pred[0] == -1:
            print(f"\n⚠️  ANOMALIA DETECTADA: {log_line.strip()}")

            # Sistema de Feedback Humano
            # Em produção, isso poderia ser uma fila em um banco de dados
            feedback = input("❓ Isso é um falso positivo? (s/n): ").lower()

            if feedback == 's':
                salvar_na_whitelist(features)
                whitelist.append(features)
                print("✔️  Entendido. Adicionado à Whitelist.")
            else:
                print("🚨 Incidente confirmado e registrado.")
                with open("incidentes_confirmados.log", "a") as f:
                    f.write(f"{time.ctime()} - {log_line.strip()}\n")
        else:
            print(f"✅ NORMAL: {features}")

except KeyboardInterrupt:
    print("\n🛑 Sistema encerrado pelo usuário.")
finally:
    sock.close()