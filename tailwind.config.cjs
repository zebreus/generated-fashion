/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/no-commonjs
module.exports = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  // eslint-disable-next-line import/no-commonjs
  plugins: [require("daisyui")],
}
