import axios from 'axios'

const agentApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AGENT_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface UpdateTokenRequest {
  token: string
  adminPassword: string
}

export async function updateAgentToken(payload: UpdateTokenRequest) {
  const { data } = await agentApi.post('/config/token', payload)
  return data
}

export default agentApi