<template>
  <div class="highlight-markers">
    <no-ssr>
      <l-marker
        v-for="(highlightedCoord, index) in highlightedCoords"
        :key="index"
        :lat-lng="highlightedCoord"
        :icon="highlightIcon"
        :options="{interactive: false}"
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
    ...mapState(['highlightedCoords', 'zoomPercentage'])
  },

  watch: {
    zoomPercentage (newZoomPercentage, oldZoomPercentage) {
      if (newZoomPercentage < this.showFromZoomPercentage) {
        $('.highlight-icon').css('display', 'none');
      } else {
        $('.highlight-icon').css('display', 'block');
      }
      let setIconHeight = this.iconHeightBig;
      if (newZoomPercentage <= this.bigIconfromZoomPercentage) {
        setIconHeight = this.iconHeightSmall;
      }
      if (setIconHeight !== this.currentIconHeight) {
        this.currentIconHeight = setIconHeight;
        this.highlightIcon = leaflet.divIcon({
          html: '<img src="/assets/highlight_arrow.png" />',
          iconSize: [60, this.currentIconHeight],
          clickable: false,
          className: 'highlight-icon'
        });
      }
    }
  },

  props: {
    showFromZoomPercentage: {
      type: Number,
      default: 15
    },
    bigIconfromZoomPercentage: {
      type: Number,
      default: 70
    },
    iconHeightBig: {
      type: Number,
      default: 240
    },
    iconHeightSmall: {
      type: Number,
      default: 120
    }
  },
  mounted () {
    this.highlightIcon = leaflet.divIcon({
      html: '<img src="/assets/highlight_arrow.png" />',
      iconSize: [60, this.currentIconHeight],
      clickable: false,
      interactive: false,
      className: 'highlight-icon'
    });
  },
  data () {
    return {
      highlightIcon: null,
      currentIconHeight: 240
    };
  }
};
</script>
<style lang="scss">
.highlight-icon {
  pointer-events: none !important;
}
</style>
