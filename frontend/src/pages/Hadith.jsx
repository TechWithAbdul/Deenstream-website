// src/pages/Hadith.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { Scroll, ChevronLeft, ChevronRight, BookOpen, AlertCircle, Copy, Check, Type, Share2 } from 'lucide-react'
import { hadithApi } from '../services/api'

const COLLECTION_TAG = {
  bukhari: 'Most Authentic', muslim: 'Sahih', abudawud: 'Sunan', tirmidhi: 'Jami',
  nasai: 'Sunan', ibnmajah: 'Sunan', malik: 'Muwatta',
}

const SLUG_NORMALIZER = (col, fallbackIdx) => {
  const currentSlug = String(col.slug || col.id || col.collection_slug || col.collection || '').toLowerCase();
  if (currentSlug.includes('bukhari')) return 'bukhari';
  if (currentSlug.includes('muslim')) return 'muslim';
  if (currentSlug.includes('abudawud') || currentSlug.includes('dawud')) return 'abudawud';
  if (currentSlug.includes('tirmidhi')) return 'tirmidhi';
  if (currentSlug.includes('nasai') || currentSlug.includes('nasa\'i')) return 'nasai';
  if (currentSlug.includes('majah') || currentSlug.includes('ibnmajah')) return 'ibnmajah';
  if (currentSlug.includes('malik') || currentSlug.includes('muwatta')) return 'malik';

  const currentName = String(col.name || col.title || '').toLowerCase();
  if (currentName.includes('bukhari')) return 'bukhari';
  if (currentName.includes('muslim')) return 'muslim';
  if (currentName.includes('dawud')) return 'abudawud';
  if (currentName.includes('tirmidhi')) return 'tirmidhi';
  if (currentName.includes('majah')) return 'ibnmajah';
  if (currentName.includes('nasa')) return 'nasai';
  if (currentName.includes('malik') || currentName.includes('muwatta')) return 'malik';

  const orderFallback = ['bukhari', 'muslim', 'abudawud', 'tirmidhi', 'ibnmajah', 'nasai', 'malik'];
  return orderFallback[fallbackIdx] || currentSlug;
};

function CollectionSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="skeleton h-10 w-10 rounded-xl" />
      <div className="skeleton h-3 w-16" />
      <div className="skeleton h-5 w-32" />
      <div className="skeleton h-3 w-20" />
    </div>
  )
}

