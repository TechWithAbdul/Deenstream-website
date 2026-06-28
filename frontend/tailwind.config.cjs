/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['D:\frontend projects\Deestream website\frontend\public\index.html', 'D:\frontend projects\Deestream website\frontend/src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Core dark theme
        obsidian: '#021511',
        malachite: {
          DEFAULT: '#062c22',
          50: '#0a3d2f',
          100: '#0d4e3d',
          200: '#10604a',
          300: '#147258',
          400: '#178465',
          500: '#1a9673',
          600: '#1ea880',
          700: '#21ba8e',
          800: '#25cc9b',
          900: '#28dea9',
        },
        gold: {
          DEFAULT: '#d4af37',
          50: '#fdf8e8',
          100: '#f9edbc',
          200: '#f5e290',
          300: '#f0d764',
          400: '#eccc38',
          500: '#d4af37',
          600: '#b8932d',
          700: '#9c7823',
          800: '#805c19',
          900: '#64410f',
        },
        // Surface colors
        surface: {
          DEFAULT: '#0a1f1b',
          dim: '#031713',
          bright: '#1a3828',
          container: '#0f231f',
          'container-low': '#0a1f1b',
          'container-high': '#1a2e29',
          'container-highest': '#243934',
        },
        // Text colors
        'on-surface': '#d0e8e0',
        'on-surface-dim': '#8a9e96',
        // Status colors
        success: '#4ade80',
        warning: '#fbbf24',
        error: '#f87171',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        inter: ['"Inter"', 'system-ui', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        arabic: ['"Amiri"', 'serif'],
        urdu: ['"Noto Nastaliq Urdu"', '"Amiri"', 'serif'],
      },
      fontSize: {
        'quran': ['2rem', { lineHeight: '2.2', fontWeight: '400' }],
        'quran-lg': ['2.5rem', { lineHeight: '2.2', fontWeight: '400' }],
        'urdu': ['1.25rem', { lineHeight: '2.8', fontWeight: '400' }],
        'urdu-lg': ['1.5rem', { lineHeight: '2.8', fontWeight: '400' }],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'float': 'float 3s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.4)' },
          '50%': { boxShadow: '0 0 20px 10px rgba(212, 175, 55, 0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
        'glass-lg': '0 16px 48px 0 rgba(0, 0, 0, 0.48)',
        'gold': '0 0 20px rgba(212, 175, 55, 0.15)',
        'gold-lg': '0 0 40px rgba(212, 175, 55, 0.25)',
        'inner-glow': 'inset 0 1px 0 0 rgba(212, 175, 55, 0.1)',
      },
    },
  },
  plugins: [],
};
