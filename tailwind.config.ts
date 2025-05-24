import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#faf6f0',
        foreground: '#192b24',
        primary: {
          DEFAULT: '#192b24',
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#5aa19d',
          foreground: '#ffffff'
        },
        muted: {
          DEFAULT: '#8e9590',
          foreground: '#192b24'
        },
        accent: {
          DEFAULT: '#abbcb7',
          foreground: '#192b24'
        },
        border: '#c3c6bf',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#192b24'
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#192b24'
        },
        input: '#ffffff',
        ring: '#192b24',
        destructive: {
          DEFAULT: '#b74f4b',
          foreground: '#ffffff'
        }
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif']
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
