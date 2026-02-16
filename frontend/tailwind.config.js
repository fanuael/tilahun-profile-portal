/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1d232b',
        muted: '#556171',
        gold: {
          DEFAULT: '#b7864b',
          strong: '#8e6030',
          light: '#d4a574'
        },
        teal: '#2f6569',
        bg: '#f4efe6',
        bgsoft: '#fbf8f2',
        brown: {
          50: '#f9f6f1',
          100: '#ecdfce',
          200: '#e1cdb1',
          300: '#d1b896',
          400: '#b7864b'
        },
        cream: '#f5ede2',
        paper: '#fefef8',
        wood: '#3e2a1f',
      },
      fontSize: {
        'display-lg': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-lg': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-md': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-sm': ['1.25rem', { lineHeight: '1.5', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        'body-md': ['1rem', { lineHeight: '1.625' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
      },
      boxShadow: {
        'premium': '0 20px 50px rgba(0, 0, 0, 0.08), 0 0px 1px rgba(0, 0, 0, 0.08)',
        'card': '0 10px 30px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 20px 40px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)',
        'soft': '0 16px 34px rgba(18, 24, 30, 0.12)',
        'lg': '0 20px 50px rgba(18, 24, 30, 0.15)',
        'xl': '0 25px 60px rgba(18, 24, 30, 0.2)',
        'glow': '0 0 30px rgba(183, 134, 75, 0.15)',
        'glow-strong': '0 0 40px rgba(183, 134, 75, 0.25)',
        'elevation': '0 8px 24px rgba(18, 24, 30, 0.08)',
        'inner-subtle': 'inset 0 1px 2px rgba(255, 255, 255, 0.3), inset 0 -1px 2px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        xl2: '30px',
        lg2: '22px',
        md2: '16px',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'gradient-mesh': 'radial-gradient(circle at 20% 50%, rgba(183, 134, 75, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% -20%, rgba(47, 101, 105, 0.05) 0%, transparent 50%)',
        'gradient-paper': 'linear-gradient(135deg, #fefef8 0%, #f9f6f1 50%, #f1ede8 100%)',
        'gradient-book': 'linear-gradient(135deg, #3e2a1f 0%, #5c3d2e 100%)',
        'gradient-gold': 'linear-gradient(135deg, #b7864b 0%, #d4a574 50%, #8e6030 100%)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(183, 134, 75, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(183, 134, 75, 0.2)' },
        },
        pulse-soft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        hoverLift: {
          '0%': { transform: 'translateY(0px)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)' },
          '100%': { transform: 'translateY(-8px)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        fadeIn: 'fadeIn 0.6s ease-out both',
        slideInLeft: 'slideInLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        slideInRight: 'slideInRight 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        slideInDown: 'slideInDown 0.6s ease-out both',
        scaleIn: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        shimmer: 'shimmer 2s infinite',
        float: 'float 4s ease-in-out infinite',
        glow: 'glow 3s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'hover-lift': 'hoverLift 0.3s ease-out forwards',
      },
        slideInLeft: 'slideInLeft 0.6s ease-out both',
        slideInRight: 'slideInRight 0.6s ease-out both',
        scaleIn: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        shimmer: 'shimmer 2s infinite',
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 3s ease-in-out infinite',
      },
      spacing: {
        'safe': 'max(1.5rem, env(safe-area-inset-left))',
      },
    },
  },
  plugins: [],
}
