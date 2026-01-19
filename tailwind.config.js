/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Custom breakpoints
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      // Custom colors
      colors: {
        primary: {
          DEFAULT: "#7c3aed",
          dark: "#6d28d9",
          light: "#a78bfa",
        },
        secondary: {
          DEFAULT: "#2c3e50",
          light: "#34495e",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },
      // Custom font family
      fontFamily: {
        sans: [
          "Montserrat",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      // Animations
      animation: {
        "fade-in-up": "fadeInUp 1s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "gradient-shift": "gradientShift 8s ease infinite",
      },
      // Keyframes
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        gradientShift: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
      },
      // Extra utilities
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};