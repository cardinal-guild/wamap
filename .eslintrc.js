module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true
  },
  extends: [
    "standard",
    "prettier",
    "prettier/standard",
    "prettier/vue"
  ],
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    "space-before-function-paren": 'warn',
    'no-unused-vars': 'warn',
    'no-debugger': 'off'
  },
  globals: {
    "debugger": true
  }
}