/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      colors: {
        blue: {
          primary: '#3361FF',
        },
      },
      backgroundColor: {
        events: '#FF6633',
      },
      spacing: {
        1.25: '.3125rem',
        7.5: '1.875rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

module.exports = config;
