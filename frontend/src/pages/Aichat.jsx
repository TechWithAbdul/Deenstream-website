// src/pages/AIChat.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Send, RotateCcw, User, Bot, AlertCircle, Sparkles } from 'lucide-react'
import { aiApi } from '../services/api'

const SUGGESTED_QUESTIONS = [
  'What are the five pillars of Islam?',
  'Explain the significance of Ramadan.',
  'What does Islam say about seeking knowledge?',
  'How do I perform Wudu correctly?',
  'What is the importance of Salah in daily life?',
]

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 animate-fade-in">
      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#0a3526,#c5a880)' }}>
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="chat-bubble-ai px-4 py-3.5 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#c5a880', animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#c5a880', animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#c5a880', animationDelay: '300ms' }} />
      </div>
    </div>
  )
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex items-end gap-2 animate-slide-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: isUser ? '#c5a880' : 'linear-gradient(135deg,#0a3526,#c5a880)' }}>
        {isUser ? <User className="w-3.5 h-3.5" style={{ color: '#021711' }} /> : <Bot className="w-3.5 h-3.5 text-white" />}
      </div>
      <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}>
        {(msg.content || '').split('\n').map((line, i) => (
          <React.Fragment key={i}>{line}{i < msg.content.split('\n').length - 1 && <br />}</React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default function AIChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || '').trim()
    if (!trimmed || loading) return

    setError(null)
    const userMsg = { role: 'user', content: trimmed }
    const updatedHistory = [...messages, userMsg]
    setMessages(updatedHistory)
    setInput('')
    setLoading(true)

    try {
      const res = await aiApi.chat(trimmed, messages)
      const data = res.data || {}
      const replyText = data.reply || data.response || data.content || 'No response received.'
      setMessages(prev => [...prev, { role: 'assistant', content: replyText }])
    } catch (err) {
      setError(err?.message || 'Could not connect to the AI assistant.')
      setMessages(messages)
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }, [messages, loading])

  const handleSubmit = (e) => { e.preventDefault(); sendMessage(input) }
  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }
  const clearChat = () => { setMessages([]); setError(null); setInput(''); inputRef.current?.focus() }

  const isEmpty = messages.length === 0

  return (
    <div className="animate-fade-in flex flex-col" style={{ height: 'calc(100vh - 64px)', background: '#021711' }}>

      <div className="shrink-0 border-b backdrop-blur-sm" style={{ background: 'rgba(2,23,17,0.9)', borderColor: 'rgba(197,168,128,0.15)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg,#0a3526,#c5a880)' }}>
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-white" style={{ fontFamily: 'Playfair Display,serif' }}>AI Alim</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#c5a880' }} />
                <span className="text-xs text-emerald-100/40">Powered by Gemini · Islamic Knowledge</span>
              </div>
            </div>
          </div>
          {!isEmpty && <button onClick={clearChat} className="btn-ghost py-1.5 text-xs"><RotateCcw className="w-3.5 h-3.5" /> New Chat</button>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">

          {isEmpty && (
            <div className="flex flex-col items-center justify-center min-h-64 gap-6 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg,#0a3526,#c5a880)' }}>
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display,serif' }}>As-salamu alaykum</h2>
                <p className="text-emerald-100/45 text-sm max-w-sm">Ask me anything about Islam — Quran, Hadith, fiqh, history, or daily practice.</p>
              </div>
              <div className="w-full max-w-md space-y-2">
                <p className="text-xs uppercase tracking-wider font-medium" style={{ color: 'rgba(197,168,128,0.6)' }}>Suggested questions</p>
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)} className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(197,168,128,0.15)', color: 'rgba(231,243,238,0.7)' }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(messages || []).map((msg, i) => <MessageBubble key={i} msg={msg} />)}
          {loading && <TypingIndicator />}

          {error && (
            <div className="error-banner">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1"><p className="font-semibold">Request failed</p><p className="text-xs opacity-80">{error}</p></div>
              <button onClick={() => setError(null)} className="text-xs hover:underline shrink-0" style={{ color: '#f3b4ba' }}>Dismiss</button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="shrink-0 border-t backdrop-blur-sm" style={{ background: 'rgba(2,23,17,0.95)', borderColor: 'rgba(197,168,128,0.15)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <textarea
              ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="Ask about Islam… (Enter to send, Shift+Enter for new line)" rows={1} disabled={loading}
              className="input-field flex-1 resize-none disabled:opacity-60 min-h-[46px] max-h-36 overflow-y-auto"
              style={{ lineHeight: '1.5' }}
              onInput={e => { e.target.style.height = 'auto'; e.target.style.height = `${Math.min(e.target.scrollHeight, 144)}px` }}
            />
            <button type="submit" disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200 disabled:cursor-not-allowed active:scale-95"
              style={{ background: (!input.trim() || loading) ? 'rgba(255,255,255,0.06)' : '#c5a880' }}>
              <Send className="w-4 h-4" style={{ color: (!input.trim() || loading) ? 'rgba(231,243,238,0.3)' : '#021711' }} />
            </button>
          </form>
          <p className="text-xs text-emerald-100/30 mt-2 text-center">Responses are AI-generated. Always verify religious rulings with a qualified scholar.</p>
        </div>
      </div>
    </div>
  )
}