// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Todas las páginas
    './components/**/*.{js,ts,jsx,tsx}', // Todos los componentes
    './pages/**/*.{js,ts,jsx,tsx}', // Rutas legacy si las tienes
  ],
  theme: {
    extend: {
      colors: {
        coffee: '#4A2C2A',
        cream: '#F5E8C7',
        green: '#6B7280',
      },
    },
  },
  plugins: [],
};
