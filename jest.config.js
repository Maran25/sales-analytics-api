module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
//   setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  globals: {
    "process.env.NODE_ENV": "test",
  },
};
