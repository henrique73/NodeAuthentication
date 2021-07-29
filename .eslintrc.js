module.exports = {
  extends: [
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.ts'],
      },
    },
    'import/extensions': ['.js', '.ts'],
  },
  env: {
    node: true,
    mocha: true,
  },
  rules: {
    'max-lines': ['error', 300],
    'max-lines-per-function': ['error', 25],
    'no-shadow': ['off'],
    camelcase: 'off',
    'linebreak-style': 0,
    'no-underscore-dangle': [
      2,
      {
        allow: ['_id', '__'],
      },
    ],
    'no-param-reassign': [
      2,
      {
        props: false,
      },
    ],
    'max-len': [
      2,
      140,
      {
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreTemplateLiterals: true,
        ignoreStrings: true,
      },
    ],
    'import/no-dynamic-require': 0,
    'no-await-in-loop': 0,
    'no-plusplus': 0,
    'no-restricted-syntax': 0,
    'no-mixed-operators': 0,
    '@typescript-eslint/camelcase': 'off',
    'class-methods-use-this': 0,
    'comma-dangle': [
      2,
      {
        functions: 'never',
        objects: 'always-multiline',
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.test.ts', '**/*.spec.ts', 'jest.*'],
      },
    ],
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/adjacent-overload-signatures': ['error'],
    '@typescript-eslint/member-ordering': ['error'],
    '@typescript-eslint/no-namespace': ['error'],
    '@typescript-eslint/no-require-imports': ['error'],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
};
