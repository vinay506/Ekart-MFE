module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['./jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|png|jpg|svg)$': 'identity-obj-proxy',
    // Map remote imports to local stubs during tests
    '^products/(.*)$': '<rootDir>/../products/src/components/$1',
    '^cart/(.*)$': '<rootDir>/../cart/src/components/$1',
  },
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/bootstrap.jsx',
  ],
};
