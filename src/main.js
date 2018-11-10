import Vue from 'vue';
import VueRouter from 'vue-router';
import L from 'leaflet';
import App from './App.vue';
import Map from "./components/Map.vue";
import 'leaflet.icon.glyph';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

Vue.config.productionTip = false
Vue.use(VueRouter);


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
      island: route.query.island
    })
  }]
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')