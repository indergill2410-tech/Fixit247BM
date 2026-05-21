/** @type {import('eslint').Linter.Config} */
module.exports = {
  ignorePatterns: ['src/generated/**'],
  rules: {
    '@typescript-eslint/no-misused-promises': 'warn',
    '@typescript-eslint/use-unknown-in-catch-callback-variable': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/restrict-template-expressions': ['warn', { allowNumber: true }],
  },
};
