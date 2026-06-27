import api from './api'

export async function fetchPrayerTimes(city){
  try{
    const res = await api.get('/prayer', { params: { city } })
    return res.data
  }catch(e){
    // fallback to aladhan direct if backend unreachable
    try{
      const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=&method=2`
      const r = await fetch(url)
      return await r.json()
    }catch(e){
      return null
    }
  }
}
