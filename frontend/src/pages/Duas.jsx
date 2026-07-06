// src/pages/Duas.jsx
// Backend confirmed: GET /api/v1/duas returns the FULL flat list (no category-list
// endpoint). Categories are derived client-side from each dua's `category` field.
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Heart, Copy, Check, AlertCircle, Filter, Search, Type } from 'lucide-react'
import { duasApi } from '../services/api'

function Skeleton() {
  return (
    <div className="card p-6 space-y-4" style={{ backgroundColor: 'rgba(4, 32, 24, 0.2)', borderColor: 'rgba(197, 168, 128, 0.08)' }}>
      <div className="flex justify-between items-center">
        <div className="skeleton h-5 w-20 rounded-md" />
        <div className="skeleton h-7 w-14 rounded-md" />
      </div>
      <div className="skeleton h-12 w-full rounded-lg" />
      <div className="skeleton h-5 w-full rounded-md" />
      <div className="skeleton h-4 w-2/3 rounded-md" />
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
    } catch { /* clipboard unavailable */ }
  }
  return (
    <button
      onClick={handleCopy}
      title="Copy supplication"
      className="p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 hover:bg-stone-800/40"
      style={copied
        ? { background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981' }
        : { border: '1px solid rgba(197, 168, 128, 0.12)', color: 'rgba(231, 243, 238, 0.5)' }}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}

function DuaCard({ dua, textSize }) {
  const arabic = dua.arabic || dua.text_arabic || ''
  const translation = dua.translation || dua.text_en || dua.text || ''
  const transliteration = dua.transliteration || ''
  const reference = dua.reference || dua.source || ''
  const category = dua.category || 'General'

  const copyText = [arabic, transliteration, translation, reference ? `(${reference})` : ''].filter(Boolean).join('\n')

  const arabicSizes = { sm: '22px', md: '26px', lg: '32px' };
  const englishSizes = { sm: '13px', md: '14px', lg: '16px' };

  return (
    <div 
      className="rounded-2xl border p-5 sm:p-6 transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between space-y-5 animate-slide-up"
      style={{ 
        backgroundColor: 'rgba(4, 32, 24, 0.35)', 
        borderColor: 'rgba(197, 168, 128, 0.12)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
      }}
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-emerald-950/30">
          <span className="px-3 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase" style={{ background: 'rgba(197,168,128,0.08)', border: '1px solid rgba(197,168,128,0.2)', color: '#c5a880' }}>
            {category}
          </span>
          <CopyButton text={copyText} />
        </div>

        {arabic && (
          <div className="w-full" style={{ direction: 'rtl' }}>
            <p 
              className="leading-loose text-right block break-words w-full font-arabic antialiased" 
              lang="ar" 
              style={{ fontFamily: 'Amiri, serif', fontSize: arabicSizes[textSize], color: '#f6ebd2', lineHeight: '2.2' }}
            >
              {arabic}
            </p>
          </div>
        )}

        {transliteration && (
          <div className="border-t border-dashed pt-4" style={{ borderColor: 'rgba(197, 168, 128, 0.1)' }}>
            <p className="italic leading-relaxed text-stone-300/90 font-medium" style={{ fontSize: englishSizes[textSize] }}>
              {transliteration}
            </p>
          </div>
        )}

        {translation && (
          <div className={transliteration ? 'pt-1' : 'border-t border-dashed pt-4'} style={{ borderColor: 'rgba(197, 168, 128, 0.1)' }}>
            <p className="leading-relaxed text-emerald-100/70" style={{ fontSize: englishSizes[textSize] }}>
              {translation}
            </p>
          </div>
        )}
      </div>

      {reference && (
        <div className="pt-4 border-t border-emerald-950/20 flex items-center text-xs font-semibold" style={{ color: '#c5a880' }}>
          <span className="opacity-40 text-stone-400 mr-1.5 font-normal">Source:</span> — {reference}
        </div>
      )}
    </div>
  )
}

export default function Duas() {
  const [duas, setDuas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [textSize, setTextSize] = useState('md')

  const loadDuas = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await duasApi.getAll()
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

  const categories = useMemo(() => {
    const cats = new Set(['All'])
    ;(duas || []).forEach(d => {
      const cat = d.category || ''
      if (cat) cats.add(cat)
    })
    return Array.from(cats)
  }, [duas])

  const filtered = useMemo(() => {
    let result = duas || []
    if (activeCategory !== 'All') {
      result = result.filter(d => (d.category || '') === activeCategory)
    }
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase()
      result = result.filter(d => 
        String(d.arabic || '').toLowerCase().includes(query) ||
        String(d.translation || d.text_en || d.text || '').toLowerCase().includes(query) ||
        String(d.transliteration || '').toLowerCase().includes(query) ||
        String(d.reference || d.source || '').toLowerCase().includes(query)
      )
    }
    return result
  }, [duas, activeCategory, searchQuery])

  return (
    <div className="animate-fade-in w-full">
      {/* Hero Banner Section with Adaptive Responsive Alignment */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #021711, #2b0b14)' }}>
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
            
            {/* Centered items on mobile view via items-center md:items-start */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(197,168,128,0.08)', border: '1px solid rgba(197,168,128,0.25)' }}>
                  <Heart className="w-5 h-5" style={{ color: '#c5a880' }} />
                </div>
                <span className="badge-gold">Supplications Portfolio</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                الأدعية النبوية
              </h1>
              <p className="text-sm text-emerald-100/60 max-w-xl leading-relaxed">
                {loading ? 'Accessing safe registry items...' : `A total of ${duas.length} canonical and daily supplications prepared for your journey.`}
              </p>
            </div>

            {!loading && (
              <div className="w-full md:w-80 relative max-w-md mx-auto md:mx-0">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-stone-400">
                  <Search className="w-4 h-4" />
                </div>
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search supplications..."
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border outline-none bg-black/30 text-white placeholder-stone-500 transition-all focus:border-[#c5a880]/50"
                  style={{ borderColor: 'rgba(197, 168, 128, 0.15)' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6">
            <ErrorBanner message={error} onRetry={loadDuas} />
          </div>
        )}

        {/* Global Modifier Control Panel Grid */}
        {!loading && (
          <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b pb-6 border-emerald-950/20">
            
            {/* Category Filter section */}
            {categories.length > 1 && (
              <div className="space-y-2.5 max-w-full overflow-hidden text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  <Filter className="w-3.5 h-3.5" /> Filter by context category
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 max-w-full">
                  {categories.map(cat => {
                    const matchCount = cat === 'All' ? duas.length : duas.filter(d => (d.category || '') === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150"
                        style={activeCategory === cat
                          ? { background: '#c5a880', color: '#021711', boxShadow: '0 2px 10px rgba(197,168,128,0.2)' }
                          : { background: 'rgba(255,255,255,0.02)', color: 'rgba(231,243,238,0.6)', border: '1px solid rgba(197,168,128,0.12)' }}
                      >
                        {cat}
                        <span className="ml-1.5 text-[10px] opacity-60">({matchCount})</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Fixed Responsive Text Display Option Toggle Container */}
            <div className="flex flex-col items-center sm:items-start lg:items-end space-y-2.5 shrink-0">
              <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                <Type className="w-3.5 h-3.5" /> Text Display Options
              </div>
              <div className="flex items-center border rounded-xl p-0.5 bg-black/20 inline-flex w-fit" style={{ borderColor: 'rgba(197, 168, 128, 0.15)' }}>
                {['sm', 'md', 'lg'].map((sz) => (
                  <button 
                    key={sz} 
                    onClick={() => setTextSize(sz)}
                    className="w-10 h-8 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center"
                    style={textSize === sz ? { background: '#c5a880', color: '#01150f' } : { color: 'rgba(255,255,255,0.4)' }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Output View Pipelines */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="py-20 text-center border border-dashed rounded-2xl flex flex-col items-center justify-center" style={{ borderColor: 'rgba(197,168,128,0.1)' }}>
            <Heart className="w-12 h-12 mb-3 opacity-20" style={{ color: '#c5a880' }} />
            <p className="text-sm font-medium text-stone-400">No supplications found matching current parameters.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((dua, i) => (
            <DuaCard key={dua.id || `dua-${i}`} dua={dua} textSize={textSize} />
          ))}
        </div>
      </div>
    </div>
  )
}