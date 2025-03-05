module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        "react-native/react-native": true,
        node: true
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: "latest",
        sourceType: "module"
    },
    plugins: [
        "react",
        "react-native",
        "@typescript-eslint"
    ],
    rules: {
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "react-native/no-unused-styles": "off",
        "react-native/no-inline-styles": "off",
        "react-hooks/exhaustive-deps": "off"
    },
    settings: {
        react: {
            version: "detect"
        }
    },
    overrides: [
        {
            files: ['*.js', '*.cjs', '*.config.js'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
                'no-undef': 'off'
            }
        }
    ]
}; 