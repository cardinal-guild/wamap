<template>
  <div v-if="boundaryData">
    <no-ssr>
      <l-marker
        v-for="sector in sectorMarkers"
        :key="sector.name"
        :lat-lng="sector.latLng"
        :icon="sector.icon"
        :options="{interactive: false}"
      />
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
    ...mapState(['zoomPercentage', 'islandData', 'boundaryData', 'boundariesLoading'])
  },
  watch: {
    zoomPercentage (newZoomPercentage, oldZoomPercentage) {
      if (
        newZoomPercentage >= this.fromZoomPercentage
      ) {
        $('.sector-label').css('display', 'block');
      } else {
        $('.sector-label').css('display', 'none');
      }
    },
    boundariesLoading (newVal, oldVal) {
      let curFeature;
      for (var i = 0; i < this.boundaryData.features.length; i++) {
        curFeature = this.boundaryData.features[i];
        if (/\D\d/.exec(curFeature.properties.name) != null) {
          let lat = 0;
          let lng = 0;
          let j;
          for (j = 0; j < curFeature.geometry.coordinates[0].length; j++) {
            lng += curFeature.geometry.coordinates[0][j][0];
            lat += curFeature.geometry.coordinates[0][j][1];

          }
          lat /= j;
          lng /= j;
          let marker = leaflet.divIcon({
            html:
              '<div class="sector-label">' +
              curFeature.properties.name +
              '</div>',
            className: 'sector-label-div'
          });
          this.sectorMarkers.push({
            name: curFeature.properties.name,
            latLng: leaflet.latLng(lat, lng),
            icon: marker
          });
        }
      }
    }
  },
  props: {
    fromZoomPercentage: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      sectorMarkers: [],
    }
  }
};
</script>
<style lang="scss">
.island-dot {
  display: none;
}

.sector-label {
  font-size: 35px;
  font-family: "Noto Sans", "Roboto", sans-serif;
  color: #291a08;
}
</style>
