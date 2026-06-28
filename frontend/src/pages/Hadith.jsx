// src/pages/Hadith.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { Scroll, ChevronLeft, ChevronRight, BookOpen, AlertCircle } from 'lucide-react'
import { hadithApi } from '../utils/api'

const COLLECTIONS = [
  { slug: 'bukhari',  name: 'Sahih al-Bukhari', count: '7,563', color: 'from-amber-700 to-amber-900',  border: 'border-amber-200',  tag: 'Most Authentic' },
  { slug: 'muslim',   name: 'Sahih Muslim',      count: '7,470', color: 'from-emerald-700 to-emerald-900', border: 'border-emerald-200', tag: 'Sahih' },
  { slug: 'abudawud', name: 'Sunan Abu Dawud',   count: '5,274', color: 'from-sky-700 to-sky-900',     border: 'border-sky-200',    tag: 'Sunan' },
  { slug: 'tirmidhi', name: "Jami' al-Tirmidhi", count: '3,956', color: 'from-rose-700 to-rose-900',   border: 'border-rose-200',   tag: 'Jami' },
  { slug: 'nasai',    name: "Sunan an-Nasa'i",   count: '5,761', color: 'from-violet-700 to-violet-900', border: 'border-violet-200', tag: 'Sunan' },
  { slug: 'ibnmajah', name: 'Sunan Ibn Majah',   count: '4,341', color: 'from-teal-700 to-teal-900',   border: 'border-teal-200',   tag: 'Sunan' },
  { slug: 'malik',    name: 'Muwatta Imam Malik', count: '1,857', color: 'from-orange-700 to-orange-900', border: 'border-orange-200', tag: 'Muwatta' },
]

function Skeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="skeleton h-4 w-24" />
      <div className="skeleton h-8 w-full" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-3/4" />
    </div>
  )
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="error-banner">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold">Failed to load</p>
        <p className="text-red-700/80 text-xs mt-0.5">{message}</p>
      </div>
      {onRetry && <button onClick={onRetry} className="text-xs font-medium text-red-700 hover:underline shrink-0">Retry</button>}
    </div>
  )
}

function HadithCard({ hadith, index }) {
  const num = hadith.hadith_number || hadith.number || hadith.id || (index + 1)
  const arabic = hadith.arabic || hadith.text_arabic || ''
  const english = hadith.text_en || hadith.text || hadith.translation || hadith.english?.text || ''
  const narrator = hadith.narrator || hadith.chain || hadith.narrated_by || ''

  return (
    <div className="ayah-block animate-slide-up">
      {/* Hadith number badge */}
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-xs font-bold text-amber-700 shrink-0">
          {num}
        </span>
        {narrator && <span className="text-xs text-slate-400 italic truncate">Narrated by {narrator}</span>}
      </div>

      {/* Arabic */}
      {arabic && (
        <p className="text-right text-xl text-emerald-900 arabic-leading leading-loose border-t border-stone-100 pt-3"
           lang="ar" style={{ fontFamily: 'Amiri,serif' }}>
          {arabic}
        </p>
      )}

      {/* English */}
      {english && (
        <p className="text-slate-600 text-sm leading-relaxed border-t border-stone-100 pt-3">
          {english}
        </p>
      )}

      {!arabic && !english && (
        <p className="text-slate-400 text-sm italic">No text available for this narration.</p>
      )}
    </div>
  )
}

export default function Hadith() {
  const [selected, setSelected] = useState(null)
  const [hadiths, setHadiths] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const LIMIT = 20

  const loadHadiths = useCallback(async (slug, p) => {
    setLoading(true); setError(null)
    try {
      const res = await hadithApi.getCollection(slug, p, LIMIT)
      const data = res.data || {}
      // Robust: handle multiple shapes
      const list =
        data.hadiths ||
        data.data?.hadiths ||
        data.data ||
        []
      const arr = Array.isArray(list) ? list : []
      setHadiths(arr)
      setHasMore(arr.length === LIMIT)
    } catch (err) {
      setError(err?.message || 'Failed to load hadiths.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selected) loadHadiths(selected.slug, page)
  }, [selected, page, loadHadiths])

  const handleSelect = (col) => {
    setSelected(col); setPage(1); setHadiths([]); setError(null)
  }

  // ── Bookshelf view ──────────────────────────────────────────────────────────
  if (!selected) {
    return (
      <div className="animate-fade-in">
        <div className="bg-gradient-to-br from-amber-950 to-amber-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Scroll className="w-5 h-5 text-amber-300" />
              </div>
              <span className="badge-gold">Hadith Library</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display,serif' }}>
              كتب الحديث
            </h1>
            <p className="text-amber-200/70">Seven canonical collections — 36,000+ verified narrations</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {COLLECTIONS.map((col) => (
              <button
                key={col.slug}
                onClick={() => handleSelect(col)}
                className={`card p-5 text-left hover:scale-[1.03] active:scale-95 transition-transform duration-200 border-l-4 ${col.border} focus:outline-none focus:ring-2 focus:ring-amber-400`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${col.color} flex items-center justify-center mb-3 shadow-md`}>
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">{col.tag}</p>
                <h3 className="font-bold text-slate-800 text-base leading-tight mb-2">{col.name}</h3>
                <p className="text-sm text-emerald-700 font-medium">{col.count} hadiths</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Reader view ─────────────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button onClick={() => setSelected(null)} className="btn-ghost py-1.5 shrink-0">
            <ChevronLeft className="w-4 h-4" /> Collections
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-emerald-900 truncate">{selected.name}</p>
            <p className="text-xs text-slate-400">Page {page}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-4 pb-20">
        {error && <ErrorBanner message={error} onRetry={() => loadHadiths(selected.slug, page)} />}

        {loading && Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} />)}

        {!loading && !error && hadiths.length === 0 && (
          <div className="empty-state">
            <Scroll className="w-12 h-12 text-amber-200" />
            <p className="text-slate-400">No hadiths found for page {page}.</p>
          </div>
        )}

        {(hadiths || []).map((h, i) => <HadithCard key={`${h.id || i}`} hadith={h} index={(page - 1) * LIMIT + i} />)}

        {/* Pagination */}
        {!loading && hadiths.length > 0 && (
          <div className="flex items-center justify-between pt-6 border-t border-stone-100">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <div className="flex items-center gap-2">
              {[page - 1, page, page + 1].filter(n => n >= 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    n === page
                      ? 'bg-emerald-800 text-white'
                      : 'text-slate-600 hover:bg-stone-100'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!hasMore}
              className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}