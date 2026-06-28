import React, { useState } from 'react';
import api from '../services/api';
import { Send, Loader2, Bot, User } from 'lucide-react';

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Assalamu Alaikum! I am your intelligent assistant. Feel free to ask contextual analytical questions regarding your research data sheets.' }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSending(true);

    api.post('/ai/chat', { message: input })
      .then(res => {
        setMessages(prev => [...prev, { role: 'assistant', content: res.data?.response || 'No response captured.' }]);
      })
      .catch(err => {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Connection issue encountered contacting proxy gateway endpoint pipelines.' }]);
      })
      .finally(() => setSending(false));
  };

  return (
    <div className="max-w-4xl mx-auto h-[75vh] border border-stone-200 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden animate-fadeIn">
      {/* Box Header Banner */}
      <div className="bg-gradient-to-r from-islamic-deep to-emerald-950 p-4 text-white flex items-center space-x-3 shadow-md">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-islamic-amber"><Bot className="w-5 h-5" /></div>
        <div>
          <h2 className="text-sm font-bold tracking-wide">Deestream AI Scholar Assistant</h2>
          <span className="text-xs text-emerald-400 font-medium flex items-center space-x-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span><span>Online via Apizio Proxy Pipeline</span></span>
        </div>
      </div>

      {/* Messages Stream Content Area */}
      <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-stone-50/50">
        {messages.map((msg, index) => {
          const isBot = msg.role === 'assistant';
          return (
            <div key={index} className={`flex items-start space-x-3 ${!isBot ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${isBot ? 'bg-islamic-emerald text-islamic-amber' : 'bg-islamic-gold text-white'}`}>
                {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={`max-w-[75%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${isBot ? 'bg-white border border-stone-200 text-stone-800' : 'bg-islamic-deep text-white'}`}>
                <p className="whitespace-pre-line">{msg.content}</p>
              </div>
            </div>
          );
        })}
        {sending && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-islamic-emerald text-islamic-amber flex items-center justify-center shadow-sm"><Bot className="w-4 h-4" /></div>
            <div className="bg-white border border-stone-200 p-4 rounded-2xl shadow-sm"><Loader2 className="w-4 h-4 animate-spin text-stone-400" /></div>
          </div>
        )}
      </div>

      {/* Chat input box form bar wrapper */}
      <form onSubmit={handleSend} className="p-4 border-t border-stone-200 bg-white flex items-center space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-grow p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-islamic-emerald transition-colors"
        />
        <button type="submit" disabled={!input.trim() || sending} className="p-3 rounded-xl bg-islamic-deep text-islamic-amber hover:bg-emerald-950 transition-colors shadow-md disabled:opacity-50">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}