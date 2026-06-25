import React from 'react'
import { Link } from 'react-router-dom'

export default function Header(){
  return (
    <header className="bg-white/40 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">DS</div>
          <div className="font-semibold">DeenStream AI</div>
        </div>
        <nav className="flex gap-4">
          <Link to="/" className="text-sm">Home</Link>
          <Link to="/quran" className="text-sm">Quran</Link>
          <Link to="/hadith" className="text-sm">Hadith</Link>
          <Link to="/chat" className="text-sm">AI Chat</Link>
        </nav>
      </div>
    </header>
  )
}
