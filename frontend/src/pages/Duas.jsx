// src/pages/Duas.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Heart, Copy, Check, AlertCircle, Filter } from 'lucide-react'
import { duasApi } from '../utils/api'

function Skeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="skeleton h-3 w-20" />
      <div className="skeleton h-8 w-full" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-2/3" />
    </div>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable – silently fail
    }
  }

  return (
    <button
      onClick={handleCopy}
      title="Copy dua"
      className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all duration-200 ${
        copied
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
          : 'border-stone-200 text-slate-400 hover:border-amber-300 hover:text-amber-600'
      }`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function DuaCard({ dua }) {
  const arabic = dua.arabic || dua.text_arabic || ''
  const translation = dua.translation || dua.text_en || dua.text || ''
  const transliteration = dua.transliteration || ''
  const reference = dua.reference || dua.source || ''
  const category = dua.category || 'General'

  const copyText = [arabic, transliteration, translation, reference ? `(${reference})` : ''].filter(Boolean).join('\n')

  return (
    <div className="card p-5 space-y-4 animate-slide-up">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <span className="badge-gold shrink-0">{category}</span>
        <CopyButton text={copyText} />
      </div>

      {/* Arabic */}
      {arabic && (
        <p
          className="text-2xl text-right text-emerald-900 arabic-leading leading-loose"
          lang="ar"
          style={{ fontFamily: 'Amiri,serif' }}
        >
          {arabic}
        </p>
      )}

      {/* Transliteration */}
      {transliteration && (
        <p className="text-sm text-amber-700 italic leading-relaxed border-t border-stone-100 pt-3">
          {transliteration}
        </p>
      )}

      {/* Translation */}
      {translation && (
        <p className="text-sm text-slate-600 leading-relaxed border-t border-stone-100 pt-3">
          {translation}
        </p>
      )}

      {/* Reference */}
      {reference && (
        <p className="text-xs text-emerald-600 font-medium">— {reference}</p>
      )}
    </div>
  )
}

export default function Duas() {
  const [duas, setDuas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')

  const loadDuas = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await duasApi.getAll()
      // Handle multiple response shapes defensively
      const data = res.data
      const list =
        Array.isArray(data) ? data :
        Array.isArray(data?.duas) ? data.duas :
        Array.isArray(data?.data) ? data.data :
        Array.isArray(data?.data?.duas) ? data.data.duas :
        []
      setDuas(list)
    } catch (err) {
      setError(err?.message || 'Failed to load supplications.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadDuas() }, [loadDuas])

  // Derive unique categories from data
  const categories = useMemo(() => {
    const cats = new Set(['All'])
    ;(duas || []).forEach(d => {
      const cat = d.category || d.type || ''
      if (cat) cats.add(cat)
    })
    return Array.from(cats)
  }, [duas])

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return duas
    return (duas || []).filter(d => (d.category || d.type || '') === activeCategory)
  }, [duas, activeCategory])

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="bg-gradient-to-br from-rose-950 to-rose-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-300" />
            </div>
            <span className="badge-gold">Supplications</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display,serif' }}>
            الأدعية النبوية
          </h1>
          <p className="text-rose-200/70">
            {loading ? 'Loading…' : `${duas.length} prophetic supplications`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error */}
        {error && (
          <div className="error-banner mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Could not load duas</p>
              <p className="text-xs text-red-700/80">{error}</p>
            </div>
            <button onClick={loadDuas} className="text-xs font-medium text-red-700 hover:underline shrink-0">Retry</button>
          </div>
        )}

        {/* Category filter tabs */}
        {!loading && categories.length > 1 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5" /> Filter by occasion
            </div>
            <div className="flex flex-wrap gap-2">
              {(categories || []).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    activeCategory === cat
                      ? 'bg-emerald-800 text-white border-emerald-700 shadow-sm'
                      : 'bg-white text-slate-600 border-stone-200 hover:border-emerald-300 hover:text-emerald-700'
                  }`}
                >
                  {cat}
                  {cat !== 'All' && (
                    <span className={`ml-1.5 text-xs ${activeCategory === cat ? 'text-emerald-300' : 'text-slate-400'}`}>
                      ({(duas || []).filter(d => (d.category || d.type || '') === cat).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <Heart className="w-12 h-12 text-rose-200" />
            <p className="text-slate-400">No supplications found for "{activeCategory}".</p>
          </div>
        )}

        {/* Dua grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {(filtered || []).map((dua, i) => (
            <DuaCard key={dua.id || i} dua={dua} />
          ))}
        </div>
      </div>
    </div>
  )
}