const BASE_URL = 'http://127.0.0.1:8000/';

export const apiService = {
  async getChapters() {
    const res = await fetch(`${BASE_URL}/quran/chapters`);
    return res.json();
  },
  async getSurah(id) {
    const res = await fetch(`${BASE_URL}/quran/surah/${id}`);
    return res.json();
  },
  async getPrayerTimes(lat, lng, tz, date) {
    const res = await fetch(`${BASE_URL}/calculations/prayer-times?latitude=${lat}&longitude=${lng}&timezone=${tz}&date=${date}`);
    return res.json();
  },
  async getQibla(lat, lng) {
    const res = await fetch(`${BASE_URL}/calculations/qibla?latitude=${lat}&longitude=${lng}`);
    return res.json();
  },
  async postAiChat(prompt, keyword = "") {
    const res = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, context_keyword: keyword })
    });
    return res.json();
  }
};