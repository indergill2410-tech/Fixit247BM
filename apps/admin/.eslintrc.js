/** @type {import('eslint').Linter.Config} */
module.exports = {
  rules: {
    // Unsafe-any rules: fetch() responses are untyped by design in admin UI pages
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    // Void/promise rules: common patterns in event handlers and useEffect
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-confusing-void-expression': 'off',
    // Conditional rules: nullable checks on Supabase metadata fields
    '@typescript-eslint/no-unnecessary-condition': 'off',
    // Other relaxed rules
    '@typescript-eslint/restrict-template-expressions': ['warn', { allowNumber: true }],
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/require-await': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'react/no-unescaped-entities': 'off',
    '@next/next/no-img-element': 'off',
  },
};
