// tailwind.config.js

module.exports = {
  purge: {
    content: [
      './src/**/*.{js,ts,jsx,tsx}',
      './public/index.html',
    ],
    options: {
      whitelist: ['flex', 'justify-between'], // Example whitelist Tailwind classes
    },
  },
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      colors: {
        black: '#000000', // Set black color
        green: {
          '50': '#f0fdf4',
          '100': '#dcfce7',
          '200': '#bbf7d0',
          '300': '#86efac',
          '400': '#4ade80',
          '500': '#22c55e', // Green 500 color
          '600': '#16a34a',
          '700': '#15803d',
          '800': '#166534',
          '900': '#14532d',
        },
      },
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'], // Define default sans-serif font
      },
      fontSize: {
        'xs': '0.75rem', // Extra small font size
        'sm': '0.875rem', // Small font size
        'base': '1rem', // Base font size
        'lg': '1.125rem', // Large font size
        'xl': '1.25rem', // Extra large font size
        '2xl': '1.5rem', // 2x large font size
      },
      fontWeight: {
        'normal': 400, // Normal font weight
        'bold': 700, // Bold font weight
      },
      backgroundColor: theme => ({
        ...theme('colors'),
        'primary': '#3490dc', // Primary background color
        'secondary': '#ffed4a', // Secondary background color
        'black': '#000000', // Black background color
      }),
      borderRadius: {
        'lg': '1rem', // Large border radius
      },
      spacing: {
        '4': '1rem', // 4 units of spacing
        '8': '2rem', // 8 units of spacing
      },
    },
  },
  plugins: [],
};
