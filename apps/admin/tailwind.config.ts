import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border:      'hsl(var(--border))',
        'border-strong': 'hsl(var(--border-strong))',
        input:       'hsl(var(--input))',
        ring:        'hsl(var(--ring))',
        background:  'hsl(var(--background))',
        'background-alt':      'hsl(var(--background-alt))',
        'background-elevated': 'hsl(var(--background-elevated))',
        foreground:  'hsl(var(--foreground))',
        'foreground-secondary': 'hsl(var(--foreground-secondary))',
        'foreground-muted':    'hsl(var(--foreground-muted))',
        'foreground-subtle':   'hsl(var(--foreground-subtle))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        brand: {
          50:  '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
          400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
          800: '#92400e', 900: '#78350f', 950: '#1c0a00',
        },
        emergency: {
          DEFAULT: '#ef4444',
          light: '#fca5a5',
        },
        warm: {
          50:  '#faf8f4', 100: '#f5f0e8', 200: '#ede8df',
          300: '#e4ddd5', 400: '#d4cdbf', 500: '#b3afac',
          600: '#8c8480', 700: '#6b6460', 800: '#524d49', 900: '#1e1a17',
        },
        success: { DEFAULT: '#22c55e', light: '#86efac' },
      },
      boxShadow: {
        'brand':    '0 0 40px rgba(245,158,11,0.15)',
        'brand-sm': '0 0 20px rgba(245,158,11,0.10)',
        'brand-md': '0 4px 32px rgba(245,158,11,0.20), 0 2px 12px rgba(245,158,11,0.12)',
        'sm-warm':  '0 1px 3px rgba(90,70,40,0.08), 0 1px 2px rgba(90,70,40,0.04)',
        'card-warm': '0 1px 4px rgba(90,70,40,0.08), 0 4px 16px rgba(90,70,40,0.06)',
      },
      borderRadius: {
        lg:   'var(--radius)',
        md:   'calc(var(--radius) - 2px)',
        sm:   'calc(var(--radius) - 4px)',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      fontFamily: {
        sans:    ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
