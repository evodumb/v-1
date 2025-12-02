/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // Indigo 600
          light: '#818CF8', // Indigo 400
          dark: '#3730A3', // Indigo 800
        },
        secondary: {
          DEFAULT: '#10B981', // Emerald 500
          light: '#34D399', // Emerald 400
          dark: '#059669', // Emerald 600
        },
        accent: {
          DEFAULT: '#F59E0B', // Amber 500
          light: '#FBBF24', // Amber 400
          dark: '#D97706', // Amber 600
        },
        background: '#F3F4F6', // Gray 100
        surface: '#FFFFFF',
        text: {
          primary: '#1F2937', // Gray 800
          secondary: '#4B5563', // Gray 600
          light: '#9CA3AF', // Gray 400
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}
