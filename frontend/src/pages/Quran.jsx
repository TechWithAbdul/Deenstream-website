import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Loader2, BookOpen, AlertCircle } from 'lucide-react';

export default function Quran() {
  const [chapters, setChapters] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [surahData, setSurahData] = useState(null);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoadingChapters(true);
    api.get('/quran/chapters')
      .then(res => {
        // Bulletproof safety mapping check
        setChapters(res.data || []);
        setError(null);
      })
      .catch(err => {
        setError('Failed to fetch the Surah index. Please verify your backend server connection.');
      })
      .finally(() => setLoadingChapters(false));
  }, []);

  const handleSelectSurah = (id) => {
    setSelectedSurah(id);
    setLoadingSurah(true);
    setSurahData(null);
    api.get(`/quran/surah/${id}?lang=en`)
      .then(res => {
        setSurahData(res.data?.data || res.data || {});
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingSurah(false));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn">
      {/* Left Menu Column Tracker */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm h-[75vh] flex flex-col">
        <h2 className="text-lg font-bold text-islamic-deep mb-4 px-2 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-islamic-gold" />
          <span>Select a Surah</span>
        </h2>
        
        {loadingChapters ? (
          <div className="flex-grow flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-islamic-gold" /></div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-start space-x-2"><AlertCircle className="w-5 h-5 flex-shrink-0" /><span>{error}</span></div>
        ) : (
          <div className="flex-grow overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {(chapters || []).map((ch) => (
              <button
                key={ch.number}
                onClick={() => handleSelectSurah(ch.number)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                  selectedSurah === ch.number 
                    ? 'bg-islamic-emerald text-white font-semibold shadow-md' 
                    : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-7 h-7 text-xs font-bold rounded-lg flex items-center justify-center ${selectedSurah === ch.number ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'}`}>
                    {ch.number}
                  </span>
                  <div>
                    <div className="text-sm font-medium">{ch.name_english}</div>
                    <div className={`text-xs ${selectedSurah === ch.number ? 'text-stone-200' : 'text-stone-400'}`}>{ch.name_translation}</div>
                  </div>
                </div>
                <div className={`font-arabic text-lg ${selectedSurah === ch.number ? 'text-islamic-amber' : 'text-islamic-emerald'}`}>
                  {ch.name_arabic}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Reading View Column Pane */}
      <div className="lg:grid-cols-1 lg:col-span-2 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm min-h-[75vh]">
        {!selectedSurah ? (
          <div className="h-[65vh] flex flex-col items-center justify-center text-center text-stone-400 space-y-3">
            <BookOpen className="w-12 h-12 text-stone-300" />
            <p className="text-sm">Select a surah chapter from the sidebar catalogue map to load text data blocks.</p>
          </div>
        ) : loadingSurah ? (
          <div className="h-[65vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-islamic-emerald" /></div>
        ) : (
          <div className="space-y-6">
            <div className="text-center border-b border-stone-100 pb-4">
              <h1 className="text-2xl font-bold text-islamic-deep">{surahData?.surah?.name_english || 'Surah Text'}</h1>
              <p className="text-sm text-stone-400">{surahData?.surah?.name_translation}</p>
            </div>
            
            <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2">
              {/* Fallback layout array verification loop mapping */}
              {(surahData?.ayahs || []).map((ayah, idx) => (
                <div key={idx} className="border-b border-stone-100 pb-6 space-y-4">
                  <div className="text-right text-3xl font-arabic text-stone-900 leading-loose tracking-wide font-medium">
                    {ayah.text_arabic} <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-islamic-gold/40 text-xs text-islamic-gold font-sans ml-2">{ayah.number_in_surah || idx+1}</span>
                  </div>
                  <div className="text-stone-600 text-sm leading-relaxed font-sans pl-2 border-l-2 border-stone-200">
                    {ayah.text_english || ayah.translation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}