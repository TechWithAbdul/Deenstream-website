import React from 'react';

export default function Navbar({ currentView, setView, locale, setLocale }) {
  const menuItems = [
    { id: 'home', label: 'Dashboard' },
    { id: 'quran', label: 'Quran Reader' },
    { id: 'hadith', label: 'Hadith' },
    { id: 'tools', label: 'Tools Hub' },
    { id: 'duas', label: 'Duas' },
    { id: 'ai-chat', label: 'Research AI' }
  ];

  return (
    <nav className="sticky top-0 z-50 glassmorphic border-b border-gold/10 px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
        <div className="w-10 h-10 rounded-xl border-2 border-gold flex items-center justify-center bg-malachite/80 font-serif text-gold text-xl font-bold">
          ﷽
        </div>
        <div>
          <span className="text-xl font-bold tracking-wider gold-gradient-text block">DEENSTREAM AI</span>
          <span className="text-[10px] uppercase text-emerald-400 tracking-widest block -mt-1">Quantum Ummah Ecosystem</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-1 bg-obsidian/60 p-1 rounded-full border border-gold/10">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-300 ${
              currentView === item.id 
                ? 'bg-gold text-obsidian font-bold shadow-lg shadow-gold/20' 
                : 'text-gray-300 hover:text-gold hover:bg-glassWhite'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-malachite/60 px-3 py-1.5 rounded-lg border border-gold/20 text-xs text-gold font-semibold">
        <button onClick={() => setLocale('EN')} className={`px-1.5 py-0.5 rounded ${locale === 'EN' ? 'bg-gold text-obsidian' : ''}`}>EN</button>
        <span className="opacity-30">|</span>
        <button onClick={() => setLocale('AR')} className={`px-1.5 py-0.5 rounded ${locale === 'AR' ? 'bg-gold text-obsidian' : ''}`}>AR</button>
        <span className="opacity-30">|</span>
        <button onClick={() => setLocale('UR')} className={`px-1.5 py-0.5 rounded ${locale === 'UR' ? 'bg-gold text-obsidian' : ''}`}>UR</button>
      </div>
    </nav>
  );
}