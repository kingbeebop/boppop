import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px', // Adjusted md breakpoint
        'lg': '1024px',
        'xl': '1280px',
      },
      maxWidth: {
        'xs': '20rem', // 320px
        'sm': '24rem', // 384px
        'md': '28rem', // 448px
        'lg': '32rem', // 512px
        'xl': '36rem', // 576px
        '2xl': '42rem', // 672px
        '3xl': '48rem', // 768px
        '4xl': '56rem', // 896px
        '5xl': '64rem', // 1024px
        '6xl': '72rem', // 1152px
      },
    },
  },
  plugins: [],
};

export default config;
