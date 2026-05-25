import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050816',
        panel: '#101a36',
        text: '#eef2ff',
        muted: '#9aa8ff',
      },
      boxShadow: {
        soft: '0 24px 80px rgba(15, 30, 75, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
