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
      if (newZoomPercentage <= this.normalIconFromZoomPercentage) {
        this.highlightIcon = leaflet.divIcon({
          html:
            '<img style="width:30px;height:30px;" src="/assets/highlight_arrow.png" />',
          iconSize: [30, 50],
          iconAnchor: [15, 25],
          clickable: false,
          interactive: false,
          className: 'highlight-icon'
        });
      } else if (newZoomPercentage <= this.bigIconfromZoomPercentage) {
        this.highlightIcon = leaflet.divIcon({
          html: '<img src="/assets/highlight_arrow.png" />',
          iconSize: [60, 100],
          iconAnchor: [30, 50],
          clickable: false,
          interactive: false,
          className: 'highlight-icon'
        });
      } else {
        this.highlightIcon = leaflet.divIcon({
          html: '<img src="/assets/highlight_arrow.png" />',
          iconSize: [60, 230],
          iconAnchor: [30, 120],
          clickable: false,
          interactive: false,
          className: 'highlight-icon'
        });
      }

      // let setIconHeight = this.iconHeightBig;

      // if (newZoomPercentage <= this.bigIconfromZoomPercentage) {
      //   setIconHeight = this.iconHeightSmall;
      // }
      // if (setIconHeight !== this.currentIconHeight) {
      //   this.currentIconHeight = setIconHeight;
      //
      // }
    }
  },

  props: {
    normalIconFromZoomPercentage: {
      type: Number,
      default: 35
    },
    bigIconfromZoomPercentage: {
      type: Number,
      default: 70
    }
  },
  mounted () {
    this.highlightIcon = leaflet.divIcon({
      html: '<img src="/assets/highlight_arrow.png" />',
      iconSize: [60, 120],
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
