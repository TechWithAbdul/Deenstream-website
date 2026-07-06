// src/pages/Dashboard.jsx
<<<<<<< HEAD
// Mobile-first, authentic data from backend, balanced Arabic+English,
// richer color palette, full responsiveness across all screen sizes.
import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles, ArrowRight, ChevronRight, MapPin, Compass,
  Sunrise, BookOpen, Quote, Heart, Clock, Moon, Sun, Sunset,
  MessageSquare, ShieldCheck, Award, Bookmark, Plus, RotateCcw,
  AlertCircle, Loader2
} from 'lucide-react'
import { prayerApi, namesApi } from '../services/api'

// ── Static daily content ──────────────────────────────────────────────────────
const STATS = [
  { val: '6,236',   label: 'Quran Verses',    ar: 'آيات قرآنية' },
  { val: '40,000+', label: 'Hadith',           ar: 'حديث نبوي' },
  { val: '27',      label: 'Translations',     ar: 'ترجمة' },
  { val: '190+',    label: 'Countries',        ar: 'دولة' },
  { val: '100%',    label: 'Authentic',        ar: 'مصادر موثوقة' },
]

const TODAY_HADITH = {
  arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
  translation: 'Actions are judged by intentions, and every person will get what they intended.',
  source: 'صحيح البخاري · Sahih Bukhari 1',
  to: '/hadith',
}
const TODAY_DUA = {
  arabic: 'رَبِّ زِدْنِي عِلْمًا',
  translation: 'My Lord, increase me in knowledge.',
  source: 'سورة طه 20:114 · Surah Taha 20:114',
  to: '/duas',
}
const VERSE_OF_DAY = {
  arabic: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ۚ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
  translation: 'Allah is sufficient for me; there is no deity except Him. I have placed my trust in Him.',
  source: 'التوبة 9:129 · At-Tawbah 9:129',
}
const AI_PROMPTS = [
  'ما هي فضائل آية الكرسي؟',
  'What are the virtues of Ayah al-Kursi?',
  'أعطني تذكيرًا إسلاميًا يوميًا',
]
const JOURNEY_STEPS = [
  { tag: 'الفجر · Fajr',    title: 'Wake with Intention',    ar: 'استيقظ بنية', desc: 'Begin with morning adhkaar, Fajr prayer, and gratitude.' },
  { tag: 'الظهر · Dhuhr',   title: 'Recite & Reflect',       ar: 'اتلُ وتأمل',   desc: 'Pause from the world, recite Quran and ponder meanings.' },
  { tag: 'العصر · Asr',     title: 'Learn & Grow',           ar: 'تعلم وانمُ',   desc: 'Study authentic Hadith and expand your Islamic knowledge.' },
  { tag: 'المغرب · Maghrib', title: 'Pray on Time',           ar: 'صلِّ في وقتها', desc: 'Stay consistent — the pillars of your day, never missed.' },
  { tag: 'العشاء · Isha',   title: 'Night Devotion',         ar: 'العبادة الليلية', desc: 'Close the day with evening supplications and reflection.' },
]
const PRAYER_ICONS = { Fajr: Sunrise, Sunrise: Sun, Dhuhr: Sun, Asr: Sun, Maghrib: Sunset, Isha: Moon }
const PRAYER_AR = { Fajr: 'الفجر', Sunrise: 'الشروق', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' }
const CALC_METHODS = ['MWL','ISNA','Egypt','Makkah','Karachi','NorthAmerica','Singapore','Turkey','Kuwait','Qatar']

// ── Shared style helpers ──────────────────────────────────────────────────────
const C = {
  gold: '#c5a880',
  bg: '#010f07',
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(197,168,128,0.18)', borderRadius: '1rem' },
  cardHover: { borderColor: 'rgba(197,168,128,0.4)', background: 'rgba(255,255,255,0.065)' },
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mb-5 sm:mb-6">
      <span className="w-1 h-4 rounded-full inline-block" style={{ background: C.gold }} />
      <h2 className="text-base sm:text-lg font-light text-white" style={{ fontFamily: 'Playfair Display,serif' }}>{children}</h2>
=======
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
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
    </div>
  )
}

