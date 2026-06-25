import React, { useEffect, useState } from 'react'
import api from '../utils/api'

function formatTime(value){
  return value ? value.replace(':', ':') : '--:--'
}

export default function Prayer(){
  const [timings, setTimings] = useState(null)
  const [hijri, setHijri] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    async function load(){
      setLoading(true)
      setError(null)
      try{
        const [timingRes, hijriRes] = await Promise.all([
          api.get('/prayer'),
          api.get('/prayer/hijri')
        ])
        setTimings(timingRes.data.data?.timings || null)
        setHijri(hijriRes.data.data?.hijri || null)
      }catch(err){
        console.error(err)
        setError('Unable to load prayer times. Please try again later.')
      }finally{
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="rounded-[2rem] bg-white/90 p-6 shadow-xl ring-1 ring-emerald-100">
        <h1 className="text-3xl font-semibold">Prayer Times</h1>
        <p className="mt-2 text-sm text-gray-600">Daily prayer times and the current Hijri date for Mecca, Saudi Arabia.</p>

        {loading ? (
          <div className="mt-8 rounded-3xl bg-gray-50 p-8 text-center text-gray-500">Loading prayer times...</div>
        ) : error ? (
          <div className="mt-8 rounded-3xl bg-red-50 p-8 text-center text-red-700">{error}</div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="rounded-3xl bg-emerald-50/80 p-6">
              <h2 className="text-xl font-semibold">Today&apos;s Timings</h2>
              <div className="mt-5 grid gap-3">
                {timings ? Object.entries(timings).map(([name, value]) => (
                  <div key={name} className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm">
                    <span className="font-medium text-gray-700">{name}</span>
                    <span className="font-semibold text-gray-900">{formatTime(value)}</span>
                  </div>
                )) : <div className="text-sm text-gray-500">No timings available.</div>}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Hijri Date</h2>
              {hijri ? (
                <div className="mt-4 space-y-3">
                  <div className="text-3xl font-semibold text-gray-900">{hijri.day} {hijri.month.en}</div>
                  <div className="text-sm text-gray-600">{hijri.weekday.en}, {hijri.year} AH</div>
                  <div className="text-sm text-gray-500">{hijri.designation.abbrev}</div>
                </div>
              ) : (
                <div className="mt-4 text-sm text-gray-500">Hijri information unavailable.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
