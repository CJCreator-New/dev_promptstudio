/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        /* Semantic tokens */
        background: 'rgb(var(--bg-base) / <alpha-value>)',
        elevated: 'rgb(var(--bg-elevated) / <alpha-value>)',
        overlay: 'rgb(var(--bg-overlay) / <alpha-value>)',
        subtle: 'rgb(var(--bg-subtle) / <alpha-value>)',
        
        foreground: 'rgb(var(--text-primary) / <alpha-value>)',
        muted: 'rgb(var(--text-secondary) / <alpha-value>)',
        subtle: 'rgb(var(--text-tertiary) / <alpha-value>)',
        inverse: 'rgb(var(--text-inverse) / <alpha-value>)',
        
        border: 'rgb(var(--border-default) / <alpha-value>)',
        'border-subtle': 'rgb(var(--border-subtle) / <alpha-value>)',
        'border-strong': 'rgb(var(--border-strong) / <alpha-value>)',
        
        'accent-primary': 'rgb(var(--accent-primary) / <alpha-value>)',
        'accent-primary-hover': 'rgb(var(--accent-primary-hover) / <alpha-value>)',
        'accent-primary-subtle': 'rgb(var(--accent-primary-subtle) / <alpha-value>)',
        
        'accent-success': 'rgb(var(--accent-success) / <alpha-value>)',
        'accent-success-hover': 'rgb(var(--accent-success-hover) / <alpha-value>)',
        'accent-success-subtle': 'rgb(var(--accent-success-subtle) / <alpha-value>)',
        
        'accent-warning': 'rgb(var(--accent-warning) / <alpha-value>)',
        'accent-warning-hover': 'rgb(var(--accent-warning-hover) / <alpha-value>)',
        'accent-warning-subtle': 'rgb(var(--accent-warning-subtle) / <alpha-value>)',
        
        'accent-error': 'rgb(var(--accent-error) / <alpha-value>)',
        'accent-error-hover': 'rgb(var(--accent-error-hover) / <alpha-value>)',
        'accent-error-subtle': 'rgb(var(--accent-error-subtle) / <alpha-value>)',
        
        'accent-info': 'rgb(var(--accent-info) / <alpha-value>)',
        'accent-info-hover': 'rgb(var(--accent-info-hover) / <alpha-value>)',
        'accent-info-subtle': 'rgb(var(--accent-info-subtle) / <alpha-value>)',
        
        interactive: 'rgb(var(--interactive-default) / <alpha-value>)',
        'interactive-hover': 'rgb(var(--interactive-hover) / <alpha-value>)',
        'interactive-active': 'rgb(var(--interactive-active) / <alpha-value>)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in-top': 'slideInFromTop 0.2s ease-out',
        'slide-in-bottom': 'slideInFromBottom 0.2s ease-out',
        'zoom-in': 'zoomIn 0.2s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideInFromTop: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideInFromBottom: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        zoomIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
