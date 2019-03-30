<template>
  <l-image-overlay
    v-if="zonenamesData"
    ref="zonenames"
    :url="zonenamesData"
    :attribution="attribution"
    :bounds="bounds"
    :clickable="false"
    :interactive="false"
    :options="{class: 'map-zone-overlay', className: 'map-zone-overlay', interactive: false}"
    @load="setOverlayLoaded"
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
          $elem.css('z-index', 1001);
          if (newZoomPercentage > this.alphaFromZoomPercentage) {
            let opacity =
              (newZoomPercentage - this.alphaFromZoomPercentage) /
              (this.alphaToZoomPercentage - this.alphaFromZoomPercentage);
            $elem.css('opacity', 1 - opacity);
          } else {
            $elem.css('opacity', 1);
          }
          if (newZoomPercentage > this.alphaToZoomPercentage) {
            $elem.hide();
          } else {
            $elem.show();
          }
        }
      }
    }
  },
  data () {
    return {
      attribution:
        "Data from the <a href='https://discord.gg/BVwKDwy'>Cardinal Guild</a>. App made by Machine_Maker and FearlessJake",
      bounds: [[0, 0], [-9500, 9500]]
    };
  }
};
</script>
