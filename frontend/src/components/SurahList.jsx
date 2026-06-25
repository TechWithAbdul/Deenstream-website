import React, {useEffect, useState} from 'react'
import { fetchSurahList } from '../services/quranService'
import { motion } from 'framer-motion'

export default function SurahList({onSelect}){
  const [surahs, setSurahs] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(()=>{
    let mounted = true
    fetchSurahList().then(d=>{
      if(mounted) setSurahs(d.data)
    }).catch(console.error)
    return ()=> mounted = false
  },[])

  const shown = surahs.filter(s=> s.englishName.toLowerCase().includes(filter.toLowerCase()) || s.name.includes(filter))

  return (
    <div className="bg-white/60 p-3 rounded shadow">
      <div className="flex items-center gap-2 mb-3">
        <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search surah" className="flex-1 p-2 rounded border" />
      </div>
      <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-auto">
        {shown.map(s=> (
          <motion.button key={s.number} whileHover={{scale:1.02}} onClick={()=>onSelect(s.number)} className="text-left p-3 bg-white/80 rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{s.number}. {s.englishName}</div>
              <div className="text-xs text-gray-600">{s.englishNameTranslation} • {s.numberOfAyahs} ayahs</div>
            </div>
            <div className="text-right">
              <div className="font-amiri text-2xl">{s.name}</div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
