/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
      },
      fontFamily: {
        figtree: ['Figtree', 'sans-serif'],
      },
      keyframes: {
        underlineanimation: {
          '0%': { minWidth: '0' },
          '100%': { minWidth: '100%' }
        }
      },
      animation: {
        underline: 'underlineanimation 0.4s forwards'
      }
    },

  },
  plugins: [],
};
