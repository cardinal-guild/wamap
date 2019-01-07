module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  parserOptions: {
    sourceType: "module",
    parser: "babel-eslint"
  },
  env: {
    browser: true,
    node: true
  },
  extends: [
    "prettier",
    "prettier/standard",
    "plugin:vue/recommended"
  ],
  // required to lint *.vue files
  plugins: [
    'html',
    'vue',
    'prettier',
    'import',
    'promise'
  ],
  // add your custom rules here
  rules: {
    "space-before-function-paren": 'warn',
    'no-unused-vars': 'warn',
    'no-debugger': 'off',
    'no-unused-vars': 'off',
    'no-unused-expressions': 'off',
    'vue/require-v-for-keys': 'off',
    'vue/max-attributes-per-line': ["error", {
      singleline: 5,
      multiline: {
        allowFirstLine: true
      }
    }],
    'vue/order-in-components': 'off',
    'vue/require-prop-types': 'off',
    'vue/html-indent': 'warn'
  },
  globals: {
    "debugger": true,
    "$": true,
    "jQuery": true,
    "_": true
  }
}
