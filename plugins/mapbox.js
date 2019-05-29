import Vue from 'vue'
import {
  MglMap,
  MglNavigationControl,
  MglGeojsonLayer,
  MglFullscreenControl,
  MglMarker
} from 'vue-mapbox'
import Mapbox from 'mapbox-gl'

Vue.component('MglMap', MglMap)
Vue.component('MglNavigationControl', MglNavigationControl)
Vue.component('MglGeojsonLayer', MglGeojsonLayer)
Vue.component('MglFullscreenControl', MglFullscreenControl)
Vue.component('MglMarker', MglMarker)

export default ({ app }, inject) => {
  inject('mapbox', Mapbox)
}
