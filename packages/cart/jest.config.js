module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['./jest.setup.js'],
  transform: { '^.+\\.(js|jsx)$': 'babel-jest' },
  moduleNameMapper: { '\\.(css|less|scss|png|jpg|svg)$': 'identity-obj-proxy' },
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/bootstrap.jsx',
  ],
};
