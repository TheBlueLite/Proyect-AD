/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0b0c10',
        darkCard: '#1f2833',
        neonBorder: '#45a29e',
        neonAccent: '#66fcf1',
      }
    },
  },
  plugins: [],
}