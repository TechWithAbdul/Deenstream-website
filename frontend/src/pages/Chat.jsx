import React, { useState } from 'react'
import api from '../utils/api'
import { Send, Loader2 } from 'lucide-react'

export default function Chat(){
  const [q, setQ] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function send(){
    if(!q.trim()) return
    const userText = q.trim()
    setMessages(prev => [...prev, { role: 'user', text: userText }])
    setQ('')
    setLoading(true)
    setError(null)

    try{
      const res = await api.post('/ai/chat', { question: userText })
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.answer }])
    }catch(err){
      console.error(err)
      setError('Unable to get an answer. Please try again later.')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="rounded-[2rem] bg-white/90 p-6 shadow-xl ring-1 ring-emerald-100">
        <h1 className="text-3xl font-semibold">Islamic AI Chat</h1>
        <p className="mt-2 text-sm text-gray-600">Ask questions about Islam, the Quran, or hadith and receive thoughtful answers with references when applicable.</p>

        <div className="mt-6 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`rounded-3xl p-4 ${message.role === 'user' ? 'bg-emerald-50 text-right self-end' : 'bg-slate-50 text-left'} shadow-sm`}>
              <div className="text-sm leading-7">{message.text}</div>
            </div>
          ))}

          {error && <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ask about prayer, Quran, hadith, or Islamic life..."
            className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-5 py-3 text-sm shadow-sm focus:border-primary focus:outline-none"
            disabled={loading}
          />
          <button
            onClick={send}
            disabled={loading || !q.trim()}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <><Send size={18} className="mr-2" />Send</>}
          </button>
        </div>
      </div>
    </div>
  )
}
