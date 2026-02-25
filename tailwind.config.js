/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0b0f0b',
        secondary: '#111715',
        accent: '#16a34a',
        'accent-hover': '#15803d',
        highlight: '#facc15',
      },
      fontFamily: {
        sans: ['Inter', 'Source Sans Pro', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
