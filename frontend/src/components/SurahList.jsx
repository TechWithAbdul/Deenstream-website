import React, { useEffect, useState } from 'react'
import { fetchSurahList } from '../services/quranService'

export default function SurahList({ onSelect }){
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ load() }, [])
  async function load(){
    setLoading(true)
    try{ const res = await fetchSurahList(); setList(res.data || res) }catch(e){ console.error(e) }
    setLoading(false)
  }

  return (
    <div className="p-3 bg-white/60 card-glass">
      <h4 className="font-semibold mb-3">Surahs</h4>
      <div className="space-y-2 max-h-[60vh] overflow-auto">
        {list.map(s=> (
          <button key={s.number} onClick={()=>onSelect?.(s.number)} className="w-full text-left px-2 py-1 rounded hover:bg-white/30">{s.number}. {s.englishName || s.name}</button>
        ))}
      </div>
    </div>
  )
}
