// src/pages/Prayers.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { Clock, MapPin, RefreshCw, AlertCircle, Sun, Sunrise, Sunset, Moon, Star, Compass, Info, Calendar, Flame, ShieldAlert, Heart, ChevronDown } from 'lucide-react'
import { useApp } from '../context/Appcontext.jsx'

const METHODS = [
  { value: 'MuslimWorldLeague', label: 'Muslim World League' },
  { value: 'ISNA',              label: 'North America (ISNA)' },
  { value: 'Egyptian',          label: 'Egyptian Authority' },
  { value: 'UmmAlQura',         label: 'Umm al-Qura (Makkah)' },
  { value: 'Karachi',           label: 'University of Karachi' },
  { value: 'Turkey',            label: 'Diyanet (Turkey)' },
  { value: 'Dubai',             label: 'Dubai Executive Council' },
]

const PRAYER_META = {
  Fajr:    { icon: Sunrise, label: 'Fajr',    desc: 'Suhoor Ends',    gradient: 'from-blue-500/20 via-blue-600/5 to-transparent' },
  Sunrise: { icon: Sunrise, label: 'Sunrise', desc: 'Solar rise',     gradient: 'from-amber-500/20 via-amber-600/5 to-transparent' },
  Dhuhr:   { icon: Sun,     label: 'Dhuhr',   desc: 'Midday prayer',  gradient: 'from-emerald-500/20 via-emerald-600/5 to-transparent' },
  Asr:     { icon: Sun,     label: 'Asr',     desc: 'Afternoon zone', gradient: 'from-orange-500/20 via-orange-600/5 to-transparent' },
  Maghrib: { icon: Sunset,  label: 'Maghrib', desc: 'Iftar Window',   gradient: 'from-rose-500/20 via-rose-600/5 to-transparent' },
  Isha:    { icon: Moon,    label: 'Isha',    desc: 'Night prayer',   gradient: 'from-indigo-500/20 via-indigo-600/5 to-transparent' },
}

const NAV_TABS = [
  { id: 'daily', label: 'Daily Card' },
  { id: 'monthly', label: 'Monthly Table' },
  { id: 'ramadan', label: 'Ramadan 30-Day' },
  { id: 'qibla', label: 'Qibla Compass' }
]

