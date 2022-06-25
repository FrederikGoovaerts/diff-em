module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Workaround for https://github.com/kulshekhar/ts-jest/issues/259 to prevent
  // all test suites transpiling the code at the same time and taking longer
  maxWorkers: 1,
};
