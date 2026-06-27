import React, { useState, useEffect } from 'react'
import SurahList from '../components/SurahList'
import SurahReader from '../components/SurahReader'
import SearchBar from '../components/SearchBar'
import Loader from '../components/Loader'
import { fetchSurah } from '../services/quranService'

export default function Quran(){
  const [activeSurah, setActiveSurah] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(()=>{
    // preload first surah
    selectSurah(1)
  }, [])

  async function selectSurah(number, targetAyah=null){
    setLoading(true)
    try{
      const res = await fetchSurah(number)
      setActiveSurah(res.data)
      if(targetAyah){
        setTimeout(()=>{
          const el = document.getElementById(`ayah-${number}-${targetAyah}`)
          if(el) el.scrollIntoView({behavior:'smooth', block:'center'})
        }, 250)
      }
    }catch(e){ console.error(e) }
    setLoading(false)
  }

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SurahList onSelect={selectSurah} />
        </div>
        <div className="lg:col-span-3">
          <SearchBar onResults={setSearchResults} onQueryChange={setSearchQuery} />
          <div className="mt-4">
            {searchResults && searchResults.length>0 ? (
              <div className="space-y-3">{searchResults.map((r,i)=> (
                <div key={i} className="p-3 bg-white/70 rounded shadow-sm">{r.text || JSON.stringify(r)}</div>
              ))}</div>
            ) : (
              loading ? <Loader/> : <SurahReader surah={activeSurah} highlightQuery={searchQuery} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
