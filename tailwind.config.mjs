import { withUt } from 'uploadthing/tw';

/** @type {import('tailwindcss').Config} */
export default withUt({
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
        require('@tailwindcss/typography'), // <--- AJOUTEZ CETTE LIGNE
  ],
});


