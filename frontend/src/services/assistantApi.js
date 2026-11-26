import { api } from './api'

export async function askAssistant(message, history = []) {
  const { data } = await api.post('/assistant/chat', { message, history })
  return data
}
