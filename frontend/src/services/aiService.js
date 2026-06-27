import api from './api'

export async function askAI(question){
  const res = await api.post('/ai/chat', { question })
  return res.data?.answer
}
