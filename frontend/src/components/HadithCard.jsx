import React, { useState } from 'react'

export default function HadithCard({ hadith }){
  const [open, setOpen] = useState(false)
  return (
    <div className="p-4 bg-white/80 rounded shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-700">{hadith.text || hadith.body || hadith.hadith || '...'}</div>
          <div className="mt-2 text-xs text-gray-500">{hadith.book || hadith.collection || hadith.reference || ''}</div>
        </div>
        <div>
          <button onClick={()=>setOpen(v=>!v)} className="px-2 py-1 bg-primary text-white rounded">{open? 'Hide' : 'Expand'}</button>
        </div>
      </div>
      {open && <div className="mt-3 text-sm text-gray-600">{hadith.explanation || ''}</div>}
    </div>
  )
}
