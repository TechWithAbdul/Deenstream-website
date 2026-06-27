import React from 'react'
import HadithCard from './HadithCard'

export default function HadithList({ hadiths }){
  if(!hadiths || hadiths.length===0) return <div className="text-gray-500">No hadiths found.</div>

  return (
    <div className="space-y-3">
      {hadiths.map((h,i)=> <HadithCard key={i} hadith={h} />)}
    </div>
  )
}