<<<<<<< HEAD
function HoverCard({ children, className = '', style = {}, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      className={`transition-all duration-300 ${className}`}
      style={{ ...C.card, ...(hov ? C.cardHover : {}), ...style }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// ── Geolocation + prayer times hook ──────────────────────────────────────────
function usePrayerTimes() {
  const [times, setTimes] = useState(null)
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [method] = useState('MWL')

  const fetchTimes = useCallback(async (lat, lng, loc) => {
    setLoading(true); setError(null)
    try {
      const res = await prayerApi.getTimes(lat, lng, method)
      const d = res.data
      const timings = d?.times || d?.data?.timings || d?.timings || d?.prayer_times || d
      setTimes(typeof timings === 'object' ? timings : null)
      setLocation(loc)
    } catch (e) {
      setError('Could not load prayer times.')
    } finally { setLoading(false) }
  }, [method])

  useEffect(() => {
    if (!navigator.geolocation) { setError('Geolocation not supported'); return }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        // Reverse geocode city name
        let locName = `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          const j = await r.json()
          locName = j?.address?.city || j?.address?.town || j?.address?.county || locName
        } catch {}
        fetchTimes(lat, lng, locName)
      },
      () => {
        // Fallback to Makkah
        fetchTimes(21.3891, 39.8579, 'Makkah al-Mukarramah')
      },
      { timeout: 6000 }
    )
  }, [fetchTimes])

  return { times, location, loading, error }
}

// ── Next prayer calculator ────────────────────────────────────────────────────
function getNextPrayer(times) {
  if (!times) return null
  const KEYS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
  const now = new Date()
  const today = now.toLocaleDateString('en-CA')
  for (const k of KEYS) {
    const t = times[k]; if (!t) continue
    const [h, m] = t.replace(/ (AM|PM)/, '').split(':').map(Number)
    const isPM = t.includes('PM') && h !== 12
    const isAM = t.includes('AM') && h === 12
    const hr = isPM ? h + 12 : isAM ? 0 : h
    const pDate = new Date(`${today}T${String(hr).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`)
    if (pDate > now) return { name: k, time: t, date: pDate }
  }
  return { name: 'Fajr', time: times['Fajr'] || '—', date: null }
}

function useCountdown(targetDate) {
  const [cd, setCd] = useState('')
  useEffect(() => {
    if (!targetDate) return
    const tick = () => {
      const diff = targetDate - Date.now()
      if (diff <= 0) { setCd('الآن · Now'); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCd(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`)
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [targetDate])
  return cd
}



// ── Name of the Day hook ──────────────────────────────────────────────────────
function useNameOfDay() {
  const [name, setName] = useState(null)

  useEffect(() => {
    let currentDay = new Date().getDate()

    const fetchName = () => {
      const id = ((currentDay % 99) + 1)
      
      fetch(`/v1/names/${id}`)
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(d => {
          // FIX: Access the "data" sub-object directly from your backend structure
          if (d && d.success && d.data) {
            setName(d.data)
          }
        })
        .catch(() => {})
    }

    fetchName()

    const interval = setInterval(() => {
      const today = new Date().getDate()
      if (today !== currentDay) {
        currentDay = today
        fetchName()
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  return name
}

// ═════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const [tasbih, setTasbih] = useState(0)
  const [aiQuery, setAiQuery] = useState('')
  const { times, location, loading: pLoading, error: pError } = usePrayerTimes()
  const nextPrayer = getNextPrayer(times)
  const countdown = useCountdown(nextPrayer?.date)
  const nameOfDay = useNameOfDay()

  const PRAYER_KEYS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#010f07', color: '#e7ece9' }}>

      {/* ── AMBIENT GLOW (subtle, not dark) ─────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 sm:w-[600px] sm:h-[600px] rounded-full opacity-20"
             style={{ background: 'radial-gradient(circle,rgba(197,168,128,0.35) 0%,transparent 70%)' }} />
        <div className="absolute top-1/2 -left-32 w-80 h-80 sm:w-[450px] sm:h-[450px] rounded-full opacity-10"
             style={{ background: 'radial-gradient(circle,rgba(21,128,61,0.4) 0%,transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full opacity-10"
             style={{ background: 'radial-gradient(circle,rgba(197,168,128,0.2) 0%,transparent 70%)' }} />
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-12 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left */}
          <div className="space-y-5 sm:space-y-6 animate-fade-in order-2 lg:order-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] sm:text-[11px] tracking-[0.18em] uppercase font-medium"
                 style={{ background: 'rgba(197,168,128,0.1)', color: C.gold, border: '1px solid rgba(197,168,128,0.25)' }}>
              <Sparkles className="w-3 h-3" /> A New Era of Islamic Learning
            </div>

            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight text-white leading-[1.12] tracking-tight"
                  style={{ fontFamily: 'Playfair Display,serif' }}>
                Walk The Path Of {' '}
                <em className="not-italic font-light" style={{ color: C.gold }}> Noor</em> <br className="hidden sm:block" />
                {' '}Guided by knowledge.
              </h1>
              <p className="mt-5 text-lg sm:text-lm text-center arabic-leading text-[20px] sm:text-[20px]"
                 lang="ar" style={{ fontFamily: 'Amiri,serif', color: 'rgba(197,168,128,0.65)', lineHeight: 1}}>
                امشِ في طريق النور، بهدى العلم
              </p>
            </div>

            <p className="text-sm text-emerald-100/55 leading-relaxed max-w-md font-light">
              DeenStream brings together the Quran, Authenticated Hadith, Prayer times, and AI-powered tools — beautifully designed for the modern Muslim.
            </p>

            <div className="flex flex-col xs:flex-row flex-wrap gap-3">
              <Link to="/quran"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-200 active:scale-95"
                style={{ background: C.gold, color: '#010f07' }}>
                <BookOpen className="w-3.5 h-3.5" /> Read the Quran <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/ai-chat"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-200 active:scale-95"
                style={{ border: '1px solid rgba(197,168,128,0.28)', color: '#e7ece9', background: 'rgba(197,168,128,0.04)' }}>
                <Sparkles className="w-3.5 h-3.5" style={{ color: C.gold }} /> Ask AI Alim
              </Link>
            </div>
          </div>

          {/* Right — hero image + prayer countdown */}
          <div className="relative rounded-2xl overflow-hidden order-1 lg:order-2" style={{ height: '300px', ...C.card }}>
            <img
              src="https://plus.unsplash.com/premium_photo-1697729758639-d692c36557b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA5fHxtb3NxdWV8ZW58MHx8MHx8fDA%3D"
              alt="Mosque at night"
              className="absolute inset-0 w-full h-full object-cover"
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(1,15,7,0.7) 0%,rgba(1,15,7,0.15) 50%,rgba(1,15,7,0.6) 100%)' }} />

            {/* Top row */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <span className="text-[10px] font-mono tracking-widest px-2.5 py-1 rounded"
                    style={{ background: 'rgba(1,15,7,0.75)', color: C.gold, border: '1px solid rgba(197,168,128,0.25)', backdropFilter: 'blur(8px)' }}>
               Islam
              </span>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: C.gold }} />
            </div>

            {/* Countdown chip */}
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl z-10"
                 style={{ background: 'rgba(1,15,7,0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(197,168,128,0.2)' }}>
              {pLoading ? (
                <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(197,168,128,0.7)' }}>
                  <Loader2 className="w-2 h-2 animate-spin" /> Fetching prayer times…
                </div>
              ) : pError ? (
                <p className="text-[10px]" style={{ color: 'rgba(197,168,128,0.6)' }}>📍 {pError}</p>
              ) : nextPrayer ? (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[9px] font-mono tracking-widest uppercase" style={{ color: 'rgba(197,168,128,0.65)' }}>
                      Next · {PRAYER_AR[nextPrayer.name] || nextPrayer.name}
                    </p>
                    <p className="text-[10px] text-emerald-100/40 font-mono">{nextPrayer.time}</p>
                  </div>
                  <p className="font-mono text-2xl sm:text-4xl font-bold text-white tabular-nums">{countdown}</p>
                  <p className="text-[10px] text-emerald-100/35 mt-1 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" /> {location || '…'}
                  </p>
                </>
              ) : null}
            </div>
          </div>

        </div>

        {/* Stats ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mt-8 sm:mt-12 pt-8 sm:pt-10"
             style={{ borderTop: '1px solid rgba(197,168,128,0.12)' }}>
          {STATS.map((s, i) => (
            <div key={i} className="text-center py-3 sm:py-4 px-2 rounded-xl"
                 style={{ background: 'rgba(197,168,128,0.05)', border: '1px solid rgba(197,168,128,0.1)' }}>
              <p className="text-xl sm:text-2xl font-semibold text-white" style={{ fontFamily: 'Playfair Display,serif' }}>{s.val}</p>
              <p className="text-[9px] sm:text-[10px] text-emerald-200/40 uppercase tracking-wider mt-0.5 font-light">{s.label}</p>
              <p className="text-[9px] mt-0.5" lang="ar" style={{ color: 'rgba(197,168,128,0.45)', fontFamily: 'Amiri,serif' }}>{s.ar}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          DAILY HUB — Prayer Times, Hadith, Dua, Tools
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14"
               style={{ borderTop: '1px solid rgba(197,168,128,0.1)' }}>
        <SectionLabel>Daily Devotional Hub · ورد اليوم</SectionLabel>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

          {/* A: Real Prayer Times */}
          <HoverCard className="p-4 sm:p-5 flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="text-[9px] font-mono uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'rgba(197,168,128,0.7)' }}>
                  <Clock className="w-3 h-3" style={{ color: C.gold }} /> أوقات الصلاة
                </span>
                <span className="text-[9px] text-emerald-100/30 font-mono">{location || '…'}</span>
              </div>

              {pLoading && (
                <div className="space-y-2">
                  {[...Array(5)].map((_,i) => (
                    <div key={i} className="h-7 rounded-lg skeleton" />
                  ))}
                </div>
              )}
              {pError && !pLoading && (
                <div className="text-xs text-red-300/70 flex items-start gap-1.5 mt-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {pError}
                </div>
              )}
              {!pLoading && !pError && times && (
                <div className="space-y-1.5">
                  {PRAYER_KEYS.map(k => {
                    const Icon = PRAYER_ICONS[k] || Clock
                    const isNext = nextPrayer?.name === k
                    return (
                      <div key={k}
                           className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg"
                           style={isNext
                             ? { background: 'rgba(197,168,128,0.15)', border: '1px solid rgba(197,168,128,0.35)', color: '#fff' }
                             : { color: 'rgba(231,243,238,0.55)' }}>
                        <span className="flex items-center gap-1.5">
                          <Icon className="w-3 h-3" style={{ color: isNext ? C.gold : 'rgba(197,168,128,0.4)' }} />
                          <span lang="ar" style={{ fontFamily: 'Amiri,serif', fontSize: '13px' }}>{PRAYER_AR[k]}</span>
                          <span className="text-[10px] opacity-60">· {k}</span>
                        </span>
                        <span className="font-mono text-[11px]">{times[k] || '—'}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            <Link to="/prayers" className="text-[11px] flex items-center gap-1 mt-4 font-medium transition-colors hover:text-white" style={{ color: C.gold }}>
              Full timetable · التوقيت الكامل <ChevronRight className="w-3 h-3" />
            </Link>
          </HoverCard>

          {/* B: Hadith of the Day */}
          <HoverCard className="p-4 sm:p-5 flex flex-col justify-between min-h-[280px]">
            <div>
              <span className="text-[9px] font-mono uppercase tracking-widest flex items-center gap-1.5 mb-3 sm:mb-4" style={{ color: 'rgba(197,168,128,0.7)' }}>
                <Quote className="w-3 h-3" style={{ color: C.gold }} /> حديث اليوم · Hadith of the Day
              </span>
              <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(197,168,128,0.06)', border: '1px solid rgba(197,168,128,0.12)' }}>
                <p className="text-right text-lg sm:text-xl leading-loose" lang="ar"
                   style={{ fontFamily: 'Amiri,serif', color: '#f0e6d3', lineHeight: 2.1 }}>
                  {TODAY_HADITH.arabic}
                </p>
              </div>
              <p className="text-xs text-emerald-100/60 font-light leading-relaxed italic">"{TODAY_HADITH.translation}"</p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid rgba(197,168,128,0.1)' }}>
              <span className="text-[9px] font-mono text-emerald-200/30">{TODAY_HADITH.source}</span>
              <Link to={TODAY_HADITH.to} className="text-[11px] font-medium flex items-center gap-0.5 hover:text-white" style={{ color: C.gold }}>
                Read more <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </HoverCard>

          {/* C: Daily Dua */}
          <HoverCard className="p-4 sm:p-5 flex flex-col justify-between min-h-[280px]">
            <div>
              <span className="text-[9px] font-mono uppercase tracking-widest flex items-center gap-1.5 mb-3 sm:mb-4" style={{ color: 'rgba(197,168,128,0.7)' }}>
                <Heart className="w-3 h-3" style={{ color: C.gold }} /> دعاء اليوم · Daily Dua
              </span>
              <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(197,168,128,0.06)', border: '1px solid rgba(197,168,128,0.12)' }}>
                <p className="text-right text-2xl sm:text-3xl leading-loose" lang="ar"
                   style={{ fontFamily: 'Amiri,serif', color: '#f0e6d3', lineHeight: 2.2 }}>
                  {TODAY_DUA.arabic}
                </p>
              </div>
              <p className="text-xs text-emerald-100/60 font-light leading-relaxed italic">"{TODAY_DUA.translation}"</p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid rgba(197,168,128,0.1)' }}>
              <span className="text-[9px] font-mono text-emerald-200/30">{TODAY_DUA.source}</span>
              <Link to={TODAY_DUA.to} className="text-[11px] font-medium flex items-center gap-0.5 hover:text-white" style={{ color: C.gold }}>
                View more <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </HoverCard>

{/* D: Name of Day + Tasbih */}
<HoverCard className="p-4 sm:p-5 flex flex-col gap-4 min-h-[280px]">
  <span className="text-[9px] font-mono uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'rgba(197,168,128,0.7)' }}>
    <Sparkles className="w-3 h-3" style={{ color: C.gold }} /> اسم الله · Name of Allah
  </span>

  {/* Name of the Day Container */}
  <div className="flex-1 rounded-xl p-3 flex flex-col items-center justify-center text-center"
       style={{ background: 'rgba(197,168,128,0.05)', border: '1px solid rgba(197,168,128,0.12)' }}>
    
    {(() => {
      // 1. Premium local fallback list that displays if backend data is missing
      const staticNames = [
        { name: "Ar-Rahman", meaning: "The Most Gracious", arabic: "الرحمن", title: "Asma al-Husna" },
        { name: "Ar-Rahim", meaning: "The Most Merciful", arabic: "الرحيم", title: "Asma al-Husna" },
        { name: "Al-Malik", meaning: "The Absolute Ruler", arabic: "الملك", title: "Asma al-Husna" },
        { name: "Al-Quddus", meaning: "The Pure / Holy", arabic: "القدوس", title: "Asma al-Husna" },
        { name: "As-Salam", meaning: "The Source of Peace", arabic: "السلام", title: "Asma al-Husna" },
        { name: "Al-Mu'min", meaning: "The Inspirer of Faith", arabic: "المؤمن", title: "Asma al-Husna" },
        { name: "Al-Muhaymin", meaning: "The Guardian", arabic: "المهيمن", title: "Asma al-Husna" }
      ];

      // 2. Select a name based on today's day of the month so it changes daily
      const dayIndex = new Date().getDate() % staticNames.length;
      const defaultName = staticNames[dayIndex];

      // 3. Merge API data with fallback safety defaults
      const displayName = nameOfDay?.name || nameOfDay?.transliteration || defaultName.name;
      const displayMeaning = nameOfDay?.meaning || nameOfDay?.en?.meaning || defaultName.meaning;
      const displayArabic = nameOfDay?.arabic || nameOfDay?.text || defaultName.arabic;
      const displayTitle = nameOfDay?.gender || nameOfDay?.title || defaultName.title;

      return (
        <div className="p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/10 shadow-md w-full text-left">
          <div className="flex justify-between items-start gap-4">
            
            {/* English Text Content Box */}
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-[#d4af37] bg-[#c5a880]/10 border border-[#c5a880]/20 uppercase">
                  {displayTitle} of the Day
                </span>
                {nameOfDay?.origin && (
                  <span className="text-[10px] text-stone-500 font-mono truncate">({nameOfDay.origin})</span>
                )}
              </div>
              
              {/* Unique name title */}
              <h3 className="text-xl font-bold text-stone-100 tracking-wide truncate">
                {displayName}
              </h3>
              
              {/* Meaning Field */}
              <p className="text-xs text-[#34d399] font-medium line-clamp-2">
                Meaning: {displayMeaning}
              </p>

              {/* Historic Context Note */}
              {(nameOfDay?.note || nameOfDay?.description) && (
                <p className="text-[11px] text-stone-400 mt-2 leading-relaxed border-l-2 border-emerald-900/40 pl-2 italic line-clamp-2">
                  {nameOfDay.note || nameOfDay.description}
                </p>
              )}
            </div>

            {/* Beautiful Right-Aligned Arabic Text */}
            <div className="text-right shrink-0 pl-1">
              <span 
                className="text-3xl font-arabic text-[#d4af37] select-none block tracking-wide" 
                style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}
              >
                {displayArabic}
              </span>
            </div>

          </div>
        </div>
      );
    })()}
  </div>

  {/* Tasbih counter */}
  <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(197,168,128,0.12)' }}>
    <div className="flex items-center justify-between mb-2">
      <p className="text-[9px] font-mono uppercase tracking-wider text-emerald-200/35">التسبيح · Tasbih</p>
      <button onClick={() => setTasbih(0)} className="text-[9px] text-emerald-200/25 hover:text-red-400 transition-colors flex items-center gap-0.5">
        <RotateCcw className="w-2.5 h-2.5" /> Reset
      </button>
    </div>
    <div className="flex items-center justify-between">
      <p className="text-3xl font-mono font-bold text-white tabular-nums">{String(tasbih || 0).padStart(3, '0')}</p>
      <button onClick={() => setTasbih(p => p + 1)}
        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-150 active:scale-90 touch-manipulation"
        style={{ background: C.gold, color: '#010f07' }}>
        <Plus className="w-4 h-4" />
      </button>
    </div>
  </div>
</HoverCard>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FEATURE DIRECTORY — Quran (large), Hadith (large), Duas + Prayers (smaller)
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14"
               style={{ borderTop: '1px solid rgba(197,168,128,0.1)' }}>
        <SectionLabel>Core Knowledge · المصادر الأساسية</SectionLabel>

        {/* Two large cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">
          {[
            {
              to: '/quran', label: 'المصحف الشريف · TRI-SCRIPT READER', title: 'The Holy Quran',
              ar: 'القرآن الكريم',
              desc: 'Verse-by-verse Arabic with translations, recitation audio, and AI-powered tafsir explanations.',
              cta: 'Open the Quran · اقرأ القرآن',
              img: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=900&auto=format&fit=crop',
            },
            {
              to: '/hadith', label: '6 CANONICAL BOOKS · كتب الحديث', title: 'Authenticated Hadith',
              ar: 'الحديث النبوي',
              desc: 'Bukhari, Muslim, Tirmidhi and more — every narration tagged with grade, chapter, and narrator chain.',
              cta: 'Browse Hadith · استعرض الأحاديث',
              img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiwiPGomgty5b4ZdBBFr3UY0KEZXMD6pX3d0avG2Wf5g&s=10',
            },
          ].map(f => (
            <Link key={f.to} to={f.to}
              className="group relative rounded-2xl overflow-hidden"
              style={{ height: '220px', ...C.card }}>
              <img src={f.img} alt={f.title}
                   className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                   style={{ opacity: 0.55 }}
                   onError={e => { e.currentTarget.style.display = 'none' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(1,15,7,0.95) 25%,rgba(1,15,7,0.3) 100%)' }} />
              <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between z-10">
                <div className="flex items-start justify-between">
                  <span className="text-[9px] font-mono tracking-wider px-2 py-0.5 rounded"
                        style={{ background: 'rgba(1,15,7,0.7)', color: C.gold, border: '1px solid rgba(197,168,128,0.25)', backdropFilter: 'blur(8px)' }}>
                    {f.label}
                  </span>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-light" lang="ar"
                     style={{ fontFamily: 'Amiri,serif', color: '#f0e6d3', lineHeight: 1.7 }}>{f.ar}</p>
                  <h3 className="text-base sm:text-lg font-medium text-white mb-1" style={{ fontFamily: 'Playfair Display,serif' }}>{f.title}</h3>
                  <p className="text-xs text-emerald-100/50 font-light leading-relaxed mb-3 line-clamp-2">{f.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide" style={{ color: C.gold }}>
                    {f.cta} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Two smaller quick-links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {[
            {
              to: '/duas', label: 'الأدعية', title: 'Dua & Supplications',
              desc: 'Morning, evening & everyday duas from the Quran & Sunnah.',
              cta: 'Explore Duas',
              img: 'https://plus.unsplash.com/premium_photo-1677618443939-97919d890300?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjYxfHxtdXNsaW0lMjBtYW58ZW58MHx8MHx8fDA%3D',
            },
            {
              to: '/prayers', label: 'الصلاة', title: 'Prayer Times',
              desc: 'Accurate daily prayer schedule for your location.',
              cta: 'View Times',
              img: 'https://images.unsplash.com/photo-1740970036011-b83bd2c0889b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTR8fHByYXllciUyMHRpbWVzfGVufDB8fDB8fHww',
            },
          ].map(q => (
            <Link key={q.to} to={q.to}
              className="group relative rounded-2xl overflow-hidden"
              style={{ height: '150px', ...C.card }}>
              <img src={q.img} alt={q.title}
                   className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                   style={{ opacity: 0.5 }}
                   onError={e => { e.currentTarget.style.display = 'none' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right,rgba(1,15,7,0.92) 40%,rgba(1,15,7,0.35) 100%)' }} />
              <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-center z-10">
                <p className="text-base mb-0.5" lang="ar" style={{ fontFamily: 'Amiri,serif', color: C.gold }}>{q.label}</p>
                <h3 className="text-sm sm:text-base font-medium text-white mb-1" style={{ fontFamily: 'Playfair Display,serif' }}>{q.title}</h3>
                <p className="text-[11px] text-emerald-100/45 font-light mb-2 line-clamp-1">{q.desc}</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: C.gold }}>
                  {q.cta} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          VERSE OF THE DAY BANNER
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        <div className="rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5"
             style={{ background: 'linear-gradient(135deg,rgba(197,168,128,0.07),rgba(197,168,128,0.02))', border: '1px solid rgba(197,168,128,0.2)' }}>
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center"
                 style={{ background: 'rgba(197,168,128,0.1)', border: '1px solid rgba(197,168,128,0.25)' }}>
              <Bookmark className="w-4 h-4" style={{ color: C.gold }} />
            </div>
            <div>
              <p className="text-[9px] font-mono tracking-widest uppercase" style={{ color: C.gold }}>آية اليوم</p>
              <p className="text-[9px] text-emerald-200/30 font-light">Verse Reflection of the Day</p>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-right text-base sm:text-lg arabic-leading mb-2" lang="ar"
               style={{ fontFamily: 'Amiri,serif', color: '#f0e6d3', lineHeight: 2.1 }}>
              {VERSE_OF_DAY.arabic}
            </p>
            <p className="text-xs text-emerald-100/50 font-light italic leading-relaxed">
              "{VERSE_OF_DAY.translation}"
              <span className="text-[9px] font-mono not-italic ml-2" style={{ color: 'rgba(197,168,128,0.5)' }}>— {VERSE_OF_DAY.source}</span>
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          AI COMPANION
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14"
               style={{ borderTop: '1px solid rgba(197,168,128,0.1)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          <div className="lg:col-span-4 space-y-4">
            <span className="text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ color: C.gold, border: '1px solid rgba(197,168,128,0.25)', background: 'rgba(197,168,128,0.06)' }}>
              الذكاء الاصطناعي · AI Companion
            </span>
            <h2 className="text-xl sm:text-2xl font-light text-white" style={{ fontFamily: 'Playfair Display,serif' }}>
              Ask anything.<br />
              <span style={{ color: C.gold }}>Every answer is cited.</span>
            </h2>
            <p className="text-xs text-emerald-200/45 font-light leading-relaxed">
              Query complex Islamic topics, retrieve targeted citations cross-referenced across our verified Hadith vault and complete Tafsir records.
            </p>
            <div className="space-y-1.5 text-xs text-emerald-200/40 font-light">
              <p className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400/70 shrink-0" /> Scholar-verified source checking</p>
              <p className="flex items-center gap-2"><Award className="w-3.5 h-3.5 shrink-0" style={{ color: C.gold }} /> Dynamic confidence grading</p>
            </div>
          </div>

          <div className="lg:col-span-8 rounded-2xl overflow-hidden" style={{ ...C.card }}>
            <div className="px-4 sm:px-5 py-3 flex items-center justify-between text-[9px] font-mono"
                 style={{ background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid rgba(197,168,128,0.12)', color: 'rgba(231,243,238,0.25)' }}>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.gold }} />
                deenstream-ai-companion
              </div>
              <span style={{ color: 'rgba(197,168,128,0.6)' }}>100% Source Match</span>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="p-3 sm:p-4 rounded-xl space-y-2"
                   style={{ background: 'rgba(197,168,128,0.04)', border: '1px solid rgba(197,168,128,0.12)' }}>
                <p className="font-semibold text-xs flex items-center gap-1.5" style={{ color: C.gold }}>
                  <Sparkles className="w-3.5 h-3.5" /> AI Scholar Assistant · مساعد علمي
                </p>
                <p className="text-xs text-emerald-100/65 leading-relaxed font-light">
                  "In Surah Al-Baqarah (2:186), Allah explicitly addresses closeness to the believer: <em>'When My servants ask you concerning Me, indeed I am near…'</em>"
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Quran 2:186', 'Tafsir Ibn Kathir', 'البقرة 2:186'].map(tag => (
                    <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded"
                          style={{ background: 'rgba(197,168,128,0.08)', color: C.gold, border: '1px solid rgba(197,168,128,0.15)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {AI_PROMPTS.map((q, i) => (
                  <Link key={i} to="/ai-chat"
                    className="text-[10px] sm:text-[11px] px-3 py-1.5 rounded-full transition-all duration-200 font-light"
                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(197,168,128,0.14)', color: 'rgba(231,243,238,0.65)' }}>
                    {q}
                  </Link>
                ))}
              </div>

              <div className="flex gap-2 sm:gap-3">
                <input
                  type="text" value={aiQuery} onChange={e => setAiQuery(e.target.value)}
                  placeholder="اسأل سؤالاً… Ask a question rooted in Quran & Sunnah"
                  className="flex-1 px-3 sm:px-4 py-2.5 text-xs rounded-xl outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(197,168,128,0.18)', color: '#e7ece9' }}
                  onFocus={e => e.currentTarget.style.borderColor = C.gold}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(197,168,128,0.18)'}
                />
                <Link to="/ai-chat"
                  className="px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 active:scale-95 whitespace-nowrap"
                  style={{ background: C.gold, color: '#010f07' }}>
                  Ask →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          DAILY JOURNEY TIMELINE
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16"
               style={{ borderTop: '1px solid rgba(197,168,128,0.1)' }}>
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-[9px] tracking-[0.25em] font-bold uppercase mb-2" style={{ color: C.gold }}>
            ◆ رحلتك اليومية · Your Daily Journey ◆
          </p>
          <h2 className="text-xl sm:text-2xl font-light text-white" style={{ fontFamily: 'Playfair Display,serif' }}>
=======
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
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
            From Fajr to Isha, beautifully orchestrated.
          </h2>
        </div>

<<<<<<< HEAD
        {/* Mobile: vertical timeline */}
        <div className="lg:hidden border-l-2 pl-5 space-y-7" style={{ borderColor: 'rgba(197,168,128,0.2)' }}>
          {JOURNEY_STEPS.map((s, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                   style={{ background: '#010f07', borderColor: 'rgba(197,168,128,0.5)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.gold }} />
              </div>
              <span className="text-[8px] font-mono tracking-widest uppercase px-2 py-0.5 rounded"
                    style={{ color: C.gold, background: 'rgba(197,168,128,0.08)', border: '1px solid rgba(197,168,128,0.15)' }}>
                {s.tag}
              </span>
              <div className="mt-1.5">
                <p className="text-sm font-medium text-white">{s.title}</p>
                <p className="text-[11px] font-light" lang="ar" style={{ fontFamily: 'Amiri,serif', color: 'rgba(197,168,128,0.6)', lineHeight: 1.7 }}>{s.ar}</p>
                <p className="text-xs text-emerald-200/35 font-light leading-relaxed mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: horizontal 5-step */}
        <div className="hidden lg:grid grid-cols-5 gap-2 relative">
          <div className="absolute top-[22px] left-8 right-8 h-px"
               style={{ background: 'linear-gradient(to right,transparent,rgba(197,168,128,0.25),transparent)' }} />
          {JOURNEY_STEPS.map((s, i) => (
            <div key={i}
              className="group relative flex flex-col items-center text-center px-3 pt-12 pb-5 rounded-2xl transition-all duration-300 cursor-default"
              style={{ border: '1px solid transparent' }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(197,168,128,0.04)'; e.currentTarget.style.borderColor='rgba(197,168,128,0.18)' }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent' }}>
              <div className="absolute top-0 -translate-y-1/2 w-4 h-4 rounded-full border-2 flex items-center justify-center z-10"
                   style={{ background: '#010f07', borderColor: 'rgba(197,168,128,0.45)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.gold }} />
              </div>
              <span className="text-[8px] font-mono tracking-wider uppercase mb-2 px-2 py-0.5 rounded"
                    style={{ color: C.gold, background: 'rgba(197,168,128,0.08)', border: '1px solid rgba(197,168,128,0.15)' }}>
                {s.tag}
              </span>
              <h4 className="text-sm font-medium text-white mb-1">{s.title}</h4>
              <p className="text-sm mb-1" lang="ar" style={{ fontFamily: 'Amiri,serif', color: 'rgba(197,168,128,0.55)', lineHeight: 1.6 }}>{s.ar}</p>
              <p className="text-[11px] text-emerald-200/30 font-light leading-relaxed">{s.desc}</p>
            </div>
=======
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
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
          ))}
        </div>
      </section>

<<<<<<< HEAD
      {/* ════════════════════════════════════════════════════════════════════
          CLOSING CTA
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-20">
        <div className="rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
             style={{ background: 'linear-gradient(135deg,rgba(197,168,128,0.08),rgba(255,255,255,0.02))', border: '1px solid rgba(197,168,128,0.22)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center top,rgba(197,168,128,0.07),transparent 70%)' }} />
          <p className="text-2xl sm:text-3xl mb-3" lang="ar" style={{ fontFamily: 'Amiri,serif', color: 'rgba(197,168,128,0.7)', lineHeight: 1.6 }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <h2 className="text-2xl sm:text-3xl font-light text-white mb-2" style={{ fontFamily: 'Playfair Display,serif' }}>
            Begin your <span style={{ color: C.gold }}>DeenStream</span> journey today.
          </h2>
          <p className="text-sm text-emerald-200/40 mb-7 font-light max-w-md mx-auto">
            Free to use. Built for every Muslim, everywhere. Designed in the spirit of Islamic art.
          </p>
          <div className="flex flex-col xs:flex-row flex-wrap justify-center gap-3">
            <Link to="/quran"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-200 active:scale-95"
              style={{ background: C.gold, color: '#010f07' }}>
              Open the Quran
            </Link>
            <Link to="/prayers"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-200 active:scale-95 border"
              style={{ borderColor: 'rgba(197,168,128,0.3)', color: '#e7ece9' }}>
              See Prayer Times
            </Link>
            <Link to="/ai-chat"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-200 active:scale-95 border"
              style={{ borderColor: 'rgba(197,168,128,0.2)', color: 'rgba(197,168,128,0.8)' }}>
              <Sparkles className="w-3.5 h-3.5" /> Ask AI Alim
=======
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
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
            </Link>
          </div>
        </div>
      </section>
<<<<<<< HEAD

=======
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
    </div>
  )
}