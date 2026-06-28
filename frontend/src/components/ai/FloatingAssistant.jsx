import React, { useState } from 'react';
import { Sparkles, X, Send } from 'lucide-react';


export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuickAsk = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setResponse('');
    try {
      const res = await apiService.postAiChat(input);
      setResponse(res.response);
    } catch {
      setResponse("System latency connection error. Verify localized API instances.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen ? (
        <div className="w-80 h-96 glassmorphic rounded-2xl shadow-2xl border border-gold/30 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 bg-malachite border-b border-gold/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold animate-pulse" />
              <span className="text-xs font-bold tracking-wider text-white">DeenStream Live Context Explainer</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gold">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto text-xs space-y-3 bg-obsidian/40">
            {response ? (
              <div className="p-3 rounded-xl bg-malachite/40 border border-gold/10 text-gray-200 leading-relaxed">
                {response}
              </div>
            ) : (
              <p className="text-gray-400 italic text-center pt-12">Highlight scripture or prompt an instant context query overlay anywhere across the ecosystem.</p>
            )}
            {loading && <div className="text-gold animate-pulse text-center">Injesting core matrices...</div>}
          </div>

          <form onSubmit={handleQuickAsk} className="p-2 bg-malachite/80 border-t border-gold/10 flex gap-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything instantly..."
              className="flex-1 bg-obsidian text-xs text-white p-2 rounded-lg border border-gold/15 focus:outline-none focus:border-gold"
            />
            <button type="submit" className="p-2 bg-gold rounded-lg text-obsidian font-bold hover:bg-gold/80 transition-colors">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-gold via-mutedGold to-malachite flex items-center justify-center text-obsidian shadow-xl shadow-gold/10 hover:scale-105 active:scale-95 transition-transform border border-gold/40"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
}