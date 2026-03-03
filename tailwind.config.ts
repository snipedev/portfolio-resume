
import type { Config } from "tailwindcss";
export default {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0f1a",
        card: "rgba(255,255,255,0.04)",
        border: "rgba(255,255,255,0.08)",
        neon: "#7dd3fc"
      },
      backdropBlur: { xs: "2px" }
    }
  },
  plugins: []
} satisfies Config;
