import api from './api'

export async function fetchSurahList(){
  const res = await api.get('/quran/surah')
  return res.data
}

export async function fetchSurah(number){
  const res = await api.get(`/quran/surah/${number}`)
  return res.data
}

export async function searchAyah(query){
  try{
    const res = await api.get('/quran/search', { params: { q: query } })
    return res.data.results || []
  }catch(e){ return [] }
}
