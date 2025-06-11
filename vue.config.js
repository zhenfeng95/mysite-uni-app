module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'https://zzf.net.cn'
            }
        }
    }
};
