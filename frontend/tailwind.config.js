/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#100E34', // Color azul personalizado
        customRed: '#A2001D', // Color rojo personalizado
        customBlueOpacity: 'rgba(16, 14, 52, 0.8)', 
      },
    },
  },
  plugins: [],
});
