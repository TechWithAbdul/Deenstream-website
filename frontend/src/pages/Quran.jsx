// src/pages/Quran.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { BookOpen, Search, ChevronLeft, Minus, Plus, Globe, AlertCircle } from 'lucide-react'
import { quranApi } from '../services/api'

const TRANSLATIONS = [
  { key: 'en', label: 'English' },
  { key: 'ur', label: 'Urdu' },
  { key: 'fr', label: 'French' },
  { key: 'tr', label: 'Turkish' },
]

function ChapterSkeleton() {
  return (
    <div className="card p-4 space-y-2">
      <div className="skeleton h-4 w-8 mb-3" />
      <div className="skeleton h-5 w-32" />
      <div className="skeleton h-3 w-20" />
    </div>
  )
}

function AyahSkeleton() {
  return (
    <div className="ayah-block space-y-3">
      <div className="skeleton h-8 w-full" />
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-4 w-1/2" />
    </div>
  )
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="error-banner">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold">Could not load data</p>
        <p className="text-xs mt-0.5 opacity-80">{message}</p>
      </div>
      {onRetry && <button onClick={onRetry} className="shrink-0 text-xs font-medium hover:underline" style={{ color: '#c5a880' }}>Retry</button>}
    </div>
  )
}

function SurahReader({ chapter, onBack }) {
  const [ayahs, setAyahs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [translation, setTranslation] = useState('en')
  const [fontSize, setFontSize] = useState(32)

  const loadSurah = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await quranApi.getSurah(chapter.number || chapter.id, translation)
      const data = res.data || {}
      const list = data.ayahs || data.verses || data.data?.ayahs || data.data?.verses || []
      setAyahs(Array.isArray(list) ? list : [])
    } catch (err) {
      setError(err?.message || 'Failed to load surah.')
    } finally {
      setLoading(false)
    }
  }, [chapter, translation])

  useEffect(() => { loadSurah() }, [loadSurah])

  const chapterEn = chapter.name_english || chapter.nameEnglish || chapter.englishName || ''
  const verseCount = chapter.verses_count || chapter.numberOfAyahs || ayahs.length

  return (
    <div className="animate-fade-in">
      <div className="sticky top-16 z-30 backdrop-blur-sm border-b" style={{ background: 'rgba(2,23,17,0.95)', borderColor: 'rgba(197,168,128,0.15)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3">
          <button onClick={onBack} className="btn-ghost py-1.5 shrink-0"><ChevronLeft className="w-4 h-4" /> All Surahs</button>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-lg font-bold text-white" style={{ fontFamily: 'Playfair Display,serif' }}>{chapterEn}</span>
              <span className="text-sm text-emerald-100/40">{verseCount} verses</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 rounded-lg px-2 py-1" style={{ border: '1px solid rgba(197,168,128,0.2)' }}>
              <button onClick={() => setFontSize(s => Math.max(20, s - 4))} className="text-emerald-100/50 hover:text-white transition-colors" title="Decrease Arabic size"><Minus className="w-3.5 h-3.5" /></button>
              <span className="text-xs text-emerald-100/50 w-8 text-center">{fontSize}px</span>
              <button onClick={() => setFontSize(s => Math.min(56, s + 4))} className="text-emerald-100/50 hover:text-white transition-colors" title="Increase Arabic size"><Plus className="w-3.5 h-3.5" /></button>
            </div>
            <div className="flex items-center gap-1 rounded-lg px-2 py-1" style={{ border: '1px solid rgba(197,168,128,0.2)' }}>
              <Globe className="w-3.5 h-3.5 text-emerald-100/40" />
              <select value={translation} onChange={e => setTranslation(e.target.value)} className="text-xs text-emerald-100/70 bg-transparent outline-none cursor-pointer" style={{ colorScheme: 'dark' }}>
                {TRANSLATIONS.map(t => <option key={t.key} value={t.key} style={{ background: '#021711' }}>{t.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center">
        <p className="text-3xl arabic-leading" lang="ar" style={{ fontFamily: 'Amiri,serif', color: '#c5a880' }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <div className="divider-gold" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 space-y-4">
        {error && <ErrorBanner message={error} onRetry={loadSurah} />}
        {loading && Array.from({ length: 6 }).map((_, i) => <AyahSkeleton key={i} />)}

        {!loading && !error && ayahs.length === 0 && (
          <div className="empty-state">
            <BookOpen className="w-12 h-12" style={{ color: 'rgba(197,168,128,0.3)' }} />
            <p className="text-emerald-100/40">No ayahs found in the response.</p>
          </div>
        )}

        {(ayahs || []).map((ayah, idx) => {
          const arabic = ayah.text_arabic || ayah.arabic || ayah.text || ''
          const translationText = ayah.translations?.[translation] || ayah.text_en || ayah.translation || ayah.text || ''
          const number = ayah.number || ayah.verse_number || ayah.numberInSurah || (idx + 1)
          return (
            <div key={`${number}-${idx}`} className="ayah-block animate-slide-up">
              <p className="arabic-leading text-right leading-loose" lang="ar" style={{ fontFamily: 'Amiri,serif', fontSize: `${fontSize}px`, color: '#f3ead9' }}>
                {arabic || '—'}<span className="text-2xl mr-3" style={{ color: '#c5a880' }}>﴿{number}﴾</span>
              </p>
              {translationText && (
                <p className="text-sm leading-relaxed border-t pt-3 text-emerald-100/70" style={{ borderColor: 'rgba(197,168,128,0.12)' }}>
                  <span className="font-semibold text-xs mr-2" style={{ color: '#c5a880' }}>{number}.</span>{translationText}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Quran() {
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedChapter, setSelectedChapter] = useState(null)

  const loadChapters = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await quranApi.getChapters()
      const list = Array.isArray(res.data) ? res.data : (res.data?.chapters || [])
      setChapters(list)
    } catch (err) {
      setError(err?.message || 'Failed to load chapters.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadChapters() }, [loadChapters])

  if (selectedChapter) return <SurahReader chapter={selectedChapter} onBack={() => setSelectedChapter(null)} />

  const filtered = (chapters || []).filter(ch => {
    const q = search.toLowerCase()
    return (
      (ch.name_english || ch.nameEnglish || ch.englishName || '').toLowerCase().includes(q) ||
      (ch.name_translation || ch.englishNameTranslation || '').toLowerCase().includes(q) ||
      String(ch.number || ch.id || '').includes(q)
    )
  })

  return (
    <div className="animate-fade-in">
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#021711,#0a3526)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(197,168,128,0.08)', border: '1px solid rgba(197,168,128,0.3)' }}>
              <BookOpen className="w-5 h-5" style={{ color: '#c5a880' }} />
            </div>
            <span className="badge-gold">Quran Reader</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display,serif' }}>القرآن الكريم</h1>
          <p className="text-emerald-100/50">The Noble Quran — 114 Surahs, 6,236 Ayahs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-100/30" />
          <input type="text" placeholder="Search surah name or number…" value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {error && <ErrorBanner message={error} onRetry={loadChapters} />}

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 24 }).map((_, i) => <ChapterSkeleton key={i} />)}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state"><Search className="w-10 h-10" style={{ color: 'rgba(197,168,128,0.3)' }} /><p className="text-emerald-100/30">No surahs match your search.</p></div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {(filtered || []).map((ch, idx) => {
            const num = ch.number || ch.id || (idx + 1)
            const nameAr = ch.name_arabic || ch.nameArabic || ch.name || ''
            const nameEn = ch.name_english || ch.nameEnglish || ch.englishName || ''
            const trans = ch.name_translation || ch.englishNameTranslation || ''
            const verses = ch.verses_count || ch.numberOfAyahs || ''
            const place = (ch.revelation_place || ch.revelationType || '').toLowerCase()

            return (
              <button key={`${num}-${idx}`} onClick={() => setSelectedChapter(ch)} className="card p-4 text-left hover:scale-105 active:scale-95 transition-transform duration-200 space-y-2 focus:outline-none">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(197,168,128,0.08)', border: '1px solid rgba(197,168,128,0.25)', color: '#c5a880' }}>{num}</span>
                  {place && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ background: place === 'makkah' ? 'rgba(197,168,128,0.1)' : 'rgba(125,180,200,0.1)', color: place === 'makkah' ? '#c5a880' : '#8fc4d9' }}>
                      {place === 'makkah' ? 'Makki' : 'Madani'}
                    </span>
                  )}
                </div>
                <p className="text-xl arabic-leading" lang="ar" style={{ fontFamily: 'Amiri,serif', lineHeight: '1.8', color: '#f3ead9' }}>{nameAr}</p>
                <div>
                  <p className="text-sm font-semibold text-white truncate">{nameEn}</p>
                  {trans && <p className="text-xs text-emerald-100/35 truncate">{trans}</p>}
                  {verses && <p className="text-xs mt-0.5" style={{ color: '#c5a880' }}>{verses} verses</p>}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}