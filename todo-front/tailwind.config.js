/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'todo': 'url("/public/todo.jpeg")',
      }
    },
  },
  plugins: [require("daisyui")],
}

