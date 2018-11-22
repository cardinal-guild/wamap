import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from "vuex";
import L from 'leaflet';
import App from './App.vue';
import Map from "./components/Map.vue";
import 'leaflet.icon.glyph';

window.$ = window.jQuery = window.jquery = require("jquery");
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

Vue.config.productionTip = false
Vue.use(VueRouter);
Vue.use(Vuex);

const router = new VueRouter({
  mode: 'history',
  /*
  We just add one route
   */
  routes: [{
    // Wildcard path
    path: '*',
    // Specify the component to be rendered for this route
    component: Map,
    // Inject  props based on route.query values (our query parameters!)
    props: (route) => ({
      hideheader: route.query.hideheader,
      admin: route.query.admin,
      lat: route.query.lat,
      lng: route.query.lng,
      island: route.query.island,
      point: route.query.point,
      move: route.query.move
    })
  }]
});

const store = new Vuex.Store({
  state: {
    map: null,
  },
  mutations: {
    setMap(state, map) {
      state.map = map;
    },
  },
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
