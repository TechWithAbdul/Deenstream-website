import React, { useState } from 'react'
import PrayerCard from '../components/PrayerCard'
import { fetchPrayerTimes } from '../services/prayerService'
import Loader from '../components/Loader'

export default function Prayer(){
  const [city, setCity] = useState('London')
  const [times, setTimes] = useState(null)
  const [loading, setLoading] = useState(false)

  async function load(cityName){
    setLoading(true)
    try{
      const data = await fetchPrayerTimes(cityName)
      setTimes(data)
    }catch(e){ console.error(e) }
    setLoading(false)
  }

  return (
    <div className="py-6">
      <div className="flex gap-3 items-center">
        <input className="px-3 py-2 rounded border w-64" value={city} onChange={e=>setCity(e.target.value)} />
        <button className="px-4 py-2 bg-primary text-white rounded" onClick={()=>load(city)}>Get Times</button>
      </div>
      <div className="mt-4">{loading ? <Loader/> : times ? <PrayerCard times={times} location={city} /> : <div className="text-gray-500">Enter your city and press Get Times</div>}</div>
    </div>
  )
}
