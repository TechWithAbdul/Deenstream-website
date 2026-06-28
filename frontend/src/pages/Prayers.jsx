// src/pages/Prayers.jsx
import React, { useState } from 'react'
import { Clock, MapPin, RefreshCw, AlertCircle, Sun, Sunrise, Sunset, Moon, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'

const METHODS = [
  { value: 'MWL',                    label: 'Muslim World League' },
  { value: 'ISNA',                   label: 'North America (ISNA)' },
  { value: 'Egypt',                  label: 'Egyptian Authority' },
  { value: 'Makkah',                 label: 'Umm al-Qura (Makkah)' },
  { value: 'Karachi',                label: 'University of Karachi' },
  { value: 'Tehran',                 label: 'Tehran University' },
  { value: 'MoonsightingCommittee',  label: 'Moonsighting Committee' },
  { value: 'NorthAmerica',           label: 'ISNA North America' },
  { value: 'Singapore',              label: 'Singapore' },
  { value: 'Turkey',                 label: 'Diyanet (Turkey)' },
  { value: 'Kuwait',                 label: 'Kuwait' },
  { value: 'Qatar',                  label: 'Qatar' },
]

const PRAYER_META = {
  Fajr:    { icon: Sunrise,  label: 'Fajr',    desc: 'Dawn prayer', color: 'text-violet-600', bg: 'bg-violet-50 border-violet-100' },
  Sunrise: { icon: Sun,      label: 'Sunrise',  desc: 'Sun rises',  color: 'text-amber-600',  bg: 'bg-amber-50  border-amber-100',  dimmed: true },
  Dhuhr:   { icon: Sun,      label: 'Dhuhr',   desc: 'Midday prayer', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-100' },
  Asr:     { icon: Sun,      label: 'Asr',     desc: 'Afternoon prayer', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100' },
  Maghrib: { icon: Sunset,   label: 'Maghrib', desc: 'Sunset prayer', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' },
  Isha:    { icon: Moon,     label: 'Isha',    desc: 'Night prayer',  color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
}

function PrayerCardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="skeleton h-8 w-8 rounded-full mx-auto" />
      <div className="skeleton h-4 w-16 mx-auto" />
      <div className="skeleton h-6 w-20 mx-auto" />
    </div>
  )
}

export default function Prayers() {
  const {
    prayerTimes, nextPrayer, prayerMethod, setPrayerMethod,
    userCoords, setUserCoords,
    prayerLoading, prayerError,
    countdown, fetchPrayerTimes, requestLocation,
    PRAYER_KEYS,
  } = useApp()

  // Manual coordinate entry
  const [latInput, setLatInput] = useState(String(userCoords?.lat ?? ''))
  const [lngInput, setLngInput] = useState(String(userCoords?.lng ?? ''))
  const [inputError, setInputError] = useState('')

  const handleManualSubmit = (e) => {
    e.preventDefault()
    const lat = parseFloat(latInput)
    const lng = parseFloat(lngInput)
    if (isNaN(lat) || lat < -90 || lat > 90) { setInputError('Latitude must be between -90 and 90.'); return }
    if (isNaN(lng) || lng < -180 || lng > 180) { setInputError('Longitude must be between -180 and 180.'); return }
    setInputError('')
    setUserCoords({ lat, lng })
  }

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-sky-300" />
            </div>
            <span className="badge-gold">Prayer Calculations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display,serif' }}>
            أوقات الصلاة
          </h1>
          <p className="text-slate-300/70">{today}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Controls card */}
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" /> Location & Method
          </h2>

          {/* Geolocation button */}
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={requestLocation} className="btn-primary">
              <MapPin className="w-4 h-4" /> Use My Location
            </button>
            {userCoords && (
              <span className="text-xs text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
              </span>
            )}
          </div>

          {/* Manual entry */}
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Or enter coordinates manually</p>
            <div className="flex flex-wrap gap-3">
              <input
                type="number" step="any" placeholder="Latitude (e.g. 21.3891)"
                value={latInput} onChange={e => setLatInput(e.target.value)}
                className="flex-1 min-w-32 px-3 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <input
                type="number" step="any" placeholder="Longitude (e.g. 39.8579)"
                value={lngInput} onChange={e => setLngInput(e.target.value)}
                className="flex-1 min-w-32 px-3 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <button type="submit" className="btn-ghost">
                <RefreshCw className="w-3.5 h-3.5" /> Calculate
              </button>
            </div>
            {inputError && <p className="text-xs text-red-600">{inputError}</p>}
          </form>

          {/* Method selector */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Calculation Method</p>
            <select
              value={prayerMethod}
              onChange={e => setPrayerMethod(e.target.value)}
              className="w-full sm:max-w-xs px-3 py-2 text-sm rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              {METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
        </div>

        {/* Error */}
        {prayerError && (
          <div className="error-banner">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <div>
              <p className="font-semibold">Could not fetch prayer times</p>
              <p className="text-red-700/80 text-xs">{prayerError}</p>
            </div>
          </div>
        )}

        {/* Countdown banner (when times loaded) */}
        {nextPrayer && countdown && (
          <div className="rounded-2xl p-6 text-center" style={{ background: 'linear-gradient(135deg,#022c22,#064e3b)' }}>
            <p className="text-emerald-300/70 text-xs uppercase tracking-widest mb-1">Next Prayer</p>
            <p className="text-amber-300 font-bold text-xl mb-2" style={{ fontFamily: 'Playfair Display,serif' }}>
              {nextPrayer.name} — {nextPrayer.time}
            </p>
            <p className="font-mono text-4xl font-bold text-white tabular-nums">{countdown}</p>
          </div>
        )}

        {/* No location prompt */}
        {!userCoords && !prayerLoading && !prayerError && (
          <div className="empty-state">
            <div className="w-16 h-16 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center mx-auto">
              <MapPin className="w-7 h-7 text-sky-400" />
            </div>
            <p className="text-slate-500 text-sm">Enable location or enter coordinates above to see prayer times.</p>
          </div>
        )}

        {/* Prayer time cards */}
        {(prayerLoading || prayerTimes) && (
          <div>
            <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-current" /> Today's Prayer Schedule
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {prayerLoading && PRAYER_KEYS.map(k => <PrayerCardSkeleton key={k} />)}

              {!prayerLoading && (PRAYER_KEYS || []).map(key => {
                const meta = PRAYER_META[key] || {}
                const Icon = meta.icon || Clock
                const isNext = nextPrayer?.name === key
                const time = prayerTimes?.[key] || '—'

                return (
                  <div
                    key={key}
                    className={`prayer-card border ${isNext ? 'bg-emerald-900 border-emerald-700 text-white shadow-lg scale-105' : `${meta.bg || 'bg-white border-stone-100'}`}`}
                  >
                    <Icon className={`w-6 h-6 ${isNext ? 'text-amber-300' : meta.color || 'text-slate-500'}`} />
                    <p className={`font-bold text-sm ${isNext ? 'text-white' : 'text-slate-800'}`}>{meta.label || key}</p>
                    <p className={`font-mono text-lg font-bold tabular-nums ${isNext ? 'text-amber-300' : meta.color || 'text-slate-700'}`}>
                      {time}
                    </p>
                    <p className={`text-xs ${isNext ? 'text-emerald-300' : 'text-slate-400'}`}>{meta.desc || ''}</p>
                    {isNext && <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-medium">Next ↑</span>}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}