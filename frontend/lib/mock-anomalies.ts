import type { Anomaly, AnomalyStats } from '@/types/index'

const anomalyTypes = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] as const
const statusTypes = ['NEW', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'] as const
const sources = [
  'Firewall Principal',
  'IDS/IPS Perimetral',
  'Endpoint Detection',
  'Network Traffic Analyzer',
  'Cloud Security Gateway',
  'Email Security',
  'Web Application Firewall',
  'Database Activity Monitor',
  'Active Directory',
  'VPN Gateway',
]

const descriptions = {
  CRITICAL: [
    'Tentativa de exfiltracao de dados detectada - Volume anomalo de transferencia',
    'Acesso nao autorizado a sistema critico - Padrao de ataque lateral',
    'Malware avancado detectado - Comportamento de ransomware identificado',
    'Comprometimento de conta privilegiada - Atividade suspeita detectada',
    'Ataque DDoS em andamento - Origem distribuida detectada',
  ],
  HIGH: [
    'Multiplas tentativas de login falhas - Possivel ataque de forca bruta',
    'Comunicacao com IP malicioso conhecido - C2 potencial',
    'Escalacao de privilegios detectada - Usuario padrao acessando recursos admin',
    'Anomalia de trafego de rede - Padrao de varredura detectado',
    'Modificacao nao autorizada de arquivos de sistema',
  ],
  MEDIUM: [
    'Acesso fora do horario padrao - Usuario acessando recursos sensiveis',
    'Download de volume incomum de dados - Possivel vazamento',
    'Instalacao de software nao autorizado detectada',
    'Alteracao de configuracao de firewall - Revisao necessaria',
    'Conexao VPN de localizacao geografica incomum',
  ],
  LOW: [
    'Tentativa de acesso a recurso restrito - Permissao negada',
    'Dispositivo desconhecido conectado a rede corporativa',
    'Certificado SSL proximo da expiracao',
    'Uso elevado de CPU em servidor - Investigar causa',
    'Falha de autenticacao em servico - Credenciais expiradas',
  ],
  INFO: [
    'Novo dispositivo registrado na rede',
    'Atualizacao de politica de seguranca aplicada',
    'Backup de sistema concluido com sucesso',
    'Rotacao de logs executada',
    'Scan de vulnerabilidades agendado iniciado',
  ],
}

const mlModels = [
  'AnomalyNet v2.3',
  'ThreatPredict ML',
  'BehaviorAnalyzer AI',
  'NetworkGuard Deep',
  'EndpointShield ML',
]

const assets = [
  'srv-prod-01',
  'srv-db-master',
  'fw-perimetral',
  'ws-admin-045',
  'cloud-gateway',
  'mail-server',
  'dc-primary',
  'vpn-concentrator',
  'web-app-01',
  'storage-nas',
]

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function generateAnomaly(index: number): Anomaly {
  const type = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)]
  const status = statusTypes[Math.floor(Math.random() * statusTypes.length)]
  const descriptionList = descriptions[type]
  
  const affectedCount = type === 'CRITICAL' ? Math.floor(Math.random() * 5) + 2 :
                       type === 'HIGH' ? Math.floor(Math.random() * 3) + 1 :
                       Math.floor(Math.random() * 2) + 1

  const shuffledAssets = [...assets].sort(() => Math.random() - 0.5)
  
  const confidence = type === 'CRITICAL' ? 85 + Math.random() * 15 :
                    type === 'HIGH' ? 75 + Math.random() * 20 :
                    type === 'MEDIUM' ? 60 + Math.random() * 25 :
                    type === 'LOW' ? 45 + Math.random() * 30 :
                    30 + Math.random() * 40

  return {
    id: `ANM-${String(index + 1).padStart(6, '0')}`,
    type,
    source: sources[Math.floor(Math.random() * sources.length)],
    description: descriptionList[Math.floor(Math.random() * descriptionList.length)],
    timestamp: randomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()).toISOString(),
    status,
    confidence: Math.round(confidence * 10) / 10,
    affectedAssets: shuffledAssets.slice(0, affectedCount),
    mlModel: mlModels[Math.floor(Math.random() * mlModels.length)],
  }
}

export function generateMockAnomalies(count: number = 50): Anomaly[] {
  return Array.from({ length: count }, (_, i) => generateAnomaly(i))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function calculateStats(anomalies: Anomaly[]): AnomalyStats {
  return {
    total: anomalies.length,
    critical: anomalies.filter(a => a.type === 'CRITICAL').length,
    high: anomalies.filter(a => a.type === 'HIGH').length,
    medium: anomalies.filter(a => a.type === 'MEDIUM').length,
    low: anomalies.filter(a => a.type === 'LOW').length,
    info: anomalies.filter(a => a.type === 'INFO').length,
    newCount: anomalies.filter(a => a.status === 'NEW').length,
    investigating: anomalies.filter(a => a.status === 'INVESTIGATING').length,
    resolved: anomalies.filter(a => a.status === 'RESOLVED').length,
  }
}
