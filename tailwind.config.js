/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        cream: '#FAF8F4',
        gold: {
          DEFAULT: '#B8924A',
          light: '#F5ECD9',
          dark: '#9e7a38',
        },
        charcoal: '#1C1C1A',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