export default function Prayers() {
  const {
    prayerTimes, nextPrayer, prayerMethod, setPrayerMethod,
    userCoords, setUserCoords, prayerLoading, calendarLoading, prayerError,
    countdown, requestLocation, PRAYER_KEYS, hijriDate, monthlyData
  } = useApp()

  const [activeTab, setActiveTab] = useState('daily') // 'daily' | 'monthly' | 'ramadan' | 'qibla'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [latInput, setLatInput] = useState(String(userCoords?.lat ?? ''))
  const [lngInput, setLngInput] = useState(String(userCoords?.lng ?? ''))
  const [inputError, setInputError] = useState('')
  const [showConfig, setShowConfig] = useState(false)

  useEffect(() => {
    if (userCoords) {
      setLatInput(String(userCoords.lat.toFixed(4)))
      setLngInput(String(userCoords.lng.toFixed(4)))
    }
  }, [userCoords])

  // --- HIGH PRECISION SPHERICAL TRIGONOMETRY ENGINE ---
  const qiblaMetrics = useMemo(() => {
    if (!userCoords?.lat || !userCoords?.lng) return { bearing: 0, distance: 0 }
    
    const KAABA_LAT = 21.4225
    const KAABA_LNG = 39.8262
    
    const toRad = (v) => (v * Math.PI) / 180
    const toDeg = (v) => (v * 180) / Math.PI
    
    const phi1 = toRad(userCoords.lat)
    const phi2 = toRad(KAABA_LAT)
    const deltaLambda = toRad(KAABA_LNG - userCoords.lng)
    
    // Calculate Bearing angle via atan2
    const y = Math.sin(deltaLambda) * Math.cos(phi2)
    const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda)
    let bearing = toDeg(Math.atan2(y, x))
    bearing = (bearing + 360) % 360
    
    // Calculate Geodesic Earth Arc Distance via Haversine
    const R = 6371 
    const dLat = phi2 - phi1
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    
    return { bearing: bearing.toFixed(2), distance: distance.toFixed(0) }
  }, [userCoords])

  const handleManualSubmit = (e) => {
    e.preventDefault()
    const lat = parseFloat(latInput)
    const lng = parseFloat(lngInput)
    if (isNaN(lat) || lat < -90 || lat > 90) { setInputError('Latitude must be -90 to 90.'); return }
    if (isNaN(lng) || lng < -180 || lng > 180) { setInputError('Longitude must be -180 to 180.'); return }
    setInputError('')
    setUserCoords({ lat, lng })
    setShowConfig(false)
  }

  const getPrayerTime = (key) => {
    if (!prayerTimes) return '—'
    return prayerTimes[key] || prayerTimes[key.toLowerCase()] || '—'
  }

  const activeNextName = (typeof nextPrayer === 'object' ? nextPrayer?.name : nextPrayer) || ''
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#020a06] text-stone-200 overflow-y-auto relative pb-16 selection:bg-[#c5a880]/30">
      
      {/* Background Ambience Layers */}
      <div className="absolute top-0 right-1/4 w-[280px] sm:w-[700px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[120px] sm:blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-20 left-10 w-[250px] sm:w-[500px] h-[500px] bg-[#c5a880]/[0.02] rounded-full blur-[100px] sm:blur-[140px] pointer-events-none z-0" />

      {/* DYNAMIC HUB PLATFORM HEADER */}
      <div className="relative border-b border-emerald-950/40 bg-gradient-to-b from-[#031911] to-transparent backdrop-blur-sm z-30">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#c5a880]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c5a880]">Astronomical Guidance Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-serif tracking-wide">أوقات الصلاة والقبلة</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-400">
              <span className="text-stone-200 font-medium">{today}</span>
              {hijriDate && (
                <>
                  <span className="text-emerald-800/80">•</span>
                  <span className="text-[#c5a880] font-serif tracking-wide">{hijriDate}</span>
                </>
              )}
            </div>
          </div>

          {/* RESPONSIVE CONTROL PANEL SWITCH */}
          <div className="relative w-full md:w-auto">
            {/* Mobile Selection Dropdown Viewport */}
            <div className="block md:hidden">
              <button 
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-emerald-950 text-xs font-bold text-stone-200 flex items-center justify-between shadow-xl"
              >
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#c5a880] rounded-full" />
                  {NAV_TABS.find(t => t.id === activeTab)?.label}
                </span>
                <ChevronDown className={`w-4 h-4 text-[#c5a880] transition-transform duration-200 ${mobileMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {mobileMenuOpen && (
                <div className="absolute top-[110%] left-0 right-0 bg-[#031c13]/95 border border-emerald-900/60 rounded-xl mt-1 shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
                  {NAV_TABS.map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-xs font-semibold transition-colors ${activeTab === tab.id ? 'bg-[#c5a880] text-[#02110b]' : 'text-stone-300 hover:bg-emerald-950/40'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Laptop / Big Screen Tabs */}
            <div className="hidden md:flex flex-wrap items-center gap-2 bg-black/40 border border-emerald-950 p-1.5 rounded-2xl backdrop-blur-md">
              {NAV_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-[#c5a880] text-[#02110b] shadow-lg shadow-emerald-950/40' 
                      : 'text-stone-400 hover:text-white hover:bg-emerald-950/30'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setShowConfig(!showConfig)}
            className="px-4 py-2.5 rounded-xl bg-[#06241b]/90 border border-emerald-900/40 text-xs font-semibold text-stone-200 hover:border-[#c5a880]/60 transition-all flex items-center gap-2 self-end md:self-auto shadow-md"
          >
            <MapPin className="w-3.5 h-3.5 text-[#c5a880]" />
            {userCoords ? `${userCoords.lat.toFixed(4)}°N, ${userCoords.lng.toFixed(4)}°E` : 'Configure Parameters'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 relative z-10">
        
        {/* PARAMETERS CONFIG PANEL DRAWER */}
        {showConfig && (
          <div className="bg-[#031a13]/95 border border-[#c5a880]/30 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-5 backdrop-blur-xl transition-all">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#c5a880]" /> Coordinates Interface
              </h3>
              <button onClick={() => setShowConfig(false)} className="text-stone-500 hover:text-white text-xs font-semibold">Dismiss</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <p className="text-[11px] text-stone-400 leading-relaxed">Update calculation matrix via browser telemetry geolocation instantly.</p>
                <button type="button" onClick={() => { requestLocation(); setShowConfig(false); }} className="w-full py-3 px-4 rounded-xl bg-[#082f23] border border-[#c5a880]/20 hover:border-[#c5a880] text-xs font-bold text-[#c5a880] transition-all flex items-center justify-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> Acquire Satellite Telemetry
                </button>
              </div>
              <form onSubmit={handleManualSubmit} className="space-y-3 border-t md:border-t-0 md:border-l border-emerald-950/60 pt-4 md:pt-0 md:pl-6">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-stone-500 uppercase block mb-1 font-semibold">Latitude</label>
                    <input type="number" step="any" value={latInput} onChange={e => setLatInput(e.target.value)} className="w-full bg-black/40 text-xs p-3 rounded-xl border border-emerald-900/40 text-white outline-none focus:border-[#c5a880]/50" />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 uppercase block mb-1 font-semibold">Longitude</label>
                    <input type="number" step="any" value={lngInput} onChange={e => setLngInput(e.target.value)} className="w-full bg-black/40 text-xs p-3 rounded-xl border border-emerald-900/40 text-white outline-none focus:border-[#c5a880]/50" />
                  </div>
                </div>
                <button type="submit" className="w-full py-3 rounded-xl bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-800/40 text-xs font-bold text-white transition-all">Sync Spatial Mapping</button>
                {inputError && <p className="text-[11px] text-rose-400 font-medium">{inputError}</p>}
              </form>
            </div>
            <div className="pt-4 border-t border-emerald-950/40 space-y-2">
              <label className="text-[10px] text-stone-400 uppercase block font-bold">Calculation System Standard</label>
              <select value={prayerMethod} onChange={e => setPrayerMethod(e.target.value)} className="w-full bg-black/40 border border-emerald-900/40 p-3 rounded-xl text-xs text-white outline-none focus:border-[#c5a880]/50 cursor-pointer">
                {METHODS.map(m => <option key={m.value} value={m.value} style={{ background: '#031610' }}>{m.label}</option>)}
              </select>
            </div>
          </div>
        )}

        {prayerError && (
          <div className="bg-rose-950/20 border border-rose-900/30 rounded-2xl p-4 flex items-start gap-3 text-stone-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">System Calibration Disruption</p>
              <p className="text-[11px] text-stone-400 mt-0.5">{prayerError}</p>
            </div>
          </div>
        )}

        {/* ==================== TAB 1: DAILY SPOTLIGHT CARD ==================== */}
        {activeTab === 'daily' && (
          <div className="space-y-6">
            {activeNextName && countdown && !prayerError && (
              <div className="relative rounded-3xl p-6 sm:p-10 border border-[#c5a880]/30 shadow-2xl flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#031d15] to-[#010e0a] backdrop-blur-md">
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#c5a880] px-3 py-1 bg-[#c5a880]/10 border border-[#c5a880]/20 rounded-full mb-4 flex items-center gap-2">
                  <Clock className="w-3 h-3 text-[#c5a880] animate-pulse" /> Live Countdown Indicator
                </span>
                <h2 className="text-4xl sm:text-6xl font-black tracking-tight font-mono text-white tabular-nums drop-shadow-lg">{countdown}</h2>
                <p className="text-xs text-stone-400 mt-3 font-medium">
                  Until the dynamic window opens for: <span className="text-[#c5a880] font-bold uppercase tracking-widest bg-[#c5a880]/5 px-2 py-0.5 rounded border border-[#c5a880]/10 ml-1">{activeNextName}</span>
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:get-4">
              {PRAYER_KEYS.map(key => {
                const meta = PRAYER_META[key] || { icon: Clock, label: key, desc: 'Window active', gradient: 'from-emerald-500/5 to-transparent' }
                const Icon = meta.icon
                const isNext = activeNextName.toLowerCase() === key.toLowerCase()
                const displayTime = getPrayerTime(key)

                return (
                  <div 
                    key={key} 
                    className={`relative rounded-2xl p-4 sm:p-5 border text-center transition-all duration-300 flex flex-col items-center justify-between min-h-[155px] sm:min-h-[165px] overflow-hidden group ${
                      isNext 
                        ? 'bg-gradient-to-b from-[#063324] to-[#031d15] border-[#c5a880]/70 shadow-2xl scale-[1.02] sm:scale-[1.03] z-10 ring-1 ring-[#c5a880]/20' 
                        : 'bg-[#03150e]/40 border-emerald-950/70 hover:border-emerald-800/60 hover:bg-[#041d13]/60'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-b ${meta.gradient} opacity-40 pointer-events-none`} />
                    <div className="relative z-10 flex flex-col items-center space-y-2 sm:space-y-3 w-full">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all duration-300 group-hover:rotate-6 ${isNext ? 'bg-[#c5a880] text-[#02110b] border-transparent' : 'bg-black/30 border-emerald-900/30 text-[#c5a880]'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-xs sm:text-sm tracking-wide text-white">{meta.label}</p>
                        <p className="text-[10px] text-stone-500 font-medium truncate max-w-[90px] sm:max-w-[100px] mt-0.5">{meta.desc}</p>
                      </div>
                    </div>
                    <div className="relative z-10 w-full pt-3 border-t border-emerald-950/40 mt-3">
                      <p className={`font-mono text-lg sm:text-xl font-black tracking-tight tabular-nums ${isNext ? 'text-[#c5a880]' : 'text-stone-300'}`}>{displayTime}</p>
                      {isNext && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase bg-[#c5a880] text-[#020d08] border border-white/10">NEXT</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: MONTHLY INTEGRATED TABLE ==================== */}
        {activeTab === 'monthly' && (
          <div className="space-y-4">
            
            {/* MOBILE VIEW: STACKED COMPACT DATA CARD MATRICES */}
            <div className="block md:hidden space-y-3">
              {!monthlyData || monthlyData.length === 0 ? (
                <p className="text-center py-8 text-xs text-stone-500 font-medium">Awaiting network metrics entry stream...</p>
              ) : (
                monthlyData.map((row, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-[#02110b] to-[#04241a] border border-emerald-950 rounded-2xl p-4 shadow-md space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-950/60 pb-2">
                      <span className="text-[10px] uppercase font-bold text-[#c5a880]">Gregorian Target</span>
                      <span className="text-xs font-mono font-bold text-white">
                        {row?.date?.gregorian?.date || `Day ${idx + 1}`}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center font-mono">
                      <div className="bg-black/30 rounded-xl p-2 border border-emerald-950/40">
                        <p className="text-[9px] text-stone-500 uppercase font-sans font-semibold">Fajr</p>
                        <p className="text-xs text-stone-300 mt-0.5">{row?.timings?.Fajr || '—'}</p>
                      </div>
                      <div className="bg-black/30 rounded-xl p-2 border border-emerald-950/40">
                        <p className="text-[9px] text-stone-500 uppercase font-sans font-semibold">Sunrise</p>
                        <p className="text-xs text-stone-500 mt-0.5">{row?.timings?.Sunrise || '—'}</p>
                      </div>
                      <div className="bg-black/30 rounded-xl p-2 border border-emerald-950/40">
                        <p className="text-[9px] text-stone-500 uppercase font-sans font-semibold">Dhuhr</p>
                        <p className="text-xs text-stone-300 mt-0.5">{row?.timings?.Dhuhr || '—'}</p>
                      </div>
                      <div className="bg-black/30 rounded-xl p-2 border border-emerald-950/40">
                        <p className="text-[9px] text-stone-500 uppercase font-sans font-semibold">Asr</p>
                        <p className="text-xs text-stone-300 mt-0.5">{row?.timings?.Asr || '—'}</p>
                      </div>
                      <div className="bg-emerald-950/40 rounded-xl p-2 border border-[#c5a880]/10 col-span-2 flex items-center justify-around">
                        <div>
                          <p className="text-[9px] text-emerald-400 uppercase font-sans font-bold">Maghrib</p>
                          <p className="text-xs font-black text-emerald-300 mt-0.5">{row?.timings?.Maghrib || '—'}</p>
                        </div>
                        <div className="w-px h-6 bg-emerald-950" />
                        <div>
                          <p className="text-[9px] text-stone-400 uppercase font-sans font-semibold">Isha</p>
                          <p className="text-xs text-stone-300 mt-0.5">{row?.timings?.Isha || '—'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* LAPTOP / WIDESCREEN DISPLAY: UNTOUCHED RAW DATATABLE */}
            <div className="hidden md:block bg-[#031610]/40 border border-emerald-950 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
              <div className="p-5 border-b border-emerald-950 bg-black/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#c5a880]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">Full Monthly Matrix Overview</h3>
                </div>
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">Calculated dynamically</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-emerald-950/60 bg-black/40 text-stone-400 font-bold tracking-wide">
                      <th className="p-4">Date</th>
                      <th className="p-4">Fajr</th>
                      <th className="p-4">Sunrise</th>
                      <th className="p-4">Dhuhr</th>
                      <th className="p-4">Asr</th>
                      <th className="p-4">Maghrib</th>
                      <th className="p-4">Isha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-950/30">
                    {monthlyData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-emerald-900/10 transition-colors duration-150 text-stone-300 font-mono">
                        <td className="p-4 text-stone-200 font-sans font-medium">{row?.date?.gregorian?.date || `Day ${idx+1}`}</td>
                        <td className="p-4">{row?.timings?.Fajr || '—'}</td>
                        <td className="p-4 text-stone-500">{row?.timings?.Sunrise || '—'}</td>
                        <td className="p-4">{row?.timings?.Dhuhr || '—'}</td>
                        <td className="p-4">{row?.timings?.Asr || '—'}</td>
                        <td className="p-4 font-bold text-emerald-400">{row?.timings?.Maghrib || '—'}</td>
                        <td className="p-4">{row?.timings?.Isha || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 3: ULTIMATE 30-DAY RAMADAN ASHRA MATRIX ==================== */}
        {activeTab === 'ramadan' && (
          <div className="space-y-8">
            {[
              { title: 'First Third: Rahmah (Mercy - Days 1-10)', icon: Heart, color: 'text-blue-400', border: 'border-blue-900/40', bg: 'bg-blue-950/5', range: [0, 10], dua: 'يا حَيُّ يا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ (O Living, O Sustainer, in Your Mercy I seek relief)' },
              { title: 'Second Third: Maghfirah (Forgiveness - Days 11-20)', icon: Flame, color: 'text-amber-400', border: 'border-amber-900/40', bg: 'bg-amber-950/5', range: [10, 20], dua: 'أَسْتَغْفِرُ اللَّهَ رَبِّي مِنْ كُلِّ ذَنْبٍ وَأَتُوبُ إِلَيْهِ (I seek forgiveness from Allah, my Lord, for every sin)' },
              { title: 'Third Third: Nijah (Protection - Days 21-30)', icon: ShieldAlert, color: 'text-rose-400', border: 'border-rose-900/40', bg: 'bg-rose-950/5', range: [20, 30], dua: 'اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ (O Allah, protect and save me from the Fire)' }
            ].map((ashra, aIdx) => (
              <div key={aIdx} className={`border ${ashra.border} ${ashra.bg} rounded-3xl overflow-hidden shadow-xl backdrop-blur-md`}>
                <div className="p-5 bg-black/30 border-b border-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-black/40 rounded-xl ${ashra.color}`}>
                      <ashra.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black tracking-wide text-white font-serif">{ashra.title}</h3>
                      <p className="text-[11px] text-stone-400 font-serif italic mt-0.5">{ashra.dua}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-black tracking-widest uppercase px-2.5 py-1 bg-black/40 rounded-full border ${ashra.border} ${ashra.color} self-start sm:self-auto`}>Ashra {aIdx + 1}</span>
                </div>

                {/* MOBILE CONFIG: COMPACT ROW-CONTAINED CAPSULES */}
                <div className="block md:hidden p-3 space-y-2">
                  {monthlyData.slice(ashra.range[0], ashra.range[1]).map((row, idx) => {
                    const globalFastNum = ashra.range[0] + idx + 1
                    return (
                      <div key={idx} className="flex items-center justify-between bg-black/30 border border-emerald-950/70 rounded-xl p-3 text-xs font-mono">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-[#042116] border border-emerald-900/50 flex items-center justify-center text-[10px] font-bold text-stone-400">{globalFastNum}</span>
                          <span className="font-sans text-stone-200 text-[11px]">{row?.date?.gregorian?.date || `Fast ${globalFastNum}`}</span>
                        </div>
                        <div className="flex gap-4 text-right text-[11px]">
                          <div>
                            <span className="text-[8px] text-emerald-400 block uppercase font-sans font-semibold">Suhoor</span>
                            <span className="font-bold text-emerald-300">{row?.timings?.Fajr || '—'}</span>
                          </div>
                          <div className="border-l border-emerald-950/60 my-0.5" />
                          <div>
                            <span className="text-[8px] text-orange-400 block uppercase font-sans font-semibold">Iftar</span>
                            <span className="font-bold text-orange-300">{row?.timings?.Maghrib || '—'}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* LAPTOP / DESKTOP VIEWPORT: STAYS THE SAME TABLE */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-emerald-950 bg-black/10 text-stone-400 font-bold tracking-wide">
                        <th className="p-4 text-center w-16">Fast</th>
                        <th className="p-4">Gregorian Date</th>
                        <th className="p-4 text-emerald-400 font-bold">Suhoor (Fajr)</th>
                        <th className="p-4 text-orange-400 font-bold">Iftar (Maghrib)</th>
                        <th className="p-4">Isha / Taraweeh</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-950/20 text-stone-300 font-mono">
                      {monthlyData.slice(ashra.range[0], ashra.range[1]).map((row, idx) => {
                        const globalFastNum = ashra.range[0] + idx + 1
                        return (
                          <tr key={idx} className="hover:bg-emerald-900/10 transition-colors duration-150">
                            <td className="p-4 text-center font-bold text-stone-400 bg-black/10">{globalFastNum}</td>
                            <td className="p-4 font-sans font-medium text-stone-200">{row?.date?.gregorian?.date || '—'}</td>
                            <td className="p-4 font-black text-emerald-300 bg-emerald-950/10">{row?.timings?.Fajr || '—'}</td>
                            <td className="p-4 font-black text-orange-300 bg-orange-950/10">{row?.timings?.Maghrib || '—'}</td>
                            <td className="p-4 text-stone-400">{row?.timings?.Isha || '—'}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================== TAB 4: HIGH-PRECISION QIBLA COMPASS HUB ==================== */}
        {activeTab === 'qibla' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* COMPASS COMPONENT CANVAS PANEL */}
            <div className="bg-[#031610]/40 border border-emerald-950 p-6 sm:p-8 rounded-3xl shadow-xl backdrop-blur-md flex flex-col items-center justify-center relative min-h-[340px] sm:min-h-[380px]">
              <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[9px] font-bold text-[#c5a880] uppercase tracking-widest bg-[#c5a880]/10 px-2 py-0.5 rounded-full border border-[#c5a880]/20">
                <Compass className="w-3 h-3" /> Angular Heading Matrix
              </div>

              {/* Graphical Rotating Compass dial structure */}
              <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full border-2 border-emerald-900/60 flex items-center justify-center relative shadow-inner bg-black/40 mt-4">
                <div className="absolute top-1 text-[10px] font-black text-rose-500">N</div>
                <div className="absolute bottom-1 text-[10px] font-black text-stone-500">S</div>
                <div className="absolute right-1 text-[10px] font-black text-stone-500">E</div>
                <div className="absolute left-1 text-[10px] font-black text-stone-500">W</div>
                
                {/* Dynamic Bearing Needle Indicator Ring */}
                <div 
                  className="w-full h-full absolute flex items-center justify-center transition-transform duration-700 ease-out"
                  style={{ transform: `rotate(${qiblaMetrics.bearing}deg)` }}
                >
                  <div className="w-1.5 h-20 sm:h-24 bg-gradient-to-b from-[#c5a880] via-emerald-600 to-transparent rounded-full shadow-md relative">
                    <div className="w-3 h-3 bg-white border border-[#c5a880] rounded-full absolute -top-1 -left-0.5 shadow animate-ping" />
                  </div>
                </div>
                <div className="w-4 h-4 bg-[#020a06] border-2 border-[#c5a880] rounded-full z-10" />
              </div>
              <p className="text-[11px] text-stone-500 mt-5 tracking-wide text-center leading-relaxed">Align your physical device until the golden coordinate pointer converges directly north-ward.</p>
            </div>

            {/* HIGH-PRECISION MATHEMATICAL SUMMARY CARD */}
            <div className="space-y-4">
              <div className="bg-[#031d14]/60 border border-[#c5a880]/20 p-5 sm:p-6 rounded-3xl shadow-xl backdrop-blur-md space-y-4">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#c5a880]">Spherical Geodesic Engine</span>
                <h3 className="text-xl sm:text-2xl font-black font-serif text-white tracking-wide">Makkah Al-Mukarramah</h3>
               <p className={"text-xs text-stone-400 leading-relaxed"}>
  {"Derived matching global orthodromic arcs based on the mathematical positioning coordinates of the holy Kaaba ($21.4225^\\circ\\text{ N}, 39.8262^\\circ\\text{ E}$)"}
</p>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-black/30 border border-emerald-950 p-4 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">True Azimuth</p>
                    <p className="text-xl sm:text-2xl font-black font-mono text-[#c5a880] mt-1 tabular-nums">{qiblaMetrics.bearing}°</p>
                  </div>
                  <div className="bg-black/30 border border-emerald-950 p-4 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Geodesic Distance</p>
                    <p className="text-xl sm:text-2xl font-black font-mono text-white mt-1 tabular-nums">{qiblaMetrics.distance} <span className="text-xs text-stone-400 font-sans">km</span></p>
                  </div>
                </div>
              </div>

              {/* ASTRO LOGICAL ZENITH PROHIBITED WINDOWS INSIGHT CARD */}
              <div className="p-5 rounded-2xl bg-black/20 border border-emerald-950 flex gap-3 text-[11px] text-stone-400 leading-relaxed">
                <Info className="w-4 h-4 text-[#c5a880] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-stone-200">Prohibited Prayer Bounds Reminder</p>
                  <p>Avoid executing acts of prostration during explicit astronomical transition periods: exact solar noon (Zawal Zenith), exact solar rise, and direct sunset horizons.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* METRICS INFO SUB-BAR FOOTER */}
        <div className="p-4 rounded-xl bg-black/20 border border-emerald-950/40 flex gap-3 text-[11px] text-stone-500 max-w-3xl leading-relaxed">
          <Info className="w-4 h-4 text-emerald-800/80 shrink-0 mt-0.5" />
          <p>Calculations mapped via high-precision astronomical trigonometry parameters. Twilight calculation metrics shift adaptively depending on your selected jurisprudential system configuration settings.</p>
        </div>
      </div>
    </div>
  )
}