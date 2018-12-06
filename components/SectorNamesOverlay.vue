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
    ...mapState(['zoomPercentage', 'boundaryData'])
  },
  watch: {
    zoomPercentage (newZoomPercentage, oldZoomPercentage) {
      $('.sector-label').css('z-index', 1000);
      if (newZoomPercentage >= this.fromZoomPercentage) {
        let opacity =
          (newZoomPercentage - this.fromZoomPercentage) /
          (this.toZoomPercentage - this.fromZoomPercentage);
        opacity = 1 - opacity;
        console.log('New between opacity: ' + opacity);
        $('.sector-label').css('opacity', opacity);
      } else {
        let opacity = newZoomPercentage / this.fromZoomPercentage;
        console.log('New opacity: ' + opacity);
        $('.sector-label').css('opacity', opacity);
      }
      if (newZoomPercentage > this.toZoomPercentage) {
        $('.sector-label').hide();
      } else {
        $('.sector-label').show();
      }
    },
    boundaryData (newVal, oldVal) {
      this.createSectors();
    }
  },
  mounted () {
    this.createSectors();
  },
  methods: {
    createSectors () {
      if (
        this.boundaryData &&
        this.boundaryData.features &&
        this.boundaryData.features.length
      ) {
        this.sectorMarkers = [];
        let curFeature;
        for (var i = 0; i < this.boundaryData.features.length; i++) {
          curFeature = this.boundaryData.features[i];
          if (/\D\d/.exec(curFeature.properties.name) != null) {
            let lat = 0;
            let lng = 0;
            let j;
            for (
              j = 0;
              j < curFeature.geometry.coordinates[0].length - 1;
              j++
            ) {
              lng += curFeature.geometry.coordinates[0][j][0];
              lat += curFeature.geometry.coordinates[0][j][1];
            }
            lat /= j;
            lng /= j;
            let marker = leaflet.divIcon({
              html: curFeature.properties.name,
              className: 'sector-label',
              clickable: false,
              interactive: false,
              iconSize: [80, 40]
            });
            this.sectorMarkers.push({
              name: curFeature.properties.name,
              latLng: leaflet.latLng(lat, lng),
              icon: marker
            });
          }
        }
      }
    }
  },
  props: {
    fromZoomPercentage: {
      type: Number,
      default: 10
    },
    toZoomPercentage: {
      type: Number,
      default: 70
    }
  },
  data () {
    return {
      sectorMarkers: []
    };
  }
};
</script>
<style lang="scss">
.sector-label {
  display: none;
  text-align: center;
  font-size: 35px;
  font-family: 'Noto Sans', 'Roboto', sans-serif;
  color: rgba(black, 0.75);
  pointer-events: none !important;
}
</style>
