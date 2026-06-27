import React from 'react'

export default function PrayerCard({ times, location }){
  if(!times) return null
  const list = times.data || times
  return (
    <div className="p-4 bg-white/80 rounded card-glass">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-semibold">Prayer Times — {location}</div>
          <div className="text-xs text-gray-500">Hijri: {list.hijri?.date || list.hijri_date || ''}</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
        {(list.timings || list).timings ? Object.entries(list.timings).map(([k,v])=> (
          <div key={k} className="p-3 bg-white rounded text-center shadow-sm">
            <div className="text-sm text-gray-500">{k}</div>
            <div className="font-medium">{v}</div>
          </div>
        )) : <div>No timings</div>}
      </div>
    </div>
  )
}
