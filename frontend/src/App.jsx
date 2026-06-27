import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

const Home = lazy(()=> import('./pages/Home'))
const Quran = lazy(()=> import('./pages/Quran'))
const Hadith = lazy(()=> import('./pages/Hadith'))
const Prayer = lazy(()=> import('./pages/Prayer'))
const Chat = lazy(()=> import('./pages/Chat'))

export default function App(){
  return (
    <Layout>
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/quran" element={<Quran/>} />
          <Route path="/hadith" element={<Hadith/>} />
          <Route path="/prayer" element={<Prayer/>} />
          <Route path="/chat" element={<Chat/>} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
