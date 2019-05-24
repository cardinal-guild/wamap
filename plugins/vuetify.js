import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  theme: {
    primary: '#232323',
    accent: colors.red.lighten2,
    secondary: '#4f4141',
    info: '#ffe5c4',
    warning: colors.amber.base,
    error: colors.deepOrange.accent4,
    success: '#e0af84'
  }
})
