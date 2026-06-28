// src/pages/Quran.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { BookOpen, Search, ChevronLeft, Minus, Plus, Globe } from 'lucide-react'
import { quranApi } from '../utils/api'

const TRANSLATIONS = [
  { key: 'en', label: 'English' },
  { key: 'ur', label: 'Urdu' },
  { key: 'fr', label: 'French' },
  { key: 'tr', label: 'Turkish' },
]

// ── Skeleton loaders ──────────────────────────────────────────────────────────
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

// ── Error banner ──────────────────────────────────────────────────────────────
function ErrorBanner({ message, onRetry }) {
  return (
    <div className="error-banner">
      <div className="flex-1">
        <p className="font-semibold">Could not load data</p>
        <p className="text-red-700/80 text-xs mt-0.5">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="shrink-0 text-xs font-medium text-red-700 hover:underline">
          Retry
        </button>
      )}
    </div>
  )
}

// ── Surah reader ──────────────────────────────────────────────────────────────
function SurahReader({ chapter, onBack }) {
  const [ayahs, setAyahs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [translation, setTranslation] = useState('en')
  const [fontSize, setFontSize] = useState(32) // px

  const loadSurah = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await quranApi.getSurah(chapter.number || chapter.id, translation)
      const data = res.data || {}
      // Defensive: try multiple key shapes
      const list = data.ayahs || data.verses || data.data?.ayahs || data.data?.verses || []
      setAyahs(Array.isArray(list) ? list : [])
    } catch (err) {
      setError(err?.message || 'Failed to load surah.')
    } finally {
      setLoading(false)
    }
  }, [chapter, translation])

  useEffect(() => { loadSurah() }, [loadSurah])

  const chapterName = chapter.name_arabic || chapter.nameArabic || chapter.name
  const chapterEn = chapter.name_english || chapter.nameEnglish || chapter.englishName || ''
  const verseCount = chapter.verses_count || chapter.numberOfAyahs || ayahs.length

  return (
    <div className="animate-fade-in">
      {/* Surah header */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3">
          <button onClick={onBack} className="btn-ghost py-1.5 shrink-0">
            <ChevronLeft className="w-4 h-4" /> All Surahs
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-lg font-bold text-emerald-900" style={{ fontFamily: 'Playfair Display,serif' }}>
                {chapterEn}
              </span>
              <span className="text-sm text-slate-400">{verseCount} verses</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Font size */}
            <div className="flex items-center gap-1 border border-stone-200 rounded-lg px-2 py-1">
              <button onClick={() => setFontSize(s => Math.max(20, s - 4))} className="text-slate-500 hover:text-emerald-700 transition-colors" title="Decrease Arabic size">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-slate-500 w-8 text-center">{fontSize}px</span>
              <button onClick={() => setFontSize(s => Math.min(56, s + 4))} className="text-slate-500 hover:text-emerald-700 transition-colors" title="Increase Arabic size">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Translation toggle */}
            <div className="flex items-center gap-1 border border-stone-200 rounded-lg px-2 py-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={translation}
                onChange={e => setTranslation(e.target.value)}
                className="text-xs text-slate-600 bg-transparent outline-none cursor-pointer"
              >
                {TRANSLATIONS.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bismillah banner */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center">
        <p className="text-3xl text-emerald-800 arabic-leading" lang="ar" style={{ fontFamily: 'Amiri,serif' }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <div className="divider-gold" />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 space-y-4">
        {error && <ErrorBanner message={error} onRetry={loadSurah} />}

        {loading && Array.from({ length: 6 }).map((_, i) => <AyahSkeleton key={i} />)}

        {!loading && !error && ayahs.length === 0 && (
          <div className="empty-state">
            <BookOpen className="w-12 h-12 text-emerald-200" />
            <p className="text-slate-500">No ayahs found in the response.</p>
          </div>
        )}

        {(ayahs || []).map((ayah, idx) => {
          const arabic = ayah.text_arabic || ayah.arabic || ayah.text || ''
          const translationText = ayah.translations?.[translation] || ayah.text_en || ayah.translation || ayah.text || ''
          const number = ayah.number || ayah.verse_number || ayah.numberInSurah || (idx + 1)

          return (
            <div key={`${number}-${idx}`} className="ayah-block animate-slide-up">
              {/* Arabic */}
              <p
                className="arabic-leading text-right text-emerald-900 leading-loose"
                lang="ar"
                style={{ fontFamily: 'Amiri,serif', fontSize: `${fontSize}px` }}
              >
                {arabic || '—'}
                <span className="text-amber-600 text-2xl mr-3">﴿{number}﴾</span>
              </p>

              {/* Translation */}
              {translationText && (
                <p className="text-slate-600 text-sm leading-relaxed border-t border-stone-100 pt-3">
                  <span className="text-amber-600 font-semibold text-xs mr-2">{number}.</span>
                  {translationText}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Chapter grid ──────────────────────────────────────────────────────────────
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
      // Backend returns array directly (already extracted by proxy)
      const list = Array.isArray(res.data) ? res.data : (res.data?.chapters || [])
      setChapters(list)
    } catch (err) {
      setError(err?.message || 'Failed to load chapters.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadChapters() }, [loadChapters])

  if (selectedChapter) {
    return <SurahReader chapter={selectedChapter} onBack={() => setSelectedChapter(null)} />
  }

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
      {/* Page header */}
      <div className="bg-gradient-to-br from-emerald-950 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
            <span className="badge-gold">Quran Reader</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display,serif' }}>
            القرآن الكريم
          </h1>
          <p className="text-emerald-300/70">The Noble Quran — 114 Surahs, 6,236 Ayahs</p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search surah name or number…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {error && <ErrorBanner message={error} onRetry={loadChapters} />}

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 24 }).map((_, i) => <ChapterSkeleton key={i} />)}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <Search className="w-10 h-10 text-emerald-200" />
            <p className="text-slate-400">No surahs match your search.</p>
          </div>
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
              <button
                key={`${num}-${idx}`}
                onClick={() => setSelectedChapter(ch)}
                className="card p-4 text-left hover:scale-105 active:scale-95 transition-transform duration-200 space-y-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">
                    {num}
                  </span>
                  {place && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      place === 'makkah' ? 'bg-amber-50 text-amber-700' : 'bg-sky-50 text-sky-700'
                    }`}>
                      {place === 'makkah' ? 'Makki' : 'Madani'}
                    </span>
                  )}
                </div>
                <p className="text-xl text-emerald-900 arabic-leading" lang="ar" style={{ fontFamily: 'Amiri,serif', lineHeight: '1.8' }}>
                  {nameAr}
                </p>
                <div>
                  <p className="text-sm font-semibold text-slate-700 truncate">{nameEn}</p>
                  {trans && <p className="text-xs text-slate-400 truncate">{trans}</p>}
                  {verses && <p className="text-xs text-emerald-600 mt-0.5">{verses} verses</p>}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}