module.exports = {
    baseUrl: process.env.NODE_ENV === 'production' ? '/' : '/',
    configureWebpack: {
        module: {
            rules: [{
                test: /\.(svg)(\?.*)?$/,
                use: [{
                    loader: 'svg-inline-loader',
                    options: {
                        limit: 10000,
                        name: 'assets/img/[name].[hash:7].[ext]'
                    }
                }]
            }, {
                test: /\.vue$/,
                use: [
                    "vue-loader",
                    {
                        loader: "vue-svg-inline-loader",
                    },
                    // ...
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