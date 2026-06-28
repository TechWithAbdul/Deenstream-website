// src/pages/Dashboard.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Scroll, Clock, Heart, MessageSquare, MapPin, ChevronRight, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'

const FEATURES = [
  { to:'/quran',   icon:BookOpen,      title:'Quran Reader',    desc:'114 surahs with Arabic, transliteration, and multi-language translations.', grad:'from-emerald-700 to-emerald-900', link:'text-emerald-700' },
  { to:'/hadith',  icon:Scroll,        title:'Hadith Library',  desc:'36,000+ narrations from Bukhari, Muslim, and five canonical collections.',  grad:'from-amber-700  to-amber-900',  link:'text-amber-700'  },
  { to:'/prayers', icon:Clock,         title:'Prayer Times',    desc:'Accurate daily schedules for your location across 22 calculation methods.',  grad:'from-sky-700    to-sky-900',    link:'text-sky-700'    },
  { to:'/duas',    icon:Heart,         title:'Duas Hub',        desc:'Prophetic supplications by occasion — morning, travel, protection & more.',  grad:'from-rose-700   to-rose-900',   link:'text-rose-700'   },
  { to:'/ai-chat', icon:MessageSquare, title:'AI Assistant',    desc:'Ask anything about Islam — Gemini-powered with a scholarly system prompt.',  grad:'from-violet-700 to-violet-900', link:'text-violet-700' },
]

export default function Dashboard() {
  const { countdown, nextPrayer, requestLocation, userCoords } = useApp()

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{background:'linear-gradient(135deg,#022c22 0%,#064e3b 55%,#065f46 100%)'}}>
        <div className="absolute inset-0 geometric-bg opacity-25 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none opacity-15" style={{background:'radial-gradient(circle,#fbbf24 0%,transparent 70%)',transform:'translate(30%,-30%)'}} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: headline */}
            <div className="space-y-6 animate-slide-up">
              <div className="badge-gold w-fit"><Sparkles className="w-3 h-3" /> Islamic Content Platform</div>
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold text-white leading-tight" style={{fontFamily:'Playfair Display,Georgia,serif'}}>
                A Sanctuary of{' '}<span style={{color:'#fbbf24'}}>Sacred Knowledge</span>
              </h1>
              <p className="text-emerald-300/80 text-lg leading-relaxed max-w-md">
                Quran, Hadith, Prayer Times, Duas, and AI-powered learning — all in one beautifully crafted space.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/quran" className="btn-primary"><BookOpen className="w-4 h-4" /> Open Quran</Link>
                <Link to="/prayers" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border border-emerald-500/40 text-emerald-200 hover:bg-emerald-800/40 transition-all duration-200">
                  <Clock className="w-4 h-4" /> Prayer Times
                </Link>
              </div>
              <div>
                <p className="text-2xl text-amber-300/70 arabic-leading" lang="ar" style={{fontFamily:'Amiri,serif'}}>اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</p>
                <p className="text-emerald-400/50 text-xs mt-1">"Read in the name of your Lord who created" — Al-Alaq 96:1</p>
              </div>
            </div>

            {/* Right: countdown */}
            <div className="flex justify-center lg:justify-end">
              <div className="rounded-3xl p-8 sm:p-10 text-center w-full max-w-sm" style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',backdropFilter:'blur(12px)'}}>
                {nextPrayer ? (
                  <>
                    <p className="text-emerald-300/70 text-xs uppercase tracking-widest font-medium mb-2">Next Prayer</p>
                    <p className="text-amber-300 font-bold text-2xl mb-3" style={{fontFamily:'Playfair Display,serif'}}>{nextPrayer.name}</p>
                    <div className="font-mono text-5xl sm:text-6xl font-bold text-white tracking-tight tabular-nums">{countdown || '––:––:––'}</div>
                    <p className="text-emerald-400/60 text-sm mt-3">{nextPrayer.time}</p>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <Clock className="w-14 h-14 text-amber-400/50" />
                    <p className="text-emerald-300/70 text-sm">Share your location to see live prayer countdown</p>
                    <button onClick={requestLocation} className="btn-primary"><MapPin className="w-4 h-4" /> Detect Location</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ornamental divider */}
      <div className="flex items-center justify-center gap-4 py-2" style={{background:'rgba(251,191,36,0.04)'}}>
        <div className="h-px flex-1 max-w-xs" style={{background:'linear-gradient(to right,transparent,rgba(251,191,36,0.3))'}} />
        <span className="text-amber-400/50 text-sm">✦ ✦ ✦</span>
        <div className="h-px flex-1 max-w-xs" style={{background:'linear-gradient(to left,transparent,rgba(251,191,36,0.3))'}} />
      </div>

      {/* Feature cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-emerald-900 mb-3" style={{fontFamily:'Playfair Display,serif'}}>Everything You Need</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Five complete modules, one unified platform — crafted with care for the Muslim community.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ to, icon: Icon, title, desc, grad, link }) => (
            <Link key={to} to={to} className="card group p-6 flex flex-col gap-4 hover:scale-[1.02] transition-transform duration-300">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-md`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-lg mb-1 group-hover:text-emerald-800 transition-colors">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium mt-auto ${link}`}>Explore <ChevronRight className="w-3.5 h-3.5" /></div>
            </Link>
          ))}
          <div className="card p-6 flex flex-col gap-4" style={{background:'linear-gradient(135deg,#fafaf9,#fffbeb)'}}>
            <p className="text-4xl text-amber-500/80 arabic-leading" lang="ar" style={{fontFamily:'Amiri,serif'}}>اللَّهُ</p>
            <div>
              <h3 className="font-semibold text-slate-800 text-lg mb-1">99 Names of Allah</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Explore Asma ul Husna with meanings and transliterations.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}