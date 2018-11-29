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
    'no-debugger': 'off',
    'no-unused-vars': 'off',
    'no-unused-expressions': 'off',
    'vue/require-v-for-keys': 'off' 
  },
  globals: {
    "debugger": true,
    "$": true,
    "jQuery": true,
    "_": true
  }
}