function Skeleton() {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="skeleton h-6 w-20 rounded-md" />
        <div className="skeleton h-6 w-16 rounded-md" />
      </div>
      <div className="skeleton h-24 w-full rounded-lg" />
      <div className="skeleton h-16 w-full rounded-lg" />
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

function HadithCard({ hadith, collectionName, textSize }) {
  const [copied, setCopied] = useState(false)
  
  // Map parameters exactly matching the target API response keys
  const num = hadith.hadithnumber || hadith.hadith_number || hadith.number || hadith.id
  const arabic = hadith.arabic || ''
  const english = hadith.english || hadith.text_en || hadith.translation || ''
  const grade = hadith.grade || null

  // Extract the narrator snippet out of the english text if available
  let narrator = '';
  if (english && english.toLowerCase().startsWith('narrated')) {
    const colonIndex = english.indexOf(':');
    if (colonIndex !== -1 && colonIndex < 60) {
      narrator = english.substring(0, colonIndex + 1);
    }
  }

  const handleCopy = () => {
    const textToCopy = `[${collectionName} Hadith #${num}]\n\nArabic:\n${arabic}\n\nTranslation:\n${english}${grade ? `\n\nGrade: ${grade}` : ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getGradeStyle = (g) => {
    const clean = g.toLowerCase();
    if (clean.includes('sahih') || clean.includes('authentic')) return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: 'rgba(16, 185, 129, 0.2)' };
    if (clean.includes('daif') || clean.includes('weak')) return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.2)' };
    return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.2)' };
  };

  const gradeStyle = grade ? getGradeStyle(grade) : null;

  // Size Multipliers based on Text Controls
  const arabicSizes = { sm: '20px', md: '25px', lg: '32px' };
  const englishSizes = { sm: '14px', md: '16px', lg: '19px' };

  return (
    <div 
      className="rounded-2xl border transition-all duration-300 overflow-hidden animate-slide-up"
      style={{ backgroundColor: 'rgba(4, 32, 24, 0.35)', borderColor: 'rgba(197, 168, 128, 0.12)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
    >
      {/* Card Header Metadata Layout */}
      <div className="px-5 py-3.5 flex items-center justify-between border-b" style={{ borderColor: 'rgba(197, 168, 128, 0.08)', background: 'rgba(2, 16, 12, 0.4)' }}>
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide" style={{ background: 'rgba(197,168,128,0.1)', border: '1px solid rgba(197,168,128,0.2)', color: '#c5a880' }}>
            Hadith {num}
          </span>
          {grade && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border" style={{ backgroundColor: gradeStyle.bg, color: gradeStyle.text, borderColor: gradeStyle.border }}>
              ● {grade}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button onClick={handleCopy} className="p-2 text-stone-400 hover:text-[#c5a880] transition-colors rounded-lg hover:bg-stone-800/40" title="Copy Hadith Citation">
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Arabic Segment */}
        {arabic && (
          <div className="w-full" style={{ direction: 'rtl' }}>
            <p 
              className="leading-loose text-right block break-words w-full font-arabic antialiased" 
              lang="ar" 
              style={{ fontFamily: 'Amiri, serif', fontSize: arabicSizes[textSize], color: '#f6ebd2', lineHeight: '2.3' }}
            >
              {arabic}
            </p>
          </div>
        )}

        {/* English Translation Segment */}
        {english && (
          <div className="border-t border-dashed pt-5 text-left" style={{ borderColor: 'rgba(197, 168, 128, 0.12)' }}>
            <p className="leading-relaxed text-stone-200 antialiased" style={{ fontSize: englishSizes[textSize] }}>
              {narrator && <strong className="text-[#c5a880] font-medium mr-1">{narrator}</strong>}
              {narrator ? english.substring(narrator.length).trim() : english}
            </p>
            
            {/* Citation Footprint */}
            <span className="block mt-4 text-[11px] uppercase tracking-wider font-semibold opacity-30 text-emerald-100">
              Reference: {collectionName} {num}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Hadith() {
  const [collections, setCollections] = useState([])
  const [collectionsLoading, setCollectionsLoading] = useState(true)
  const [collectionsError, setCollectionsError] = useState(null)

  const [selected, setSelected] = useState(null)
  const [hadiths, setHadiths] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [textSize, setTextSize] = useState('md') // 'sm' | 'md' | 'lg'
  const LIMIT = 20

  const loadCollections = useCallback(async () => {
    setCollectionsLoading(true); setCollectionsError(null)
    try {
      const res = await hadithApi.getCollections()
      const raw = res.data || {}
      
      let list = []
      if (Array.isArray(raw)) {
        list = raw
      } else if (raw.data && Array.isArray(raw.data.collections)) {
        list = raw.data.collections
      } else if (raw.data && Array.isArray(raw.data)) {
        list = raw.data
      } else if (Array.isArray(raw.collections)) {
        list = raw.collections
      }
      setCollections(list)
    } catch (err) {
      setCollectionsError(err?.message || 'Failed to load hadith collections.')
    } finally {
      setCollectionsLoading(false)
    }
  }, [])

  useEffect(() => { loadCollections() }, [loadCollections])

  const loadHadiths = useCallback(async (slug, p) => {
    setLoading(true); setError(null)
    try {
      const res = await hadithApi.getCollection(slug, p, LIMIT)
      const raw = res.data || {}
      
      let list = []
      if (raw.data && Array.isArray(raw.data.hadiths)) {
        list = raw.data.hadiths
      } else if (Array.isArray(raw.hadiths)) {
        list = raw.hadiths
      } else if (Array.isArray(raw.data)) {
        list = raw.data
      } else if (Array.isArray(raw)) {
        list = raw
      }

      setHadiths(list)
      setHasMore(list.length === LIMIT)
    } catch (err) {
      setError(err?.message || 'Failed to load hadiths.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (selected) loadHadiths(selected.slug, page) }, [selected, page, loadHadiths])

  const handleSelect = (col, idx) => { 
    const verifiedSlug = SLUG_NORMALIZER(col, idx);
    setSelected({ slug: verifiedSlug, name: col.name || col.title || verifiedSlug }); 
    setPage(1); 
    setHadiths([]); 
    setError(null);
  }

  // View 1: Main Collection Index Dashboard
  if (!selected) {
    return (
      <div className="animate-fade-in w-full">
        <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #01140e, #29180a)' }}>
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(197,168,128,0.08)', border: '1px solid rgba(197,168,128,0.25)' }}>
                <Scroll className="w-5 h-5" style={{ color: '#c5a880' }} />
              </div>
              <span className="badge-gold">Hadith Encyclopedia</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>كتب الحديث</h1>
            <p className="text-sm sm:text-base text-emerald-100/60 max-w-2xl leading-relaxed"> Explore the canonical books of prophetic Traditions. Read authenticated transcripts, text grades, and analytical cross-references.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {collectionsError && <ErrorBanner message={collectionsError} onRetry={loadCollections} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collectionsLoading && Array.from({ length: 7 }).map((_, i) => <CollectionSkeleton key={i} />)}

            {!collectionsLoading && collections.map((col, idx) => {
              const name = col.name || col.title || 'Collection'
              const count = col.hadith_count || col.count || col.total || '—'
              const displaySlug = SLUG_NORMALIZER(col, idx)
              const tag = COLLECTION_TAG[displaySlug] || 'Canonical'

              return (
                <button 
                  key={`${displaySlug}-${idx}`} 
                  onClick={() => handleSelect({ ...col, name }, idx)} 
                  className="group relative p-6 text-left rounded-2xl border transition-all duration-300 focus:outline-none flex flex-col justify-between overflow-hidden"
                  style={{ backgroundColor: 'rgba(3, 26, 19, 0.4)', borderColor: 'rgba(197, 168, 128, 0.08)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-900/0 to-amber-900/0 group-hover:to-amber-900/10 transition-all duration-300" />
                  <div className="relative z-10 w-full">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300" style={{ background: 'rgba(197,168,128,0.06)', border: '1px solid rgba(197,168,128,0.2)' }}>
                      <BookOpen className="w-4 h-4" style={{ color: '#c5a880' }} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#c5a880' }}>{tag}</p>
                    <h3 className="font-bold text-white text-lg leading-snug mb-4 group-hover:text-[#e4d4be] transition-colors">{name}</h3>
                  </div>
                  <div className="relative z-10 pt-3 border-t w-full flex items-center justify-between text-xs font-medium text-emerald-100/40 group-hover:text-emerald-100/60 transition-colors" style={{ borderColor: 'rgba(197,168,128,0.06)' }}>
                    <span>{count} Narrations</span>
                    <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" style={{ color: '#c5a880' }} />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // View 2: Detailed Hadith View (Islam 360 Style Layout)
  return (
    <div className="animate-fade-in w-full max-w-full flex flex-col min-h-screen">
      {/* Dynamic Action Sub-Header */}
      <div className="w-full border-b backdrop-blur-md sticky top-0 z-30" style={{ background: 'rgba(1, 15, 11, 0.93)', borderColor: 'rgba(197, 168, 128, 0.15)' }}>
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
          <button onClick={() => setSelected(null)} className="btn-ghost px-3 py-1.5 text-xs font-semibold shrink-0 flex items-center gap-1.5 rounded-xl border border-stone-800">
            <ChevronLeft className="w-4 h-4" /> Library
          </button>
          
          <div className="text-center truncate max-w-[50%]">
            <p className="text-base font-bold text-white truncate" style={{ fontFamily: 'Playfair Display, serif' }}>{selected.name}</p>
            <p className="text-[10px] tracking-wider uppercase font-bold text-[#c5a880]">Page {page}</p>
          </div>

          {/* Sizing Toggles */}
          <div className="flex items-center gap-1 border rounded-xl p-0.5" style={{ borderColor: 'rgba(197,168,128,0.15)', background: 'rgba(0,0,0,0.2)' }}>
            {['sm', 'md', 'lg'].map((sz) => (
              <button 
                key={sz} 
                onClick={() => setTextSize(sz)}
                className="w-7 h-7 rounded-lg text-[11px] font-bold uppercase transition-all"
                style={textSize === sz ? { background: '#c5a880', color: '#01150f' } : { color: 'rgba(255,255,255,0.4)' }}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Hadith Stream Container */}
      <div className="w-full flex-1 px-4 py-6 sm:py-10">
        <div className="max-w-3xl mx-auto space-y-6 pb-24">
          {error && <ErrorBanner message={error} onRetry={() => loadHadiths(selected.slug, page)} />}
          {loading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} />)}

          {!loading && !error && hadiths.length === 0 && (
            <div className="text-center py-16 border border-dashed rounded-2xl" style={{ borderColor: 'rgba(197,168,128,0.1)' }}>
              <p className="text-sm text-stone-400">No hadiths found matching page parameters.</p>
            </div>
          )}

          {!loading && !error && hadiths.map((h, i) => (
            <HadithCard key={h.id || `${selected.slug}-${page}-${i}`} hadith={h} collectionName={selected.name} textSize={textSize} />
          ))}

          {/* Pagination Controls */}
          {!loading && hadiths.length > 0 && (
            <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: 'rgba(197, 168, 128, 0.12)' }}>
              <button 
                onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
                disabled={page === 1} 
                className="btn-ghost text-xs px-3.5 py-2 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 rounded-xl"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              
              <div className="flex items-center gap-1.5">
                {[page - 1, page, page + 1].filter(n => n >= 1).map(n => (
                  <button 
                    key={n} 
                    onClick={() => { setPage(n); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
                    className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
                    style={n === page ? { background: '#c5a880', color: '#01150f' } : { color: 'rgba(231,243,238,0.4)', backgroundColor: 'rgba(255,255,255,0.02)' }}
                  >
                    {n}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => { setPage(p => p + 1); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
                disabled={!hasMore} 
                className="btn-ghost text-xs px-3.5 py-2 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 rounded-xl"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}