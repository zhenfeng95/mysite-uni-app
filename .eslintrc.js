module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es2021: true,
    },
    parserOptions: {
        parser: 'babel-eslint', // Vue 2 + JS 推荐 parser
        ecmaVersion: 2021,
        sourceType: 'module',
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/recommended', // Vue 2 推荐规则
        'plugin:prettier/recommended', // 放最后，关闭 ESLint 与 Prettier 冲突规则
    ],
    plugins: ['vue', 'prettier'],
    rules: {
        'prettier/prettier': 'error',
        'vue/max-attributes-per-line': 'off', // 你可以根据团队喜好开启
        'vue/singleline-html-element-content-newline': 'off',
    },
};
