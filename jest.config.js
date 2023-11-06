module.exports = {
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json"],
  transform: {
    "^.+\\.(js|jsx)$": "./node_modules/babel-jest",
  },
  transformIgnorePatterns: ["./node_modules/"],
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ["json", "lcov"],
};
