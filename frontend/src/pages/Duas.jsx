// src/pages/Duas.jsx
// Backend confirmed: GET /api/v1/duas returns the FULL flat list (no category-list
// endpoint). Categories are derived client-side from each dua's `category` field.
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Heart, Copy, Check, AlertCircle, Filter } from 'lucide-react'
import { duasApi } from '../services/api'

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

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="error-banner">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold">Failed to load</p>
        <p className="text-xs mt-0.5 opacity-80">{message}</p>
      </div>
      {onRetry && <button onClick={onRetry} className="text-xs font-medium hover:underline shrink-0" style={{ color: '#c5a880' }}>Retry</button>}
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
    } catch { /* clipboard unavailable — silently ignore */ }
  }
  return (
    <button
      onClick={handleCopy}
      title="Copy dua"
      className="p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all duration-200"
      style={copied
        ? { background: 'rgba(197,168,128,0.12)', border: '1px solid rgba(197,168,128,0.3)', color: '#c5a880' }
        : { border: '1px solid rgba(197,168,128,0.15)', color: 'rgba(231,243,238,0.4)' }}
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
      <div className="flex items-start justify-between gap-3">
        <span className="badge-gold shrink-0">{category}</span>
        <CopyButton text={copyText} />
      </div>

      {arabic && (
        <p className="text-2xl text-right arabic-leading leading-loose" lang="ar" style={{ fontFamily: 'Amiri,serif', color: '#f3ead9' }}>
          {arabic}
        </p>
      )}

      {transliteration && (
        <p className="text-sm italic leading-relaxed border-t pt-3" style={{ color: '#d4bc99', borderColor: 'rgba(197,168,128,0.12)' }}>
          {transliteration}
        </p>
      )}

      {translation && (
        <p className="text-sm leading-relaxed border-t pt-3 text-emerald-100/70" style={{ borderColor: 'rgba(197,168,128,0.12)' }}>
          {translation}
        </p>
      )}

      {reference && <p className="text-xs font-medium" style={{ color: '#c5a880' }}>— {reference}</p>}
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
      const data = res.data
      // Defensive: handle bare array or dict-wrapped array
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

  // Derive unique categories from the flat list — no separate endpoint exists.
  const categories = useMemo(() => {
    const cats = new Set(['All'])
    ;(duas || []).forEach(d => {
      const cat = d.category || ''
      if (cat) cats.add(cat)
    })
    return Array.from(cats)
  }, [duas])

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return duas
    return (duas || []).filter(d => (d.category || '') === activeCategory)
  }, [duas, activeCategory])

  return (
    <div className="animate-fade-in">
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#021711,#3d0e1c)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(197,168,128,0.08)', border: '1px solid rgba(197,168,128,0.3)' }}>
              <Heart className="w-5 h-5" style={{ color: '#c5a880' }} />
            </div>
            <span className="badge-gold">Supplications</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display,serif' }}>
            الأدعية النبوية
          </h1>
          <p className="text-emerald-100/50">
            {loading ? 'Loading…' : `${duas.length} prophetic supplications`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6">
            <ErrorBanner message={error} onRetry={loadDuas} />
          </div>
        )}

        {/* Category filter tabs — derived client-side from the flat list */}
        {!loading && categories.length > 1 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(231,243,238,0.4)' }}>
              <Filter className="w-3.5 h-3.5" /> Filter by occasion
            </div>
            <div className="flex flex-wrap gap-2">
              {(categories || []).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                  style={activeCategory === cat
                    ? { background: '#c5a880', color: '#021711' }
                    : { background: 'rgba(255,255,255,0.02)', color: 'rgba(231,243,238,0.6)', border: '1px solid rgba(197,168,128,0.15)' }}
                >
                  {cat}
                  {cat !== 'All' && (
                    <span className="ml-1.5 text-xs" style={{ opacity: 0.7 }}>
                      ({(duas || []).filter(d => (d.category || '') === cat).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <Heart className="w-12 h-12" style={{ color: 'rgba(197,168,128,0.3)' }} />
            <p className="text-emerald-100/30">No supplications found for "{activeCategory}".</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {(filtered || []).map((dua, i) => (
            <DuaCard key={dua.id || i} dua={dua} />
          ))}
        </div>
      </div>
    </div>
  )
}