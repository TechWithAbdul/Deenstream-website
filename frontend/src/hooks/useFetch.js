import { useState, useEffect } from 'react'

export default function useFetch(asyncFn, deps=[]){
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(()=>{ let mounted=true; async function run(){ setLoading(true); try{ const res = await asyncFn(); if(mounted) setData(res)}catch(e){ if(mounted) setError(e)} setLoading(false) } run(); return ()=> mounted=false }, deps)

  return { data, loading, error }
}
