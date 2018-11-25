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
                layer-type="overlay"
                @click="closeLegend($event, $bus)">
                <l-popup>
                  <island-popup :mode="mode" v-bind="island.properties" />
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
    },
    mode: {
      type: String,
      default: 'pve'
    }
  },
  methods: {
    closeLegend: (e, b) => {
      b.$emit('closeLegend');
    },
    getIconImage: properties => {
      if (properties.imageIcon) {
        let classNames = ['island-divicon'];
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
          return leaflet.divIcon({
            properties: properties,
            html:
              '<div class="' +
              classNames.join(' ') +
              '"><img class="island-divicon-img" src="' +
              properties.imageIcon +
              '" /><div class="island-divicon-type"></div><div class="island-image-divicon-revivor"></div></div>',
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
.island-divicon {
  &-img {
    width: 100px;
    height: 100px;
    border-radius: 100%;
    border: 5px solid #ccc;
    box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.75);
  }
  &.kioki {
    .island-divicon-type:after {
      background-image: url('/assets/kioki_icon.png');
    }
  }
  &.saborian {
    .island-divicon-type {
      border-radius: 0;
      background: none;
      &:before {
        content: ' ';
        background: #ccc;
        width: 90%;
        height: 90%;
        display: block;
        position: absolute;
        top: -2.5%;
        left: 2.5%;
        transform: rotateZ(45deg);
      }
      &:after {
        background-image: url('/assets/saborian_icon.png');
      }
    }
  }
  &.revival {
  }
  &-type {
    border-radius: 100%;
    display: block;
    background: #ccc;
    width: 32px;
    height: 32px;
    position: absolute;
    bottom: -16px;
    left: 35px;
    &:after {
      content: ' ';
      background-size: cover;
      width: 24px;
      height: 24px;
      margin: 4px;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>

