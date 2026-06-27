import React from 'react'
import { MessageCircle } from 'lucide-react'

export default function FloatingChatButton({ onClick }){
  return (
    <button onClick={onClick} className="fixed right-6 bottom-6 bg-primary text-white p-3 rounded-full shadow-lg z-50">
      <MessageCircle />
    </button>
  )
}
