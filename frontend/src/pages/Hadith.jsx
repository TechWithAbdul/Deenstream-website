// src/pages/Hadith.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { Scroll, ChevronLeft, ChevronRight, BookOpen, AlertCircle } from 'lucide-react'
import { hadithApi } from '../services/api'

const COLLECTION_TAG = {
  bukhari: 'Most Authentic', muslim: 'Sahih', abudawud: 'Sunan', tirmidhi: 'Jami',
  nasai: 'Sunan', ibnmajah: 'Sunan', malik: 'Muwatta',
}

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
      <div className="flex-1"><p className="font-semibold">Failed to load</p><p className="text-xs mt-0.5 opacity-80">{message}</p></div>
      {onRetry && <button onClick={onRetry} className="text-xs font-medium hover:underline shrink-0" style={{ color: '#c5a880' }}>Retry</button>}
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
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'rgba(197,168,128,0.08)', border: '1px solid rgba(197,168,128,0.25)', color: '#c5a880' }}>{num}</span>
        {narrator && <span className="text-xs text-emerald-100/35 italic truncate">Narrated by {narrator}</span>}
      </div>
      {arabic && <p className="text-right text-xl arabic-leading leading-loose border-t pt-3" lang="ar" style={{ fontFamily: 'Amiri,serif', color: '#f3ead9', borderColor: 'rgba(197,168,128,0.12)' }}>{arabic}</p>}
      {english && <p className="text-sm leading-relaxed border-t pt-3 text-emerald-100/70" style={{ borderColor: 'rgba(197,168,128,0.12)' }}>{english}</p>}
      {!arabic && !english && <p className="text-sm italic text-emerald-100/30">No text available for this narration.</p>}
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
  const LIMIT = 20

  const loadCollections = useCallback(async () => {
    setCollectionsLoading(true); setCollectionsError(null)
    try {
      const res = await hadithApi.getCollections()
      const data = res.data
      const list = Array.isArray(data) ? data : Array.isArray(data?.collections) ? data.collections : Array.isArray(data?.data) ? data.data : []
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
      const data = res.data || {}
      const list = data.hadiths || data.data?.hadiths || data.data || []
      const arr = Array.isArray(list) ? list : []
      setHadiths(arr)
      setHasMore(arr.length === LIMIT)
    } catch (err) {
      setError(err?.message || 'Failed to load hadiths.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (selected) loadHadiths(selected.slug, page) }, [selected, page, loadHadiths])

  const handleSelect = (col) => { setSelected(col); setPage(1); setHadiths([]); setError(null) }

  if (!selected) {
    return (
      <div className="animate-fade-in">
        <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#021711,#3d2510)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(197,168,128,0.08)', border: '1px solid rgba(197,168,128,0.3)' }}>
                <Scroll className="w-5 h-5" style={{ color: '#c5a880' }} />
              </div>
              <span className="badge-gold">Hadith Library</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display,serif' }}>كتب الحديث</h1>
            <p className="text-emerald-100/50">Seven canonical collections — 36,000+ verified narrations</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {collectionsError && <ErrorBanner message={collectionsError} onRetry={loadCollections} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {collectionsLoading && Array.from({ length: 7 }).map((_, i) => <CollectionSkeleton key={i} />)}

            {!collectionsLoading && !collectionsError && collections.length === 0 && (
              <div className="empty-state col-span-full"><Scroll className="w-12 h-12" style={{ color: 'rgba(197,168,128,0.3)' }} /><p className="text-emerald-100/30">No hadith collections returned by the backend.</p></div>
            )}

            {!collectionsLoading && (collections || []).map((col) => {
              const slug = col.slug || col.id || col.collection_slug || ''
              const name = col.name || col.title || slug
              const count = col.hadith_count || col.count || col.total || '—'
              const tag = COLLECTION_TAG[slug] || 'Collection'

              return (
                <button key={slug} onClick={() => handleSelect({ slug, name })} className="card p-5 text-left hover:scale-[1.03] active:scale-95 transition-transform duration-200 focus:outline-none">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(197,168,128,0.08)', border: '1px solid rgba(197,168,128,0.3)' }}>
                    <BookOpen className="w-4 h-4" style={{ color: '#c5a880' }} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#c5a880' }}>{tag}</p>
                  <h3 className="font-bold text-white text-base leading-tight mb-2">{name}</h3>
                  <p className="text-sm font-medium text-emerald-100/50">{count} hadiths</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="sticky top-16 z-30 backdrop-blur-sm border-b" style={{ background: 'rgba(2,23,17,0.95)', borderColor: 'rgba(197,168,128,0.15)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button onClick={() => setSelected(null)} className="btn-ghost py-1.5 shrink-0"><ChevronLeft className="w-4 h-4" /> Collections</button>
          <div className="flex-1 min-w-0"><p className="font-bold text-white truncate">{selected.name}</p><p className="text-xs text-emerald-100/35">Page {page}</p></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-4 pb-20">
        {error && <ErrorBanner message={error} onRetry={() => loadHadiths(selected.slug, page)} />}
        {loading && Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} />)}

        {!loading && !error && hadiths.length === 0 && (
          <div className="empty-state"><Scroll className="w-12 h-12" style={{ color: 'rgba(197,168,128,0.3)' }} /><p className="text-emerald-100/30">No hadiths found for page {page}.</p></div>
        )}

        {(hadiths || []).map((h, i) => <HadithCard key={`${h.id || i}`} hadith={h} index={(page - 1) * LIMIT + i} />)}

        {!loading && hadiths.length > 0 && (
          <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: 'rgba(197,168,128,0.12)' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex items-center gap-2">
              {[page - 1, page, page + 1].filter(n => n >= 1).map(n => (
                <button key={n} onClick={() => setPage(n)} className="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
                  style={n === page ? { background: '#c5a880', color: '#021711' } : { color: 'rgba(231,243,238,0.5)' }}>
                  {n}
                </button>
              ))}
            </div>
            <button onClick={() => setPage(p => p + 1)} disabled={!hasMore} className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}