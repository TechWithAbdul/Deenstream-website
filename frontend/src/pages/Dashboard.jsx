// src/pages/Dashboard.jsx
// Homepage — replicates the approved design reference (gold/emerald DeenStream AI landing page).
import React from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles, ArrowRight, BookOpen, Scroll, Compass, Library,
  Sunrise, BookMarked, Quote, MessageSquare,
} from 'lucide-react'

const STATS = [
  { value: '6,236', label: 'QURAN VERSES' },
  { value: '40,000+', label: 'HADITH' },
  { value: '27', label: 'TRANSLATIONS' },
  { value: '190+', label: 'COUNTRIES' },
]

const PILLARS = [
  {
    eyebrow: 'TRI-SCRIPT READER',
    title: 'The Holy Quran',
    desc: 'Verse by verse Arabic, Urdu and English with tafsir, audio recitation by world-renowned qaris, and AI-powered explanations.',
    cta: 'Open the Quran',
    to: '/quran',
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1200&auto=format&fit=crop',
  },
  {
    eyebrow: '9 CANONICAL BOOKS',
    title: 'Authenticated Hadith',
    desc: 'Bukhari, Muslim, Tirmidhi and more — every narration tagged with grade, chapter, and narrator chain.',
    cta: 'Browse Hadith',
    to: '/hadith',
    image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?q=80&w=1200&auto=format&fit=crop',
  },
  {
    eyebrow: 'PRAYER & QIBLA',
    title: 'Salah, on time',
    desc: 'Accurate prayer times for your city, a live vector Qibla compass, and reminders that respect your routine.',
    cta: 'View prayer times',
    to: '/prayers',
    image: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?q=80&w=1200&auto=format&fit=crop',
  },
  {
    eyebrow: 'SCHOLARLY LIBRARY',
    title: 'Classical works, modern reader',
    desc: 'A curated digital library of tafsir, seerah and fiqh — with custom typography controls and a sticky table of contents.',
    cta: 'Enter the library',
    to: '/duas',
    pattern: true,
  },
]

const SUGGESTED_PROMPTS = [
  'What are the virtues of Ayah al-Kursi?',
  'Summarize Surah Al-Kahf in 5 points',
  'Is qunoot in Fajr obligatory across madhāhib?',
  'Hadith on the etiquette of seeking knowledge',
]

const JOURNEY_STEPS = [
  { icon: Sunrise,   title: 'Wake with intention', desc: 'Fajr times, sunrise tracking and a soft Qibla pointer the moment you open the app.', to: '/prayers' },
  { icon: BookMarked, title: 'Recite & reflect',    desc: 'Continue your daily wird with bookmarks, repetition counters and tafsir at a tap.', to: '/quran' },
  { icon: Quote,      title: 'Learn the Sunnah',     desc: 'A handpicked hadith of the day with full chain, grade and contextual commentary.', to: '/hadith' },
]

