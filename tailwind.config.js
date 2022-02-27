module.exports = {
  content: ['./src/**/*.(js|jsx|ts|tsx)'],
  theme: {
    extend: {
      transitionProperty: {
        top: 'top',
      },
      animation: {
        'zjit-hacked': 'scroll-out 1s',
        'scroll-out':
          '1.0001s linear 0s infinite normal both paused scroll-out',
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
