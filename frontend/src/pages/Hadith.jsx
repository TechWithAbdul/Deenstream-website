import React, { useEffect, useMemo, useState } from 'react'
import { fetchHadiths } from '../services/hadithService'
import { Search } from 'lucide-react'

export default function Hadith(){
  const [query, setQuery] = useState('')
  const [hadiths, setHadiths] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    let active = true
    async function load(){
      setLoading(true)
      try{
        const data = await fetchHadiths(query)
        if(active) setHadiths(data)
      }catch(err){
        console.error(err)
      }
      if(active) setLoading(false)
    }
    load()
    return ()=> { active = false }
  }, [query])

  const count = hadiths.length
  const list = useMemo(()=> hadiths.slice(0, 40), [hadiths])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 rounded-3xl bg-white/90 p-6 shadow-lg ring-1 ring-emerald-100">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Hadith Library</h1>
            <p className="mt-2 text-sm text-gray-600">Browse authentic narrations. Search by keyword in English or Arabic.</p>
          </div>
          <div className="w-full sm:w-80 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              value={query}
              onChange={e=>setQuery(e.target.value)}
              placeholder="Search hadiths"
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm shadow-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="text-sm text-gray-500">Showing {count} hadith(s) {query ? `for "${query}"` : ''}.</div>
        {loading ? (
          <div className="rounded-3xl bg-white/90 p-8 text-center text-gray-500 shadow-sm">Loading hadiths...</div>
        ) : list.length === 0 ? (
          <div className="rounded-3xl bg-white/90 p-8 text-center text-gray-500 shadow-sm">No hadiths found. Try another keyword.</div>
        ) : (
          list.map((item, idx) => (
            <article key={idx} className="rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-emerald-50">
              <p className="text-base leading-7 text-gray-800">{item.english}</p>
              <p className="mt-4 text-sm text-gray-500">{item.arabic}</p>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
