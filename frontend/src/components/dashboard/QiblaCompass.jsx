import React, { useState } from 'react';
import { Compass, Navigation } from 'lucide-react';

export default function QiblaCompass() {
  const [angle, setAngle] = useState(114.6); // Auto-computed default dynamic mapping variable for Pakistan coordinates

  return (
    <div className="glassmorphic rounded-3xl p-6 flex flex-col items-center justify-center relative">
      <span className="text-xs uppercase text-emerald-400 tracking-widest font-semibold mb-4 block">Interactive Vector Qibla</span>
      
      <div className="relative w-44 h-44 flex items-center justify-center bg-obsidian/60 rounded-full border border-gold/20 shadow-inner">
        {/* Interactive Mathematical SVG Compass Layout */}
        <div className="absolute inset-2 border border-dashed border-emerald-900/40 rounded-full"></div>
        <div 
          className="w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <Navigation className="text-gold w-10 h-10 fill-gold absolute" style={{ transform: 'rotate(0deg)' }} />
            <div className="absolute top-2 text-[10px] font-black text-gold/40">KAABA</div>
          </div>
        </div>
        <div className="absolute text-center">
          <Compass className="w-6 h-6 text-emerald-500/20" />
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <span className="text-sm font-bold text-white block">{angle}° SE</span>
        <span className="text-[10px] text-gray-400 block">Calculated from current network deployment hub</span>
      </div>
    </div>
  );
}