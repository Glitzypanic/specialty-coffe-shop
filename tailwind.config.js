/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Nota: usa /app en lugar de /pages
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: "#4B2E2A",
        cream: "#F5E8C7",
      },
    },
  },
  plugins: [],
};
