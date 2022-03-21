const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.(js|jsx|ts|tsx)'],
  theme: {
    extend: {
      colors: {
        primary: '#0097A7',
        secondary: '#78909C',
        error: '#A50F01',
        warning: '#CB8900',
        grey: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        cryan: {
          50: '#E0F7F9',
          700: '#0097A7',
          900: '#006064',
        },
        red: {
          100: '#FBC8CA',
          200: '#E7938D',
          900: '#A50F01',
        },
        pink: {
          300: '#F076A2',
        },
        lime: {
          100: '#EBF1C4',
          500: '#C0D243',
        },
        green: {
          100: '#C1eed3',
          300: '#6CCB97',
          700: '#2C8A4D',
        },
        blue: {
          100: '#B5E3F4',
          300: '#60BFE5',
        },
        purple: {
          100: '#D8CBF2',
          300: '#A683E2',
        },
      },
      transitionProperty: {
        top: 'top',
      },
      keyframes: {
        'scroll-out': {
          '100%': { transform: 'translate(0, -100%)' },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('hover', '&:hover');
      addVariant('focus-within', '&:focus-within'); // change variant order
    }),
  ],
};
