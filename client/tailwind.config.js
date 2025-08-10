// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'parchment': '#F5F5DC',
        'ink': '#3a2e2e',
        'wood': '#8B4513',
        'gold': '#DAA520',
        // Dark theme colors
        'dark-bg': '#1a1a1a',
        'dark-ink': '#e0e0e0',
        'dark-wood': '#4a2c1a',
        'dark-gold': '#b8860b',
      },
      fontFamily: {
        serif: ['Lora', 'serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}