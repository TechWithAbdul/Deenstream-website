import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
})

export default api
