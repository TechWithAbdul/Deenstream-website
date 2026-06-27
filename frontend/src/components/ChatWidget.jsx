import React, { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import api from '../services/api'

export default function ChatWidget(){
  const [open, setOpen] = useState(true)
  const [q, setQ] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef()

  useEffect(()=>{
    function handler(e){
      const d = e.detail || {}
      if(d.question) setQ(d.question)
      if(d.open !== false) setOpen(true)
      if(d.autoSend) send(d.question, d.context)
      // focus input
      setTimeout(()=> inputRef.current?.focus(), 100)
    }
    window.addEventListener('deenstream:openChat', handler)
    return ()=> window.removeEventListener('deenstream:openChat', handler)
  }, [])

  async function send(text = null, context = null){
    const question = text || q
    if(!question) return
    const userMsg = {role:'user', text:question}
    setMessages(m=>[...m, userMsg]); setLoading(true)
    try{
      const res = await api.post('/ai/chat', { question, context })
      const answer = res.data?.answer || 'No response'
      setMessages(m=>[...m, {role:'assistant', text: answer}])
    }catch(e){ setMessages(m=>[...m, {role:'assistant', text: 'AI unavailable'}]) }
    setLoading(false); setQ('')
  }

  const suggestions = [
    'Explain Surah Al-Fatiha',
    'Hadith about charity',
    'Prayer times in Cairo',
  ]

  return (
    <div className="fixed right-5 bottom-5 w-80 md:w-96 z-50">
      <div className="bg-white/90 rounded shadow-lg overflow-hidden">
        <div className="p-3 bg-primary text-white flex items-center justify-between">
          <div className="font-semibold">DeenStream Assistant</div>
          <button onClick={()=>setOpen(o=>!o)} className="text-white text-sm">{open? 'Close' : 'Open'}</button>
        </div>
        {open && (
          <div className="p-3 space-y-3">
            <div className="flex gap-2 flex-wrap">
              {suggestions.map(s=> (
                <button key={s} onClick={()=>{ setQ(s); send(s) }} className="px-2 py-1 bg-gray-100 text-xs rounded">{s}</button>
              ))}
            </div>
            <div className="h-48 overflow-auto bg-white/50 p-2 rounded">
              {messages.map((m,i)=> (
                <div key={i} className={`mb-2 p-2 rounded ${m.role==='user' ? 'bg-primary/10 text-right' : 'bg-gray-100'}`}><div className="text-sm">{m.text}</div></div>
              ))}
            </div>
            <div className="flex gap-2">
              <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)} className="flex-1 px-3 py-2 rounded border" placeholder="Ask about a verse, hadith, or prayer..." />
              <button onClick={()=>send()} className="px-3 py-2 bg-primary text-white rounded" disabled={loading}><Send size={16} /></button>
            </div>
            <div className="text-xs text-gray-500">Tip: click a verse's Explain icon to ask the assistant about it.</div>
          </div>
        )}
      </div>
    </div>
  )
}
