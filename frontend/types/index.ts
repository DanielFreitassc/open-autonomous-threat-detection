// types/index.ts (ou types.ts)

export interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'ACTIVE' | 'PENDING'
  createdAt: string
}

export interface PaginatedResponse<T> {
  content: T[]
  empty: boolean
  first: boolean
  last: boolean
  number: number
  numberOfElements: number
  pageable: {
    offset: number
    pageNumber: number
    pageSize: number
    paged: boolean
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    unpaged: boolean
  }
  size: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  totalElements: number
  totalPages: number
}

// === INTERFACE ATUALIZADA ===
export interface Anomaly {
  id: string
  type: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'
  source: string
  description: string
  timestamp: string
  status: 'NEW' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED'
  confidence: number
  affectedAssets: string[]
  mlModel: string
  
  // Nossas propriedades adicionadas para a tabela e sidebar
  endpoint?: string
  clientIp?: string
  statusCode?: string
  rawLog?: string
  userAgent?: string
  bodySize?: string
  rawData?: Record<string, unknown>
}

export interface AnomalyStats {
  total: number
  critical: number
  high: number
  medium: number
  low: number
  info: number
  newCount: number
  investigating: number
  resolved: number
}