<template>
    <div 
        class="hilite-markers" 
        v-if="hilites && hilites.length">
        <no-ssr>
            <l-marker
                v-for="hiliteCoord in hilitedCoords"
                :key="hilitedCoords.findIndex(hiliteCoord)"
                :lat-lng="hiliteCoord.latLng"
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
    ...mapState(['hilitedCoords'])
  },
  data () {
    return {
      hiliteIcon: null
    };
  }
};
</script>
