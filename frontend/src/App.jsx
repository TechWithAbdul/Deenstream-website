import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import FloatingAssistant from './components/ai/FloatingAssistant';
import Home from './pages/Home';
import QuranReader from './pages/Quran';
import HadithExplorer from './pages/Hadith';
import ToolsHub from './pages/Aichat';
import Duas from './pages/Duas';
import FullAIChat from './pages/FullAIChat';

export default function App() {
  const [view, setView] = useState('home');
  const [locale, setLocale] = useState('EN');

  // Multi-page routing layout engine inside Single Page Application pattern
  const renderView = () => {
    switch (view) {
      case 'home': return <Home setView={setView} />;
      case 'quran': return <QuranReader />;
      case 'hadith': return <HadithExplorer />;
      case 'tools': return <ToolsHub />;
      case 'duas': return <Duas />;
      case 'ai-chat': return <FullAIChat />;
      default: return <Home setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-obsidian selection:bg-gold selection:text-obsidian text-gray-100 flex flex-col justify-between">
      <div>
        <Navbar currentView={view} setView={setView} locale={locale} setLocale={setLocale} />
        {renderView()}
      </div>
      <FloatingAssistant />
    </div>
  );
}