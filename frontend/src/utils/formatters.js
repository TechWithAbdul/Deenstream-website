export function shortDate(dt){ try{ const d = new Date(dt); return d.toLocaleString() }catch(e){ return dt } }

export function sanitizeText(s){ return s?.replace(/\n{2,}/g, '\n') }
