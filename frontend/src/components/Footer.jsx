import React from 'react'

export default function Footer(){
  return (
    <footer className="mt-12 bg-white/40 p-6">
      <div className="max-w-6xl mx-auto text-center text-sm text-gray-600">© {new Date().getFullYear()} DeenStream AI — Privacy · Terms</div>
    </footer>
  )
}
