import api from '../utils/api'

export async function fetchSurahList(){
  const res = await api.get('/quran/surah')
  return res.data
}

export async function fetchSurah(number){
  const res = await api.get(`/quran/surah/${number}`)
  const payload = res.data
  try{
    if(Array.isArray(payload.data)){
      const arabic = payload.data.find(d=> d.edition && d.edition.language === 'ar')
      const eng = payload.data.find(d=> d.edition && d.edition.language === 'en')
      const surah = arabic || payload.data[0]
      if(eng && eng.ayahs){
        surah.ayahs = surah.ayahs.map((a,i)=> ({...a, translation: eng.ayahs[i]?.text}))
      }
      return { data: surah }
    }
    return payload
  }catch(e){
    return payload
  }
}

export async function searchAyah(query){
  try{
    const res = await api.get('/quran/search', { params: { q: query } })
    return res.data.results || []
  }catch(err){
    console.error('Search API failed', err)
    return []
  }
}
