import React from 'react'
import { Link } from 'react-router-dom'

export default function Header(){
  return (
    <header className="w-full py-4 px-6 bg-white/60 backdrop-blur-sm border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent shadow-md" />
          <div>
            <div className="font-semibold text-lg">DeenStream AI</div>
            <div className="text-xs text-gray-500">Islamic knowledge, powered by AI</div>
          </div>
        </Link>
        <nav className="hidden md:flex gap-4 items-center text-sm text-gray-700">
          <Link to="/quran">Quran</Link>
          <Link to="/hadith">Hadith</Link>
          <Link to="/prayer">Prayer</Link>
          <Link to="/chat">AI Chat</Link>
        </nav>
      </div>
    </header>
  )
}
