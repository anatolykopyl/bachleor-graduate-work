/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    "vue/setup-compiler-macros": true,
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/eslint-config-typescript/recommended",
  ],
  rules: {
    "@typescript-eslint/ban-ts-comment": ["error", { "ts-ignore": "allow-with-description" }],
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-function": ["error", { allow: ["arrowFunctions"] }],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-var-requires": "off",
    "vue/require-default-prop": "off",
    "vue/multi-word-component-names": "off",
    "vue/html-self-closing": "off",
    "comma-dangle": ["error", "always-multiline"],
    "semi": "off",
    "@typescript-eslint/semi": ["error"],
    "quotes": ["error", "double"],
    "object-curly-spacing": ["error", "always"],
    "import/no-unresolved": 0,
    "indent": ["error", 2],
    "comma-spacing": ["error", { "before": false, "after": true }],
    "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1 }],
    "eol-last": ["error", "always"],
    "no-multi-spaces": "error",
    "no-trailing-spaces": "error",
  },
  overrides: [
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
      },
    },
  ],
};
