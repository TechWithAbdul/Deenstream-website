// src/pages/Quran.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { BookOpen, Search, Minus, Plus, Globe, AlertCircle } from 'lucide-react'
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
    <div className="card p-4 space-y-2 animate-pulse bg-emerald-950/10 border border-emerald-900/20 rounded-xl">
      <div className="h-4 bg-emerald-900/40 rounded w-8 mb-3" />
      <div className="h-5 bg-emerald-900/30 rounded w-32" />
      <div className="h-3 bg-emerald-900/20 rounded w-20" />
    </div>
  )
}

function AyahSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-emerald-900/20 bg-emerald-950/10 space-y-3 animate-pulse">
      <div className="h-8 bg-emerald-900/40 rounded w-full" />
      <div className="h-4 bg-emerald-900/30 rounded w-3/4" />
      <div className="h-4 bg-emerald-900/20 rounded w-1/2" />
    </div>
  )
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="p-4 rounded-xl border border-red-900/50 bg-red-950/20 text-red-200 flex items-start gap-3 text-xs mb-6">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
      <div className="flex-1">
        <p className="font-semibold text-stone-100">Could not load data</p>
        <p className="opacity-80 mt-0.5 text-red-300">{message}</p>
      </div>
      {onRetry && <button onClick={onRetry} className="shrink-0 text-xs font-semibold hover:underline text-[#c5a880]">Retry</button>}
    </div>
  )
}

