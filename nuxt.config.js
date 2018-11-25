
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
    'nuxt-clipboard2',
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],
  plugins: [{
    src: '~/plugins/vuetify.js',
    ssr: true
  },
  {
    src: '~/plugins/bus-inject.js',
    ssr: false
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
  workbox: {
    runtimeCaching: [
      {
        // Should be a regex string. Compiles into new RegExp('https://my-cdn.com/.*')
        urlPattern: 'https://data.cardinalguild.com/.*',
        // Defaults to `networkFirst` if omitted
        handler: 'cacheFirst',
        // Defaults to `GET` if omitted
        method: 'GET',
        strategyOptions: {
          cacheName: 'surveyor-cache',
          cacheExpiration: {
            maxAgeSeconds: 10800
          }
        }
      },
      {
        // Should be a regex string. Compiles into new RegExp('https://my-cdn.com/.*')
        urlPattern: 'https://surveyor.cardinalguild.com/.*',
        // Defaults to `networkFirst` if omitted
        handler: 'cacheFirst',
        // Defaults to `GET` if omitted
        method: 'GET',
        strategyOptions: {
          cacheName: 'surveyor-cache',
          cacheExpiration: {
            maxAgeSeconds: 1800
          }
        }
      }
    ]
  },
  build: {
    transpile: [/^vuetify/],
    plugins: [
      new VuetifyLoaderPlugin()
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
