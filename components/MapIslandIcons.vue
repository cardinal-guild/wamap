<template>
    <div 
        class="islandMarkers" 
        v-if="islandData &&
            islandData.features &&
            islandData.features.length &&
            zoomPercentage >= fromZoomPercentage &&
            zoomPercentage < toZoomPercentage"
            >
        <no-ssr>
            <l-marker
                v-for="island in islandData.features"
                :key="island.properties.key"
                :lat-lng="island.geometry.coordinates"
                :icon="getIconByAltitude(island.properties.altitude, island.properties.type, $data.islandIcons)"
                :id="island.id"
                layer-type="overlay"
                @click="closeLegend($event, $bus)"
                >
                <island-popup  v-bind="island.properties" />
            </l-marker>
        </no-ssr>
    </div>
</template>

<script>
import { mapState } from 'vuex';
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
  data () {
    return {
      islandIcons: {
        kioki: {
          high: '/assets/island_icons/Island_K_H.png',
          medium: '/assets/island_icons/Island_K_M.png',
          low: '/assets/island_icons/Island_K_L.png'
        },
        saborian: {
          high: '/assets/island_icons/Island_S_H.png',
          medium: '/assets/island_icons/Island_S_M.png',
          low: '/assets/island_icons/Island_S_L.png'
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
    getIconByAltitude: (altitude, type, islandIcons) => {
      let height = 'low';
      if (altitude > 1800) {
        height = 'medium';
      } else if (altitude > 2200) {
        height = 'high';
      }
      if (leaflet) {
        return leaflet.icon({
          iconUrl: islandIcons[type][height],
          iconSize: [30, 30],
          className: 'island-icon'
        });
      }
    }
  }
};
</script>
