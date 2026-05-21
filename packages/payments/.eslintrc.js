/** @type {import('eslint').Linter.Config} */
module.exports = {
  rules: {
    '@typescript-eslint/no-unnecessary-condition': 'warn',
    '@typescript-eslint/no-inferrable-types': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/restrict-template-expressions': ['warn', { allowNumber: true }],
    '@typescript-eslint/no-misused-promises': 'warn',
  },
};