function FullAudioPlayer({ audioUrl, title, subtitle }) {
  if (!audioUrl) return null;

  return (
    <div className="w-full p-4 rounded-xl border bg-black/40 border-emerald-900/30 mb-4 animate-fade-in shadow-inner flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="truncate flex-1">
        <p className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
          <span>Complete Recitation Player</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-[#c5a880] font-mono border border-emerald-900/40">AUDIO ON TOP</span>
        </p>
        <p className="text-[11px] text-emerald-100/60 truncate font-medium mt-0.5">
          {title} {subtitle ? `• ${subtitle}` : ''}
        </p>
      </div>
      
      <div className="shrink-0 w-full sm:w-auto max-w-xs">
        <audio
          controls
          preload="metadata"
          src={audioUrl}
          className="w-full sm:w-[200px] h-9 rounded-lg"
          style={{ colorScheme: 'dark' }}
        />
      </div>
    </div>
  );
}

function QuranContentReader({ viewMode, selectedItem, translation, fontSize, ayahs, loading, error, onRetry }) {
  const isSurah = viewMode === 'surah';
  
  const displayTitle = isSurah 
    ? (selectedItem?.name_english || selectedItem?.nameEnglish || selectedItem?.englishName || 'Loading Surah...')
    : `Juz ${selectedItem || ''}`;

  const displaySubtitle = isSurah 
    ? `${selectedItem?.verses_count || selectedItem?.numberOfAyahs || ayahs.length || 0} Verses`
    : `${ayahs.length} Verses Loaded`;
    
let fullAudioTrack = '';
  if (selectedItem) {
    if (isSurah) {
      const surahNum = selectedItem.number || selectedItem.id;
      if (surahNum) {
        const paddedNum = String(surahNum).padStart(3, '0');
        // Tier 1: Dedicated High-Availability Server
        fullAudioTrack = `https://server8.mp3quran.net/afs/${paddedNum}.mp3`;
      }
    } else {
      // Tier 2 (Juz Mode): Utilizing a completely flat, non-encoded, standardized directory 
      // hosted on an open-access global architecture that enforces correct CORS and MIME headers.
      const juzNum = String(selectedItem).padStart(2, '0');
      fullAudioTrack = `https://archive.org/download/juz-25_202302aaaa/Juz%20${juzNum}.mp3`;
    }
  }

  if (!selectedItem && !loading) {
    return (
      <div className="text-center py-12 border border-dashed border-emerald-900/20 rounded-xl bg-emerald-950/5">
        <p className="text-xs text-stone-400">Select a Surah or Juz from the sidebar index to begin reading.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex-1 w-full max-w-full">
      <div className="p-5 rounded-xl border text-center relative overflow-hidden bg-gradient-to-br from-[#021711] to-[#0a3526] border-emerald-900/30 shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{displayTitle}</h2>
        <p className="text-xs text-emerald-100/50 mb-2">{displaySubtitle}</p>
        
        {isSurah && selectedItem?.name_arabic && (
          <p className="text-2xl tracking-wide font-arabic mt-2 text-[#f3ead9]" style={{ fontFamily: 'Amiri, serif' }}>
            {selectedItem.name_arabic}
          </p>
        )}
      </div>

      {!loading && !error && fullAudioTrack && (
        <FullAudioPlayer 
          audioUrl={fullAudioTrack} 
          title={displayTitle} 
          subtitle={isSurah ? selectedItem?.name_arabic : 'Full Part Recitation'}
        />
      )}

      {isSurah && selectedItem?.number !== 1 && selectedItem?.id !== 1 && (
        <div className="text-center py-2">
          <p className="text-2xl sm:text-3xl tracking-wide font-arabic text-[#c5a880]" lang="ar" style={{ fontFamily: 'Amiri, serif', lineHeight: '2' }}>
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </p>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#c5a880]/30 to-transparent mx-auto mt-2" />
        </div>
      )}

      <div className="space-y-4 pb-16">
        {error && <ErrorBanner message={error} onRetry={onRetry} />}
        {loading && Array.from({ length: 4 }).map((_, i) => <AyahSkeleton key={i} />)}

        {!loading && !error && ayahs.length === 0 && (
          <div className="text-center py-12 border border-dashed border-stone-800 rounded-xl bg-emerald-950/5">
            <p className="text-sm text-stone-500">No verses could be read from this selection format.</p>
          </div>
        )}

        {!loading && !error && ayahs.map((ayah, idx) => {
          const arabicText = ayah.arabic || '';
          const currentVerseNum = ayah.ayah || ayah.verse_number || (idx + 1);
          
          let verseTranslation = '';
          if (ayah.translations) {
            if (typeof ayah.translations === 'string') verseTranslation = ayah.translations;
            else if (ayah.translations[translation]) verseTranslation = ayah.translations[translation];
            else if (ayah.translations.sahih_international) verseTranslation = ayah.translations.sahih_international;
          } else if (ayah.translation) {
            verseTranslation = typeof ayah.translation === 'string' ? ayah.translation : (ayah.translation.text || '');
          } else if (ayah.text && translation !== 'sahih_international') {
            verseTranslation = ayah.text;
          }

          const individualAudio = ayah.audio?.ayah_audio || ayah.audio?.audio_url || '';

          return (
            <div
              key={`${ayah.verse_key || currentVerseNum}-${idx}`}
              className="p-4 sm:p-6 rounded-xl border transition-all duration-200 bg-emerald-950/10 border-emerald-900/20 hover:border-emerald-800/40 shadow-sm"
            >
              <div className="w-full text-right mb-4" style={{ direction: 'rtl' }}>
                <p 
                  className="leading-loose text-right inline-block break-words w-full font-arabic" 
                  lang="ar" 
                  style={{ 
                    fontFamily: 'Amiri, serif', 
                    fontSize: `${fontSize}px`, 
                    color: '#f3ead9',
                    lineHeight: '2.3'
                  }}
                >
                  {arabicText || '—'}
                  <span className="text-xl sm:text-2xl mr-2 text-amber-200/60 inline-block font-serif select-none" style={{ color: '#c5a880' }}>
                    ﴿{currentVerseNum}﴾
                  </span>
                </p>
              </div>

              <div className="border-t pt-3.5 text-left border-emerald-900/10">
                <p className="text-sm sm:text-base leading-relaxed text-stone-200">
                  <span className="font-semibold text-xs mr-2 select-none" style={{ color: '#c5a880' }}>{currentVerseNum}.</span>
                  {verseTranslation || <span className="text-xs text-stone-500 italic">Translation unavailable for this translation toggle.</span>}
                </p>
                
                {ayah.transliteration && (
                  <p className="text-xs text-emerald-100/30 mt-1.5 italic font-sans">
                    {ayah.transliteration}
                  </p>
                )}
              </div>

              {individualAudio && (
                <div className="flex justify-start pt-4">
                  <audio
                    controls
                    preload="none"
                    src={individualAudio}
                    className="w-full max-w-[260px] h-7 opacity-40 hover:opacity-100 transition-opacity rounded"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Quran() {
  const [viewMode, setViewMode] = useState('surah'); 
  const [chapters, setChapters] = useState([])
  const [chaptersLoading, setChaptersLoading] = useState(true)
  const [chaptersError, setChaptersError] = useState(null)
  
  const [search, setSearch] = useState('')
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [selectedJuz, setSelectedJuz] = useState(null)
  
  const [ayahs, setAyahs] = useState([])
  const [readerLoading, setReaderLoading] = useState(false)
  const [readerError, setReaderError] = useState(null)
  const [translation, setTranslation] = useState('sahih_international') 
  const [fontSize, setFontSize] = useState(28)

  const loadChapters = useCallback(async () => {
    setChaptersLoading(true); setChaptersError(null)
    try {
      const res = await quranApi.getChapters()
      const list = Array.isArray(res.data) ? res.data : (res.data?.chapters || [])
      setChapters(list)
      if (list.length > 0 && !selectedChapter) {
        setSelectedChapter(list[0]);
      }
    } catch (err) {
      setChaptersError(err?.message || 'Failed to load index chapters.')
    } finally {
      setChaptersLoading(false)
    }
  }, [selectedChapter])

  useEffect(() => { loadChapters() }, [])

  const loadReaderData = useCallback(async () => {
    setReaderLoading(true); setReaderError(null);
    try {
      let res;
      if (viewMode === 'surah' && selectedChapter) {
        res = await quranApi.getSurah(selectedChapter.number || selectedChapter.id, translation);
      } else if (viewMode === 'juz' && selectedJuz) {
        res = await fetch(`https://ummahapi.com/api/quran/juz/${selectedJuz}`).then(r => r.json());
      } else {
        return;
      }

      const data = res?.data || res || {};
      let list = data.verses || data.ayahs || data.data?.verses || data.data?.ayahs || [];
      if (!Array.isArray(list) && Array.isArray(data)) list = data;

      setAyahs(Array.isArray(list) ? list : []);
    } catch (err) {
      setReaderError(err?.message || 'Failed to sync textual content vectors.');
    } finally {
      setReaderLoading(false);
    }
  }, [viewMode, selectedChapter, selectedJuz, translation]);

  useEffect(() => {
    loadReaderData();
  }, [loadReaderData]);

  useEffect(() => {
    if (viewMode === 'juz' && !selectedJuz) {
      setSelectedJuz(1);
    }
  }, [viewMode, selectedJuz]);

  const filteredChapters = (chapters || []).filter(ch => {
    const q = search.toLowerCase()
    return (
      (ch.name_english || ch.nameEnglish || ch.englishName || '').toLowerCase().includes(q) ||
      (ch.name_translation || ch.englishNameTranslation || '').toLowerCase().includes(q) ||
      String(ch.number || ch.id || '').includes(q)
    )
  })

  return (
    <div className="min-h-screen text-stone-200 overflow-x-hidden antialiased flex flex-col" style={{ backgroundColor: '#020e0b' }}>
      
      <div className="w-full border-b backdrop-blur-md sticky top-0 z-40 bg-[#02140f]/95 border-emerald-900/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-950/60 border border-emerald-800/40">
              <BookOpen className="w-4 h-4 text-[#c5a880]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Noble Quran Interactive</h1>
              <p className="text-[10px] text-emerald-100/40">Read and Listen dynamically</p>
            </div>
          </div>

          <div className="flex items-center justify-end w-full sm:w-auto gap-2.5">
            <div className="flex items-center gap-1 rounded-lg px-2 py-1 bg-black/40 border border-emerald-900/40">
              <button onClick={() => setFontSize(s => Math.max(20, s - 2))} className="p-1 text-stone-400 hover:text-white transition-colors"><Minus className="w-3 h-3" /></button>
              <span className="text-xs font-mono text-[#c5a880] w-8 text-center select-none font-bold">{fontSize}px</span>
              <button onClick={() => setFontSize(s => Math.min(46, s + 2))} className="p-1 text-stone-400 hover:text-white transition-colors"><Plus className="w-3 h-3" /></button>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 bg-black/40 border border-emerald-900/40 focus-within:border-[#c5a880]/50 transition-colors">
              <Globe className="w-3.5 h-3.5 text-emerald-100/40 shrink-0" />
              <select 
                value={translation} 
                onChange={e => setTranslation(e.target.value)} 
                className="text-xs font-semibold text-stone-200 bg-transparent outline-none cursor-pointer pr-1 py-0.5"
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

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="lg:col-span-4 bg-black/20 border border-emerald-900/20 rounded-2xl p-4 space-y-4 lg:sticky lg:top-20 max-h-[calc(100vh-6rem)] overflow-y-auto shadow-inner">
          
          <div className="grid grid-cols-2 p-1 rounded-xl bg-black/40 border border-emerald-900/30">
            <button 
              onClick={() => setViewMode('surah')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'surah' ? 'bg-[#c5a880] text-[#020e0b]' : 'text-stone-400 hover:text-white'}`}
            >
              Surah Index
            </button>
            <button 
              onClick={() => setViewMode('juz')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'juz' ? 'bg-[#c5a880] text-[#020e0b]' : 'text-stone-400 hover:text-white'}`}
            >
              Juz (Parts)
            </button>
          </div>

          {viewMode === 'surah' && (
            <div className="space-y-3">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-100/30" />
                <input 
                  type="text" 
                  placeholder="Filter Surah names..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  className="w-full bg-black/40 border border-emerald-900/40 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-[#c5a880]/50" 
                />
              </div>

              <div className="space-y-1.5 overflow-y-auto max-h-[50vh] pr-1">
                {chaptersError && <ErrorBanner message={chaptersError} onRetry={loadChapters} />}
                {chaptersLoading && Array.from({ length: 8 }).map((_, i) => <ChapterSkeleton key={i} />)}
                
                {!chaptersLoading && filteredChapters.length === 0 && (
                  <p className="text-center text-xs text-stone-600 py-6">No matching Surah found.</p>
                )}

                {!chaptersLoading && filteredChapters.map((ch, idx) => {
                  const num = ch.number || ch.id || (idx + 1);
                  const isSelected = selectedChapter && (selectedChapter.id === ch.id || selectedChapter.number === ch.number);
                  return (
                    <button
                      key={`sidebar-${num}-${idx}`}
                      onClick={() => setSelectedChapter(ch)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected 
                          ? 'bg-emerald-950/40 border-[#c5a880]/60 shadow-sm' 
                          : 'bg-transparent border-transparent hover:bg-emerald-950/20 hover:border-emerald-900/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span className="w-6 h-6 rounded-lg font-mono text-[10px] font-bold flex items-center justify-center bg-black/40 border border-emerald-900/40 text-[#c5a880]">
                          {num}
                        </span>
                        <div className="truncate">
                          <p className="text-xs font-bold text-white truncate">{ch.name_english || ch.englishName || ''}</p>
                          <p className="text-[10px] text-stone-500 truncate">{ch.name_translation || ch.englishNameTranslation || ''}</p>
                        </div>
                      </div>
                      <p className="text-sm font-arabic text-emerald-300 pl-2" style={{ fontFamily: 'Amiri, serif' }}>
                        {ch.name_arabic || ch.nameArabic || ''}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === 'juz' && (
            <div className="space-y-1 overflow-y-auto max-h-[62vh] pr-1">
              <p className="text-[10px] text-emerald-400/60 font-mono tracking-wider uppercase pl-1 mb-2">Select a reading Juz</p>
              <div className="grid grid-cols-2 gap-1.5">
                {Array.from({ length: 30 }).map((_, i) => {
                  const juzNum = i + 1;
                  const isSelected = selectedJuz === juzNum;
                  return (
                    <button
                      key={`juz-btn-${juzNum}`}
                      onClick={() => setSelectedJuz(juzNum)}
                      className={`p-2.5 rounded-xl border font-mono text-xs font-bold transition-all text-center flex flex-col justify-center items-center ${
                        isSelected 
                          ? 'bg-emerald-950/40 border-[#c5a880] text-[#c5a880]' 
                          : 'bg-black/20 border-emerald-900/40 hover:border-emerald-800 text-stone-400 hover:text-white'
                      }`}
                    >
                      <span>JUZ {juzNum}</span>
                      <span className="text-[9px] font-sans opacity-40 font-normal">Part {juzNum}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        <div className="lg:col-span-8 w-full min-h-[70vh]">
          <QuranContentReader
            viewMode={viewMode}
            selectedItem={viewMode === 'surah' ? selectedChapter : selectedJuz}
            translation={translation}
            fontSize={fontSize}
            ayahs={ayahs}
            loading={readerLoading}
            error={readerError}
            onRetry={loadReaderData}
          />
        </div>

      </div>
    </div>
  )
}