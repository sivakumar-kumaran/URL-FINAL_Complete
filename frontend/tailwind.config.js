/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        // Professional Teal/Cyan Theme
        primary: {
          50: '#cffafe',
          100: '#a5f3fc',
          200: '#67e8f9',
          300: '#22d3ee',
          400: '#06b6d4',
          500: '#0891b2',
          600: '#0e7490',
          700: '#155e75',
          800: '#164e63',
          900: '#0c2d3d',
        },
        secondary: {
          50: '#ccfdf5',
          100: '#99fbf0',
          200: '#5eead4',
          300: '#2dd4bf',
          400: '#14b8a6',
          500: '#0d9488',
          600: '#0d8476',
          700: '#0f6950',
          800: '#115e59',
          900: '#134e4a',
        },
        accent: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #14b8a6 100%)',
        'gradient-primary-dark': 'linear-gradient(135deg, #164e63 0%, #0c4a6e 50%, #0f766e 100%)',
        'gradient-primary-to-right': 'linear-gradient(90deg, #0891b2 0%, #06b6d4 100%)',
        'gradient-accent': 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
        'gradient-warm': 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
      },
      boxShadow: {
        'glass-light': '0 8px 32px 0 rgba(8, 145, 178, 0.1)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-teal': '0 0 20px rgba(6, 182, 212, 0.4)',
        'glow-primary': '0 0 30px rgba(8, 145, 178, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(8, 145, 178, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(8, 145, 178, 0.6)' },
        },
      },
      backdropBlur: {
        glass: '12px',
      },
    },
  },
  plugins: [],
}
