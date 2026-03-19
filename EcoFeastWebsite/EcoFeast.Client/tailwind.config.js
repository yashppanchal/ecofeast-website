/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'eco-dark': '#0C1A0A',
        'eco-green': '#2B3A1B',
        'eco-gold': '#C9A96E',
        'eco-gold-dark': '#A88B4A',
        'eco-cream': '#E8E0D0',
      },
      fontFamily: {
        'display': ['"Playfair Display"', 'serif'],
        'body': ['"DM Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
