import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "bg-geo-light-pink",
    "bg-geo-dark-pink",
    "bg-geo-yellow",
    "bg-geo-light-teal",
    "geo-green",
    "geo-bg",
    "geo-yellow",
  ],
  theme: {
    extend: {
      colors: {
        "geo-green": "#2d6061",
        "geo-bg": "#e5dac0",
        "geo-yellow": "#f1c63b",
        "geo-light-pink": "##ff9b88",
        "geo-dark-pink": "#f27663",
        "geo-light-teal": "#91ccbf",
      },
      fontFamily: {
        lucky: ['"Luckiest Guy"', "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;
