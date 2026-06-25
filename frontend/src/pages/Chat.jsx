import React, {useState} from 'react'
import api from '../utils/api'

export default function Chat(){
  const [q, setQ] = useState('')
  const [messages, setMessages] = useState([])

  async function send(){
    setMessages(prev=>[...prev,{role:'user',text:q}])
    const res = await api.post('/ai/chat', {question: q})
    setMessages(prev=>[...prev,{role:'assistant',text: res.data.answer}])
    setQ('')
  }

  return (
    <div className="p-6">
      <h3 className="text-2xl">AI Chat</h3>
      <div className="mt-4 space-y-2">
        {messages.map((m,i)=>(<div key={i} className={m.role==='user'? 'text-right':'text-left'}>{m.text}</div>))}
      </div>
      <div className="mt-4 flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} className="flex-1 p-2 border rounded" />
        <button onClick={send} className="btn">Send</button>
      </div>
    </div>
  )
}
