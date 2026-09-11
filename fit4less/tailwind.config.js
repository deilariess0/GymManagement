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
      // --- ANIMATIONS FOR QR SCANNER, UI, AND MOBILE NAV ---
      keyframes: {
        scan: {
          '0%, 100%': { top: '10%' },
          '50%': { top: '90%' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // ADDED: Slide-up animation for the mobile "More" menu
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        scan: 'scan 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.2s ease-out',
        // ADDED: Registered the slide-up animation
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
}