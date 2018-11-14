module.exports = {
    baseUrl: process.env.NODE_ENV === 'production' ? '/' : '/',
    configureWebpack: {
        module: {
            rules: [{
                test: /\.vue$/,
                use: [
                    "vue-loader",
                    {
                        loader: "vue-svg-inline-loader",
                    }
                ]
            }]
        }
    },
    chainWebpack: config => {
        config.module
            .rule('svg')
            .test(() => false)
            .use('file-loader')
    }
}