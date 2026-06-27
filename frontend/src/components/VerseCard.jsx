import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Link2, Share, MessageCircle } from 'lucide-react'

export default function VerseCard({ ayah, surahNumber, highlightQuery }){
  const [copied, setCopied] = useState(false)
  const arabic = ayah.text || ayah.arabic || ''
  const translation = ayah.translation || ayah.translation_text || ''
  const ayahNumber = ayah.numberInSurah || ayah.number || ''

  async function copyText(){
    try{ await navigator.clipboard.writeText(`${arabic}\n${translation}`); setCopied(true); setTimeout(()=>setCopied(false),2000)}catch(e){console.error(e)}
  }

  return (
    <motion.article id={`ayah-${surahNumber}-${ayahNumber}`} whileHover={{y:-2}} className="p-4 bg-white/80 rounded-lg border transition-shadow">
      <div className="text-right font-arabic text-2xl leading-relaxed">{arabic} <span className="text-sm inline-block">({ayahNumber})</span></div>
      <div className="mt-3 text-gray-700">{translation}</div>
      <div className="mt-3 flex justify-between items-center">
        <div className="text-xs text-gray-500">Surah {surahNumber} — Ayah {ayahNumber}</div>
        <div className="flex gap-2">
          <button onClick={copyText} className="p-1 rounded hover:bg-gray-100" title="Copy"><Copy size={16} /></button>
          <button onClick={()=>{ const url = `${window.location.origin}/quran/${surahNumber}/${ayahNumber}`; navigator.clipboard.writeText(url)}} className="p-1 rounded hover:bg-gray-100" title="Permalink"><Link2 size={16} /></button>
          <button onClick={()=>navigator.share ? navigator.share({text: arabic}) : alert('Share not supported')} className="p-1 rounded hover:bg-gray-100" title="Share"><Share size={16} /></button>
          <button onClick={()=>{
            const payload = {
              question: `Explain this verse (Surah ${surahNumber} Ayah ${ayahNumber}): ${arabic} — ${translation}`,
              context: { surah: surahNumber, ayah: ayahNumber },
              autoSend: true,
              open: true
            }
            window.dispatchEvent(new CustomEvent('deenstream:openChat', { detail: payload }))
          }} className="p-1 rounded hover:bg-gray-100" title="Explain"><MessageCircle size={16} /></button>
        </div>
      </div>
    </motion.article>
  )
}
