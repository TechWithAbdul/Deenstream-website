import React, { useState, useEffect } from 'react';

export default function PrayerCountdown() {
  const [timeLeft, setTimeLeft] = useState('02:44:12');
  const [activePrayer, setActivePrayer] = useState('Dhuhr');

  // Hardcoded real-time tracking preview mock for standalone execution integrity
  const prayers = [
    { name: 'Fajr', time: '04:12 AM', passed: true },
    { name: 'Dhuhr', time: '12:24 PM', active: true },
    { name: 'Asr', time: '03:45 PM', active: false },
    { name: 'Maghrib', time: '07:15 PM', active: false },
    { name: 'Isha', time: '08:48 PM', active: false },
  ];

  return (
    <div className="glassmorphic rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl"></div>
      <span className="text-xs uppercase text-emerald-400 tracking-widest font-semibold mb-2 block">Next Active Interval</span>
      
      {/* Radial Ring UI Segment Wrapper */}
      <div className="relative w-44 h-44 flex items-center justify-center mb-4">
        <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="rgba(6, 44, 34, 0.8)" strokeWidth="6" fill="transparent" />
          <circle cx="50" cy="50" r="40" stroke="#d4af37" strokeWidth="6" fill="transparent" 
            strokeDasharray="251.2" strokeDashoffset="75" strokeLinecap="round" className="transition-all duration-1000"/>
        </svg>
        <div className="text-center z-10">
          <span className="text-3xl font-black text-white block tracking-tighter">{timeLeft}</span>
          <span className="text-xs text-gold uppercase tracking-widest block font-medium">until {activePrayer}</span>
        </div>
      </div>

      <div className="w-full grid grid-cols-5 gap-1 mt-2 bg-obsidian/40 p-2 rounded-xl border border-gold/5">
        {prayers.map((p) => (
          <div key={p.name} className={`p-1.5 rounded-lg text-center ${p.active ? 'bg-gold/10 border border-gold/40' : ''}`}>
            <span className={`text-[10px] block font-bold ${p.active ? 'text-gold' : 'text-gray-500'}`}>{p.name}</span>
            <span className="text-[9px] block text-gray-400 mt-0.5">{p.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}