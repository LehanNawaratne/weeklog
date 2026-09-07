import { api } from './client'

export async function sendChat(messages) {
  const res = await api.post('/assistant/chat', { messages })
  return res.data.reply
}
