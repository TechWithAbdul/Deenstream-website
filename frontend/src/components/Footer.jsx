import React from 'react'

export default function Footer(){
  return (
    <footer className="w-full py-6 mt-10 border-t bg-white/30">
      <div className="max-w-6xl mx-auto text-center text-sm text-gray-600">© {new Date().getFullYear()} DeenStream AI — Built with care for the global Muslim community.</div>
    </footer>
  )
}
