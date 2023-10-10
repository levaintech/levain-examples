import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Arial', 'sans-serif'],
    },
    extend: {
      colors: {
        invert: 'rgb(var(--color-invert) / <alpha-value>)',
        mono: {
          50: 'rgb(var(--color-mono-50) / <alpha-value>)',
          100: 'rgb(var(--color-mono-100) / <alpha-value>)',
          200: 'rgb(var(--color-mono-200) / <alpha-value>)',
          300: 'rgb(var(--color-mono-300) / <alpha-value>)',
          400: 'rgb(var(--color-mono-400) / <alpha-value>)',
          500: 'rgb(var(--color-mono-500) / <alpha-value>)',
          600: 'rgb(var(--color-mono-600) / <alpha-value>)',
          700: 'rgb(var(--color-mono-700) / <alpha-value>)',
          800: 'rgb(var(--color-mono-800) / <alpha-value>)',
          900: 'rgb(var(--color-mono-900) / <alpha-value>)',
          950: 'rgb(var(--color-mono-950) / <alpha-value>)',
        },
      },
      opacity: {
        1: '0.01',
        2.5: '0.025',
      },
    },
  },
  plugins: [],
};
export default config;
