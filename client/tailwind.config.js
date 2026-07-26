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
        // ── Stitch MarbleCraft Design System ──────────────────────────
        'surface':                    '#fcf9f8',
        'surface-dim':                '#dcd9d9',
        'surface-bright':             '#fcf9f8',
        'surface-container-lowest':   '#ffffff',
        'surface-container-low':      '#f6f3f2',
        'surface-container':          '#f0eded',
        'surface-container-high':     '#eae7e7',
        'surface-container-highest':  '#e4e2e1',
        'surface-variant':            '#e4e2e1',
        'surface-tint':               '#5f5e5e',
        'on-surface':                 '#1b1c1c',
        'on-surface-variant':         '#444748',
        'inverse-surface':            '#303030',
        'inverse-on-surface':         '#f3f0f0',
        'outline':                    '#747878',
        'outline-variant':            '#c4c7c7',
        'background':                 '#fcf9f8',
        'on-background':              '#1b1c1c',

        'primary':                    '#000000',
        'on-primary':                 '#ffffff',
        'primary-container':          '#1c1b1b',
        'on-primary-container':       '#858383',
        'primary-fixed':              '#e5e2e1',
        'primary-fixed-dim':          '#c8c6c5',
        'on-primary-fixed':           '#1c1b1b',
        'on-primary-fixed-variant':   '#474646',
        'inverse-primary':            '#c8c6c5',

        'secondary':                  '#755b00',
        'on-secondary':               '#ffffff',
        'secondary-container':        '#fed255',
        'on-secondary-container':     '#735a00',
        'secondary-fixed':            '#ffe08e',
        'secondary-fixed-dim':        '#ecc246',
        'on-secondary-fixed':         '#241a00',
        'on-secondary-fixed-variant': '#584400',

        'tertiary':                   '#000000',
        'on-tertiary':                '#ffffff',
        'tertiary-container':         '#1a1c1c',
        'on-tertiary-container':      '#838484',
        'tertiary-fixed':             '#e2e2e2',
        'tertiary-fixed-dim':         '#c6c6c6',
        'on-tertiary-fixed':          '#1a1c1c',
        'on-tertiary-fixed-variant':  '#454747',

        'error':                      '#ba1a1a',
        'on-error':                   '#ffffff',
        'error-container':            '#ffdad6',
        'on-error-container':         '#93000a',

        // Gold accent for hover/interactive states
        'gold-accent':                '#C9A227',

        // ── Legacy / backwards compat ─────────────────────────────────
        gold: {
          50:  '#fbf8eb',
          100: '#f5eecf',
          200: '#ebdc9d',
          300: '#dfc261',
          400: '#d4af37',
          500: '#b8901c',
          600: '#947013',
          700: '#705111',
          800: '#523a12',
          900: '#38250f',
        },
        luxury: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          900: '#0f172a',
          950: '#0a0a0c',
        },
      },

      fontFamily: {
        sans:     ['Inter', 'sans-serif'],
        serif:    ['Cormorant Garamond', 'Playfair Display', 'Cinzel', 'serif'],
        heading:  ['Cormorant Garamond', 'Playfair Display', 'Cinzel', 'serif'],
        // Type token aliases
        'display-lg':        ['Cormorant Garamond', 'Playfair Display', 'serif'],
        'display-lg-mobile': ['Cormorant Garamond', 'Playfair Display', 'serif'],
        'headline-xl':       ['Cormorant Garamond', 'Playfair Display', 'serif'],
        'headline-lg':       ['Cormorant Garamond', 'Playfair Display', 'serif'],
        'body-lg':           ['Inter', 'sans-serif'],
        'body-md':           ['Inter', 'sans-serif'],
        'label-caps':        ['Inter', 'sans-serif'],
      },

      fontSize: {
        // ── Stitch type scale ─────────────────────────────────────────
        'display-lg': ['72px', {
          lineHeight:    '1.1',
          letterSpacing: '-0.04em',
          fontWeight:    '600',
        }],
        'display-lg-mobile': ['40px', {
          lineHeight:    '1.2',
          letterSpacing: '-0.02em',
          fontWeight:    '600',
        }],
        'headline-xl': ['48px', {
          lineHeight:    '1.2',
          letterSpacing: '-0.02em',
          fontWeight:    '500',
        }],
        'headline-lg': ['32px', {
          lineHeight:  '1.3',
          fontWeight:  '500',
        }],
        'body-lg': ['18px', {
          lineHeight: '1.6',
          fontWeight: '400',
        }],
        'body-md': ['16px', {
          lineHeight: '1.6',
          fontWeight: '400',
        }],
        'label-caps': ['12px', {
          lineHeight:    '1',
          letterSpacing: '0.1em',
          fontWeight:    '600',
        }],
      },

      spacing: {
        // ── Stitch spacing tokens ─────────────────────────────────────
        'unit':             '8px',
        'section-gap':      '160px',
        'margin-desktop':   '80px',
        'margin-mobile':    '20px',
        'gutter':           '32px',
        'container-max':    '1440px',
      },

      borderRadius: {
        'DEFAULT': '0.5rem',
        'sm':      '0.25rem',
        'md':      '0.75rem',
        'lg':      '1rem',
        'xl':      '1.5rem',
        'full':    '9999px',
      },

      transitionDuration: {
        '400': '400ms',
      },

      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in':    'fadeIn 0.5s ease-out forwards',
        'shimmer':    'shimmer 2s infinite linear',
        'spin-slow':  'spin 3s linear infinite',
      },

      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      backdropBlur: {
        'xl': '20px',
      },

      maxWidth: {
        'container-max': '1440px',
      },

      height: {
        'screen-minus-nav': 'calc(100vh - 80px)',
      },
    },
  },
  plugins: [],
};
