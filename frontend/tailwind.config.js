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
        // Primary Action
        wine: {
          DEFAULT: "#6E1F2E",
          hover: "#581723",
          deep: "#7A2828",
          light: "#8B2B3D",
        },
        // Craft Soul Accent
        terracotta: {
          DEFAULT: "#C85A32",
          dark: "#A33F1C",
          light: "#FBF0EB",
          blush: "#EBD3CC",
          base: "#B4461F",
        },
        // Kohl & Charcoal Neutrals
        kohl: {
          DEFAULT: "#2B1219",
          plum: "#2B1219",
          charcoal: "#1E2229",
          deep: "#14171C",
          muted: "#5E4B4E",
          light: "#8A8986",
        },
        // Canvas & Natural Grounds
        canvas: {
          DEFAULT: "#F7F5EF",
          linen: "#F7F5EF",
          warm: "#FAF8F5",
          ochre: "#F0E3C8",
          terracotta: "#EBD3CC",
        },
        // Surfaces & Cards
        surface: {
          DEFAULT: "#FFFDF8",
          card: "#FFFDF8",
          white: "#FFFFFF",
          alt: "#FAF7F2",
        },
        // Hairline Borders & Dividers
        sand: {
          DEFAULT: "#E7E0D6",
          hairline: "#E7E0D6",
          border: "#D4CDC3",
          hover: "#C8B8A6",
          subtle: "#F0EFE8",
        },
        // Status & Functional Accents
        turmeric: {
          DEFAULT: "#E5A93B",
          dark: "#C68A20",
          light: "#FEF7E6",
        },
        sage: {
          DEFAULT: "#4E6E58",
          dark: "#2D583B",
          light: "#EEF4F0",
        },
        // Backward-compatibility aliases
        parchment: {
          DEFAULT: "#FAF8F5",
          canvas: "#F7F5EF",
          card: "#FFFDF8",
          border: "#E7E0D6",
        },
        slate: {
          kohl: "#1E2229",
          deep: "#14171C",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Newsreader", "Cinzel", "Georgia", "serif"],
        sans: ["var(--font-sans)", "DM Sans", "Plus Jakarta Sans", "-apple-system", "sans-serif"],
        nastaliq: ["Noto Nastaliq Urdu", "Georgia", "serif"],
      },
      borderRadius: {
        "craft-sm": "2px",
        "craft": "4px",
        "craft-lg": "8px",
      },
      boxShadow: {
        "craft-card": "0 1px 3px rgba(43, 18, 25, 0.02)",
        "craft-hover": "0 4px 12px rgba(43, 18, 25, 0.05)",
        "craft-modal": "0 16px 32px -8px rgba(43, 18, 25, 0.12), 0 4px 8px -2px rgba(43, 18, 25, 0.04)",
      },
    },
  },
  plugins: [],
};

