/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          green: '#1DB954',
          black: '#191414',
          darkgray: '#121212',
          gray: '#535353',
          lightgray: '#B3B3B3',
          white: '#FFFFFF',
        }
      }
    },
  },
  plugins: [],
}