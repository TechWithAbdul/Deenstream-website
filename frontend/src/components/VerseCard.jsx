import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Share, Link2, Check } from 'lucide-react'
import { highlightText } from '../utils/highlight'
import { createPermalink } from '../services/redirectService'

export default function VerseCard({ayah, highlightQuery, surahNumber}){
  const [linkStatus, setLinkStatus] = useState('idle')
  const copyText = ()=> navigator.clipboard.writeText(`${ayah.text}\n— ${ayah.translation || ''}`)

  async function handlePermalink(){
    if(linkStatus === 'loading') return
    setLinkStatus('loading')
    try{
      const ayahNumber = ayah.numberInSurah || ayah.number
      const target = `/quran/${surahNumber}/${ayahNumber}`
      const payload = await createPermalink(target)
      const url = `${window.location.origin}${payload.url}`
      await navigator.clipboard.writeText(url)
      setLinkStatus('copied')
      window.setTimeout(()=> setLinkStatus('idle'), 2500)
    }catch(error){
      console.error('Permalink creation failed', error)
      setLinkStatus('error')
      window.setTimeout(()=> setLinkStatus('idle'), 2500)
    }
  }

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
          <button onClick={handlePermalink} className="p-1 rounded hover:bg-gray-100" title="Copy Permalink">
            {linkStatus === 'copied' ? <Check size={16} /> : <Link2 size={16} />}
          </button>
          <button onClick={()=>navigator.share? navigator.share({text: ayah.text}) : alert('Share not supported')} className="p-1 rounded hover:bg-gray-100" title="Share"><Share size={16} /></button>
        </div>
      </div>
    </motion.article>
  )
}
