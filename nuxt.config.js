import colors from 'vuetify/es5/util/colors'
import pkg from './package'

export default {
  env: {
    API_URL: 'https://surveyor.cardinalguild.com'
  },

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#d9b18a' },

  /*
   ** Global CSS
   */
  css: [
    'mapbox-gl/dist/mapbox-gl.css',
    '@mdi/font/css/materialdesignicons.css'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{ src: '@/plugins/mapbox', ssr: false }],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/vuetify',
    'nuxt-client-init-module'
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    retry: { retries: 5 },
    baseUrl: ''
  },
  /**
   * Vuetify configuration
   */
  vuetify: {
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: '#232323',
          accent: colors.red.lighten2,
          secondary: '#4f4141',
          info: '#ffe5c4',
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: '#e0af84'
        }
      }
    }
  },

  /*
   ** Build configuration
   */
  build: {
    transpile: ['vuetify/lib'],
    quiet: false,
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
