import React from 'react'
import { motion } from 'framer-motion'

export default function Home(){
  return (
    <section className="py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <motion.h1 initial={{y:12, opacity:0}} animate={{y:0, opacity:1}} className="text-4xl font-bold text-primary">DeenStream AI</motion.h1>
          <p className="mt-4 text-gray-700">An AI-powered Islamic knowledge platform — Quran, Hadith, Prayer times, Islamic calendar, and an intelligent assistant to help you explore authentic sources.</p>
        </div>
        <div>
          <div className="card-glass p-6 shadow">Hero / quick modules go here (Qibla, Prayer times, Search)</div>
        </div>
      </div>
    </section>
  )
}
