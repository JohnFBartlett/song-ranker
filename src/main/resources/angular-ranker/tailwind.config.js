/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        primaryTeal: '#87EDF2'
      },
    },
    maxHeight: {
      '0': '0',
      '1/10': '10%',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '100%',
     },
     fontFamily: {
      'header': ['Montserrat'],
      'body': ['"Open Sans"'],
     }
  },
  plugins: [],
}

