import Vue from 'vue'
import {
  MglMap,
  MglGeolocateControl,
  MglNavigationControl,
  MglGeojsonLayer
} from 'vue-mapbox'
import Mapbox from 'mapbox-gl'

Vue.component('MglMap', MglMap)
Vue.component('MglGeolocateControl', MglGeolocateControl)
Vue.component('MglNavigationControl', MglNavigationControl)
Vue.component('MglGeojsonLayer', MglGeojsonLayer)

Vue.prototype.$mapbox = Mapbox
