/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: "#B4461F",
          dark: "#963716",
          light: "#FBF0EB"
        },
        slate: {
          kohl: "#1E2229",
          deep: "#111418"
        },
        parchment: {
          canvas: "#F9F6F0",
          card: "#FAF7F2",
          border: "#E8DEC8"
        }
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "var(--font-plus-jakarta)", "sans-serif"]
      },
      scale: {
        102: "1.02"
      }
    },
  },
  plugins: [],
};
