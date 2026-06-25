import React from 'react'
import { motion } from 'framer-motion'

export default function SearchResults({results = [], onNavigate}){
  if(!results || results.length === 0) return null

  function parseLocation(item){
    // Try quran.com style: verse_key like "2:255" or fields
    if(item.verse_key){
      const [s, a] = item.verse_key.split(':').map(Number)
      return {surah: s, ayah: a}
    }
    if(item.verse){
      // sometimes 'verse' contains text only
      return {surah: item.surah || item.chapter || null, ayah: item.ayah || item.verse_number || null}
    }
    // try fallback: keys
    if(item.chapter && item.verse){
      return {surah: item.chapter, ayah: item.verse}
    }
    return {surah: null, ayah: null}
  }

  return (
    <div className="bg-white/60 p-3 rounded shadow space-y-2">
      <h4 className="font-semibold">Search Results</h4>
      <div className="max-h-64 overflow-auto">
        {results.map((r,i)=>{
          const loc = parseLocation(r)
          const title = loc.surah ? `S${loc.surah}:A${loc.ayah}` : (r.verse_key || `Result ${i+1}`)
          const snippet = r.text || r.excerpt || r.verse || r.translation || ''
          return (
            <motion.div key={i} whileHover={{scale:1.01}} className="p-2 rounded hover:bg-gray-50 border-b flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm text-gray-700">{snippet}</div>
                <div className="text-xs text-gray-500 mt-1">{title}</div>
              </div>
              <div className="ml-3">
                <button onClick={()=> onNavigate && onNavigate(loc.surah, loc.ayah)} className="px-3 py-1 rounded bg-primary text-white text-sm">Open</button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
