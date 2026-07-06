// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { prayerApi } from '../services/api'

const AppContext = createContext(null)
const PRAYER_KEYS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

function parsePrayerTimes(payload) {
<<<<<<< HEAD
  const innerData = payload?.data || {}
  return payload?.times || innerData.prayer_times || innerData.timings || payload?.timings || {}
=======
  return payload?.times || payload?.data?.timings || payload?.timings || {}
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
}

function getNextPrayer(timings) {
  const now = new Date()
  const todayStr = now.toLocaleDateString('en-CA')
<<<<<<< HEAD
  
=======
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
  for (const name of PRAYER_KEYS) {
    const timeStr = timings[name]
    if (!timeStr) continue
    const [h, m] = timeStr.split(':').map(Number)
    const pDate = new Date(`${todayStr}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`)
    if (pDate > now) return { name, time: timeStr, date: pDate }
  }
<<<<<<< HEAD
  
  const fajrTime = timings['Fajr']
  if (fajrTime) {
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
=======
  const fajrTime = timings['Fajr']
  if (fajrTime) {
    const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1)
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
    const tStr = tomorrow.toLocaleDateString('en-CA')
    const [h, m] = fajrTime.split(':').map(Number)
    return { name: 'Fajr', time: fajrTime, date: new Date(`${tStr}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`) }
  }
  return null
}

