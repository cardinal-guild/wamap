<template>
    <div
        class="islandMarkers"
        v-if="islandData &&
            islandData.features &&
            islandData.features.length"
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
                :closePopupOnClick="false"
                @click="closeLegend($event, $bus)">
                <island-popup v-bind="island.properties" />
            </l-marker>
        </no-ssr>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import IslandPopup from '~/components/IslandPopup';
import $ from 'jquery';
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
        newZoomPercentage <= this.toZoomPercentage
      ) {
        $('.island-divicon').css('opacity', '1');
        $('.island-divicon').css('pointer-events', 'auto');
      } else {
        $('.island-divicon').css('opacity', '0');
        $('.island-divicon').css('pointer-events', 'none', 'important');
      }
    }
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
        if (properties.dangerous) {
          classNames.push('dangerous');
        }
        if (leaflet) {
          return leaflet.divIcon({
            properties: properties,
            html:
              '<div class="' +
              classNames.join(' ') +
              '"><img class="island-divicon-img" src="' +
              properties.imageIcon +
              '" />' +
              '<div class="island-divicon-type"></div>' +
              '<div class="island-divicon-knowledge">' +
              properties.databanks +
              '</div>' +
              '<div class="island-divicon-revival"></div>' +
              '<div class="island-divicon-turrets"></div>' +
              '</div>',
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
  opacity: 0;
  transition: opacity 0.2s;
  &-img {
    width: 100px;
    height: 100px;
    border-radius: 100%;
    border: 5px solid #ccc;
    box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.75);
  }
  &.dangerous .island-divicon-img {
    border-color: #ea6d6d;
  }
  &.kioki {
    .island-divicon-type:after {
      background-image: url('/island_icons/kioki_icon.png');
    }
  }
  &.saborian {
    .island-divicon-turrets:before,
    .island-divicon-revival:before {
      border-radius: 0;
      transform: rotateZ(45deg);
      width: 24px;
      height: 24px;
      top: 2px;
      left: 2px;
    }
    .island-divicon-revival:after {
      top: 2px;
    }
    .island-divicon-type {
      bottom: -14px;
      border-radius: 0;
      background: none;
      &:before {
        background: rgb(240, 240, 255);
        border-radius: 0;
        width: 90%;
        height: 90%;
        top: -2.5%;
        left: 2.5%;
        transform: rotateZ(45deg);
      }
      &:after {
        background-image: url('/island_icons/saborian_icon.png');
      }
    }
  }
  &.revival {
    .island-divicon-revival {
      display: block;
    }
  }

  &.turrets {
    .island-divicon-turrets {
      display: block;
    }
  }
  &-knowledge {
    position: absolute;
    display: block;
    width: 36px;
    height: 36px;
    top: -15px;
    left: 32px;
    background-image: url('/island_icons/knowledge_icon.png');
    color: black;
    text-align: center;
    padding: 7px;
    font-size: 1.2em;
    font-weight: 600;
    font-family: 'Noto Sans', sans-serif;
  }
  &-revival {
    display: none;
    width: 28px;
    height: 28px;
    position: absolute;
    top: 36px;
    right: -14px;
    &:before {
      content: ' ';
      background: rgb(20, 160, 20);
      box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.75);
      border-radius: 100%;
      width: 100%;
      height: 100%;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
    }
    &:after {
      content: ' ';
      background-image: url('/island_icons/revival_icon.png');
      width: 20px;
      height: 20px;
      display: block;
      position: absolute;
      top: 4px;
      left: 4px;
    }
  }
  &-turrets {
    display: none;
    width: 28px;
    height: 28px;
    position: absolute;
    top: 36px;
    left: -14px;

    &:before {
      content: ' ';
      background: rgb(160, 20, 20);
      box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.75);
      border-radius: 100%;
      width: 100%;
      height: 100%;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
    }
    &:after {
      content: ' ';
      background-image: url('/island_icons/turret_icon.png');
      width: 20px;
      height: 20px;
      display: block;
      position: absolute;
      top: 4px;
      left: 4px;
    }
  }
  &-type {
    &:before {
      content: ' ';
      background: rgb(255, 240, 220);
      box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.75);
      border-radius: 100%;
      width: 100%;
      height: 100%;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
    }

    width: 32px;
    height: 32px;
    position: absolute;
    bottom: -16px;
    left: 35px;
    display: block;
    &:after {
      content: ' ';
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

