<template>
    <div class="highlight-markers" >
        <no-ssr>
            <l-marker 
                v-for="(highlightedCoord, index) in highlightedCoords"
                :key="index"
                :lat-lng="highlightedCoord"
                :icon="highlightIcon"
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
    ...mapState(['highlightedCoords'])
  },
  data () {
    return {
      highlightIcon: leaflet.divIcon({
        html: '<img src="/assets/highlight_arrow.png" />',
        iconSize: [60, 240],
        className: 'highlight-icon'
      })
    };
  }
};
</script>
