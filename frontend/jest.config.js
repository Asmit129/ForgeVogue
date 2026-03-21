export default{
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx)$": ["@swc/jest", {
      jsc: {
        parser: {
          syntax: "ecmascript",
          jsx: true
        },
        transform: {
          react: {
            runtime: "automatic"
          }
        }
      }
    }]
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
};