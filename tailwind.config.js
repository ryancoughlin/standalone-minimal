/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
        serif: ["Roboto Serif", "serif"],
      },
      colors: {
        reprise: {
          "off-white": "#FCFBF7",
          "base-surface": "#FEFEF6",
          sky: "#BCE8F8",
          blue: "#3A8DDB",
          "deep-blue": "#0D0D41",
        },
      },
    },
  },
  plugins: [],
};
