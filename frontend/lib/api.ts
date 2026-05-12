import axios from 'axios'
import type { Anomaly } from '@/types/index'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ==========================================
// INTEGRAÇÃO COM O SPRING BOOT - EVENTOS
// ==========================================

export interface SpringEvent {
  events: { id: string; timestamp: string; category: string; type: string; outcome: string }
  httpRequests: Array<{ id?: string; method: string; endpoint: string; statusCode: string; bodySize: string; protocol: string }>
  rawLogs: { id?: string; raw: string }
  sourcers: { id?: string; service: string; engine: string; host: string; clientIp: string; userAgent: string }
  anomaly: { id?: string; rule: string; severity: string; title: string; description: string; timestamp: string; createdAt?: string }
}

interface SpringPageResponse {
  content: SpringEvent[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

function mapSpringEventToAnomaly(item: SpringEvent): Anomaly {
  return {
    id: item.events.id,
    type: item.anomaly.severity as any,
    source: item.sourcers.service,
    description: item.anomaly.title,
    timestamp: item.events.timestamp,
    status: 'NEW',
    confidence: 95,
    affectedAssets: [item.sourcers.host],
    mlModel: item.sourcers.engine,
    endpoint: item.httpRequests[0]?.endpoint || 'N/A',
    clientIp: item.sourcers.clientIp || 'N/A',
    statusCode: item.httpRequests[0]?.statusCode || 'N/A',
    rawLog: item.rawLogs?.raw,
    userAgent: item.sourcers.userAgent,
    bodySize: item.httpRequests[0]?.bodySize
  } as Anomaly
}

export async function getPaginatedEvents(page = 0, size = 10) {
  const { data } = await api.get<SpringPageResponse>(`/events?page=${page}&size=${size}`)
  const anomalies: Anomaly[] = data.content.map(mapSpringEventToAnomaly)

  return {
    anomalies,
    totalElements: data.totalElements,
    totalPages: data.totalPages,
    currentPage: data.number
  }
}

export async function getEventById(id: string) {
  const { data } = await api.get<SpringEvent>(`/events/${id}`)
  return mapSpringEventToAnomaly(data)
}

// ==========================================
// INTEGRAÇÃO COM O SPRING BOOT - WHITELIST
// ==========================================

export interface WhitelistRule {
  id: string
  endpoint: string
  statusCode: string
  bodySize: string
}

export interface WhitelistRequest {
  eventId: string
  endpoint: string
  statusCode: string
  bodySize: string
}

interface SpringWhitelistPageResponse {
  content: WhitelistRule[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

// 1. GET Paginado
export async function getPaginatedWhitelist(page = 0, size = 20) {
  const { data } = await api.get<SpringWhitelistPageResponse>(`/whitelist?page=${page}&size=${size}`)
  
  return {
    rules: data.content,
    totalElements: data.totalElements,
    totalPages: data.totalPages,
    currentPage: data.number
  }
}

// 2. POST - Criar nova regra
export async function addWhitelistRule(rule: WhitelistRequest) {
  const { data } = await api.post<WhitelistRule>('/whitelist', rule)
  return data
}

// 3. DELETE - Remover regra pelo ID
export async function deleteWhitelistRule(id: string) {
  await api.delete(`/whitelist/${id}`)
}

export default api