module.exports = {
    env: {
        browser: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        "plugin:react-hooks/recommended",
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'react-hooks'],
    rules: {
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'default',
                format: ['camelCase'],
            },
            {
                selector: 'variable',
                format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            },
            {
                selector: 'parameter',
                format: ['camelCase'],
                leadingUnderscore: 'allow',
            },
            {
                selector: 'memberLike',
                modifiers: ['private'],
                format: ['camelCase'],
                leadingUnderscore: 'require',
            },
            {
                selector: 'typeLike',
                format: ['PascalCase'],
            },
            {
                selector: 'property',
                format: ['camelCase', 'snake_case'],
            },
            {
                selector: 'enumMember',
                format: ['UPPER_CASE', 'camelCase'],
            },
        ],
        'import/prefer-default-export': 'off',
        'no-underscore-dangle': 'off',
        'no-param-reassign': ['error', { props: false }],
        'no-void': ['error', { allowAsStatement: true }],
        'react/jsx-props-no-spreading': 'off',
        'react/jsx-closing-bracket-location': 'off',
        'react/jsx-wrap-multilines': 'off',
        'react/jsx-one-expression-per-line': 'off',
        'react/prop-types': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
    },
    overrides: [
        {
            files: ['**/*.(spec|test).(tsx|ts|js|jsx)'],
            env: {
                jest: true,
            },
        },
    ],
};
