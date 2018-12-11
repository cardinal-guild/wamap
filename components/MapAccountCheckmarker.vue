<template>
  <div class="highlight-markers" v-if="currentCharacter && characters.length">
    <no-ssr>
      <l-marker
        v-for="island in visitedIslands"
        :key="island.properties.key"
        :lat-lng="island.geometry.coordinates"
        :icon="checkMarkerIcon"
        layer-type="overlay"
      ></l-marker>
    </no-ssr>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import $ from 'jquery';
const isBrowser = typeof window !== 'undefined';

let leaflet;
if (isBrowser) {
  leaflet = require('leaflet');
}
export default {
  computed: {
    ...mapState(['currentCharacter', 'characters', 'zoomPercentage','islandData'])
  },
  mounted () {
    this.checkMarkerIcon = leaflet.divIcon({
      html: '<div class="checkmark-icon"></div>',
      iconSize: [24, 124],
      className: 'highlight-icon'
    });
  },
  data () {
    return {
      checkMarkerIcon: null
    };
  }
};
</script>
<style lang="scss">
.checkmark-icon {
  padding-top: 100px;
}
</style>
