const webpack = require('webpack')
module.exports = {
    baseUrl: process.env.NODE_ENV === 'production' ? '/' : '/',
    chainWebpack: (config) => {
        const svgRule = config.module.rule('svg');

        svgRule.uses.clear();

        svgRule
            .use('vue-svg-loader')
            .loader('vue-svg-loader');
    },
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                '$': 'jquery',
                jquery: 'jquery',
                jQuery: 'jquery',
                'window.jquery': 'jquery',
                'window.jQuery': 'jquery',
                'window.$': 'jquery'
            })
        ]
    }
}