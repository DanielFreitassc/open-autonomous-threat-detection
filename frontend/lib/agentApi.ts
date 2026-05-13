import axios from 'axios'

const agentApi = axios.create({
  baseURL: 'http://localhost:5000/api',
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