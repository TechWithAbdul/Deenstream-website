import React from 'react';
import PrayerCountdown from '../components/dashboard/PrayerCountdown';
import { BookOpen, MessageSquare, Heart, Sparkles, ArrowRight } from 'lucide-react';

export default function LandingPage({ setTab }) {
  const cards = [
    { id: 'quran', title: 'The Holy Quran', desc: 'Read and explore holy revelations with interactive translations and audio controls.', icon: BookOpen, color: 'from-emerald-900 to-islamic-emerald' },
    { id: 'hadith', title: 'Hadith Archives', desc: 'Browse prophetic wisdom from Sahih al-Bukhari, Muslim, and canonical records cleanly.', icon: BookOpen, color: 'from-amber-900 to-islamic-gold' },
    { id: 'duas', title: 'Supplications Hub', desc: 'Access essential authentic duas extracted directly from prophetic traditions.', icon: Heart, color: 'from-stone-900 to-stone-800' },
    { id: 'ai', title: 'AI Companion', desc: 'Have contextual queries answered regarding islamic contexts through safe proxy channels.', icon: MessageSquare, color: 'from-teal-900 to-teal-800' },
  ];

  return (
    <div className="space-y-16 animate-fadeIn">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-islamic-deep via-emerald-950 to-stone-900 text-white rounded-3xl p-8 md:p-16 shadow-2xl border border-islamic-gold/20 text-center space-y-6">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-islamic-gold/20 border border-islamic-gold/30 text-islamic-amber text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Islamic Knowledge Portal</span>
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
          Discover Clarity, Wisdom, and Spiritual Enrichment
        </h1>
        <p className="text-stone-300 max-w-2xl mx-auto text-base md:text-lg">
          Deestream beautifully bridges authentic traditional frameworks with highly accelerated AI pipelines. Secure, fast, and gorgeous.
        </p>
      </div>

      {/* Feature Grid Blocks */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-islamic-deep border-b border-stone-200 pb-3 tracking-wide">Explore Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.id}
                onClick={() => setTab(card.id)}
                className="group relative bg-white border border-stone-200/80 hover:border-islamic-gold/30 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-islamic-amber shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-islamic-emerald transition-colors">{card.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{card.desc}</p>
                </div>
                <div className="mt-6 flex items-center text-sm font-semibold text-islamic-gold space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Open Section</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}