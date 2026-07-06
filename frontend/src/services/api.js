// src/utils/api.js
// Backend mounts every router under /api/v1 (confirmed via main.py + live logs).
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status
    const detail = error?.response?.data?.detail || error.message || 'Unknown error'
    const normalisedError = {
      status,
      message:
        status === 404 ? `Route not found (404): ${error?.config?.url || ''}` :
        status === 502 ? `Upstream error: ${detail}` :
        status === 503 ? 'Service temporarily unavailable.' :
        status === 429 ? 'Too many requests – please wait.' :
        detail,
      raw: error,
    }
    return Promise.reject(normalisedError)
  }
)

// ── Quran ──────────────────────────────────────────────────────────────────
// GET /api/v1/quran/chapters
// GET /api/v1/quran/surah/{surah_id}?translations=en
export const quranApi = {
  getChapters: () => api.get('/quran/chapters'),
  getSurah: (id, translations = 'en') => api.get(`/quran/surah/${id}`, { params: { translations } }),
<<<<<<< HEAD
  getJuz: (num) => api.get(`/quran/juz/${num}`),
=======
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd
}

// ── Hadith ─────────────────────────────────────────────────────────────────
// GET /api/v1/hadith/collections                       (book list — confirmed live, 200 OK)
// GET /api/v1/hadith/{collection_slug}?page=1&limit=20  (paginated hadiths)
export const hadithApi = {
  getCollections: () => api.get('/hadith/collections'),
  getCollection: (slug, page = 1, limit = 20) => api.get(`/hadith/${slug}`, { params: { page, limit } }),
}

// ── Prayer Times ───────────────────────────────────────────────────────────
// GET /api/v1/calculations/prayer-times?lat=&lng=&method=
export const prayerApi = {
<<<<<<< HEAD
  // Daily fallback timings from Aladhan
  getTimes: (lat, lng) => 
    axios.get(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=2`),

  // As shown in image_0c781c.png
  getMonthlyTimes: (lat, lng) => 
    ummahClient.get(`/api/prayer-times/month?lat=${lat}&lng=${lng}`),

  // As shown in image_0c7b1e.png (Configured for the year 2026)
  getRamadanTimetable: (lat, lng) => 
    ummahClient.get(`/api/ramadan/2026?lat=${lat}&lng=${lng}`),

  // As shown in image_0c7b97.png
  getQiblaData: (lat, lng) => 
    ummahClient.get(`/api/qibla?lat=${lat}&lng=${lng}`)
};
=======
  getTimes: (lat, lng, method = 'MWL') => api.get('/calculations/prayer-times', { params: { lat, lng, method } }),
}
>>>>>>> 1073f45ff56105adf9d83ba45c3ffb5e8aadc3fd

// ── Duas ───────────────────────────────────────────────────────────────────
// GET /api/v1/duas        (FULL flat list — each dua has id, arabic, transliteration,
//                          translation, reference, category. No category-list endpoint exists.)
// GET /api/v1/duas/{id}   (single dua by id)
export const duasApi = {
  getAll: () => api.get('/duas'),
  getById: (id) => api.get(`/duas/${id}`),
}

// ── 99 Names ───────────────────────────────────────────────────────────────
// GET /api/v1/names
// GET /api/v1/names/{name_id}
export const namesApi = {
  getAll: () => api.get('/names'),
  getById: (id) => api.get(`/names/${id}`),
}

// ── AI Chat ────────────────────────────────────────────────────────────────
// POST /api/v1/ai/chat   body: { message, history }
export const aiApi = {
  chat: (message, history = []) => api.post('/ai/chat', { message, history }),
}

export default api