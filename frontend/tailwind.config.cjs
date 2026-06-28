/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#021511',
        malachite: '#062c22',
        gold: '#d4af37',
        mutedGold: '#aa8c2c',
        glassWhite: 'rgba(255, 255, 255, 0.03)',
        glassBorder: 'rgba(212, 175, 55, 0.15)'
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
        urdu: ['Noto Nastaliq Urdu', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}