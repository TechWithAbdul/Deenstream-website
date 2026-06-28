import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Loader2, Heart, Copy, Check } from 'lucide-react';

export default function Duas() {
  const [duas, setDuas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/duas')
      .then(res => setDuas(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-islamic-deep flex items-center space-x-2">
        <Heart className="w-6 h-6 text-red-500 fill-red-500" />
        <span>Prophetic Supplications</span>
      </h1>

      {loading ? (
        <div className="h-60 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-islamic-emerald" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(duas || []).map((dua) => (
            <div key={dua.id} className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:border-islamic-gold/20 transition-all">
              <div className="space-y-3">
                <span className="px-2 py-0.5 bg-islamic-ivory border border-islamic-gold/20 text-islamic-gold text-xs rounded-md font-medium">{dua.category || 'General'}</span>
                <div className="text-right text-2xl font-arabic text-stone-900 leading-loose font-medium pt-2">{dua.arabic}</div>
                <p className="text-sm text-stone-500 italic font-medium">{dua.transliteration}</p>
                <p className="text-sm text-stone-700 leading-relaxed pt-1 border-t border-stone-100">{dua.translation}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-400 pt-2">
                <span>Ref: {dua.reference || 'Authentic Supplication'}</span>
                <button 
                  onClick={() => handleCopy(`${dua.arabic}\n\n${dua.translation}`, dua.id)}
                  className="flex items-center space-x-1 px-2.5 py-1 border rounded-lg hover:bg-stone-50 hover:text-stone-700 transition-colors"
                >
                  {copiedId === dua.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === dua.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}