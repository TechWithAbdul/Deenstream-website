// src/pages/Prayers.jsx
import React, { useState } from 'react'
import { Clock, MapPin, RefreshCw, AlertCircle, Sun, Sunrise, Sunset, Moon, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'

const METHODS = [
  { value: 'MWL', label: 'Muslim World League' }, { value: 'ISNA', label: 'North America (ISNA)' },
  { value: 'Egypt', label: 'Egyptian Authority' }, { value: 'Makkah', label: 'Umm al-Qura (Makkah)' },
  { value: 'Karachi', label: 'University of Karachi' }, { value: 'Tehran', label: 'Tehran University' },
  { value: 'MoonsightingCommittee', label: 'Moonsighting Committee' }, { value: 'NorthAmerica', label: 'ISNA North America' },
  { value: 'Singapore', label: 'Singapore' }, { value: 'Turkey', label: 'Diyanet (Turkey)' },
  { value: 'Kuwait', label: 'Kuwait' }, { value: 'Qatar', label: 'Qatar' },
]

const PRAYER_META = {
  Fajr:    { icon: Sunrise, label: 'Fajr',    desc: 'Dawn prayer' },
  Sunrise: { icon: Sun,     label: 'Sunrise', desc: 'Sun rises' },
  Dhuhr:   { icon: Sun,     label: 'Dhuhr',   desc: 'Midday prayer' },
  Asr:     { icon: Sun,     label: 'Asr',     desc: 'Afternoon prayer' },
  Maghrib: { icon: Sunset,  label: 'Maghrib', desc: 'Sunset prayer' },
  Isha:    { icon: Moon,    label: 'Isha',    desc: 'Night prayer' },
}

function PrayerCardSkeleton() {
  return <div className="card p-5 space-y-3"><div className="skeleton h-8 w-8 rounded-full mx-auto" /><div className="skeleton h-4 w-16 mx-auto" /><div className="skeleton h-6 w-20 mx-auto" /></div>
}

export default function Prayers() {
  const {
    prayerTimes, nextPrayer, prayerMethod, setPrayerMethod,
    userCoords, setUserCoords, prayerLoading, prayerError,
    countdown, requestLocation, PRAYER_KEYS,
  } = useApp()

  const [latInput, setLatInput] = useState(String(userCoords?.lat ?? ''))
  const [lngInput, setLngInput] = useState(String(userCoords?.lng ?? ''))
  const [inputError, setInputError] = useState('')

  const handleManualSubmit = (e) => {
    e.preventDefault()
    const lat = parseFloat(latInput); const lng = parseFloat(lngInput)
    if (isNaN(lat) || lat < -90 || lat > 90) { setInputError('Latitude must be between -90 and 90.'); return }
    if (isNaN(lng) || lng < -180 || lng > 180) { setInputError('Longitude must be between -180 and 180.'); return }
    setInputError(''); setUserCoords({ lat, lng })
  }

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="animate-fade-in">
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#021711,#0d2738)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(197,168,128,0.08)', border: '1px solid rgba(197,168,128,0.3)' }}>
              <Clock className="w-5 h-5" style={{ color: '#c5a880' }} />
            </div>
            <span className="badge-gold">Prayer Calculations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display,serif' }}>أوقات الصلاة</h1>
          <p className="text-emerald-100/50">{today}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-white flex items-center gap-2"><MapPin className="w-4 h-4" style={{ color: '#c5a880' }} /> Location & Method</h2>

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={requestLocation} className="btn-primary"><MapPin className="w-4 h-4" /> Use My Location</button>
            {userCoords && (
              <span className="text-xs font-mono px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(197,168,128,0.15)', color: 'rgba(231,243,238,0.6)' }}>
                {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
              </span>
            )}
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(231,243,238,0.4)' }}>Or enter coordinates manually</p>
            <div className="flex flex-wrap gap-3">
              <input type="number" step="any" placeholder="Latitude (e.g. 21.3891)" value={latInput} onChange={e => setLatInput(e.target.value)} className="input-field flex-1 min-w-32" />
              <input type="number" step="any" placeholder="Longitude (e.g. 39.8579)" value={lngInput} onChange={e => setLngInput(e.target.value)} className="input-field flex-1 min-w-32" />
              <button type="submit" className="btn-ghost"><RefreshCw className="w-3.5 h-3.5" /> Calculate</button>
            </div>
            {inputError && <p className="text-xs text-red-300">{inputError}</p>}
          </form>

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(231,243,238,0.4)' }}>Calculation Method</p>
            <select value={prayerMethod} onChange={e => setPrayerMethod(e.target.value)} className="input-field w-full sm:max-w-xs" style={{ colorScheme: 'dark' }}>
              {METHODS.map(m => <option key={m.value} value={m.value} style={{ background: '#021711' }}>{m.label}</option>)}
            </select>
          </div>
        </div>

        {prayerError && (
          <div className="error-banner">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <div><p className="font-semibold">Could not fetch prayer times</p><p className="text-xs opacity-80">{prayerError}</p></div>
          </div>
        )}

        {nextPrayer && countdown && (
          <div className="rounded-2xl p-6 text-center" style={{ background: 'linear-gradient(135deg,rgba(197,168,128,0.08),rgba(255,255,255,0.02))', border: '1px solid rgba(197,168,128,0.25)' }}>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(197,168,128,0.7)' }}>Next Prayer</p>
            <p className="font-bold text-xl mb-2" style={{ fontFamily: 'Playfair Display,serif', color: '#c5a880' }}>{nextPrayer.name} — {nextPrayer.time}</p>
            <p className="font-mono text-4xl font-bold text-white tabular-nums">{countdown}</p>
          </div>
        )}

        {!userCoords && !prayerLoading && !prayerError && (
          <div className="empty-state">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: 'rgba(197,168,128,0.06)', border: '1px solid rgba(197,168,128,0.2)' }}>
              <MapPin className="w-7 h-7" style={{ color: '#c5a880' }} />
            </div>
            <p className="text-emerald-100/40 text-sm">Enable location or enter coordinates above to see prayer times.</p>
          </div>
        )}

        {(prayerLoading || prayerTimes) && (
          <div>
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><Star className="w-4 h-4 fill-current" style={{ color: '#c5a880' }} /> Today's Prayer Schedule</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {prayerLoading && PRAYER_KEYS.map(k => <PrayerCardSkeleton key={k} />)}

              {!prayerLoading && (PRAYER_KEYS || []).map(key => {
                const meta = PRAYER_META[key] || {}
                const Icon = meta.icon || Clock
                const isNext = nextPrayer?.name === key
                const time = prayerTimes?.[key] || '—'

                return (
                  <div key={key} className="prayer-card" style={isNext ? { background: 'rgba(197,168,128,0.1)', borderColor: 'rgba(197,168,128,0.4)' } : {}}>
                    <Icon className="w-6 h-6" style={{ color: isNext ? '#c5a880' : 'rgba(231,243,238,0.4)' }} />
                    <p className="font-bold text-sm text-white">{meta.label || key}</p>
                    <p className="font-mono text-lg font-bold tabular-nums" style={{ color: isNext ? '#c5a880' : 'rgba(231,243,238,0.7)' }}>{time}</p>
                    <p className="text-xs text-emerald-100/35">{meta.desc || ''}</p>
                    {isNext && <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(197,168,128,0.15)', color: '#c5a880', border: '1px solid rgba(197,168,128,0.3)' }}>Next ↑</span>}
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