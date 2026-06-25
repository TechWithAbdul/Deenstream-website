import axios from 'axios'

const QURAN_API = 'https://api.alquran.cloud/v1'

export async function fetchSurahList(){
  const res = await axios.get(`${QURAN_API}/surah`)
  return res.data
}

export async function fetchSurah(number){
  // Request common edition - adapt to returned schema
  const res = await axios.get(`${QURAN_API}/surah/${number}/editions/quran-uthmani,en.asad`)
  // The alquran.cloud response nests data per edition; normalize to a single surah object with ayahs array
  try{
    const payload = res.data
    // If payload.data is array of editions
    if(Array.isArray(payload.data)){
      // find arabic and english
      const arabic = payload.data.find(d=> d.edition && d.edition.language === 'ar')
      const eng = payload.data.find(d=> d.edition && d.edition.language === 'en')
      const surah = arabic || payload.data[0]
      // Attach translations into ayah objects when available
      if(eng && eng.ayahs){
        surah.ayahs = surah.ayahs.map((a,i)=> ({...a, translation: eng.ayahs[i]?.text}))
      }
      return { data: surah }
    }
    return payload
  }catch(e){
    return res.data
  }
}

export async function searchAyah(query){
  // Use quran.com search as supplemental API (rate-limits apply)
  try{
    const res = await axios.get(`https://api.quran.com/api/v4/search?q=${encodeURIComponent(query)}`)
    return res.data.results || []
  }catch(err){
    console.error('Search API failed', err)
    return []
  }
}
