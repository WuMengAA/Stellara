import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './app.vue',
    './pages/**/*.vue',
    './layouts/**/*.vue',
    './components/**/*.vue',
    './composables/**/*.ts',
    './error.vue',
  ],
  theme: {
    container: { center: true },
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        muted: 'var(--color-muted)',
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        'on-accent': 'var(--color-on-accent)',
        'on-accent-soft': 'var(--color-on-accent-soft)',
        bordertheme: 'var(--color-border)',
        stellara: {
          void: 'var(--color-background)',
          deep: 'var(--color-panel)',
          purple: 'var(--color-purple)',
          blue: 'var(--color-blue)',
          pink: 'var(--color-pink)',
          glow: 'var(--color-accent)',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Noto Sans SC', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 3.8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.25)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
