// src/pages/AIChat.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Send, User, Bot, AlertCircle, Sparkles, BookOpen, MessageSquare, Search, Plus, Book, Compass, Heart, History, Trash2, Menu, X } from 'lucide-react'
import { aiApi } from '../services/api'

const PRESET_TILES = [
  { title: 'Explore Core Pillars', desc: 'Deep dive into historical contexts & theological principles.', icon: BookOpen, tag: 'Knowledge' },
  { title: 'Hadith Navigation', desc: 'Locate contexts, narrations & traditional commentary.', icon: Compass, tag: 'Hadith' },
  { title: 'Spiritual Reminders', desc: 'Seek comforting verses and du’as for modern daily trials.', icon: Heart, tag: 'Spiritual' },
]

const SCOPE_FILTERS = [
  { name: 'Noble Quran Analytics', prompt: 'Provide a deep analytical overview of thematic structures in the Holy Quran.', icon: Book },
  { name: 'Hadith Frameworks', prompt: 'Explain the methodology of authentic Hadith preservation and grading standards.', icon: Compass },
  { name: 'Fiqh & Daily Practice', prompt: 'What are the core foundational principles of Islamic jurisprudence (Fiqh) regarding daily routines?', icon: MessageSquare }
]

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-2.5 sm:gap-4 max-w-[92%] sm:max-w-[80%] transition-all duration-300 ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto flex-row'}`}>
      <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-md ${
        isUser ? 'border-[#c5a880]/30 bg-[#c5a880]' : 'border-emerald-700/20 bg-[#06241b]'
      }`}>
        {isUser ? <User className="w-3.5 h-3.5 text-[#021711]" /> : <Bot className="w-3.5 h-3.5 text-[#c5a880]" />}
      </div>
      
      <div className={`rounded-2xl px-3.5 py-2.5 sm:px-5 sm:py-4 text-[13px] sm:text-[15px] leading-relaxed shadow-xl border relative overflow-hidden ${
        isUser 
          ? 'bg-emerald-950/40 text-emerald-50 border-emerald-800/30 rounded-tr-none' 
          : 'bg-[#06241b]/60 text-stone-200 border-emerald-900/30 rounded-tl-none font-serif'
      }`}>
        {!isUser && <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#c5a880]/[0.02] to-transparent pointer-events-none" />}
        <div className="whitespace-pre-wrap break-words selection:bg-[#c5a880]/30">{msg.content}</div>
      </div>
    </div>
  )
}

export default function AIChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const currentSessionIdRef = useRef(null)

  const [chatHistory, setChatHistory] = useState([
    { id: '1', title: 'Concept of Sabr (Patience)', tokens: [{ role: 'user', content: 'Tell me about Sabr' }, { role: 'assistant', content: 'Sabr (patience) is one of the most emphasized values...' }] },
    { id: '2', title: 'Seeking Knowledge in Islam', tokens: [{ role: 'user', content: 'Hadith about education' }, { role: 'assistant', content: 'The Prophet (ﷺ) said: Seeking knowledge is mandatory...' }] }
  ])
  const [searchQuery, setSearchQuery] = useState('')
  
  const chatContainerRef = useRef(null)
  const inputRef = useRef(null)
  const isEmpty = messages.length === 0

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages, loading])

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || '').trim()
    if (!trimmed || loading) return

    setError(null)
    const userMsg = { role: 'user', content: trimmed }
    
    let isFreshSession = false
    if (messages.length === 0 && !currentSessionIdRef.current) {
      currentSessionIdRef.current = String(Date.now())
      isFreshSession = true
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await aiApi.chat(trimmed, messages)
      const data = res.data || {}
      const replyText = data.reply || data.response || data.content || 'No response received.'
      const aiMsg = { role: 'assistant', content: replyText }

      setMessages(prev => {
        const nextState = [...prev, aiMsg]
        
        if (isFreshSession) {
          const newSessionTitle = trimmed.length > 26 ? trimmed.substring(0, 23) + '...' : trimmed
          setChatHistory(old => {
            if (old.some(s => s.id === currentSessionIdRef.current)) return old
            return [{ id: currentSessionIdRef.current, title: newSessionTitle, tokens: nextState }, ...old]
          })
        } else {
          setChatHistory(old => old.map(s => s.id === currentSessionIdRef.current ? { ...s, tokens: nextState } : s))
        }
        return nextState
      })
    } catch (err) {
      setError(err?.message || 'Could not connect to your AI companion.')
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [messages, loading])

  const handleSubmit = (e) => { e.preventDefault(); sendMessage(input) }
  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }
  
  const loadSavedSession = (session) => {
    setError(null)
    currentSessionIdRef.current = session.id
    setMessages(session.tokens)
    setSidebarOpen(false)
  }

  const deleteSession = (id, e) => {
    e.stopPropagation()
    setChatHistory(prev => prev.filter(item => item.id !== id))
    if (currentSessionIdRef.current === id) clearChat()
  }

  const clearChat = () => { 
    setMessages([])
    setError(null)
    setInput('')
    currentSessionIdRef.current = null
  }

  const filteredHistory = chatHistory.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full flex bg-[#02110b] text-stone-200 overflow-hidden relative" style={{ height: 'calc(100vh - 64px)' }}>
      
      {/* Background Ambient Aura */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[140px] pointer-events-none z-0" />

      {/* MOBILE TOP BAR NAVIGATION */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-12 bg-[#02150f]/95 backdrop-blur-md border-b border-emerald-950/40 z-40 flex items-center justify-between px-3">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 text-stone-400 hover:text-white transition-colors">
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
        <span className="text-xs font-bold tracking-wide text-white font-serif">AI Alim</span>
        <button onClick={clearChat} className="p-1.5 text-[#c5a880] hover:text-white transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* LEFT DRAWER/SIDEBAR PANEL */}
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-72 border-r flex flex-col shrink-0 p-4 justify-between z-50 pt-16 md:pt-4`} 
           style={{ backgroundColor: '#02150f', borderColor: 'rgba(197,168,128,0.12)' }}>
        <div className="space-y-5 flex flex-col h-[calc(100%-60px)]">
          <div className="flex items-center justify-between bg-[#06241b]/50 border border-emerald-900/30 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#c5a880]" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-100/70">Consultation History</span>
            </div>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-3.5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search previous topics..." 
              className="w-full bg-black/30 text-xs pl-9 pr-3 py-3 rounded-xl border border-emerald-900/20 outline-none placeholder-stone-600 focus:border-[#c5a880]/30 transition-colors" 
            />
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-1 pr-1">
            {filteredHistory.map((session) => (
              <div 
                key={session.id} 
                onClick={() => loadSavedSession(session)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  currentSessionIdRef.current === session.id 
                    ? 'bg-[#06241b] border-emerald-800/40 text-white' 
                    : 'text-stone-300 border-transparent hover:bg-[#06241b]/30'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden text-ellipsis mr-2">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{session.title}</span>
                </div>
                <button 
                  onClick={(e) => deleteSession(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-950/30 text-stone-500 hover:text-rose-400 transition-all shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 pt-4 border-t border-emerald-950/40 hidden md:block">
            <p className="text-[10px] font-bold tracking-widest text-[#c5a880]/50 uppercase px-2 mb-1">Knowledge Spheres</p>
            {SCOPE_FILTERS.map((filter, idx) => {
              const Icon = filter.icon
              return (
                <div 
                  key={idx} 
                  onClick={() => { sendMessage(filter.prompt); setSidebarOpen(false); }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-stone-400 hover:bg-[#06241b]/40 hover:text-white cursor-pointer transition-all border border-transparent hover:border-emerald-900/20 group"
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-700 group-hover:text-[#c5a880]" /> 
                  <span>{filter.name}</span>
                </div>
              )
            })}
          </div>
        </div>

        <button onClick={() => { clearChat(); setSidebarOpen(false); }} className="w-full flex items-center justify-between p-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#103b2c] to-[#0a291e] text-[#c5a880] border border-[#c5a880]/20 shadow-xl">
          <span>New Consultation</span>
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* CORE DISPLAY CANVAS */}
      <div className="flex-1 flex flex-col justify-between items-center relative z-10 h-full overflow-hidden">
        
        {isEmpty ? (
          <div className="flex-1 w-full flex items-center justify-center p-4 sm:p-6 overflow-y-auto mt-12 md:mt-0">
            
            {/* DESKTOP WELCOME CORE */}
            <div className="hidden md:flex w-full max-w-2xl border p-8 rounded-3xl flex-col items-center shadow-2xl animate-fade-in mx-auto"
                 style={{ backgroundColor: 'rgba(2, 23, 17, 0.7)', borderColor: 'rgba(197, 168, 128, 0.15)', backdropFilter: 'blur(24px)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center border border-[#c5a880]/30 bg-gradient-to-b from-[#06241b] to-[#02110b] mb-5">
                <Sparkles className="w-5 h-5 text-[#c5a880]" />
              </div>
              <h1 className="text-3xl font-bold tracking-normal text-white text-center mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>As-salamu alaykum</h1>
              <p className="text-sm text-emerald-100/60 max-w-md text-center leading-relaxed mb-8">Welcome to your DeenStream digital companion. I am here to help you explore verified pools of Islamic knowledge with ease.</p>

              <div className="grid grid-cols-3 gap-3 w-full mb-8">
                {PRESET_TILES.map((tile, i) => {
                  const Icon = tile.icon
                  return (
                    <button key={i} onClick={() => sendMessage(tile.title)}
                            className="group p-4 rounded-xl border text-left transition-all duration-300 bg-[#041d14]/40 border-emerald-900/30 hover:bg-[#06241b]/60 hover:border-[#c5a880]/40 flex flex-col justify-between min-h-[135px]">
                      <div className="flex items-center justify-between w-full mb-3">
                        <Icon className="w-4 h-4 text-[#c5a880]" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400/60 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/40">{tile.tag}</span>
                      </div>
                      <div>
                        <p className="text-stone-200 text-xs font-bold group-hover:text-white mb-1">{tile.title}</p>
                        <p className="text-[11px] text-stone-500 group-hover:text-stone-400 leading-normal">{tile.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* High Contrast Desktop Entry Panel */}
              <form onSubmit={handleSubmit} className="w-full flex items-center bg-[#0c1f17] border border-emerald-800/60 rounded-xl p-1.5 pl-4 focus-within:border-[#c5a880] transition-all shadow-lg shadow-black/40">
                <textarea
                  ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                  placeholder="Ask a question regarding verses, actions, or values..." rows={1} disabled={loading}
                  className="w-full bg-transparent border-0 outline-none focus:ring-0 text-sm text-white placeholder-emerald-800/80 resize-none py-3 max-h-24"
                  onInput={e => { e.target.style.height = 'auto'; e.target.style.height = `${e.target.scrollHeight}px` }}
                />
                <button type="submit" disabled={!input.trim() || loading} className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#c5a880] disabled:opacity-20 ml-2 shadow-lg shrink-0">
                  <Send className="w-4 h-4 text-[#02110b]" />
                </button>
              </form>
            </div>

            {/* MINIMALIST MOBILE WELCOME */}
            <div className="md:hidden w-full flex flex-col items-center justify-center h-full px-4 text-center animate-fade-in relative pb-16">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border border-[#c5a880]/20 bg-[#06241b] mb-3">
                <Sparkles className="w-4 h-4 text-[#c5a880]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1 font-serif">How can I help you today?</h2>
              <p className="text-[11px] text-stone-500 max-w-xs">Your personal Alim AI companion for authentic knowledge.</p>
              
              <div className="w-full absolute bottom-1 left-0 px-4">
                <form onSubmit={handleSubmit} className="w-full flex items-center bg-[#0c1f17] border border-emerald-800/60 rounded-xl p-1 pl-3.5 focus-within:border-[#c5a880] shadow-xl">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask anything..."
                    disabled={loading}
                    className="w-full bg-transparent border-0 outline-none focus:ring-0 text-xs text-white py-2.5 placeholder-stone-500"
                  />
                  <button type="submit" disabled={!input.trim() || loading} className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#c5a880] disabled:opacity-20 ml-2 shrink-0">
                    <Send className="w-3.5 h-3.5 text-[#02110b]" />
                  </button>
                </form>
              </div>
            </div>

          </div>
        ) : (
          /* ACTIVE STREAM TIMELINE VIEWPORT (ZERO STATIC FOOTERS) */
          <div className="w-full flex-1 flex flex-col overflow-hidden relative pt-12 md:pt-0">
            
            {/* Scroll Containment Zone */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto scrollbar-thin px-3 sm:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
              {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
              
              {loading && (
                <div className="flex items-center gap-2 animate-pulse text-stone-400 text-xs pl-2 font-medium tracking-wide">
                  <Sparkles className="w-3 h-3 text-[#c5a880] animate-spin" /> Gathering scholarly contexts...
                </div>
              )}

              {/* Dynamic scroll safety anchor to prevent panel clipping */}
              <div className="h-24 sm:h-28 shrink-0" />
            </div>

            {/* Grounded Floating Entry Station */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#02110b] via-[#02110b]/95 to-transparent pt-6 pb-4 px-3 sm:px-8 z-20">
              <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="flex items-center bg-[#0c1f17] border border-emerald-800/60 rounded-xl p-1.5 pl-3.5 sm:pl-4 focus-within:border-[#c5a880] transition-all duration-200 shadow-2xl">
                  <textarea
                    value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                    placeholder="Ask a follow-up question..." rows={1} disabled={loading}
                    className="w-full bg-transparent border-0 outline-none focus:ring-0 text-xs sm:text-sm text-white placeholder-stone-500 resize-none py-2 sm:py-3 max-h-24"
                    onInput={e => { e.target.style.height = 'auto'; e.target.style.height = `${e.target.scrollHeight}px` }}
                  />
                  <button type="submit" disabled={!input.trim() || loading} className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-[#c5a880] disabled:opacity-20 ml-2 shadow-lg shrink-0">
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#02110b]" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Backdrop overlay trigger for layout closures */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-30" />}
    </div>
  )
}