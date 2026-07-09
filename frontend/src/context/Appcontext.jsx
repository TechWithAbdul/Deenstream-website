// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { prayerApi } from '../services/api'

const AppContext = createContext(null)
const PRAYER_KEYS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

function parsePrayerTimes(payload) {
  const innerData = payload?.data || {}
  return payload?.times || innerData.prayer_times || innerData.timings || payload?.timings || {}
}

function getNextPrayer(timings) {
  const now = new Date()
  const todayStr = now.toLocaleDateString('en-CA')
  for (const name of PRAYER_KEYS) {
    const timeStr = timings[name]
    if (!timeStr) continue
    const [h, m] = timeStr.split(':').map(Number)
    const pDate = new Date(`${todayStr}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`)
    if (pDate > now) return { name, time: timeStr, date: pDate }
  }
  // Wrap to next Fajr
  const fajrTime = timings['Fajr']
  if (fajrTime) {
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tStr = tomorrow.toLocaleDateString('en-CA')
    const [h, m] = fajrTime.split(':').map(Number)
    return { name: 'Fajr', time: fajrTime, date: new Date(`${tStr}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`) }
  }
  return null   // ← was MISSING closing brace + return null in your file
}

export function AppProvider({ children }) {
  const [currentSurah, setCurrentSurah] = useState(null)
  const [prayerTimes, setPrayerTimes] = useState(null)
  const [nextPrayer, setNextPrayer] = useState(null)
  const [hijriDate, setHijriDate] = useState('')
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

  const [prayerLoading, setPrayerLoading] = useState(false)
  const [prayerError, setPrayerError] = useState(null)
  const [countdown, setCountdown] = useState('')

  const fetchAllPrayerData = useCallback(async (lat, lng, method) => {
    if (!lat || !lng) return
    setPrayerLoading(true)
    setCalendarLoading(true)
    setPrayerError(null)
    try {
      const dailyRes = await prayerApi.getTimes(lat, lng, method)
      // Extract Hijri date if present
      if (dailyRes.data?.data?.date?.hijri) {
        const h = dailyRes.data.data.date.hijri
        setHijriDate(`${h.day} ${h.month.en} ${h.year}`)
      }
      const timings = parsePrayerTimes(dailyRes.data)
      setPrayerTimes(timings)
      setNextPrayer(getNextPrayer(timings))

      // Monthly data — try backend, fall back to simulated
      try {
        const currentMonth = new Date().getMonth() + 1
        const currentYear = new Date().getFullYear()
        const monthlyRes = await prayerApi.getMonthlyTimes(lat, lng, method, currentMonth, currentYear)
        setMonthlyData(monthlyRes.data?.data || monthlyRes.data || [])
      } catch {
        const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
        const simulated = Array.from({ length: daysInMonth }, (_, i) => ({
          date: {
            gregorian: { date: `${String(i+1).padStart(2,'0')}-${String(new Date().getMonth()+1).padStart(2,'0')}-${new Date().getFullYear()}` },
            hijri: { day: i + 1, month: { en: 'Muharram' }, year: 1447 },
          },
          timings: { ...timings },
        }))
        setMonthlyData(simulated)
      }
    } catch (err) {
      setPrayerError(err?.response?.data?.detail || err?.message || 'Failed to load prayer data.')
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

  useEffect(() => {
    if (!nextPrayer?.date) { setCountdown(''); return }
    const tick = () => {
      const diff = nextPrayer.date - Date.now()
      if (diff <= 0) {
        setCountdown('Now')
        if (userCoords) fetchAllPrayerData(userCoords.lat, userCoords.lng, prayerMethod)
        return
      }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCountdown(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [nextPrayer, userCoords, prayerMethod, fetchAllPrayerData])

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) { setPrayerError('Geolocation not supported.'); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setPrayerError('Location permission denied.')
    )
  }, [])

  return (
    <AppContext.Provider value={{
      currentSurah, setCurrentSurah,
      prayerTimes, nextPrayer, prayerMethod, setPrayerMethod,
      userCoords, setUserCoords,
      prayerLoading, calendarLoading, prayerError,
      countdown, fetchPrayerTimes: fetchAllPrayerData,
      requestLocation, PRAYER_KEYS, hijriDate, monthlyData,
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