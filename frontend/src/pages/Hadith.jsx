// src/pages/Hadith.jsx
import React, { useState, useEffect, useCallback } from 'react'
<<<<<<< HEAD
import { 
  Scroll, ChevronLeft, ChevronRight, BookOpen, AlertCircle, 
  Copy, Check, UserCheck, Sliders, ShieldCheck, Search, Tag, Layers
} from 'lucide-react'
=======
import { Scroll, ChevronLeft, ChevronRight, BookOpen, AlertCircle, Copy, Check, Type, Share2 } from 'lucide-react'
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
import { hadithApi } from '../services/api'

const COLLECTION_TAG = {
  bukhari: 'Most Authentic', muslim: 'Sahih', abudawud: 'Sunan', tirmidhi: 'Jami',
  nasai: 'Sunan', ibnmajah: 'Sunan', malik: 'Muwatta',
}

<<<<<<< HEAD
const BOOK_IMAGES = {
  bukhari: 'https://cdn.shopify.com/s/files/1/0860/7668/6627/files/Sahih-Bukhari-Urdu-Complete-Set-8-Volumes-Premium-Edition-Maktaba-Quddusia-36794893697315_c7f61b2e-d969-4b06-9929-5afe4b78d175.png?v=1778491146',
  muslim: 'https://cdn.shopify.com/s/files/1/0860/7668/6627/files/Sahih-Muslim-Complete-Edition-3-Volumes-Standard-Edition-Maktaba-Quddusia-40972207096099.png?v=1768648159',
  abudawud: 'https://cdn.shopify.com/s/files/1/0860/7668/6627/files/Sunan-Abu-Daood-Urdu-Complete-Set-Maktaba-Quddusia-40978707513635.png?v=1768648351',
  tirmidhi: 'https://cdn.shopify.com/s/files/1/0860/7668/6627/files/Jamia-Tirmizi-2-Volume-Set-Standard-Edition-Maktaba-Quddusia-40972199690531.png?v=1768648159',
  nasai: 'https://cdn.shopify.com/s/files/1/0860/7668/6627/files/Sunan-Nasai-2-Volume-Set-Standard-Edition-Maktaba-Quddusia-40972248219939.png?v=1768648158',
  ibnmajah: 'https://cdn.shopify.com/s/files/1/0860/7668/6627/files/Sunan-Ibn-Majah-3-Vol-Set-Maktaba-Quddusia-41012330561827.png?v=1768648133',
  malik: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp0ttS9zG8YAwBxOLV6TRp5onkgbaydzDwg-xGTklxVw&s',
  default: 'https://photo-cdn.urdupoint.com/show_img_new/islam/images/150x150/default.png._1'
}

const SCHOLAR_PROFILES = {
  bukhari: {
    name: 'Imam Al-Bukhari',
    era: '194 AH – 256 AH',
    bio: 'Collected authentic sayings using strict verification rules for narrator integrity.',
    works: ['Sahih al-Bukhari', 'Al-Adab al-Mufrad']
  },
  muslim: {
    name: 'Imam Muslim',
    era: '206 AH – 261 AH',
    bio: 'Famous for his superb structural arrangement of matching narration paths.',
    works: ['Sahih Muslim']
  },
  abudawud: {
    name: 'Imam Abu Dawud',
    era: '202 AH – 275 AH',
    bio: 'Focused heavily on traditions containing legal rulings used by Islamic jurists.',
    works: ['Sunan Abi Dawud']
  },
  tirmidhi: {
    name: 'Imam At-Tirmidhi',
    era: '209 AH – 279 AH',
    bio: 'Introduced clear grading scales to check if statements are authentic, good, or weak.',
    works: ['Jami\' at-Tirmidhi']
  },
  nasai: {
    name: 'Imam Al-Nasa\'i',
    era: '215 AH – 303 AH',
    bio: 'Formulated remarkably precise evaluation rules for reviewing critical texts.',
    works: ['Sunan al-Sughra']
  },
  ibnmajah: {
    name: 'Imam Ibn Majah',
    era: '209 AH – 273 AH',
    bio: 'Highly praised for his organized presentation and easy-to-use chapter systems.',
    works: ['Sunan Ibn Majah']
  },
  malik: {
    name: 'Imam Malik',
    era: '93 AH – 179 AH',
    bio: 'Compiled the earliest written book of law based on the early practices of Medina.',
    works: ['Al-Muwatta']
  },
  default: {
    name: 'Hadith Collections',
    era: 'Prophetic Traditions',
    bio: 'Preserved archives of the actions, sayings, and silent approvals of Prophet Muhammad ﷺ.',
    works: ['Kutub al-Sittah', 'Muwatta Malik']
=======
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
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
  }
}

