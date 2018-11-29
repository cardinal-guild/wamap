
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
      content: 'Worlds Adrift Interactive Map'
    },
    {
      hid: 'title',
      name: 'title',
      content: 'Cardinal Guild Interactive Map'
    },
    {
      hid: 'og:title',
      name: 'og:title',
      content: 'Cardinal Guild Interactive Map'
    },
    {
      hid: 'og:site_name',
      name: 'og:site_name',
      content: 'Cardinal Guild'
    },
    {
      hid: 'og:descripion',
      name: 'og:description',
      content: 'An interactive map for Worlds Adrift'
    },
    {
      hid: 'og:image',
      name: 'og:image',
      content: '/opengraph.jpg'
    }],
    link: [{
      rel: 'icon',
      type: 'image/png',
      href: '/favicon-16x16.png',
      sizes: '16x16'
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon-32x32.png',
      sizes: '32x32'
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
    '~/assets/style/leaflet.scss',
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
            maxAgeSeconds: 14400
          }
        }
      },
      {
        // Should be a regex string. Compiles into new RegExp('https://my-cdn.com/.*')
        urlPattern: 'https://surveyor.cardinalguild.com/media/.*',
        // Defaults to `networkFirst` if omitted
        handler: 'cacheFirst',
        // Defaults to `GET` if omitted
        method: 'GET',
        strategyOptions: {
          cacheName: 'surveyor-media-cache',
          cacheExpiration: {
            maxAgeSeconds: 86400
          }
        }
      },
      {
        // Should be a regex string. Compiles into new RegExp('https://my-cdn.com/.*')
        urlPattern: 'https://surveyor.cardinalguild.com/images/.*',
        // Defaults to `networkFirst` if omitted
        handler: 'cacheFirst',
        // Defaults to `GET` if omitted
        method: 'GET',
        strategyOptions: {
          cacheName: 'surveyor-image-cache',
          cacheExpiration: {
            maxAgeSeconds: 86400
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
        ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
        ["@babel/transform-runtime"]
      ]
    },
    extractCSS: true,
    extend (config, ctx) {
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
      config.module.rules
        .filter(r => r.test.toString().includes("svg"))
        .forEach(r => {
          r.test = /\.(png|jpe?g|gif)$/;
       });
       config.module.rules.push({
        test: /\.svg$/,
        loader: 'vue-svg-loader', // `vue-svg` for webpack 1.x
        options: {
          // optional [svgo](https://github.com/svg/svgo) options
          svgo: {
            plugins: [{ removeDoctype: true }, { removeComments: true }]
          }
        }
      })
    }
  }
}
