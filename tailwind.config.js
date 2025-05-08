/** @type {import('tailwindcss').Config} */
import tailwindcss from '@tailwindcss/vite'
module.exports = {
    content: ["./*.html", "./*.js"],
    theme: {
      extend: {},
    },
    plugins: [
      tailwindcss()
    ],
  };
  