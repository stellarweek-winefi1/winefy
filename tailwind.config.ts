import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fdf4f4',
          100: '#fbe9e9',
          200: '#f6d6d6',
          300: '#eeb5b5',
          400: '#e28888',
          500: '#d15f5f',
          600: '#b84343',
          700: '#7a2e2e',
          800: '#6b2929',
          900: '#5c2727',
        },
      },
    },
  },
  plugins: [],
};

export default config;
