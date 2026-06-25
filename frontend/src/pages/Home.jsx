import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Home(){
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-4xl font-bold text-primary">Welcome to DeenStream AI</h2>
        <p className="mt-4 text-lg">AI-powered Islamic knowledge platform — Quran, Hadith, Prayer times and more.</p>
      </main>
      <Footer />
    </div>
  )
}
