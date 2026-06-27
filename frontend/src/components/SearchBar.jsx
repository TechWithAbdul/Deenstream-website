import React, { useState } from 'react'

export default function SearchBar({ onResults, onQueryChange, onSearch, placeholder='Search Quran, Hadith...' }){
  const [q, setQ] = useState('')

  async function submit(e){
    e && e.preventDefault()
    if(onSearch) return onSearch(q)
    // otherwise, use parent-provided search handler via onResults
    if(onResults){
      // parent handles API call
      onResults([])
    }
    if(onQueryChange) onQueryChange(q)
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input value={q} onChange={e=>setQ(e.target.value)} className="flex-1 px-3 py-2 rounded border" placeholder={placeholder} />
      <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Search</button>
    </form>
  )
}
