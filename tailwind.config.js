/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0f172a',      // Dark slate background
        'secondary': '#1e293b',    // Dark grey
        'primary-light': '#334155', // Medium dark grey
        'accent-blue': '#60a5fa',  // Bright blue accent for dark mode
        'accent-purple': '#a78bfa', // Bright purple accent for dark mode
        'text-dark': '#f1f5f9',    // Light grey for text (inverted)
        'text-medium': '#cbd5e1',  // Medium light grey for secondary text
        'surface': '#1e293b',      // Dark surface
        'surface-light': '#334155', // Lighter dark surface
      },
    },
  },
  plugins: [],
};