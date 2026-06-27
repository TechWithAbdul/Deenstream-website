import { useState, useEffect } from 'react'

export default function useTheme(){
  const [mode, setMode] = useState(typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'light') : 'light')
  useEffect(()=>{ document.documentElement.setAttribute('data-theme', mode); localStorage.setItem('theme', mode) }, [mode])
  return { mode, setMode }
}
