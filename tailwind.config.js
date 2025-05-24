/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        astral: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
        },
        secondary: {
          DEFAULT: '#10B981',
          dark: '#059669',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        premium: '#8b5cf6',
      },
      boxShadow: {
        'astral': '0 4px 14px 0 rgba(59, 130, 246, 0.4)',
      }
    },
  },
  plugins: [],
}