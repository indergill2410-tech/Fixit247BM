import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem', xl: '4rem', '2xl': '5rem' },
    },
    extend: {
      colors: {
        /* ── Semantic tokens (CSS variable based) ── */
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
          hover:      'hsl(var(--primary-hover))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        /* ── Fixit247 Brand — Emergency Gold ── */
        brand: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',   /* PRIMARY — Emergency Gold */
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#1c0a00',
        },

        /* ── Emergency Red ── */
        emergency: {
          DEFAULT: '#ef4444',
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          light: '#fca5a5',
        },

        /* ── Warm Light Palette ── */
        warm: {
          50:  '#faf8f4',   /* Warm Ivory — light bg */
          100: '#f5f0e8',   /* Soft Cream — alt bg */
          200: '#ede8df',   /* Warm Sand — elevated */
          300: '#e4ddd5',   /* Light Border */
          400: '#d4cdbf',   /* Strong Border */
          500: '#b3afac',   /* Subtle Text */
          600: '#8c8480',   /* Muted Text */
          700: '#6b6460',   /* Secondary Text */
          800: '#524d49',   /* Body Text */
          900: '#1e1a17',   /* Rich Charcoal */
          950: '#0f0d0b',   /* Deepest */
        },

        /* ── Success ── */
        success: {
          DEFAULT: '#22c55e',
          light:   '#86efac',
        },

        /* ── Info ── */
        info: {
          DEFAULT: '#3b82f6',
          light:   '#93c5fd',
        },
      },

      /* ── Background Images ── */
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'brand-glow':       'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(245,158,11,0.15), transparent)',
        'brand-glow-light': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(245,158,11,0.10), transparent)',
        'hero-grid':        'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        'hero-grid-light':  'linear-gradient(rgba(90,70,40,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(90,70,40,0.05) 1px, transparent 1px)',
        /* Warm gradient for light mode hero */
        'warm-hero':        'linear-gradient(160deg, #faf8f4 0%, #f5f0e8 50%, #faf8f4 100%)',
        /* Premium card gradient */
        'card-shine':       'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,253,248,0.6) 100%)',
        /* Membership banner */
        'brand-banner':     'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0.03) 100%)',
        'brand-banner-light': 'linear-gradient(135deg, rgba(245,158,11,0.10) 0%, rgba(245,158,11,0.04) 100%)',
      },

      backgroundSize: {
        'grid': '60px 60px',
      },

      /* ── Shadows ── */
      boxShadow: {
        /* Brand glow */
        'brand':    '0 0 40px rgba(245,158,11,0.15)',
        'brand-sm': '0 0 20px rgba(245,158,11,0.10)',
        'brand-md': '0 4px 32px rgba(245,158,11,0.20), 0 2px 12px rgba(245,158,11,0.12)',
        'brand-lg': '0 0 60px rgba(245,158,11,0.20), 0 0 120px rgba(245,158,11,0.08)',

        /* Emergency */
        'emergency':    '0 0 30px rgba(239,68,68,0.20)',
        'emergency-md': '0 4px 24px rgba(239,68,68,0.22), 0 2px 8px rgba(239,68,68,0.14)',

        /* Glass */
        'glass-warm':    '0 4px 24px rgba(90,70,40,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
        'glass-warm-lg': '0 8px 40px rgba(90,70,40,0.10), inset 0 1px 0 rgba(255,255,255,0.95)',

        /* Cards */
        'card-warm':       '0 1px 4px rgba(90,70,40,0.08), 0 4px 16px rgba(90,70,40,0.06)',
        'card-warm-hover': '0 4px 12px rgba(90,70,40,0.12), 0 12px 32px rgba(90,70,40,0.10)',

        /* Generic elevation */
        'sm-warm': '0 1px 3px rgba(90,70,40,0.08), 0 1px 2px rgba(90,70,40,0.04)',
        'md-warm': '0 4px 12px rgba(90,70,40,0.10), 0 2px 6px rgba(90,70,40,0.06)',
        'lg-warm': '0 8px 32px rgba(90,70,40,0.12), 0 4px 16px rgba(90,70,40,0.06)',
        'xl-warm': '0 16px 48px rgba(90,70,40,0.14), 0 6px 24px rgba(90,70,40,0.08)',

        /* Glow combo */
        'glow': '0 0 60px rgba(245,158,11,0.12), 0 0 120px rgba(245,158,11,0.06)',
      },

      /* ── Border Radius ── */
      borderRadius: {
        lg:   'var(--radius)',
        md:   'calc(var(--radius) - 2px)',
        sm:   'calc(var(--radius) - 4px)',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },

      /* ── Typography ── */
      fontFamily: {
        sans:    ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-geist-mono)', 'monospace'],
        display: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        '8xl': ['5.5rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
        '9xl': ['7rem',   { lineHeight: '1', letterSpacing: '-0.05em' }],
      },
      letterSpacing: {
        tightest: '-0.05em',
        tighter:  '-0.04em',
        widest:   '0.2em',
      },

      /* ── Animations ── */
      animation: {
        'fade-in':        'fadeIn 0.4s ease-out',
        'fade-up':        'fadeUp 0.5s ease-out',
        'fade-up-slow':   'fadeUp 0.8s ease-out',
        'slide-up':       'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left':  'slideInLeft 0.3s ease-out',
        'pulse-dot':      'pulseDot 2s ease-in-out infinite',
        'shimmer':        'shimmer 2s linear infinite',
        'float':          'float 6s ease-in-out infinite',
        'float-slow':     'float 9s ease-in-out infinite',
        'spin-slow':      'spin 8s linear infinite',
        'bounce-sm':      'bounceSm 1s ease-in-out infinite',
        'ticker':         'ticker 30s linear infinite',
        'glow-pulse':     'glowPulse 3s ease-in-out infinite',
        'scale-in':       'scaleIn 0.2s ease-out',
        'ping-slow':      'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn:       { from: { opacity: '0' }, to: { opacity: '1' } },
        fadeUp:       { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideUp:      { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: '0', transform: 'translateX(8px)' },  to: { opacity: '1', transform: 'translateX(0)' } },
        slideInLeft:  { from: { opacity: '0', transform: 'translateX(-8px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(0.85)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        bounceSm: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(245,158,11,0.10)' },
          '50%':      { boxShadow: '0 0 40px rgba(245,158,11,0.25)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
