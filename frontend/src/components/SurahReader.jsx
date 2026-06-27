import React from 'react'
import VerseCard from './VerseCard'

export default function SurahReader({ surah, highlightQuery }){
  if(!surah) return <div className="p-6 text-gray-500">Select a surah to begin reading.</div>

  return (
    <div>
      <div className="p-4 bg-white/70 rounded mb-4">
        <div className="text-right font-arabic text-3xl">{surah.ayahs && surah.ayahs[0] && surah.ayahs[0].text ? surah.ayahs[0].text.replace(/\s+\d+$/, '') : ''}</div>
        <div className="mt-2 text-sm text-gray-600">{surah.englishName || surah.name} — {surah.revelationType}</div>
      </div>
      <div className="space-y-3">
        {(surah.ayahs || []).map((a)=> (
          <VerseCard key={a.number || a.numberInSurah} ayah={a} surahNumber={surah.number} highlightQuery={highlightQuery} />
        ))}
      </div>
    </div>
  )
}
