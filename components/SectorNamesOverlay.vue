<template>
    <div 
        class="sectorNames" 
        v-if="islandData &&
            islandData.features &&
            islandData.features.length">
        <no-ssr>
            <l-marker layer-type="overlay"></l-marker>
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
    ...mapState(['zoomPercentage', 'islandData'])
  },
  mounted () {
// for (var i = 0; i < self.geojson.data.features.length; i++) {
// let currentFeature = self.geojson.data.features[i];
// if (/\D\d/.exec(currentFeature.properties.name) != null) {
//     //weed out non-zones
//     let lat = 0;
//     let lng = 0;
//     var j;
//     for (j = 0; j < currentFeature.geometry.coordinates[0].length; j++) {
//     lng += currentFeature.geometry.coordinates[0][j][0];
//     lat += currentFeature.geometry.coordinates[0][j][1];
//     }
//     lat /= j;
//     lng /= j;
//     let marker = L.divIcon({
//     html:
//         '<div class="sector-label">' +
//         currentFeature.properties.name +
//         '</div>',
//     className: 'sector-label-div'
//     });
//     self.sectorMarkers.push({
//     name: currentFeature.properties.name,
//     latLng: L.latLng(lat, lng),
//     icon: marker
//     });
// }
// }
  },
  watch: {
    zoomPercentage (newZoomPercentage, oldZoomPercentage) {
      if (
        newZoomPercentage >= this.fromZoomPercentage
      ) {
        $('.sector-letter').css('display', 'block');
      } else {
        $('.sector-letter').css('display', 'none');
      }
    }
  },
  props: {
    fromZoomPercentage: {
      type: Number,
      default: 10
    }
  }
};
</script>
<style lang="scss">
.island-dot {
  display: none;
}
</style>
