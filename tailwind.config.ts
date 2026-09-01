import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
        display: ["Cormorant SC", "Georgia", "serif"],
      },
      colors: {
        primary: {
          50: "var(--color-primary-50)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",
          950: "var(--color-primary-950)",
        },
        secondary: {
          50: "var(--color-secondary-50)",
          500: "var(--color-secondary-500)",
          800: "var(--color-secondary-800)",
          900: "var(--color-secondary-900)",
          950: "var(--color-secondary-950)",
        },
        neutral: {
          50: "var(--color-neutral-50)",
          200: "var(--color-neutral-200)",
          600: "var(--color-neutral-600)",
          900: "var(--color-neutral-900)",
        },
        surface: "var(--color-surface)",
        club: {
          green: "var(--color-primary-900)",
          red: "var(--color-secondary-800)",
        },
      },
      borderRadius: {
        card: "var(--radius-card)",
        button: "var(--radius-button)",
        lg: "var(--radius-button)",
        xl: "var(--radius-card)",
        "2xl": "16px",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
      },
      /* Escala fluida contida: boa em mobile, não exagera em MacBook/desktop */
      fontSize: {
        "fluid-xs": [
          "clamp(0.75rem, 0.73rem + 0.1vw, 0.8125rem)",
          { lineHeight: "1.45" },
        ],
        "fluid-sm": [
          "clamp(0.8125rem, 0.79rem + 0.12vw, 0.875rem)",
          { lineHeight: "1.5" },
        ],
        "fluid-base": [
          "clamp(0.9375rem, 0.91rem + 0.15vw, 1rem)",
          { lineHeight: "1.6" },
        ],
        "fluid-lg": [
          "clamp(1rem, 0.96rem + 0.2vw, 1.125rem)",
          { lineHeight: "1.55" },
        ],
        "fluid-xl": [
          "clamp(1.125rem, 1.06rem + 0.3vw, 1.25rem)",
          { lineHeight: "1.45" },
        ],
        "fluid-2xl": [
          "clamp(1.25rem, 1.15rem + 0.45vw, 1.5rem)",
          { lineHeight: "1.35" },
        ],
        "fluid-3xl": [
          "clamp(1.5rem, 1.35rem + 0.65vw, 1.875rem)",
          { lineHeight: "1.25" },
        ],
        "fluid-4xl": [
          "clamp(1.75rem, 1.5rem + 0.9vw, 2.25rem)",
          { lineHeight: "1.15" },
        ],
        "fluid-5xl": [
          "clamp(2rem, 1.65rem + 1.1vw, 2.5rem)",
          { lineHeight: "1.1" },
        ],
        "fluid-hero": [
          "clamp(1.75rem, 1.45rem + 1.1vw, 2.5rem)",
          { lineHeight: "1.12" },
        ],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