<<<<<<< HEAD
const PRESET_SEARCH_TAGS = [
  'Faith', 'Prayer', 'Zakat', 'Fasting', 'Hajj', 'Good Manners', 'Knowledge', 'Dua'
];

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
    <div className="rounded-xl border p-3 flex flex-col justify-between h-60 border-emerald-900/40 bg-emerald-950/10 animate-pulse">
      <div className="h-32 bg-emerald-900/20 rounded-lg w-full" />
      <div className="space-y-2 mt-2">
        <div className="h-3 bg-emerald-900/40 rounded w-3/4 mx-auto" />
        <div className="h-2 bg-emerald-900/30 rounded w-1/2 mx-auto" />
=======
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
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
      </div>
    </div>
  )
}

<<<<<<< HEAD
function Skeleton() {
  return (
    <div className="rounded-xl border p-5 space-y-4 border-emerald-900/40 bg-emerald-950/10 animate-pulse">
      <div className="flex justify-between items-center pb-2">
        <div className="h-4 bg-emerald-900/40 rounded w-24" />
        <div className="h-4 bg-emerald-900/30 rounded w-12" />
      </div>
      <div className="h-12 bg-emerald-900/20 rounded w-full" />
      <div className="h-8 bg-emerald-900/10 rounded w-full" />
    </div>
  )
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="p-4 rounded-xl border border-red-900/50 bg-red-950/20 text-red-200 flex items-start gap-3 text-xs mb-6">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
      <div className="flex-1">
        <p className="font-semibold text-stone-100">Could not sync data</p>
        <p className="opacity-90 mt-0.5 text-red-300">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="text-xs font-semibold hover:underline shrink-0 text-[#c5a880]">
          Try Again
        </button>
      )}
    </div>
  )
}

