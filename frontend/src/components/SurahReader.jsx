import React, {useEffect, useRef, useState} from 'react'
import VerseCard from './VerseCard'
import { motion } from 'framer-motion'

export default function SurahReader({surah, highlightedAyah, highlightQuery}){
  const refs = useRef({})
  const [localHighlight, setLocalHighlight] = useState(null)

  useEffect(()=>{
    if(highlightedAyah && refs.current[highlightedAyah]){
      try{
        refs.current[highlightedAyah].scrollIntoView({behavior:'smooth', block:'center'})
        setLocalHighlight(highlightedAyah)
        // remove highlight after 5s
        const t = setTimeout(()=> setLocalHighlight(null), 5000)
        return ()=> clearTimeout(t)
      }catch(e){/*ignore*/}
    }
  },[highlightedAyah])

  if(!surah) return <div className="p-6 text-gray-600">Select a surah to read.</div>

  return (
    <div className="bg-white/60 p-4 rounded shadow">
      <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">{surah.englishName} <span className="text-sm text-gray-600">— {surah.englishNameTranslation}</span></h3>
            <div className="text-sm text-gray-600">{surah.revelationType} • {surah.numberOfAyahs} ayahs</div>
          </div>
          <div className="text-3xl font-amiri text-right">{surah.name}</div>
        </div>

        <div className="space-y-3">
          {surah.ayahs.map(a=> (
            <div id={`ayah-${a.number}`} key={a.number} ref={el => refs.current[a.number] = el} className={localHighlight === a.number ? 'verse-highlight transition-shadow' : ''}>
              <VerseCard ayah={a} highlightQuery={highlightQuery} surahNumber={surah.number} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
