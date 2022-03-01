module.exports = {
  content: ['./src/**/*.(js|jsx|ts|tsx)'],
  theme: {
    extend: {
      colors: {
        severe: '#A50F01',
        mild: '#CB8900',
        main: '#0097A7',
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
  plugins: [],
};
