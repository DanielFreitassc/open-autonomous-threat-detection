# Usa uma imagem Python leve fixada na versão estável do Debian (Bookworm)
FROM python:3.9-slim-bookworm

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Adiciona configurações para evitar uso de cache corrompido de proxies de rede
# e instala dependências do sistema necessárias para ML
RUN echo 'Acquire::http::Pipeline-Depth "0";' > /etc/apt/apt.conf.d/99custom && \
    echo 'Acquire::http::No-Cache "true";' >> /etc/apt/apt.conf.d/99custom && \
    echo 'Acquire::BrokenProxy "true";' >> /etc/apt/apt.conf.d/99custom && \
    apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Instala as bibliotecas de Machine Learning via pip
RUN pip install --no-cache-dir pandas scikit-learn joblib

# Copia o script e os arquivos necessários para o container
COPY . .

# Expõe a porta que o script está escutando (UDP)
EXPOSE 5140/udp

# Comando para rodar a aplicação
# O -u garante que os logs do Python saiam em tempo real no terminal do Docker
CMD ["python", "-u", "main.py"]