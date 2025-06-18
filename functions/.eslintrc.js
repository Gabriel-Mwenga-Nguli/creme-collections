module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "google", // Added Google style guide
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json"],
    sourceType: "module",
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/node_modules/**/*",
    ".eslintrc.js",
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["warn", "double"],
    "import/no-unresolved": 0,
    "indent": ["warn", 2],
    "object-curly-spacing": ["warn", "always"],
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "no-multiple-empty-lines": ["warn", { "max": 1, "maxEOF": 0 }],
    "semi": ["warn", "always"],
    "max-len": ["warn", { "code": 120, "ignoreStrings": true, "ignoreTemplateLiterals": true }],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "require-jsdoc": "off", // Common to disable for TS projects or configure per needs
    "valid-jsdoc": "off",   // Common to disable for TS projects
    "new-cap": ["error", { "capIsNewExceptions": ["functions.https.HttpsError"] }]
  },
};
