import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Compass, Clock, MapPin, Loader2 } from 'lucide-react';

export default function Prayers() {
  const [prayerData, setPrayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [nextPrayer, setNextPrayer] = useState('');

  useEffect(() => {
    // Assuming your calculations.py endpoint sits under /calculations/timings or similar
    api.get('/calculations/timings?latitude=30.6778&longitude=73.3483') 
      .then(res => {
        const data = res.data?.data || res.data || {};
        setPrayerData(data);
        if (data.next_prayer) {
          setNextPrayer(data.next_prayer.name);
        }
      })
      .catch(err => console.error("Error loading timing metrics:", err))
      .finally(() => setLoading(false));
  }, []);

  // Live tick countdown effect
  useEffect(() => {
    if (!prayerData?.next_prayer?.time) return;

    const interval = setInterval(() => {
      const now = new Date();
      const [hours, minutes] = prayerData.next_prayer.time.split(':');
      const prayerTime = new Date();
      prayerTime.setHours(parseInt(hours), parseInt(minutes), 0);

      if (prayerTime < now) {
        prayerTime.setDate(prayerTime.getDate() + 1);
      }

      const diff = prayerTime - now;
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(`${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [prayerData]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-islamic-emerald" />
      </div>
    );
  }

  const timings = prayerData?.timings || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Live Countdown Widget Panel */}
      <div className="bg-gradient-to-br from-islamic-deep to-emerald-950 text-white p-8 rounded-3xl border border-islamic-gold/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs text-islamic-amber font-semibold uppercase tracking-widest block">Upcoming Supplication Window</span>
          <h2 className="text-3xl font-bold tracking-tight">Next Period: <span className="text-islamic-amber">{nextPrayer || 'Fajr'}</span></h2>
          <p className="text-sm text-stone-300 flex items-center justify-center md:justify-start gap-1">
            <MapPin className="w-4 h-4 text-islamic-amber" /> Automatic GPS Approximation Tracking
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/10 px-6 py-4 rounded-2xl text-center min-w-[200px]">
          <span className="text-xs text-stone-300 font-medium uppercase tracking-wider block mb-1">Time Remaining</span>
          <span className="text-2xl font-mono font-bold text-islamic-amber">{timeRemaining || '00:00:00'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timings List Grid Map */}
        <div className="lg:col-span-2 bg-white border border-stone-200 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-stone-900 border-b pb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-islamic-gold" /> Daily Schedule Schedule
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(timings).map(([name, time]) => (
              <div key={name} className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-100">
                <span className="font-semibold text-stone-700 capitalize">{name}</span>
                <span className="font-mono text-sm bg-white px-2.5 py-1 rounded-md border text-stone-600 shadow-sm">{time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Qibla Direction Visual Placement Context */}
        <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <h3 className="text-lg font-bold text-stone-900 w-full text-left border-b pb-2 flex items-center gap-2">
            <Compass className="w-5 h-5 text-islamic-gold" /> Qibla Pointer Locator
          </h3>
          <div className="relative w-40 h-40 bg-stone-50 rounded-full border-4 border-stone-200 shadow-inner flex items-center justify-center">
            <div className="absolute inset-2 border border-dashed border-stone-300 rounded-full"></div>
            {/* Visual placeholder pointing using your calculations.py degree results */}
            <Compass 
              className="w-20 h-20 text-islamic-emerald transition-transform duration-500 shadow-sm" 
              style={{ transform: `rotate(${prayerData?.qibla_direction || 261}deg)` }} 
            />
          </div>
          <div className="text-sm">
            <span className="block font-bold text-stone-800">Heading Alignment Degree</span>
            <span className="text-xs text-stone-500 font-mono">{prayerData?.qibla_direction || '261.4'}° relative to North orientation index</span>
          </div>
        </div>
      </div>
    </div>
  );
}