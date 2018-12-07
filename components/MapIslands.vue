<template>
  <div class="islandMarkers" v-if="islandData && islandData.features && islandData.features.length">
    <no-ssr>
      <l-marker
        v-for="island in islandData.features"
        :key="island.properties.key"
        :lat-lng="island.geometry.coordinates"
        :icon="getIcon(island.properties)"
        :id="island.id"
        layer-type="overlay"
        :closePopupOnClick="false"
        @click="closeLegend($event, $bus)"
      >
        <island-popup v-bind="island.properties"/>
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
      if (newZoomPercentage !== this.prevZoom) {
        if (newZoomPercentage <= this.alphaIconsToPercentage) {
          let opacity = newZoomPercentage / this.alphaIconsToPercentage;
          $('.island-dot').css('opacity', opacity);
        } else {
          $('.island-dot').css('opacity', 1);
        }
        this.prevZoom = newZoomPercentage;
      }
    }
  },
  data () {
    return {
      islandIcons: {},
      prevZoom: null
    };
  },
  props: {
    showIconsFromPercentage: {
      type: Number,
      default: 35
    },
    showCirclesFromPercentage: {
      type: Number,
      default: 75
    },
    alphaIconsToPercentage: {
      type: Number,
      default: 40
    }
  },
  methods: {
    closeLegend: (e, b) => {
      b.$emit('closeLegend');
    },
    getIcon (properties) {
      if (this.zoomPercentage >= this.showCirclesFromPercentage) {
        return this.getCircleIcon(properties);
      } else if (this.zoomPercentage >= this.showIconsFromPercentage) {
        return this.getDotIcon(properties);
      }
      return this.getSmallDotIcon(properties);
    },
    getSmallDotIcon (properties) {
      if (
        properties &&
        properties.altitude != null &&
        properties.tier != null &&
        properties.type != null
      ) {
        let altClass = 'low';
        if (properties.altitude > 2200) altClass = 'high';
        else if (properties.altitude > 1800) altClass = 'medium';
        let tierClass = 'one';
        if (properties.tier === 2) tierClass = 'two';
        else if (properties.tier === 3) tierClass = 'three';
        else if (properties.tier === 4) tierClass = 'four';
        let icon;
        if (properties.type === 'kioki') {
          icon = leaflet.divIcon({
            html:
              '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><circle class="' +
              altClass +
              ' ' +
              tierClass +
              '"cx="6" cy="6" r="5" /></svg>',
            iconAnchor: [6, 6],
            iconSize: [12, 12],
            className: 'island-dot'
          });
        } else if (properties.type === 'saborian') {
          icon = leaflet.divIcon({
            html:
              '<svg style="transform: rotateZ(45deg);" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><rect class="' +
              altClass +
              ' ' +
              tierClass +
              '" width="12" height="12" /></svg>',
            iconAnchor: [6, 6],
            iconSize: [12, 12],
            className: 'island-dot'
          });
        }
        return icon;
      }
    },
    getDotIcon (properties) {
      if (
        properties &&
        properties.altitude != null &&
        properties.tier != null &&
        properties.type != null
      ) {
        let altClass = 'low';
        if (properties.altitude > 2200) altClass = 'high';
        else if (properties.altitude > 1800) altClass = 'medium';
        let tierClass = 'one';
        if (properties.tier === 2) tierClass = 'two';
        else if (properties.tier === 3) tierClass = 'three';
        else if (properties.tier === 4) tierClass = 'four';
        let icon;
        if (properties.type === 'kioki') {
          icon = leaflet.divIcon({
            html:
              '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><circle class="' +
              altClass +
              ' ' +
              tierClass +
              '"cx="15" cy="15" r="14" /></svg>',
            iconAnchor: [15, 15],
            iconSize: [30, 30],
            className: 'island-dot'
          });
        } else if (properties.type === 'saborian') {
          icon = leaflet.divIcon({
            html:
              '<svg style="transform: rotateZ(45deg);" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect class="' +
              altClass +
              ' ' +
              tierClass +
              '" width="24" height="24" /></svg>',
            iconAnchor: [12, 12],
            iconSize: [24, 24],
            className: 'island-dot'
          });
        }
        return icon;
      }
    },
    getCircleIcon (properties) {
      if (properties.imageIcon) {
        let classNames = ['island-circle'];
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
              '"><img class="island-circle-img" src="' +
              properties.imageIcon +
              '" />' +
              '<div class="island-circle-type"></div>' +
              '<div class="island-circle-knowledge">' +
              properties.databanks +
              '</div>' +
              '<div class="island-circle-revival"></div>' +
              '<div class="island-circle-turrets"></div>' +
              '</div>',
            iconSize: [100, 100],
            iconAnchor: [50, 50],
            className: classNames.join(' ')
          });
        }
      }
    }
  }
};
</script>
<style lang="scss">
.island-dot {
  > svg {
    circle {
      stroke-width: 2px;
    }

    rect {
      stroke-width: 4px;
    }

    circle,
    rect {
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

.island-circle {
  &-img {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 100%;
    border: 5px solid #ccc;

    box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.75);
  }
  &.dangerous .island-circle-img {
    border-color: #ea6d6d;
  }
  &.kioki {
    .island-circle-type:after {
      background-image: url('/island_icons/kioki_icon.png');
    }
  }
  &.saborian {
    .island-circle-turrets:before,
    .island-circle-revival:before {
      border-radius: 0;
      transform: rotateZ(45deg);
      width: 24px;
      height: 24px;
      top: 2px;
      left: 2px;
    }
    .island-circle-revival:after {
      top: 2px;
    }
    .island-circle-type {
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
    .island-circle-revival {
      display: block;
    }
  }

  &.turrets {
    .island-circle-turrets {
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
