/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'lora': ['Lora', 'serif'],
        'sans': ['Lora', 'serif'], // Make Lora the default
      },
      colors: {
        // PomoDo exact color palette
        'dark-bg': '#1a1a1a',
        'dark-card': '#262626', 
        'dark-border': '#404040',
        'dark-text': '#e5e5e5',
        'dark-muted': '#a3a3a3',
        // Light mode colors
        'light-bg': '#fafafa',
        'light-card': '#ffffff',
        'light-border': '#e5e5e5',
        'light-text': '#171717',
        'light-muted': '#737373',
      },
      animation: {
        'loadingProgress': 'loadingProgress 15s linear infinite',
        'slideIn': 'slideIn 0.3s ease-out',
        'slideUp': 'slideUp 0.3s ease-out',
        'scaleIn': 'scaleIn 0.2s ease-out',
        'fadeIn': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        loadingProgress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}