function HadithCard({ hadith, collectionName, textSize, indexId }) {
  const [copied, setCopied] = useState(false)
  
  const num = hadith.hadithnumber || hadith.hadith_number || hadith.number || hadith.id
  const arabic = hadith.arabic || ''
  const english = hadith.english || hadith.text_en || hadith.translation || ''
  const grade = hadith.grade || null

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
    if (clean.includes('sahih') || clean.includes('authentic')) return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' };
    if (clean.includes('daif') || clean.includes('weak')) return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' };
    return { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' };
  };

  const gradeStyle = grade ? getGradeStyle(grade) : null;

  const arabicSizes = { sm: '18px', md: '22px', lg: '28px' };
  const englishSizes = { sm: '13px', md: '15px', lg: '17px' };

  return (
    <div 
      id={`hadith-node-${indexId}`}
      className="rounded-xl border transition-all duration-300 overflow-hidden shadow-md bg-emerald-950/20 border-emerald-900/30 scroll-mt-6"
    >
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-emerald-900/20 bg-black/40">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#d4af37] bg-[#c5a880]/10 border border-[#c5a880]/20">
            HADITH #{num}
          </span>
          {grade && (
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold border uppercase" style={{ backgroundColor: gradeStyle.bg, color: gradeStyle.text, borderColor: gradeStyle.border }}>
              {grade}
            </span>
          )}
        </div>

        <button onClick={handleCopy} className="p-1 text-stone-400 hover:text-[#c5a880] transition-colors rounded hover:bg-emerald-950/40" title="Copy Hadith">
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="p-5 space-y-4">
        {arabic && (
          <div className="w-full" style={{ direction: 'rtl' }}>
            <p 
              className="leading-relaxed text-right font-arabic antialiased text-stone-100" 
              lang="ar" 
              style={{ fontFamily: 'Amiri, serif', fontSize: arabicSizes[textSize], lineHeight: '2.2' }}
            >
              {arabic}
            </p>
          </div>
        )}

        {english && (
          <div className="border-t border-emerald-900/10 pt-3 text-left">
            <p className="leading-relaxed text-emerald-100/90" style={{ fontSize: englishSizes[textSize] }}>
              {narrator && <strong className="text-[#d4af37] font-medium block mb-1 text-xs uppercase tracking-wider">{narrator}</strong>}
              "{narrator ? english.substring(narrator.length).trim() : english}"
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

=======
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
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
<<<<<<< HEAD
  const [textSize, setTextSize] = useState('md') 
  const [searchQuery, setSearchQuery] = useState('')
=======
  const [textSize, setTextSize] = useState('md') // 'sm' | 'md' | 'lg'
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
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
<<<<<<< HEAD
      setCollectionsError(err?.message || 'Failed to connect to the Hadith server.')
=======
      setCollectionsError(err?.message || 'Failed to load hadith collections.')
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
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
<<<<<<< HEAD
      setError(err?.message || 'Failed to load Hadiths.')
=======
      setError(err?.message || 'Failed to load hadiths.')
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (selected) loadHadiths(selected.slug, page) }, [selected, page, loadHadiths])

  const handleSelect = (col, idx) => { 
    const verifiedSlug = SLUG_NORMALIZER(col, idx);
<<<<<<< HEAD
    setSelected({ 
      slug: verifiedSlug, 
      name: col.name || col.title || verifiedSlug,
      totalCount: col.hadith_count || col.count || col.total || '—'
    }); 
    setPage(1); 
    setHadiths([]); 
    setError(null);
    setSearchQuery('');
  }

  const handleTagClick = (tag) => {
    setSearchQuery(tag === searchQuery ? '' : tag);
  };

  const scrollToNode = (idx) => {
    const el = document.getElementById(`hadith-node-${idx}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const currentScholarKey = selected ? selected.slug : 'default'
  const activeScholar = SCHOLAR_PROFILES[currentScholarKey] || SCHOLAR_PROFILES['default']

  const filteredHadiths = hadiths.filter(h => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const num = String(h.hadithnumber || h.hadith_number || h.number || h.id);
    const textAr = (h.arabic || '').toLowerCase();
    const textEn = (h.english || h.text_en || h.translation || '').toLowerCase();
    const gr = (h.grade || '').toLowerCase();
    return num.includes(q) || textAr.includes(q) || textEn.includes(q) || gr.includes(q);
  });

  return (
    <div className="min-h-screen text-stone-200 overflow-x-hidden antialiased selection:bg-[#c5a880]/30" style={{ backgroundColor: '#010907' }}>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative z-10">
        
        {/* TOP COMPACT BRAND HEADER */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-emerald-900/20">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
            <span className="text-[11px] uppercase font-mono font-bold tracking-wider text-emerald-400">Hadith Library Platform</span>
          </div>
          {selected && (
            <button onClick={() => setSelected(null)} className="px-3 py-1 text-xs font-medium text-[#c5a880] hover:text-white bg-emerald-950/40 transition-all rounded border border-emerald-900/40">
              ← Back to Bookshelf
            </button>
          )}
        </div>

        {/* WORKSPACE MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDEBAR SECTION (4 Columns) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* VIEW A: Grid list of book shelves */}
            {!selected ? (
              <div className="space-y-4">
                <p className="text-xs font-bold tracking-wider text-emerald-300 uppercase pl-0.5 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Available Books
                </p>

                {collectionsError && <ErrorBanner message={collectionsError} onRetry={loadCollections} />}
                
                <div className="grid grid-cols-2 gap-4">
                  {collectionsLoading && Array.from({ length: 6 }).map((_, i) => <CollectionSkeleton key={i} />)}

                  {!collectionsLoading && collections.map((col, idx) => {
                    const name = col.name || col.title || 'Collection'
                    const count = col.hadith_count || col.count || col.total || '—'
                    const displaySlug = SLUG_NORMALIZER(col, idx)
                    const tag = COLLECTION_TAG[displaySlug] || 'Hadith Book'
                    const coverImage = BOOK_IMAGES[displaySlug] || BOOK_IMAGES.default

                    return (
                      <button
                        key={`${displaySlug}-${idx}`}
                        onClick={() => handleSelect({ ...col, name }, idx)}
                        className="rounded-xl border transition-all duration-300 group bg-emerald-950/10 border-emerald-900/30 hover:border-[#c5a880]/60 overflow-hidden shadow flex flex-col h-64 text-left"
                      >
                        {/* FULLY DIRECT UNALTERED IMAGE COVER ASSET CONTAINER */}
                        <div className="w-full h-36 overflow-hidden relative">
                          <img 
                            src={coverImage} 
                            alt={name} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                          />
                        </div>

                        {/* Title Context Data Box */}
                        <div className="p-3 bg-black/40 flex-1 flex flex-col justify-between border-t border-emerald-900/20">
                          <div>
                            <p className="text-[12px] font-bold text-stone-100 line-clamp-1 tracking-wide">{name}</p>
                            <p className="text-[10px] text-emerald-400 font-medium pt-0.5">{tag}</p>
                          </div>
                          <p className="text-[10px] font-mono font-bold text-[#c5a880]">{count} Hadiths</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              // VIEW B: Selected individual book viewer side header card
              <div className="space-y-4">
                <p className="text-xs font-bold tracking-wider text-emerald-300 uppercase pl-0.5">
                  Selected Book
                </p>
                
                <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/10 overflow-hidden shadow-md">
                  {/* FULL VISIBILITY PERMANENT ATMOSPHERIC GRAPHIC */}
                  <div className="w-full h-44 overflow-hidden">
                    <img 
                      src={BOOK_IMAGES[selected.slug] || BOOK_IMAGES.default} 
                      alt={selected.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  <div className="p-4 bg-black/40 space-y-2 border-t border-emerald-900/20">
                    <h3 className="text-sm font-bold text-stone-100 tracking-wide">{selected.name}</h3>
                    
                    {/* Simplified metadata descriptors underneath text item names */}
                    <div className="pt-2 border-t border-emerald-900/10 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-stone-400">Total Size:</span>
                      <span className="font-bold text-[#c5a880]">{selected.totalCount} Hadiths</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-stone-400">Active Location:</span>
                      <span className="font-bold text-emerald-400">Page {page}</span>
                    </div>
                  </div>
                </div>

                {/* SEARCH AND FILTER BOX */}
                <div className="p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/10 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                    <Search className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>Search Book</span>
                  </div>
                  
                  <div className="relative">
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Type a word, topic, or number..."
                      className="w-full bg-black/40 border border-emerald-900/40 rounded px-2.5 py-1.5 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-[#c5a880]/50"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-2 top-2 text-[10px] text-emerald-400 hover:text-stone-100">
                        Clear
                      </button>
                    )}
                  </div>

                  {/* QUICK TOPICS SELECTION ROW */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {PRESET_SEARCH_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={`text-[10px] px-2 py-0.5 rounded transition-all border ${
                          searchQuery === tag 
                            ? 'bg-[#c5a880] text-[#010907] border-[#c5a880] font-medium' 
                            : 'bg-black/20 border-emerald-900/40 text-emerald-300 hover:border-emerald-700'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TABLE OF CONTENTS PAGE CODES INDEX GRID */}
                {!loading && filteredHadiths.length > 0 && (
                  <div className="p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/10 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                      <Layers className="w-3.5 h-3.5 text-[#c5a880]" />
                      <span>On This Page</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1 pt-1 max-h-28 overflow-y-auto">
                      {filteredHadiths.map((h, index) => {
                        const cellNum = h.hadithnumber || h.hadith_number || h.number || h.id;
                        return (
                          <button
                            key={index}
                            onClick={() => scrollToNode(index)}
                            className="p-1 text-[10px] text-center font-mono rounded bg-black/30 border border-emerald-900/30 hover:border-[#c5a880] text-stone-300 hover:text-white transition-colors"
                          >
                            #{cellNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MAIN HADITH READING TEXT HUB CONTAINER (5 Columns) */}
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-bold tracking-wider text-emerald-300 uppercase pl-0.5 flex items-center gap-2">
              <Scroll className="w-4 h-4" /> Hadith Text
            </p>

            {!selected ? (
              <div className="text-center py-24 rounded-xl border border-dashed border-emerald-900/20 bg-emerald-950/5">
                <p className="text-xs text-stone-400 max-w-xs mx-auto px-4">
                  Please pick a book from the shelf column to view its chapters and lines of text.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {error && <ErrorBanner message={error} onRetry={() => loadHadiths(selected.slug, page)} />}
                {loading && Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} />)}

                {!loading && !error && filteredHadiths.length === 0 && (
                  <div className="text-center py-16 border border-dashed rounded-xl border-emerald-900/20 bg-emerald-950/5">
                    <p className="text-xs text-stone-400">No results found matching your search word filter.</p>
                  </div>
                )}

                {!loading && !error && filteredHadiths.map((h, i) => (
                  <HadithCard key={h.id || `${selected.slug}-${page}-${i}`} indexId={i} hadith={h} collectionName={selected.name} textSize={textSize} />
                ))}

                {/* PAGINATION PANEL FOOTER COMPANION */}
                {!loading && hadiths.length > 0 && (
                  <div className="flex items-center justify-between pt-2">
                    <button 
                      onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
                      disabled={page === 1} 
                      className="text-xs font-medium px-2.5 py-1.5 disabled:opacity-20 text-stone-300 hover:text-white transition-colors bg-emerald-950/20 border border-emerald-900/30 rounded"
                    >
                      ← Previous Page
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {[page - 1, page, page + 1].filter(n => n >= 1).map(n => (
                        <button 
                          key={n} 
                          onClick={() => { setPage(n); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
                          className="w-6 h-6 rounded text-[10px] font-mono transition-all"
                          style={n === page ? { background: '#c5a880', color: '#010907', fontWeight: 'bold' } : { color: 'rgba(252,246,232,0.8)', backgroundColor: 'rgba(4,32,24,0.3)', border: '1px solid rgba(16,185,129,0.1)' }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => { setPage(p => p + 1); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
                      disabled={!hasMore} 
                      className="text-xs font-medium px-2.5 py-1.5 disabled:opacity-20 text-stone-300 hover:text-white transition-colors bg-emerald-950/20 border border-emerald-900/30 rounded"
                    >
                      Next Page →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT BIOGRAPHY & CONTROLS DASHBOARD (3 Columns) */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Scholar Narrative Card */}
            <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/10 p-4 space-y-3 shadow shadow-emerald-950">
              <div className="flex items-center gap-2 border-b border-emerald-900/10 pb-2.5">
                <div className="w-7 h-7 rounded-full border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] bg-black">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-100">{activeScholar.name}</h4>
                  <p className="text-[10px] font-mono font-medium text-[#c5a880]">{activeScholar.era}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Author Bio</p>
                <p className="text-[12px] text-stone-300 leading-relaxed font-normal">{activeScholar.bio}</p>
              </div>

              <div className="space-y-1 pt-1 border-t border-emerald-900/10">
                <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Famous Works</p>
                <div className="space-y-1">
                  {activeScholar.works.map((work, idx) => (
                    <div key={idx} className="text-[11px] text-stone-200 bg-black/20 px-2 py-0.5 rounded border border-emerald-950 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#c5a880]" />
                      <span className="truncate">{work}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Layout Font Tuning Options */}
            <div className="p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/10 space-y-3">
              <p className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" /> Text Settings
              </p>
              
              <div className="space-y-1">
                <span className="text-[11px] block text-stone-400">Adjust Reading Size</span>
                <div className="grid grid-cols-3 gap-0.5 bg-black/40 rounded border border-emerald-950 p-0.5">
                  {['sm', 'md', 'lg'].map((sz) => (
                    <button 
                      key={sz} 
                      onClick={() => setTextSize(sz)}
                      className="py-1 rounded text-[10px] font-mono uppercase font-bold transition-all"
                      style={textSize === sz ? { background: '#c5a880', color: '#010907' } : { color: 'rgba(252,246,232,0.6)' }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

=======
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
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
      </div>
    </div>
  )
}