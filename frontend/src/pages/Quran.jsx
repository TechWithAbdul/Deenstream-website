import React, {useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SurahList from '../components/SurahList'
import SurahReader from '../components/SurahReader'
import SearchBar from '../components/SearchBar'
import SearchResults from '../components/SearchResults'
import Loader from '../components/Loader'
import { fetchSurah } from '../services/quranService'

export default function Quran(){
  const params = useParams()
  const navigate = useNavigate()
  const [activeSurah, setActiveSurah] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedAyah, setHighlightedAyah] = useState(null)

  // on mount: support route params and legacy hash (#2:255)
  useEffect(()=>{
    const { surah, ayah } = params || {}
    if(surah){
      selectSurah(Number(surah), ayah ? Number(ayah) : null)
    }else if(typeof window !== 'undefined' && window.location.hash){
      const h = window.location.hash.replace('#','')
      const m = h.match(/(\d+):?(\d+)?/)
      if(m){
        const s = Number(m[1])
        const a = m[2] ? Number(m[2]) : null
        // navigate to normalized route
        navigate(`/quran/${s}${a?`/${a}` : ''}`, { replace: true })
        selectSurah(s, a)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function selectSurah(number, targetAyah = null){
    setLoading(true)
    try{
      const res = await fetchSurah(number)
      setActiveSurah(res.data)
      // update URL for deep-linking
      try{ navigate(`/quran/${number}${targetAyah?`/${targetAyah}`:''}`, { replace: false }) }catch(e){/*ignore*/}
      // small delay to ensure DOM rendered
      if(targetAyah){
        setTimeout(()=> setHighlightedAyah(targetAyah), 300)
      }else{
        setHighlightedAyah(null)
      }
    }catch(err){ console.error(err) }
    setLoading(false)
  }

  function handleNavigate(surah, ayah){
    if(!surah) return
    // ayah might be string/number
    const ay = ayah ? Number(ayah) : null
    selectSurah(surah, ay)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SurahList onSelect={selectSurah} />
        </div>
        <div className="lg:col-span-2">
          <div className="mb-4">
          <SearchBar onResults={setSearchResults} onNavigate={handleNavigate} onQueryChange={setSearchQuery} />
          </div>
          {searchResults && searchResults.length>0 ? (
          <SearchResults results={searchResults} onNavigate={handleNavigate} />
          ) : (
          loading ? <Loader/> : <SurahReader surah={activeSurah} highlightedAyah={highlightedAyah} highlightQuery={searchQuery} />
          )}
        </div>
      </div>
    </div>
  )
}
