module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    quotes: ["error", "double"],
    "no-console": "off",
    "no-unused-vars": "off",
    "comma-dangle": "off",
  },
};
