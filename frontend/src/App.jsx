import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

const Home = lazy(()=> import('./pages/Home'))
const Quran = lazy(()=> import('./pages/Quran'))
const Hadith = lazy(()=> import('./pages/Hadith'))
const Prayer = lazy(()=> import('./pages/Prayer'))
const Chat = lazy(()=> import('./pages/Chat'))

export default function App(){
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-gray-800">
        <Header />
        <Suspense fallback={<div className="p-6">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/quran/:surah?/:ayah?" element={<Quran/>} />
            <Route path="/hadith" element={<Hadith/>} />
            <Route path="/prayer" element={<Prayer/>} />
            <Route path="/chat" element={<Chat/>} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
