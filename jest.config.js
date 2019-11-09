module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "coveragePathIgnorePatterns": [
    "<rootDir>/node_modules",
  ],
  reporters: ["default", "jest-junit"],
};
