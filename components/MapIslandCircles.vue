<template>
    <div 
        class="islandMarkers" 
        v-if="islandData &&
            islandData.features &&
            islandData.features.length &&
            zoomPercentage >= fromZoomPercentage &&
            zoomPercentage <= toZoomPercentage"
            >
        <no-ssr>
            <l-marker
                v-for="island in islandData.features"
                :key="island.properties.key"
                :lat-lng="island.geometry.coordinates"
                :icon="getIconImage(island.properties)"
                :id="island.id" 
                :data-databanks="island.properties.databanks"
                layer-type="overlay">
                <l-popup>
                  <island-popup v-bind="island.properties" />
                </l-popup>
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
  props: {
    fromZoomPercentage: {
      type: Number,
      default: 80
    },
    toZoomPercentage: {
      type: Number,
      default: 100
    }
  },
  methods: {
    getIconImage: properties => {
      if (properties.imageIcon) {
        let classNames = ['island-image-icon'];
        if (properties.revivalChambers) {
          classNames.push('revival');
        }
        if (properties.turrets) {
          classNames.push('turrets');
        }
        if (properties.dangerous) {
          classNames.push('turrets');
        }
        if (properties.type) {
          classNames.push(properties.type);
        }

        if (properties.databanks) {
          classNames.push('databanks-' + properties.databanks);
        }
        if (leaflet) {
          return leaflet.icon({
            properties: properties,
            iconUrl: properties.imageIcon,
            iconSize: [100, 100],
            className: classNames.join(' ')
          });
        }
      }
    }
  }
};
</script>

<style lang="scss">
.island-image-icon {
  border-radius: 100%;
  border: 5px solid #ccc;
  box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.75);
  &.revival {
    &:before {
      z-index: 2;
      width: 100%;
      height: 100%;
      position: absolute;
      content: 'test';
      top: 0;
      display: block;
    }
  }
}
</style>

