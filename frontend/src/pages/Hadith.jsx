import React, { useEffect, useState } from 'react'
import HadithList from '../components/HadithList'
import SearchBar from '../components/SearchBar'
import { fetchHadiths } from '../services/hadithService'
import Loader from '../components/Loader'

export default function Hadith(){
  const [hadiths, setHadiths] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ load(); }, [])

  async function load(query=''){
    setLoading(true)
    try{
      const data = await fetchHadiths(query)
      setHadiths(data || [])
    }catch(e){ console.error(e) }
    setLoading(false)
  }

  return (
    <div className="py-6">
      <SearchBar onSearch={load} placeholder="Search Hadith (keywords, narrator, book)" />
      <div className="mt-4">
        {loading ? <Loader/> : <HadithList hadiths={hadiths} />}
      </div>
    </div>
  )
}
