/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        // Or add as a custom font family:
        // sans: ["Inter", "sans-serif"],
        // mono: ["JetBrains Mono", "monospace"],
        // sans: ["var(--font-sans)"], // Bitcount
        // display: ["var(--font-display)"], // Playwrite
      },
    },
  },
};
