module.exports = [
    {
        files: ['**/*.js', '**/*.mjs'],
        rules: {
            semi: 'error',
            'prefer-const': 'error',
            'no-var': 'error',
            'no-unused-vars': 'error',
            indent: ['error', 4],
        },
    },
];
