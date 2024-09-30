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
        darkGray: '#1c1c1c',
        lightGray: '#28292d',
        softBlue: '#4a4a4a',
        softPink: '#d9138a',
        softCyan: '#2e2e2e',
      },
      animation: {
        'move-colors': 'moveColors 6s linear infinite',
      },
      keyframes: {
        moveColors: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
});
