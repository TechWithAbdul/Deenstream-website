import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Loader2, Book } from 'lucide-react';

export default function Hadith() {
  const [collections, setCollections] = useState([]);
  const [activeSlug, setActiveSlug] = useState('');
  const [hadithContainer, setHadithContainer] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const availableBooks = [
    { slug: 'bukhari', name: 'Sahih al-Bukhari' },
    { slug: 'muslim', name: 'Sahih Muslim' },
    { slug: 'tirmidhi', name: 'Jami al-Tirmidhi' },
    { slug: 'abudawud', name: 'Sunan Abi Dawud' },
    { slug: 'nasai', name: 'Sunan an-Nasa\'i' },
    { slug: 'ibnmajah', name: 'Sunan Ibn Majah' },
    { slug: 'malik', name: 'Muwatta Malik' }
  ];

  useEffect(() => {
    if (!activeSlug) return;
    setLoading(true);
    api.get(`/hadith/${activeSlug}?page=${page}&limit=10`)
      .then(res => {
        const rootData = res.data?.data || res.data || {};
        setHadithContainer(rootData.hadiths || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [activeSlug, page]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Book Choices Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {availableBooks.map((book) => (
          <button
            key={book.slug}
            onClick={() => { setActiveSlug(book.slug); setPage(1); }}
            className={`p-3 text-center rounded-xl text-xs font-semibold tracking-wide border transition-all ${
              activeSlug === book.slug 
                ? 'bg-gradient-to-br from-amber-700 to-islamic-gold text-white border-transparent shadow-md scale-105' 
                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
            }`}
          >
            {book.name}
          </button>
        ))}
      </div>

      {/* Main Hadith Array Feed View Box */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm min-h-[50vh]">
        {!activeSlug ? (
          <div className="h-[40vh] flex flex-col items-center justify-center text-center text-stone-400 space-y-2">
            <Book className="w-12 h-12 text-stone-300" />
            <p className="text-sm">Select a standard Hadith catalog source framework above to request records feed.</p>
          </div>
        ) : loading ? (
          <div className="h-[40vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-islamic-gold" /></div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-6">
              {(hadithContainer || []).map((item, idx) => (
                <div key={idx} className="p-5 bg-stone-50/50 border border-stone-100 rounded-xl space-y-4">
                  <span className="inline-block px-2.5 py-1 bg-stone-200 text-stone-700 font-mono text-xs rounded-md">Hadith #{item.hadith_number || idx+1}</span>
                  {item.arabic && <div className="text-right text-2xl font-arabic text-stone-900 leading-loose font-medium">{item.arabic}</div>}
                  <p className="text-stone-700 text-sm leading-relaxed pl-3 border-l-2 border-islamic-gold/40">{item.text_en || item.translation || 'Translation data block unassigned.'}</p>
                </div>
              ))}
            </div>

            {/* Pagination controls wrapper blocks */}
            <div className="flex items-center justify-between border-t border-stone-100 pt-4">
              <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-4 py-2 border rounded-xl text-sm font-medium hover:bg-stone-50 disabled:opacity-40">Previous</button>
              <span className="text-sm text-stone-500 font-medium">Page Index: {page}</span>
              <button onClick={() => setPage(p => p + 1)} className="px-4 py-2 border rounded-xl text-sm font-medium hover:bg-stone-50">Next Page</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}