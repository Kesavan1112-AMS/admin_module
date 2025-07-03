/** @type {import('tailwindcss').Config} */
export default {
  // content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#09377C",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#4A7BA7",
          foreground: "#ffffff",
        },
        cadetblue: {
          50: "#f0fafa",
          100: "#def0f1",
          200: "#b8dcdd",
          300: "#8ec5c8",
          400: "#6cb3b7",
          500: "#5f9ea0",
          600: "#4f888a",
          700: "#3d6e70",
          800: "#31595a",
          900: "#254445",
          DEFAULT: "#5f9ea0",
        },
        theme: {
          primary: "#1e40af",
          dark: "#262626",
        },
        textColor: {
          primary: "#6b7280",
          dark: "#ffffff",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      spacing: {
        128: "32rem",
      },
      zIndex: {
        60: "60",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
    screens: {
      lg: {
        min: "925px",
      },
    },
  },
  safelist: [
    "w-24",
    "w-28",
    "w-32",
    "w-36",
    "w-40",
    "w-44",
    "w-48",
    "w-52",
    "w-56",
    "w-60",
    "w-64",
    "w-72",
    "w-80",
    "w-96",
    "w-128",
  ],
  plugins: [require("tailwindcss-animate")],
};
