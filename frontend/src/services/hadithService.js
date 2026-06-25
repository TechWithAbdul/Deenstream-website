import axios from 'axios'

const HADITH_API = 'https://www.hadithapi.com/api'

export async function fetchCollection(name){
  // placeholder - real hadithapi endpoints require key; return empty structure to avoid breaking UI
  return { data: [] }
}

export async function searchHadith(q){
  return { data: [] }
}
