import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    // small middleware to ensure root URL serves index.html
    {
      name: 'root-redirect',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/') req.url = '/index.html'
          next()
        })
      }
    }
  ],
  server: { host: '0.0.0.0', port: 5173, strictPort: false }
})
