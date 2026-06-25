import api from '../utils/api'

export async function fetchHadiths(query = ''){
  const res = await api.get('/hadith', { params: query ? { q: query } : {} })
  return res.data
}
