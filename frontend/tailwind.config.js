/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          blue: {
            50: '#f0f5ff',
            100: '#e0ecff',
            200: '#c7dcfe',
            300: '#9fc3fd',
            400: '#6ea0fa',
            500: '#3b78f4',
            600: '#1d55e8',
            700: '#1541d5',
            800: '#003366', // Classic Gov Navy
            900: '#0b2545', // Deep National Portal Navy
            950: '#06152b',
          },
          saffron: {
            50: '#fff8eb',
            100: '#feeed1',
            500: '#ff9933', // Indian Saffron
            600: '#ea580c',
            700: '#c2410c',
          },
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            500: '#138808', // Indian Green / Verification
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
          },
          gold: {
            500: '#d4af37',
            600: '#b89628',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      boxShadow: {
        'gov': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
        'gov-md': '0 4px 6px -1px rgba(11, 37, 69, 0.08), 0 2px 4px -2px rgba(11, 37, 69, 0.08)',
        'gov-lg': '0 10px 15px -3px rgba(11, 37, 69, 0.1), 0 4px 6px -4px rgba(11, 37, 69, 0.1)',
        'gov-card': '0 2px 8px rgba(0, 51, 102, 0.06)',
      }
    },
  },
  plugins: [],
}
