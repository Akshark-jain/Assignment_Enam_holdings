/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#090d16',
          card: '#0f172a',
          cardLight: '#141e33',
          border: '#1e293b',
          borderHover: '#334155',
          text: '#f1f5f9',
          muted: '#94a3b8',
          accent: '#06b6d4',
          bull: '#10b981',
          bear: '#f43f5e',
          warning: '#f59e0b',
          primary: '#3b82f6'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
