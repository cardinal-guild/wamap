import { ProvidePlugin } from 'webpack'

const nodeExternals = require('webpack-node-externals')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: 'Worlds Adrift Map',
    meta: [{
      charset: 'utf-8'
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    },
    {
      hid: 'description',
      name: 'description',
      content: 'Worlds Adrift Map'
    }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css?family=Noto+Sans|News+Cycle:400,700|Material+Icons|Abril+Fatface'
    }
    ]
  },
  modules: [
    '@nuxtjs/axios'
  ],
  plugins: [{
    src: '~/plugins/vuetify.js',
    ssr: true
  },
  {
    src: '~/plugins/particles.js',
    ssr: false
  },
  {
    src: '~/plugins/nuxt-leaflet.js',
    ssr: false
  }],
  css: [ 
    '~/assets/style/leaflet.css',
    '~/assets/style/app.styl'
  ],
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#D9B18A'
  },
  /*
   ** Build configuration
   */
  build: {
    transpile: [/^vuetify/],
    plugins: [
      new VuetifyLoaderPlugin(),
      new ProvidePlugin({
        '$': 'jquery',
        '_': 'lodash',
        'jQuery': "jquery",
        "window.jQuery": "jquery"
      })
    ],
    babel: {
      plugins: [
        ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }]
      ]
    },
    extractCSS: true,
    extend (config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (process.server) {
        config.externals = [
          nodeExternals({
            whitelist: [/^vuetify/]
          })
        ]
      }
    }
  }
}
