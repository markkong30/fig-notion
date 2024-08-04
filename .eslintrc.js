module.exports = {
  extends: ['next', 'prettier', 'eslint:recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        endOfLine: 'auto',
      },
    ],
    'react-hooks/exhaustive-deps': 'off',
    'no-unused-vars': 'warn',
  },
};
