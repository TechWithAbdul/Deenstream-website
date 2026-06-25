import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <main className="min-h-screen max-w-6xl mx-auto p-6">
      <section className="rounded-[2rem] bg-white/90 shadow-2xl p-8 mt-8 ring-1 ring-emerald-100">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-primary">DeenStream AI</p>
            <h1 className="text-5xl font-bold sm:text-6xl">Islamic knowledge, made modern.</h1>
            <p className="max-w-3xl text-lg text-gray-700">Explore the Quran, hadiths, prayer times, Islamic dates, and an AI-powered Islamic assistant. No login required — just a clean, responsive experience designed for everyday Muslim life.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link to="/quran" className="rounded-3xl border border-emerald-100 bg-emerald-50/80 p-6 transition hover:-translate-y-1 hover:shadow-xl">
              <h2 className="text-xl font-semibold">Quran Reader</h2>
              <p className="mt-2 text-sm text-gray-600">Search, read, and share any surah with translation and deep-linking support.</p>
            </Link>
            <Link to="/chat" className="rounded-3xl border border-emerald-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl">
              <h2 className="text-xl font-semibold">AI Chat</h2>
              <p className="mt-2 text-sm text-gray-600">Ask questions about Islam and get answers that reference Quran and hadith.</p>
            </Link>
            <Link to="/hadith" className="rounded-3xl border border-emerald-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl">
              <h2 className="text-xl font-semibold">Hadith Library</h2>
              <p className="mt-2 text-sm text-gray-600">Browse key narrations and learn practical teachings from authentic sources.</p>
            </Link>
            <div className="rounded-3xl border border-emerald-100 bg-white p-6">
              <h2 className="text-xl font-semibold">Prayer & Calendar</h2>
              <p className="mt-2 text-sm text-gray-600">Coming soon: prayer times, Hijri calendar, and Islamic event highlights.</p>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white shadow-xl">
            <h2 className="text-2xl font-semibold">Build with a modern full-stack approach</h2>
            <p className="mt-3 text-sm leading-7">This app combines React, Vite, Tailwind CSS and FastAPI to showcase a scalable architecture with server-side AI and content APIs. Everything is free to use and requires no login.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
