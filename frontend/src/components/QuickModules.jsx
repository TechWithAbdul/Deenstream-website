import React from 'react'
import ChatWidget from './ChatWidget'

export default function QuickModules(){
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 card-glass">Qibla Finder (soon)</div>
      <div className="p-4 card-glass">Prayer Times (quick)</div>
      <div className="p-4 card-glass">Search Quran & Hadith</div>
      <ChatWidget />
    </div>
  )
}
