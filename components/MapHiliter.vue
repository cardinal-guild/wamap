<template>
    <div 
        class="hilite-markers" 
        v-if="hilites && hilites.length">
        <no-ssr>
            <l-marker
                v-for="hilite in hilites"
                :key="hilites.findIndex(hilite)"
                :lat-lng="hilite.latLng"
                layer-type="overlay">
            </l-marker>
        </no-ssr>
    </div>
</template>

<script>
import { mapState } from 'vuex';
const isBrowser = typeof window !== 'undefined';

let leaflet;
if (isBrowser) {
  leaflet = require('leaflet');
}
export default {
  computed: {
    ...mapState(['hilites'])
  },
  data () {
    return {
      hiliteIcon: null
    };
  }
};
</script>
