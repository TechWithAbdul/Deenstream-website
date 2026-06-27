import api from './api'

export async function fetchHadiths(q=''){
  try{
    const res = await api.get('/hadith', { params: q ? { q } : {} })
    return res.data || []
  }catch(e){
    // fallback to empty list when backend unavailable
    return []
  }
}
