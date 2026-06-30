// src/pages/Quran.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { BookOpen, Search, ChevronLeft, Minus, Plus, Globe, AlertCircle } from 'lucide-react'
import { quranApi } from '../services/api'

const TRANSLATIONS = [
  { key: 'sahih_international', label: 'English (Sahih)' },
  { key: 'pickthall', label: 'English (Pickthall)' },
  { key: 'yusuf_ali', label: 'English (Yusuf Ali)' },
  { key: 'urdu', label: 'Urdu (اردو)' },
  { key: 'turkish', label: 'Turkish (Türkçe)' },
  { key: 'indonesian', label: 'Indonesian' },
  { key: 'french', label: 'French (Français)' },
  { key: 'german', label: 'German (Deutsch)' },
  { key: 'bengali', label: 'Bengali (বাংলা)' },
  { key: 'spanish', label: 'Spanish (Español)' },
  { key: 'malay', label: 'Malay' },
  { key: 'bosnian', label: 'Bosnian' }
];

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
  const [translation, setTranslation] = useState('sahih_international') 
  const [fontSize, setFontSize] = useState(30)

  const loadSurah = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await quranApi.getSurah(chapter.number || chapter.id, translation)
      const data = res.data || {}

      let list = []
      if (data.data && data.data.verses) {
        list = data.data.verses
      } else if (data.verses) {
        list = data.verses
      } else if (data.data && data.data.ayahs) {
        list = data.data.ayahs
      } else if (data.ayahs) {
        list = data.ayahs
      } else if (Array.isArray(data)) {
        list = data
      }

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
    <div className="animate-fade-in w-full max-w-full flex flex-col min-h-screen">
      {/* 🛠️ Changed position from sticky to a relative layout flow so it pushes content down normally without overlapping */}
      <div className="w-full border-b backdrop-blur-md relative z-10" style={{ background: 'rgba(2, 20, 15, 0.95)', borderColor: 'rgba(197, 168, 128, 0.2)' }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          
          {/* Left Side: Navigation */}
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3">
            <button onClick={onBack} className="btn-ghost px-2.5 py-1.5 text-xs font-medium shrink-0 flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="text-right sm:text-left truncate">
              <h2 className="text-base sm:text-lg font-bold text-white truncate" style={{ fontFamily: 'Playfair Display, serif' }}>{chapterEn}</h2>
              <p className="text-[11px] text-emerald-100/40">{verseCount} Verses</p>
            </div>
          </div>

          {/* Right Side: Responsive Controls */}
          <div className="flex items-center justify-end w-full sm:w-auto gap-2">
            {/* Font Control Box */}
            <div className="flex items-center gap-1 rounded-lg px-2 py-1 bg-black/20 border border-stone-800">
              <button onClick={() => setFontSize(s => Math.max(22, s - 2))} className="p-1 text-stone-400 hover:text-white transition-colors"><Minus className="w-3 h-3" /></button>
              <span className="text-xs font-mono text-stone-300 w-8 text-center select-none">{fontSize}px</span>
              <button onClick={() => setFontSize(s => Math.min(48, s + 2))} className="p-1 text-stone-400 hover:text-white transition-colors"><Plus className="w-3 h-3" /></button>
            </div>

            {/* Language Dropdown Select */}
            <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 bg-black/20 border border-stone-800 focus-within:border-amber-500/50 transition-colors">
              <Globe className="w-3.5 h-3.5 text-emerald-100/40 shrink-0" />
              <select 
                value={translation} 
                onChange={e => setTranslation(e.target.value)} 
                className="text-xs font-medium text-stone-200 bg-transparent outline-none cursor-pointer pr-1"
                style={{ colorScheme: 'dark' }}
              >
                {TRANSLATIONS.map(t => (
                  <option key={t.key} value={t.key} style={{ background: '#02140f', color: '#f3ead9' }}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Main Reader View Body Block */}
      <div className="w-full flex-1 px-4 py-6 sm:py-10 space-y-6">
        {/* Elegant Centered Bismillah Banner with tighter custom margins */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl sm:text-3xl tracking-wide font-arabic" lang="ar" style={{ fontFamily: 'Amiri, serif', color: '#c5a880', lineHeight: '2' }}>
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </p>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#c5a880]/30 to-transparent mx-auto mt-4" />
        </div>

        {/* Verses Map Grid List */}
        <div className="max-w-3xl mx-auto pb-16 space-y-4">
          {error && <ErrorBanner message={error} onRetry={loadSurah} />}
          {loading && Array.from({ length: 4 }).map((_, i) => <AyahSkeleton key={i} />)}

          {!loading && !error && ayahs.length === 0 && (
            <div className="text-center py-12 border border-dashed border-stone-800 rounded-xl">
              <p className="text-sm text-stone-500">No verses could be read from this format.</p>
            </div>
          )}

          {!loading && !error && ayahs.map((ayah, idx) => {
            const arabicText = ayah.arabic || '';
            const currentVerseNum = ayah.ayah || (idx + 1);

            let verseTranslation = '';
            if (ayah.translations) {
              if (typeof ayah.translations === 'string') {
                verseTranslation = ayah.translations;
              } else if (ayah.translations[translation]) {
                verseTranslation = ayah.translations[translation];
              } else if (ayah.translations.sahih_international) {
                verseTranslation = ayah.translations.sahih_international;
              }
            } else if (ayah.translation) {
              verseTranslation = typeof ayah.translation === 'string' ? ayah.translation : (ayah.translation.text || '');
            } else if (ayah.text && translation !== 'sahih_international') {
              verseTranslation = ayah.text;
            }

            const individualAudio = ayah.audio?.ayah_audio || '';

            return (
              <div
                key={`${ayah.verse_key || currentVerseNum}-${idx}`}
                className="p-4 sm:p-6 rounded-xl border transition-all"
                style={{ backgroundColor: 'rgba(4, 40, 30, 0.2)', borderColor: 'rgba(197, 168, 128, 0.08)' }}
              >
                {/* Arabic Script Typography Section */}
                <div className="w-full text-right mb-4" style={{ direction: 'rtl' }}>
                  <p 
                    className="leading-loose text-right inline-block break-words w-full font-arabic" 
                    lang="ar" 
                    style={{ 
                      fontFamily: 'Amiri, serif', 
                      fontSize: `${fontSize}px`, 
                      color: '#f3ead9',
                      lineHeight: '2.2'
                    }}
                  >
                    {arabicText || '—'}
                    <span className="text-xl sm:text-2xl mr-2 text-amber-200/60 inline-block font-serif select-none" style={{ color: '#c5a880' }}>
                      ﴿{currentVerseNum}﴾
                    </span>
                  </p>
                </div>

                {/* Resolved Dynamic Translation String Display */}
                <div className="border-t pt-3.5 text-left" style={{ borderColor: 'rgba(197, 168, 128, 0.1)' }}>
                  <p className="text-sm sm:text-base leading-relaxed text-stone-200">
                    <span className="font-semibold text-xs mr-2 select-none" style={{ color: '#c5a880' }}>{currentVerseNum}.</span>
                    {verseTranslation || <span className="text-xs text-stone-500 italic">Translation unavailable for this selection.</span>}
                  </p>
                  
                  {ayah.transliteration && (
                    <p className="text-xs text-emerald-100/30 mt-1.5 italic font-sans">
                      {ayah.transliteration}
                    </p>
                  )}
                </div>

                {/* Minimalist Audio Control */}
                {individualAudio && (
                  <div className="flex justify-start pt-4">
                    <audio
                      controls
                      preload="none"
                      src={individualAudio}
                      className="w-full max-w-[260px] h-7 opacity-50 hover:opacity-100 transition-opacity rounded"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
    <div className="animate-fade-in w-full">
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #021711, #0a3526)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(197,168,128,0.08)', border: '1px solid rgba(197,168,128,0.3)' }}>
              <BookOpen className="w-4 h-4" style={{ color: '#c5a880' }} />
            </div>
            <span className="badge-gold text-[10px] tracking-wide uppercase px-2 py-0.5 rounded">Quran Reader</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>القرآن الكريم</h1>
          <p className="text-xs sm:text-sm text-emerald-100/50">The Noble Quran — 114 Surahs, 6,236 Ayahs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-100/30" />
          <input type="text" id="quran-search" name="quran-search" placeholder="Search surah name or number…" value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 text-sm py-2" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {error && <ErrorBanner message={error} onRetry={loadChapters} />}

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 18 }).map((_, i) => <ChapterSkeleton key={i} />)}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state py-10 text-center">
            <Search className="w-8 h-8 mx-auto opacity-20 mb-2" style={{ color: '#c5a880' }} />
            <p className="text-emerald-100/30 text-sm">No surahs match your search query.</p>
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
              <button key={`${num}-${idx}`} onClick={() => setSelectedChapter(ch)} className="card p-3 sm:p-4 text-left hover:scale-[1.03] active:scale-95 transition-all duration-150 space-y-2 focus:outline-none flex flex-col justify-between">
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold" style={{ background: 'rgba(197,168,128,0.08)', border: '1px solid rgba(197,168,128,0.25)', color: '#c5a880' }}>{num}</span>
                    {place && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium tracking-wide" style={{ background: place === 'makkah' ? 'rgba(197,168,128,0.1)' : 'rgba(125,180,200,0.1)', color: place === 'makkah' ? '#c5a880' : '#8fc4d9' }}>
                        {place === 'makkah' ? 'Makki' : 'Madani'}
                      </span>
                    )}
                  </div>
                  <p className="text-lg sm:text-xl text-right arabic-leading pt-1" lang="ar" style={{ fontFamily: 'Amiri, serif', color: '#f3ead9' }}>{nameAr}</p>
                </div>
                <div className="w-full pt-1 border-t border-emerald-950/30">
                  <p className="text-xs sm:text-sm font-semibold text-white truncate">{nameEn}</p>
                  {trans && <p className="text-[11px] text-emerald-100/35 truncate">{trans}</p>}
                  {verses && <p className="text-[10px] mt-0.5 font-medium" style={{ color: '#c5a880' }}>{verses} verses</p>}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}