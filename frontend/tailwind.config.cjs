module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#047857', // emerald
        accent: '#D4AF37'   // gold
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        arabic: ['AmiriCustom', 'Noto Nastaliq Urdu', 'serif']
      }
    }
  },
  plugins: []
}
