/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        biru:'#00fe9d',
        primary: '#0f172a',
        accent: '#06b6d4',
        textSecondary: '#94a3b8',
        error: '#ef4444',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
