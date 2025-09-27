/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2D3250',
        secondary: '#424769',
        accent: '#F6B17A',
        light: '#F7F7F7'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif']
      },
      maxWidth: {
        container: '1200px'
      },
      spacing: {
        '8': '2rem',
        '16': '4rem',
        '24': '6rem',
        '32': '8rem'
      }
    },
  },
  plugins: [],
};