function StatBlock({ value, label }) {
  return (
    <div>
      <p className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display,serif' }}>
        {value}
      </p>
      <p className="text-[10px] tracking-widest mt-1" style={{ color: 'rgba(197,168,128,0.65)' }}>
        {label}
      </p>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="animate-fade-in" style={{ background: '#021711' }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Crescent + ambient glow */}
        <div
          className="absolute top-16 right-10 sm:right-24 w-40 h-40 rounded-full pointer-events-none opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(197,168,128,0.18) 0%, transparent 70%)' }}
        />
        <div className="absolute top-20 right-16 sm:right-32 pointer-events-none">
          <div
            className="w-16 h-16 rounded-full"
            style={{
              background: 'linear-gradient(135deg, transparent 45%, rgba(245,235,210,0.9) 45%)',
              boxShadow: '0 0 40px rgba(245,235,210,0.15)',
              clipPath: 'circle(50%)',
            }}
          />
        </div>
        {/* Faint skyline silhouette */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 opacity-10 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(197,168,128,0.3) 40px, rgba(197,168,128,0.3) 42px)',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] tracking-widest font-medium mb-7"
               style={{ background: 'rgba(197,168,128,0.08)', color: '#c5a880', border: '1px solid rgba(197,168,128,0.25)' }}>
            <Sparkles className="w-3 h-3" /> A NEW ERA OF ISLAMIC LEARNING
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.15] mb-6 max-w-2xl"
            style={{ fontFamily: 'Playfair Display,Georgia,serif' }}
          >
            Walk the path of{' '}
            <span style={{ color: '#c5a880' }}>noor</span>, guided by knowledge.
          </h1>

          <p className="text-emerald-200/60 text-base sm:text-lg leading-relaxed max-w-xl mb-9">
            DeenStream AI brings together the Quran, authenticated Hadith, prayer times, and a scholar-grade AI companion — beautifully designed for the modern Muslim.
          </p>

          <div className="flex flex-wrap gap-4 mb-16">
            <Link
              to="/quran"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95"
              style={{ background: '#c5a880', color: '#021711' }}
            >
              Begin reading the Quran <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/ai-chat"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 border text-emerald-100 hover:bg-white/5"
              style={{ borderColor: 'rgba(197,168,128,0.3)' }}
            >
              <Sparkles className="w-4 h-4" style={{ color: '#c5a880' }} /> Try the AI companion
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-xl">
            {STATS.map(s => <StatBlock key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* ── FOUR PILLARS ──────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.25em] font-medium mb-3" style={{ color: '#c5a880' }}>
            FOUR PILLARS OF THE PLATFORM
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white max-w-2xl mx-auto leading-tight"
            style={{ fontFamily: 'Playfair Display,serif' }}
          >
            Everything your deen needs, in one place.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PILLARS.map((p) => (
            <Link
              key={p.title}
              to={p.to}
              className="group rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1"
              style={{ borderColor: 'rgba(197,168,128,0.15)', background: 'rgba(255,255,255,0.02)' }}
            >
              {/* Image / pattern header */}
              <div className="relative h-44 overflow-hidden">
                {p.pattern ? (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: 'radial-gradient(circle at center, #0d2e22 0%, #021711 80%)' }}
                  >
                    <div
                      className="w-32 h-32 rounded-full border-2 opacity-50"
                      style={{ borderColor: 'rgba(197,168,128,0.4)' }}
                    />
                  </div>
                ) : (
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                )}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(2,23,17,0.85) 100%)' }} />
                <span
                  className="absolute top-4 left-4 text-[10px] tracking-widest font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(2,23,17,0.7)', color: '#c5a880', border: '1px solid rgba(197,168,128,0.3)' }}
                >
                  {p.eyebrow}
                </span>
              </div>

              {/* Body */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display,serif' }}>
                  {p.title}
                </h3>
                <p className="text-emerald-200/55 text-sm leading-relaxed mb-4">{p.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: '#c5a880' }}>
                  {p.cta} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── AI COMPANION ──────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs tracking-[0.25em] font-medium mb-3" style={{ color: '#c5a880' }}>
              DEENSTREAM AI COMPANION
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight" style={{ fontFamily: 'Playfair Display,serif' }}>
              Ask anything.
            </h2>
            <h2 className="text-3xl sm:text-4xl font-bold mb-5 leading-tight" style={{ color: '#c5a880', fontFamily: 'Playfair Display,serif' }}>
              Every answer is cited.
            </h2>
            <p className="text-emerald-200/55 text-sm leading-relaxed mb-7 max-w-md">
              From the virtues of Ayah al-Kursi to nuanced fiqh across the four madhāhib — ask in plain language and receive responses grounded in Quran & Hadith, with every source linked.
            </p>
            <Link
              to="/ai-chat"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95"
              style={{ background: '#c5a880', color: '#021711' }}
            >
              <Sparkles className="w-4 h-4" /> Launch AI Companion
            </Link>
          </div>

          {/* Try asking panel */}
          <div className="rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(197,168,128,0.15)' }}>
            <div className="flex items-center gap-2 mb-4 text-emerald-200/50 text-xs">
              <MessageSquare className="w-3.5 h-3.5" /> Try asking
            </div>
            <div className="space-y-2.5">
              {SUGGESTED_PROMPTS.map((q, i) => (
                <Link
                  key={i}
                  to="/ai-chat"
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm text-emerald-100/80 border transition-all duration-200 hover:text-white group"
                  style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  {q}
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#c5a880' }} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DAILY JOURNEY ─────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.25em] font-medium mb-3" style={{ color: '#c5a880' }}>
            YOUR DAILY JOURNEY
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white max-w-xl mx-auto leading-tight" style={{ fontFamily: 'Playfair Display,serif' }}>
            From Fajr to Isha, beautifully orchestrated.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {JOURNEY_STEPS.map(({ icon: Icon, title, desc, to }) => (
            <Link
              key={title}
              to={to}
              className="group rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(197,168,128,0.12)' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 border"
                style={{ background: 'rgba(197,168,128,0.08)', borderColor: 'rgba(197,168,128,0.25)' }}
              >
                <Icon className="w-5 h-5" style={{ color: '#c5a880' }} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2" style={{ fontFamily: 'Playfair Display,serif' }}>
                {title}
              </h3>
              <p className="text-emerald-200/50 text-sm leading-relaxed mb-4">{desc}</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: '#c5a880' }}>
                Continue <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div
          className="rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(197,168,128,0.06), rgba(255,255,255,0.02))', border: '1px solid rgba(197,168,128,0.2)' }}
        >
          <p className="text-2xl mb-5" style={{ color: '#c5a880' }}>۞</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display,serif' }}>
            Begin your <span style={{ color: '#c5a880' }}>DeenStream</span> today.
          </h2>
          <p className="text-emerald-200/55 text-sm mb-8 max-w-md mx-auto">
            Free to use. Designed in the spirit of Islamic art. Built for every Muslim, everywhere.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/quran"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95"
              style={{ background: '#c5a880', color: '#021711' }}
            >
              Open the Quran
            </Link>
            <Link
              to="/prayers"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold border text-emerald-100 hover:bg-white/5 transition-all duration-200"
              style={{ borderColor: 'rgba(197,168,128,0.3)' }}
            >
              See prayer times
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}