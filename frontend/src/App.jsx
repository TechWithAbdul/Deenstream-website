// src/App.jsx
import React from 'react'
import { AppProvider } from './context/Appcontext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Quran from './pages/Quran'
import Hadith from './pages/Hadith'
import Prayers from './pages/Prayers'
import Duas from './pages/Duas'
import AIChat from './pages/Aichat'
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

// 404 view
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-4 text-center px-4">
      <p className="text-6xl font-bold text-emerald-100" style={{ fontFamily: 'Playfair Display,serif' }}>404</p>
      <h1 className="text-2xl font-bold text-slate-700">Page not found</h1>
      <p className="text-slate-400 text-sm max-w-xs">The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" className="btn-primary mt-2">← Return Home</a>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/"         element={<Dashboard />} />
            <Route path="/quran"    element={<Quran />} />
            <Route path="/hadith"   element={<Hadith />} />
            <Route path="/prayers"  element={<Prayers />} />
            <Route path="/duas"     element={<Duas />} />
            <Route path="/ai-chat"  element={<AIChat />} />
            <Route path="/404"      element={<NotFound />} />
            <Route path="*"         element={<Navigate to="/404" replace />} />
          </Routes>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  )
}