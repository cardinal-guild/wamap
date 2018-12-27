import Vue from 'vue'
import Vuetify, {
  VApp, // required
  VNavigationDrawer,
  VFooter,
  VToolbar,
  VTooltip,
  VBtn,
  VSnackbar,
  VTextField
} from 'vuetify/lib'
import VuetifyNumberInput from '@jzolago/vuetify-number-input'
import {
  Ripple
} from 'vuetify/lib/directives'
import '../assets/style/app.styl'

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VToolbar,
    VTooltip,
    VTextField,
    VBtn,
    VSnackbar
  },
  directives: {
    Ripple
  },
  theme: {
    primary: "#E0AF84",
    secondary: "#FFD180",
    accent: "#FFC107",
    error: "#f44336",
    warning: "#ffeb3b",
    info: "#2196f3",
    success: "#4caf50"
  }
})
Vue.use(VuetifyNumberInput)