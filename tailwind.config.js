/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'salt': '#F7F3EC',
        'salt-dark': '#C4A882',
        'salt-pink': '#E8B4B8',
        'amber': '#D4A574',
        'amber-dark': '#C49360',
        'brick': '#B85042',
        'brick-dark': '#9A4236',
        'ink': '#2D2D2D',
        'stone': '#6B6B6B',
        'pool': '#7A9E7E',
      },
      fontFamily: {
        'display': ['Noto Serif SC', 'serif'],
        'body': ['Noto Sans SC', 'sans-serif'],
      }
    }
  },
  plugins: [require('@tailwindcss/typography')],
}
