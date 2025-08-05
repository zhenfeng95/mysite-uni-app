module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: ['eslint:recommended', 'standard', 'plugin:vue/essential'],
    parserOptions: {
        ecmaVersion: 12,
    },
    plugins: ['vue'],
    rules: {
        // 这里有一些自定义配置
        'no-console': [
            'warn',
            {
                allow: ['warn', 'error'],
            },
        ],
        indent: ['error', 4], // 4 表示 4 个空格缩进
        'no-eval': 'error',
        'no-alert': 'error',
        semi: ['error', 'always'],
    },
    globals: {
        uni: 'readonly',
        plus: 'readonly',
        wx: 'readonly',
    },
};
