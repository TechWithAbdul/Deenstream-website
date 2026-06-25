import React, {useState, useEffect, useRef} from 'react'
import useDebounce from '../hooks/useDebounce'
import { searchAyah } from '../services/quranService'
import { Search, X, Loader2 } from 'lucide-react'

function highlightText(text = '', query = ''){
  if(!query) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`(${escaped})`, 'ig')
  return text.split(re).map((part, i) => re.test(part) ? <mark key={i} className="bg-yellow-100 rounded px-0.5">{part}</mark> : part)
}

export default function SearchBar({onResults, onNavigate, onQueryChange}){
  const [q, setQ] = useState('')
  const debounced = useDebounce(q, 350)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef(null)

  useEffect(()=>{
    if(!debounced || debounced.length < 2){ setSuggestions([]); onResults && onResults([]); setOpen(false); return }
    let mounted = true
    setLoading(true)
    searchAyah(debounced).then(r=>{
      if(!mounted) return
      const items = Array.isArray(r) ? r : (r.results || r)
      setSuggestions(items.slice(0,8))
      onResults && onResults(items)
      setOpen(true)
    }).catch(err=>{
      console.error(err)
      setSuggestions([])
      onResults && onResults([])
    }).finally(()=> mounted && setLoading(false))

    return ()=> mounted = false
  },[debounced])

  useEffect(()=>{
    function onDocClick(e){
      if(containerRef.current && !containerRef.current.contains(e.target)){
        setOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener('click', onDocClick)
    return ()=> document.removeEventListener('click', onDocClick)
  },[])

  function parseLocation(item){
    if(!item) return {surah:null, ayah:null}
    if(item.verse_key){
      const [s,a] = item.verse_key.split(':').map(Number)
      return {surah:s, ayah:a}
    }
    if(item.surah && item.ayah){
      return {surah: item.surah, ayah: item.ayah}
    }
    if(item.chapter && item.verse){
      return {surah: item.chapter, ayah: item.verse}
    }
    if(item.metadata && item.metadata.chapter && item.metadata.verse){
      return {surah: item.metadata.chapter, ayah: item.metadata.verse}
    }
    return {surah: null, ayah: null}
  }

  function handleKey(e){
    if(!open) return
    if(e.key === 'ArrowDown'){
      e.preventDefault(); setActiveIndex(i => Math.min(i+1, suggestions.length-1))
    }else if(e.key === 'ArrowUp'){
      e.preventDefault(); setActiveIndex(i => Math.max(i-1, 0))
    }else if(e.key === 'Enter'){
      e.preventDefault(); const item = suggestions[activeIndex] || suggestions[0]; if(item){ const loc = parseLocation(item); if(loc.surah) onNavigate && onNavigate(loc.surah, loc.ayah); setOpen(false)}
    }else if(e.key === 'Escape'){
      setOpen(false); setActiveIndex(-1)
    }
  }

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKey}>
      <div className="flex items-center gap-2">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Search size={16} /></div>
        <input aria-label="Search Quran" value={q} onChange={e=>{setQ(e.target.value); setActiveIndex(-1); onQueryChange && onQueryChange(e.target.value)}} onFocus={()=> q.length>=2 && suggestions.length>0 && setOpen(true)} placeholder="Search Quran: words, phrase, or root" className="w-full pl-10 pr-10 p-3 rounded border" />
        {q && <button onClick={()=>{ setQ(''); setSuggestions([]); onResults && onResults([]); setOpen(false); onQueryChange && onQueryChange('') }} className="absolute right-2 top-2 text-gray-500"><X size={16} /></button>}
        {loading && <div className="absolute right-8 top-2 text-gray-500"><Loader2 className="animate-spin" size={16} /></div>}
      </div>

      {open && suggestions && suggestions.length>0 && (
        <div className="mt-2 bg-white/95 border rounded shadow max-h-64 overflow-auto z-40">
          {suggestions.map((s, idx)=>{
            const loc = parseLocation(s)
            const title = s.verse_key || (loc.surah ? `S${loc.surah}:A${loc.ayah}` : `Result ${idx+1}`)
            const snippet = s.text || s.excerpt || s.translation || s.verse || ''
            return (
              <div key={idx} onMouseEnter={()=>setActiveIndex(idx)} onClick={()=>{ const loc2 = parseLocation(s); if(loc2.surah) onNavigate && onNavigate(loc2.surah, loc2.ayah); setOpen(false) }} className={`p-3 flex justify-between items-start cursor-pointer ${activeIndex===idx? 'bg-emerald-50':''}`}>
                <div className="flex-1">
                  <div className="text-sm text-gray-800">{highlightText(snippet, q)}</div>
                  <div className="text-xs text-gray-500 mt-1">{title} {s.translation && <span>• {s.translation}</span>}</div>
                </div>
                <div className="ml-3">
                  <button className="px-3 py-1 rounded bg-primary text-white text-sm">Open</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
