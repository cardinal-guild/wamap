import Vue from 'vue'
import { MglMap, MglGeolocateControl, MglNavigationControl } from 'vue-mapbox'
import Mapbox from 'mapbox-gl'

Vue.component('MglMap', MglMap)
Vue.component('MglGeolocateControl', MglGeolocateControl)
Vue.component('MglNavigationControl', MglNavigationControl)

Vue.prototype.$mapbox = Mapbox
