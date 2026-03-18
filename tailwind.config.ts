import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0f5ff',
          100: '#dde8ff',
          200: '#c0d4ff',
          300: '#95b6ff',
          400: '#6492ff',
          500: '#2b70ef',
          600: '#2250df',
          700: '#1a40b5',
          800: '#13318d',
          900: '#0e266a',
          950: '#07194e',
        },
        body: '#3d4b5f',
      },
      fontFamily: {
        sans: ['Inter', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
