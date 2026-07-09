// src/components/Layout.jsx
import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Home, BookOpen, Scroll, Heart, MessageSquare, Menu, X, Moon, Clock } from 'lucide-react' 
const NAV_ITEMS = [
  { to: '/',        label: 'Home',           icon: Home },
  { to: '/quran',    label: 'Noble Quran',    icon: BookOpen },
  { to: '/hadith',   label: 'Hadith Library', icon: Scroll },
  { to: '/prayers',  label: 'Prayer Times',   icon: Clock }, 
  { to: '/duas',     label: 'Supplications',  icon: Heart },
  { to: '/ai-chat',  label: 'AI Companion',   icon: MessageSquare },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  return (


    <header className="relative top-0 z-80" style={{ background: 'rgba(2,23,17,0.92)', borderColor: 'rgba(197,168,128,0.15)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity">
        <img 
          src="/logo.png" 
          alt="logo" 
          className="w-11 h-11"
        />
        <div className="leading-none">
              <p className="text-white font-bold text-xl tracking-wide group-hover:text-amber-200 transition-colors">DEENSTREAM AI</p>
              <p className="text-[7px] tracking-[0.2em]" style={{ color: '#c5a880' }}>Learn.Knowledge.Authentic</p>
            </div>
      </div>
          </Link>

          <nav className="hidden lg:flex gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                    isActive ? 'text-white' : 'text-emerald-100/60 border-transparent hover:text-white'
                  }`
                }
                style={({ isActive }) => isActive ? { borderColor: 'rgba(197,168,128,0.4)', background: 'rgba(197,168,128,0.06)' } : {}}
              >
                <Icon className="w-3.5 h-3.5" />{label}
              </NavLink>
            ))}
          </nav>

   
          

          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg text-emerald-200 hover:bg-white/5 transition-colors" aria-label="Toggle menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t px-4 pb-4 pt-2 animate-fade-in" style={{ background: 'rgba(2,23,17,0.97)', borderColor: 'rgba(197,168,128,0.15)' }}>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl my-1 text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-emerald-200/70 hover:text-white hover:bg-white/5'
                }`
              }
              style={({ isActive }) => isActive ? { background: 'rgba(197,168,128,0.08)', border: '1px solid rgba(197,168,128,0.3)' } : {}}
            >
              <Icon className="w-4 h-4" />{label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t" style={{ background: '#021711', borderColor: 'rgba(197,168,128,0.12)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center border" style={{ borderColor: 'rgba(197,168,128,0.4)' }}>
                <Moon className="w-3.5 h-3.5" style={{ color: '#c5a880' }} />
              </div>
              <span className="text-white font-bold text-sm">DEESTREAM<span style={{ color: '#c5a880' }}> AI</span></span>
            </div>
            <p className="text-emerald-100/40 text-xs leading-relaxed max-w-xs">
              A premium global Islamic platform — Quran, Hadith, prayer, and an AI companion sourced from authentic sources.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: '#c5a880' }}>EXPLORE</p>
            <ul className="space-y-2 text-sm text-emerald-100/50">
              <li><Link to="/quran" className="hover:text-white transition-colors">Quran Reader</Link></li>
              <li><Link to="/hadith" className="hover:text-white transition-colors">Hadith Library</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: '#c5a880' }}>PRACTICE</p>
            <ul className="space-y-2 text-sm text-emerald-100/50">
              <li><Link to="/duas" className="hover:text-white transition-colors">Supplications</Link></li>
              <li><Link to="/ai-chat" className="hover:text-white transition-colors">AI Companion</Link></li>
              <li><Link to="/prayers" className="hover:text-white transition-colors">Prayer Times</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: '#c5a880' }}>PLATFORM</p>
            <ul className="space-y-2 text-sm text-emerald-100/50">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/ai-chat" className="hover:text-white transition-colors">Ask AI</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t" style={{ borderColor: 'rgba(197,168,128,0.1)' }}>
          <p className="text-emerald-100/30 text-xs">© 2026 DeenStream AI. Developed By <a href="https://www.linkedin.com/in/abdul-rehman-460b59353/" target="_blank" rel="noopener noreferrer" className="text-[#c5a880] hover:underline">Abdul Rehman</a>.</p> 
          <p className="text-xs" style={{ color: 'rgba(197,168,128,0.4)', fontFamily: 'Amiri,serif' }} lang="ar">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        </div>
      </div>
    </footer>
  )
}

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#021711' }}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
