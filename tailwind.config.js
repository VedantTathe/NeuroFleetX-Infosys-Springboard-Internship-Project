/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '4.5': '1.125rem',
      },
      colors: {
        'indigo': {
          '600': '#4f46e5',
          '900': '#312e81',
        },
      },
    },
  },
  plugins: [],
}
