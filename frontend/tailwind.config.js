/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        interface: ['Inter', 'SF Pro Display', 'Geist', 'sans-serif'],
      },
      colors: {
        background: '#FAF9F6', // Off-white
        surface: '#FFFFFF',
        accent: {
          DEFAULT: '#6366F1', // Indigo
          hover: '#4F46E5', // Indigo hover
          subtle: '#EEF2FF', // Indigo light
        },
        border: '#E5E7EB', // Soft gray
        text: {
          primary: '#111827',
          secondary: '#4B5563',
          tertiary: '#9CA3AF',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'float': '0 10px 40px -4px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
