/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      colors: {
        ink: {
          950: "#14141C",
          900: "#191922",
          800: "#20202B",
          700: "#2B2B38",
        },
        gold: {
          400: "#F7C948",
          500: "#F4B740",
          600: "#E8A317",
        },
        surface: "#F5F6FA",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 20, 28, 0.04), 0 8px 24px -12px rgba(20, 20, 28, 0.10)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
}

