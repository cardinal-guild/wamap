<template>
  <div
    v-if="
      islandData &&
        islandData.features &&
        islandData.features.length &&
        currentCharacter &&
        characters.length
    "
    class="highlight-markers"
  >
    <no-ssr>
      <l-marker
        v-for="island in visitedIslands"
        :key="island.properties.key"
        :lat-lng="island.geometry.coordinates"
        :icon="checkMarkerIcon"
        layer-type="overlay"
      />
    </no-ssr>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import $ from 'jquery';
import _ from 'lodash';
const isBrowser = typeof window !== 'undefined';

let leaflet;
if (isBrowser) {
  leaflet = require('leaflet');
}
export default {
  computed: {
    ...mapState(['zoomPercentage', 'islandData']),
    ...mapState('account', {
      loggedIn: 'loggedIn',
      currentCharacter: 'currentCharacter',
      characters: 'characters'
    })
  },
  methods: {
    updateVisitedIslands() {
      if (
        this.currentCharacter !== '' &&
        this.characters &&
        this.characters.length &&
        this.islandData &&
        this.islandData.features &&
        this.islandData.features.length
      ) {
        let filterGuid = this.currentCharacter;
        let currentChar = _.chain(this.characters)
          .filter(function(x) {
            return x.guid === filterGuid;
          })
          .first()
          .value();
        if (
          currentChar &&
          currentChar.visited_islands &&
          currentChar.visited_islands.length
        ) {
          let setVisitedIslands = [];
          _.each(currentChar.visited_islands, visitedIslandId => {
            setVisitedIslands.push(
              _.chain(this.islandData.features)
                .filter(function(x) {
                  return x.id === parseInt(visitedIslandId);
                })
                .first()
                .value()
            );
          });
          this.visitedIslands = setVisitedIslands;
        } else {
          this.visitedIslands = [];
        }
      } else {
        this.visitedIslands = [];
      }
    }
  },
  mounted() {
    this.checkMarkerIcon = leaflet.divIcon({
      html: '<img src="/wamap/assets/checkmark_small.png" />',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      clickable: false,
      interactive: false,
      className: 'checkmark-icon'
    });
    this.currentSize = 'small';
    this.updateVisitedIslands();
    this.$bus.$on('updateCheckmarks', e => {
      this.updateVisitedIslands();
    });
  },
  watch: {
    zoomPercentage(newZoomPercentage, oldZoomPercentage) {
      if (newZoomPercentage <= this.normalIconFromZoomPercentage) {
        if (this.currentSize !== 'small') {
          this.checkMarkerIcon = leaflet.divIcon({
            html: '<img src="/wamap/assets/checkmark_small.png" />',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            clickable: false,
            interactive: false,
            className: 'checkmark-icon'
          });
          this.currentSize = 'small';
        }
      } else if (newZoomPercentage <= this.bigIconfromZoomPercentage) {
        if (this.currentSize !== 'medium') {
          this.checkMarkerIcon = leaflet.divIcon({
            html: '<img src="/wamap/assets/checkmark.png" />',
            iconSize: [60, 60],
            iconAnchor: [30, 30],
            clickable: false,
            interactive: false,
            className: 'checkmark-icon'
          });
          this.currentSize = 'medium';
        }
      } else {
        if (this.currentSize !== 'big') {
          this.checkMarkerIcon = leaflet.divIcon({
            html: '<img src="/wamap/assets/checkmark.png" />',
            iconSize: [140, 140],
            iconAnchor: [70, 70],
            clickable: false,
            interactive: false,
            className: 'checkmark-icon'
          });
          this.currentSize = 'big';
        }
      }
    },
    currentCharacter(newGuid, oldGuid) {
      this.updateVisitedIslands();
    },
    characters(newArr, oldArr) {
      this.updateVisitedIslands();
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
  data() {
    return {
      currentSize: '',
      checkMarkerIcon: null,
      visitedIslands: []
    };
  }
};
</script>
<style lang="scss">
.checkmark-icon {
  cursor: auto;
  pointer-events: none !important;
  img {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
