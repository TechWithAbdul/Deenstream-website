import React from 'react'
import { motion } from 'framer-motion'
import { Copy, Share } from 'lucide-react'
import { highlightText } from '../utils/highlight'

export default function VerseCard({ayah, highlightQuery}){
  const copyText = ()=> navigator.clipboard.writeText(`${ayah.text}\n— ${ayah.translation || ''}`)

  return (
    <motion.article whileHover={{scale:1.01}} className="p-4 bg-white/80 rounded-lg border">
      <div className="flex justify-end">
        <div className="text-2xl font-amiri leading-tight">{ayah.text}</div>
      </div>
      <div className="mt-3 text-sm text-gray-700">{highlightQuery ? highlightText(ayah.translation || ayah.translation_text || '', highlightQuery) : (ayah.translation || ayah.translation_text || '')}</div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-gray-500">Ayah {ayah.numberInSurah || ayah.number}</div>
        <div className="flex gap-2">
          <button onClick={copyText} className="p-1 rounded hover:bg-gray-100" title="Copy"><Copy size={16} /></button>
          <button onClick={()=>navigator.share? navigator.share({text: ayah.text}) : alert('Share not supported')} className="p-1 rounded hover:bg-gray-100" title="Share"><Share size={16} /></button>
        </div>
      </div>
    </motion.article>
  )
}
