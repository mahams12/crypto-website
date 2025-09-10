/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Cointelegraph-inspired color palette
        primary: {
          50: '#fffef7',   // Very light yellow
          100: '#fffbeb',  // Light yellow
          200: '#fef3c7',  // Pale yellow
          300: '#fde68a',  // Light gold
          400: '#facc15',  // Medium yellow
          500: '#FFD700',  // Primary gold (Cointelegraph yellow)
          600: '#eab308',  // Darker yellow
          700: '#a16207',  // Gold
          800: '#854d0e',  // Dark gold
          900: '#713f12',  // Very dark gold
        },
        
        // Black and dark grays (Cointelegraph's dark theme)
        dark: {
          50: '#f8f8f8',   // Very light gray
          100: '#f0f0f0',  // Light gray
          200: '#e4e4e4',  // Gray
          300: '#d1d1d1',  // Medium gray
          400: '#a8a8a8',  // Dark gray
          500: '#666666',  // Darker gray
          600: '#525252',  // Very dark gray
          700: '#333333',  // Almost black
          800: '#1a1a1a',  // Very dark
          900: '#0d0d0d',  // Nearly black
          950: '#000000',  // Pure black
        },
        
        // Success/Danger colors (keeping crypto standards)
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#00D4AA',  // Crypto green
          600: '#00b894',
          700: '#009875',
          800: '#00795f',
          900: '#006249',
        },
        
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#FF4747',  // Crypto red
          600: '#e53e3e',
          700: '#c53030',
          800: '#9b2c2c',
          900: '#742a2a',
        },
        
        warning: {
          50: '#fffef7',
          100: '#fffbeb',
          200: '#fef3c7',
          300: '#fde68a',
          400: '#facc15',
          500: '#FFD700',  // Same as primary yellow
          600: '#eab308',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        
        // Additional utility colors
        gray: {
          50: '#ffffff',
          100: '#f8f8f8',
          200: '#e4e4e4',
          300: '#cccccc',  // Secondary text
          400: '#a8a8a8',
          500: '#666666',  // Placeholder text
          600: '#525252',
          700: '#333333',  // Borders
          800: '#1a1a1a',  // Card backgrounds
          900: '#0d0d0d',
          950: '#000000',  // Main background
        }
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-yellow': 'linear-gradient(135deg, #FFD700 0%, #FFED4A 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
      },
      
      boxShadow: {
        'glow': '0 0 20px rgba(255, 215, 0, 0.3)',
        'glow-strong': '0 0 30px rgba(255, 215, 0, 0.5)',
        'glow-green': '0 0 20px rgba(0, 212, 170, 0.3)',
        'glow-red': '0 0 20px rgba(255, 71, 71, 0.3)',
        'card-hover': '0 8px 32px rgba(255, 215, 0, 0.1)',
      },
      
      screens: {
        'xs': '475px',
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      
      fontSize: {
        'xxs': '0.625rem',
        '2.5xl': '1.75rem',
        '3.5xl': '2rem',
        '4.5xl': '2.5rem',
      },
      
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    // Add any plugins here
    // require('@tailwindcss/forms')({ strategy: 'class' }),
    // require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
}