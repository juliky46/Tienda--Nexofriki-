import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        noche: "#12071F",
        noche2: "#1E0F33",
        noche3: "#291348",
        magenta: "#FF3EA5",
        menta: "#4BE3C1",
        arcade: "#FFC93C",
        crema: "#F5EFFF",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      fontWeight: {
        "500": "500",
        "600": "600",
        "700": "700",
        "900": "900",
      },
      clipPath: {
        badge: "polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
