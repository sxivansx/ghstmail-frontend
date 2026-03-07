/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        phantom: {
          50: "#edfff5",
          100: "#d0ffe6",
          200: "#a0ffcc",
          300: "#60ffaa",
          400: "#00ff88",
          500: "#00e07a",
          600: "#00b862",
          700: "#008f4c",
          800: "#006e3b",
          900: "#005c32",
        },
        void: {
          50: "#e8e8ed",
          100: "#c5c5d0",
          200: "#9898aa",
          300: "#6b6b80",
          400: "#4a4a5e",
          500: "#2a2a3e",
          600: "#1e1e30",
          700: "#151522",
          800: "#0d0d16",
          900: "#08080e",
          950: "#050508",
        },
      },
      fontFamily: {
        display: ["Syne", "system-ui", "sans-serif"],
        body: ["Outfit", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-up-delay-1": "fadeUp 0.6s ease-out 0.1s forwards",
        "fade-up-delay-2": "fadeUp 0.6s ease-out 0.2s forwards",
        "fade-up-delay-3": "fadeUp 0.6s ease-out 0.3s forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
