module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "@typescript-eslint/ban-ts-comment": "off",
  },
};
