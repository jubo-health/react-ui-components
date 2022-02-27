module.exports = {
  content: ['./src/**/*.(js|jsx|ts|tsx)'],
  theme: {
    extend: {
      transitionProperty: {
        top: 'top',
      },
      animation: {
        'slide-in': '75ms ease-in-out 0s 1 reverse forwards running scroll-out',
        'scroll-out': '1s linear -1s 1 reverse forwards paused scroll-out',
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
