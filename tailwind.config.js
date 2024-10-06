/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        manrope: ["var(--font-manrope)"],
      },
      colors: {
        "custom-gray": "#F8F8F8",
        "custom-gray2": "#D9D9D9",
        "custom-gray3": "#ECECEC",
        "custom-gray4": "#8B8B8B",
        "custom-gray5": "#F1F1F1",
        "custom-orange": "#FE6D3B",
        "custom-red": "#431E1E",
        "custom-red2": "#E31414",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
