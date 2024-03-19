module.exports = {
  testRegex: '.*\\.(unit|i9n|e2e)\\.ts$',
  reporters: ['default', 'github-actions'],
  moduleFileExtensions: ['ts', 'js', 'mjs', 'cjs', 'json'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  testTimeout: 60000,
};
