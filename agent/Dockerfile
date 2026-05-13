# Usa uma versão recente e segura do Python
FROM python:3.11-slim-bookworm

# Cria um usuário não-root (Boas práticas de segurança do Docker)
RUN groupadd -r agentgroup && useradd -r -g agentgroup -d /app -s /sbin/nologin agentuser

# Define o diretório de trabalho
WORKDIR /app

# Copia PRIMEIRO o requirements.txt para aproveitar o cache de camadas do Docker
COPY --chown=agentuser:agentgroup requirements.txt .

# Instala as dependências a partir do arquivo
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copia o restante dos arquivos já atribuindo a propriedade ao usuário restrito
COPY --chown=agentuser:agentgroup . .

# Muda para o usuário sem privilégios de root ANTES de iniciar a aplicação
USER agentuser

# Expõe as portas que o agente utiliza
# 5140 UDP: Recebimento de logs (Syslog)
# 5000 TCP: API REST interna do Flask para gerenciar o Token
EXPOSE 5140/udp
EXPOSE 5000

# O -u garante que os logs do Python saiam em tempo real no terminal do Docker
CMD ["python", "-u", "main.py"]