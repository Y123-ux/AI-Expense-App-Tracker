/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FCF5FA',
          100: '#F5E4F0',
          200: '#E5BFD9',
          300: '#C98AB7',
          400: '#8E3D6E',
          500: '#5E244E',
          600: '#5E244E',
          700: '#4A1C3E',
          800: '#3A152F',
          900: '#2A0F22',
        },
        accent: {
          50: '#FFF5F0',
          100: '#FFE8D9',
          200: '#F5C5A3',
          300: '#E68457',
          400: '#E68457',
          500: '#D4713E',
          600: '#B85D30',
        },
        crimson: {
          50: '#FDF2F4',
          100: '#FBE4E8',
          200: '#F3B3BF',
          300: '#D44B6A',
          400: '#AA1C41',
          500: '#AA1C41',
          600: '#8E1635',
        },
        cream: {
          50: '#FFFDF8',
          100: '#FFE8B4',
          200: '#FFE8B4',
          300: '#F5D78A',
          400: '#E8C560',
        },
      },
    },
  },
  plugins: [],
}