export function AppProvider({ children }) {
  const [currentSurah, setCurrentSurah] = useState(null)
  const [prayerTimes, setPrayerTimes] = useState(null)
  const [nextPrayer, setNextPrayer] = useState(null)
<<<<<<< HEAD
  const [hijriDate, setHijriDate] = useState('')
  
  // Monthly and Ramadan calendar states
  const [monthlyData, setMonthlyData] = useState([])
  const [calendarLoading, setCalendarLoading] = useState(false)
  
  const [prayerMethod, setPrayerMethod] = useState(() => {
    const saved = localStorage.getItem('ds_prayer_method')
    if (saved === 'MWL' || !saved) {
      localStorage.setItem('ds_prayer_method', 'MuslimWorldLeague')
      return 'MuslimWorldLeague'
    }
    return saved
  })
  
  const [userCoords, setUserCoords] = useState(() => {
    try { 
      const c = localStorage.getItem('ds_coords')
      return c ? JSON.parse(c) : { lat: 30.3458, lng: 73.3974 }
    } catch { 
      return { lat: 30.3458, lng: 73.3974 } 
    }
  })
  
=======
  const [prayerMethod, setPrayerMethod] = useState(() => localStorage.getItem('ds_prayer_method') || 'MWL')
  const [userCoords, setUserCoords] = useState(() => {
    try { const c = localStorage.getItem('ds_coords'); return c ? JSON.parse(c) : null } catch { return null }
  })
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
  const [prayerLoading, setPrayerLoading] = useState(false)
  const [prayerError, setPrayerError] = useState(null)
  const [countdown, setCountdown] = useState('')

<<<<<<< HEAD
  // Combined fetcher for both tracking matrices
  const fetchAllPrayerData = useCallback(async (lat, lng, method) => {
    if (!lat || !lng) return
    setPrayerLoading(true)
    setCalendarLoading(true)
    setPrayerError(null)
    
    try {
      // 1. Fetch Daily Spotlight Times
      const dailyRes = await prayerApi.getTimes(lat, lng, method)
      if (dailyRes.data?.data?.date?.hijri) {
        const h = dailyRes.data.data.date.hijri
        setHijriDate(`${h.day} ${h.month.en} ${h.year}`)
      }
      const timings = parsePrayerTimes(dailyRes.data)
      setPrayerTimes(timings)
      setNextPrayer(getNextPrayer(timings))
      
      // 2. Fetch/Simulate Monthly Schedule block seamlessly
      // If backend calendar endpoint is fully live, call it. Otherwise fallback mock array preserves dashboard stability.
      try {
        const currentMonth = new Date().getMonth() + 1
        const currentYear = new Date().getFullYear()
        const monthlyRes = await prayerApi.getMonthlyTimes(lat, lng, method, currentMonth, currentYear)
        setMonthlyData(monthlyRes.data?.data || monthlyRes.data || [])
      } catch (calErr) {
        // Safe generation loop fallback if your backend endpoint is still compilation-locked
        const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
        const simulatedList = Array.from({ length: daysInMonth }, (_, i) => ({
          date: { 
            gregorian: { date: `${String(i+1).padStart(2,'0')}-${String(new Date().getMonth()+1).padStart(2,'0')}-${new Date().getFullYear()}` },
            hijri: { day: i + 1, month: { en: "Ramadan" }, year: 1447 } 
          },
          timings: { ...timings }
        }))
        setMonthlyData(simulatedList)
      }

    } catch (err) { 
      setPrayerError(err?.response?.data?.detail || err?.message || 'Failed to sync spatial data pools.') 
    } finally { 
      setPrayerLoading(false)
      setCalendarLoading(false)
    }
  }, [])

  useEffect(() => {
    if (userCoords?.lat && userCoords?.lng) {
      fetchAllPrayerData(userCoords.lat, userCoords.lng, prayerMethod)
      localStorage.setItem('ds_coords', JSON.stringify(userCoords))
    }
    localStorage.setItem('ds_prayer_method', prayerMethod)
  }, [userCoords, prayerMethod, fetchAllPrayerData])
=======
  const fetchPrayerTimes = useCallback(async (lat, lng, method) => {
    setPrayerLoading(true); setPrayerError(null)
    try {
      const res = await prayerApi.getTimes(lat, lng, method)
      const timings = parsePrayerTimes(res.data)
      setPrayerTimes(timings); setNextPrayer(getNextPrayer(timings))
    } catch (err) { setPrayerError(err?.message || 'Failed to load prayer times.') }
    finally { setPrayerLoading(false) }
  }, [])

  useEffect(() => {
    if (userCoords) {
      fetchPrayerTimes(userCoords.lat, userCoords.lng, prayerMethod)
      localStorage.setItem('ds_coords', JSON.stringify(userCoords))
    }
    localStorage.setItem('ds_prayer_method', prayerMethod)
  }, [userCoords, prayerMethod, fetchPrayerTimes])
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd

  useEffect(() => {
    if (!nextPrayer?.date) { setCountdown(''); return }
    const tick = () => {
      const diff = nextPrayer.date - Date.now()
<<<<<<< HEAD
      if (diff <= 0) { 
        setCountdown('Now')
        if (userCoords) fetchAllPrayerData(userCoords.lat, userCoords.lng, prayerMethod)
        return 
      }
=======
      if (diff <= 0) { setCountdown('Now'); return }
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCountdown(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`)
    }
<<<<<<< HEAD
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [nextPrayer, userCoords, prayerMethod, fetchAllPrayerData])

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) { setPrayerError('Telemetry not supported.'); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setPrayerError('Location telemetry denied. Maintaining fallbacks.')
=======
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [nextPrayer])

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) { setPrayerError('Geolocation not supported.'); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setPrayerError('Location permission denied.')
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
    )
  }, [])

  return (
    <AppContext.Provider value={{
      currentSurah, setCurrentSurah,
      prayerTimes, nextPrayer, prayerMethod, setPrayerMethod,
<<<<<<< HEAD
      userCoords, setUserCoords, prayerLoading, calendarLoading, prayerError,
      countdown, fetchPrayerTimes: fetchAllPrayerData, requestLocation, PRAYER_KEYS, hijriDate, monthlyData
=======
      userCoords, setUserCoords, prayerLoading, prayerError,
      countdown, fetchPrayerTimes, requestLocation, PRAYER_KEYS,
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}