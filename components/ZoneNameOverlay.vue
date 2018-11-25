<template>
  <div v-if="islandData">
    <no-ssr>
      <l-image-overlay
        url="https://data.cardinalguild.com/zonenames.svg"
        :attribution="attribution"
        :bounds="bounds"
        :z-index="1000"
        className="map-zone-overlay"
        ref="zonenames"
      />
    </no-ssr>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import $ from 'jquery';
export default {
  name: 'ZoneNameOverlay',
  computed: {
    ...mapState(['zoomPercentage', 'islandData'])
  },
  props: {
    alphaFromZoomPercentage: {
      type: Number,
      default: 20
    },
    alphaToZoomPercentage: {
      type: Number,
      default: 30
    }
  },
  watch: {
    zoomPercentage (newZoomPercentage, oldZoomPercentage) {
      if (newZoomPercentage > this.alphaFromZoomPercentage) {
        let opacity =
          (newZoomPercentage - this.alphaFromZoomPercentage) /
          (this.alphaToZoomPercentage - this.alphaFromZoomPercentage);
        $('.map-zone-overlay').css('opacity', 1 - opacity);
      } else {
        $('.map-zone-overlay').css('opacity', 1);
      }
      if (newZoomPercentage > this.alphaToZoomPercentage) {
        $('.map-zone-overlay').css('display', 'none');
      } else {
        $('.map-zone-overlay').css('display', 'block');
      }
      //
    }
  },
  data () {
    return {
      attribution:
        "App made by the <a href='https://discord.gg/BVwKDwy'>Cardinal Guild</a>",
      bounds: [[0, 0], [-9500, 9500]]
    };
  }
};
</script>
