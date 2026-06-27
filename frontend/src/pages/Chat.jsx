import React from 'react'
import ChatWidget from '../components/ChatWidget'

export default function Chat(){
  return (
    <div className="py-6">
      <h2 className="text-2xl font-semibold">AI Assistant</h2>
      <p className="text-sm text-gray-600 mt-2">Ask contextual Islamic questions — the assistant references Quran & Hadith where applicable.</p>
      <div className="mt-6">
        <ChatWidget />
      </div>
    </div>
  )
}
