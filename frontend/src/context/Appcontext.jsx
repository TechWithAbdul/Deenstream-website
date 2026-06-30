// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { prayerApi } from '../services/api'

const AppContext = createContext(null)
const PRAYER_KEYS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

function parsePrayerTimes(payload) {
  return payload?.times || payload?.data?.timings || payload?.timings || {}
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
  const fajrTime = timings['Fajr']
  if (fajrTime) {
    const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1)
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
  const [prayerMethod, setPrayerMethod] = useState(() => localStorage.getItem('ds_prayer_method') || 'MWL')
  const [userCoords, setUserCoords] = useState(() => {
    try { const c = localStorage.getItem('ds_coords'); return c ? JSON.parse(c) : null } catch { return null }
  })
  const [prayerLoading, setPrayerLoading] = useState(false)
  const [prayerError, setPrayerError] = useState(null)
  const [countdown, setCountdown] = useState('')

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

  useEffect(() => {
    if (!nextPrayer?.date) { setCountdown(''); return }
    const tick = () => {
      const diff = nextPrayer.date - Date.now()
      if (diff <= 0) { setCountdown('Now'); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCountdown(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`)
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [nextPrayer])

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
      userCoords, setUserCoords, prayerLoading, prayerError,
      countdown, fetchPrayerTimes, requestLocation, PRAYER_KEYS,
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