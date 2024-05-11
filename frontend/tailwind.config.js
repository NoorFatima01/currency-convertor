/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:
      {'darkishBlue': '#114254',
        'textColor': '#99B9C5',
        'lightBlue': '#338AAA',
      }
    },
  },
  plugins: [],
}

