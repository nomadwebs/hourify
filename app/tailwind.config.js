/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{jsx,js}"],
  theme: {
    extend: {
      colors: {
        color_backgroundGrey: 'var(--color-background-grey)',
        color_lightGrey: 'var(--color-light-grey)',
        color_Grey: 'var(--color-grey)',
        color_strongGrey: 'var(--color-strong-grey)',
        color_darkBlue: 'var(--color-dark-blue)',
        color_darkBlue2: 'var(--color-dark-blue2)',
        color_lightBlue: 'var(--color-light-blue)',
        color_green: 'var(--color-green)',
        color_greenMedium: 'var(--color-green-medium)',
        color_greenDark: 'var(--color-green-dark)',
        color_softRed: 'var(--color-soft-red)',
        color_softYellow: 'var(--color-soft-yellow)',
      }
    },
  },
  plugins: [],
}