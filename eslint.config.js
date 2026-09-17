import js from "@eslint/js";
import prettier from "eslint-config-prettier";

export default [js.configs.recommended, prettier, {
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    globals: {
      window: "readonly",
      document: "readonly",
      performance: "readonly",
      requestAnimationFrame: "readonly",
      cancelAnimationFrame: "readonly",
      setInterval: "readonly",
      clearInterval: "readonly",
      console: "readonly",
    },
  },
  rules: {
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
}];
