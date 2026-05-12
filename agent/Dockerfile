# Usa uma versão recente e segura do Python
FROM python:3.11-slim-bookworm

# Cria um usuário não-root (Boas práticas de segurança do Docker)
RUN groupadd -r agentgroup && useradd -r -g agentgroup -d /app -s /sbin/nologin agentuser

# Define o diretório de trabalho
WORKDIR /app

# Instala as dependências do Python diretamente
# Usamos psycopg2-binary para evitar a necessidade de instalar o GCC e compilar código C
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir \
    pandas \
    scikit-learn \
    joblib \
    requests \
    psycopg2-binary \
    python-dotenv

# Copia os arquivos já atribuindo a propriedade ao usuário restrito
COPY --chown=agentuser:agentgroup . .

# Muda para o usuário sem privilégios de root ANTES de iniciar a aplicação
USER agentuser

# Expõe a porta que o script está escutando (UDP)
EXPOSE 5140/udp

# O -u garante que os logs do Python saiam em tempo real no terminal do Docker
CMD ["python", "-u", "main.py"]