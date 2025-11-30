/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#000000',      // Warm off-white background
        'secondary': '#00000',    // Light elegant grey
        'primary-light': '#00000', // Medium light grey
        'accent-blue': '#00000',  // Modern blue accent
        'accent-purple': '#00000', // Purple accent
        'text-dark': '#ffffff',    // Dark grey for text
        'text-medium': '#475569',  // Medium grey for secondary text
        'surface': '#000000',      // Pure white for surfaces
        'surface-light': '#f8fafc', // Very light surface
      },
    },
  },
  plugins: [],
};