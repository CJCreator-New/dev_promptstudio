/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
        secondary: {
          300: '#cbd5e1',
          700: '#334155',
          800: '#1e293b',
        },
        muted: {
          400: '#94a3b8',
          500: '#64748b',
        }
      },
      spacing: {
        'app': '1.5rem',
        'safe': '0.75rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translate3d(0, 0.5rem, 0)', opacity: '0' },
          '100%': { transform: 'translate3d(0, 0, 0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale3d(0.95, 0.95, 1)', opacity: '0' },
          '100%': { transform: 'scale3d(1, 1, 1)', opacity: '1' },
        },
        spin: {
          '0%': { transform: 'rotate3d(0, 0, 1, 0deg)' },
          '100%': { transform: 'rotate3d(0, 0, 1, 360deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        }
      }
    },
  },
  plugins: [],
}