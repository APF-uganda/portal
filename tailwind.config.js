/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // make sure this covers your components
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7c3aed",   // bright purple
          dark: "#6d28d9",      // hover/darker variant
          light: "#a78bfa",     // optional lighter shade
        },
        // You can extend other colors if needed
      },
    },
  },
  plugins: [],
};
