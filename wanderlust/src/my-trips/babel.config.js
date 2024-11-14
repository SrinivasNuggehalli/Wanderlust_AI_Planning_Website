  module.exports = {
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    // Optional: If using TypeScript, add this to handle .tsx files
    // transform: {
    //   '^.+\\.(ts|tsx)$': 'ts-jest',
    // },
    testEnvironment: 'jsdom',
  };
    