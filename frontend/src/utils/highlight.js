import React from 'react'

// Returns an array of React nodes with matched query parts wrapped in <mark>
export function highlightText(text = '', query = ''){
  if(!query) return text
  try{
    const escaped = query.replace(/[.*+?^${}()|[\\]\\]/g, '\\\\$&')
    const re = new RegExp(`(${escaped})`, 'ig')
    const parts = text.split(re)
    return parts.map((part, i)=> re.test(part) ? React.createElement('mark', {key:i, className: 'bg-yellow-100 rounded px-0.5'}, part) : part)
  }catch(e){
    return text
  }
}
