/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-smooth": "spin 2s linear infinite", // continuous smooth rotation
      },
    },
  },
  plugins: [],
};
