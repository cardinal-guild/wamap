<template>
  <div
    class="islandMarkers"
    v-if="islandData && islandData.features && islandData.features.length"
  >
    <no-ssr>
      <l-marker
        v-for="island in islandData.features"
        :key="island.properties.key"
        :lat-lng="island.geometry.coordinates"
        :icon="getIconByAltitude(island.properties.altitude, island.properties.type, island.properties.tier)"
        :id="island.id"
        layer-type="overlay"
        :closePopupOnClick="false"
        @click="closeLegend($event, $bus)"
      >
        <island-popup  v-bind="island.properties" />
      </l-marker>
    </no-ssr>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import $ from 'jquery';
import IslandPopup from '~/components/IslandPopup';

const isBrowser = typeof window !== 'undefined';

let leaflet;
if (isBrowser) {
  leaflet = require('leaflet');
}
export default {
  components: {
    IslandPopup
  },
  computed: {
    ...mapState(['zoomPercentage', 'islandData'])
  },
  watch: {
    zoomPercentage (newZoomPercentage, oldZoomPercentage) {
      if (
        newZoomPercentage >= this.fromZoomPercentage &&
        newZoomPercentage < this.toZoomPercentage
      ) {
        $('.island-dot').css('opacity', '1');
        $('.island-dot').css('pointer-events', 'auto');
      } else {
        $('.island-dot').css('opacity', '0');
        $('.island-dot').css('pointer-events', 'none', 'important');
      }
    }
  },
  data () {
    return {
      islandIcons: {
        kioki: {
          high: '/island_icons/Island_K_H.png',
          medium: '/island_icons/Island_K_M.png',
          low: '/island_icons/Island_K_L.png'
        },
        saborian: {
          high: '/island_icons/Island_S_H.png',
          medium: '/island_icons/Island_S_M.png',
          low: '/island_icons/Island_S_L.png'
        }
      }
    };
  },
  props: {
    fromZoomPercentage: {
      type: Number,
      default: 15
    },
    toZoomPercentage: {
      type: Number,
      default: 80
    }
  },
  methods: {
    closeLegend: (e, b) => {
      b.$emit('closeLegend');
    },
    getIconByAltitude: (altitude, type, tier) => {
      let altClass = 'low';
      if (altitude > 2200) altClass = 'high';
      else if (altitude > 1800) altClass = 'medium';
      let tierClass = "one";
      if (tier === 2) tierClass = "two";
      else if (tier === 3) tierClass = "three";
      else if (tier === 4) tierClass = "four";
      let icon;
      if (type === "kioki") {
        icon = leaflet.divIcon({
          html: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 100 100"><circle class="'+altClass+' '+tierClass+'"cx="50" cy="50" r="40" /></svg>',
          iconAnchor: [15, 15],
          className: "island-dot"
        });
      }
      else if (type === "saborian") {
        icon = leaflet.divIcon({
          html: '<svg style="transform: rotateZ(45deg);" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 100 100"><rect class="'+altClass+' '+tierClass+'" width="100" height="100" /></svg>',
          iconAnchor: [12, 12],
          className: "island-dot"
        });
      }
      return icon;
    }
  }
};
</script>
<style lang="scss">
.island-dot {
  opacity: 0;
  transition: opacity 0.2s;
  > svg {

    circle {
      stroke-width: 8px;
    }

    rect {
      stroke-width: 20px;
    }

    circle, rect {

      &.four {
        &.high {
          stroke: rgb(150, 134, 117);
          fill: rgb(251, 224, 195);
        }
        &.medium {
          stroke: rgb(147, 106, 64);
          fill: rgb(246, 178, 107);
        }
        &.low {
          stroke: rgb(88, 63, 38);
          fill: rgb(147, 106, 64);
        }
      }

      &.three {
        &.high {
          stroke: rgb(125, 121, 138);
          fill: rgb(209, 202, 231);
        }
        &.medium {
          stroke: rgb(85, 74, 117);
          fill: rgb(142, 124, 195);
        }
        &.low {
          stroke: rgb(51, 44, 70);
          fill: rgb(85, 74, 117);
        }
      }

      &.two {
        &.high {
          stroke: rgb(117, 129, 148);
          fill: rgb(196, 216, 247);
        }
        &.medium {
          stroke: rgb(65, 94, 141);
          fill: rgb(109, 158, 235);
        }
        &.low {
          stroke: rgb(39, 56, 84);
          fill: rgb(65, 94, 141);
        }
      }

      &.one {
        &.high {
          stroke: rgb(126, 138, 121);
          fill: rgb(211, 231, 203);
        }
        &.medium {
          stroke: rgb(88, 117, 75);
          fill: rgb(147, 196, 125);
        }
        &.low {
          stroke: rgb(52, 70, 45);
          fill: rgb(88, 117, 75);
        }
      }
    }
  }
}
</style>
