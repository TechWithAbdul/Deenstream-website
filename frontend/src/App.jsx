import React, { useState } from 'react';
import Aichat from './pages/Aichat'; // Notice the lowercase 'h' matching your image
import Dashboard from './pages/Dashboard';
import Duas from './pages/Duas';
import Hadith from './pages/Hadith';
import Quran from './pages/Quran';
import { Compass, BookOpen, MessageSquare, Heart, Home } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');

  const renderView = () => {
    switch (currentTab) {
      case 'home': return <Dashboard setTab={setCurrentTab} />;
      case 'quran': return <Quran />;
      case 'hadith': return <Hadith />;
      case 'duas': return <Duas />;
      case 'ai': return <AIchat />;
      default: return <Dashboard setTab={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-islamic-ivory text-stone-800 flex flex-col font-sans selection:bg-islamic-amber/30">
      {/* Sticky Premium Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-islamic-deep/90 border-b border-islamic-gold/20 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('home')}>
            <div className="bg-gradient-to-br from-islamic-amber to-islamic-gold p-2.5 rounded-xl shadow-md">
              <Compass className="w-6 h-6 text-islamic-deep animate-spin-slow" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-wide block bg-gradient-to-r from-white to-stone-300 bg-clip-text text-transparent">DEESTREAM</span>
              <span className="text-xs text-islamic-amber font-medium uppercase tracking-widest block -mt-1">AI Engine</span>
            </div>
          </div>

          {/* Nav Items */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'quran', label: 'Noble Quran', icon: BookOpen },
              { id: 'hadith', label: 'Hadith Library', icon: BookOpen },
              { id: 'duas', label: 'Supplications', icon: Heart },
              { id: 'ai', label: 'AI Alim', icon: MessageSquare },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-islamic-emerald to-emerald-800 text-islamic-amber shadow-inner border border-islamic-gold/30' 
                      : 'text-stone-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-islamic-amber' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Dynamic Content Body Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>
     

      {/* Footer */}
      <footer className="bg-islamic-deep text-stone-400 border-t border-islamic-gold/10 py-6 mt-12 text-center text-xs">
        <p>© 2026 Deestream Platform. Powered by advanced AI stream models & authentic canonical arrays.</p>
      </footer>
      
    </div>
  );
}