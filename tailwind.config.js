/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#f5f4ed',
          dark: '#080a09',
        },
        text: {
          dark: '#e3ddd7',
        },
      },
    },
  },
  plugins: [],
};