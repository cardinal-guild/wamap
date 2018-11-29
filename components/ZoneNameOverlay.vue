<template>
  <l-image-overlay
    v-if="zonenamesData"
    :url="zonenamesData"
    :attribution="attribution"
    :bounds="bounds"
    :z-index="1000"
    @load="setOverlayLoaded"
    :options="{className: 'map-zone-overlay', interactive: false}"
    ref="zonenames"
  />
</template>
<script>
import { mapState } from 'vuex';
import $ from 'jquery';
export default {
  name: 'ZoneNameOverlay',
  computed: {
    ...mapState(['zonenamesData', 'zoomPercentage', 'overlayLoaded'])
  },
  methods: {
    setOverlayLoaded () {
      this.$store.commit('setOverlayLoaded', true);
    }
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
      if (
        this.$refs &&
        this.$refs.zonenames &&
        this.$refs.zonenames.getElement()
      ) {
        let elem = this.$refs.zonenames.getElement();
        if (elem) {
          let $elem = $(elem);
          if (newZoomPercentage > this.alphaFromZoomPercentage) {
            let opacity =
              (newZoomPercentage - this.alphaFromZoomPercentage) /
              (this.alphaToZoomPercentage - this.alphaFromZoomPercentage);
            $elem.css('opacity', 1 - opacity);
          } else {
            $elem.css('opacity', 1);
          }
          if (newZoomPercentage > this.alphaToZoomPercentage) {
            $elem.css('display', 'none');
          } else {
            $elem.css('display', 'block');
          }
        }
      }
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
<style lang="scss">
.map-zone-overlay {
  transition: opacity 0.2s;
}
</style>
