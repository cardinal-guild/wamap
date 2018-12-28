<template>
  <div id="map-wrap" v-if="islandData && boundaryData">
    <no-ssr>
      <BuildUpOverlay v-if="buildUpSequence"/>
      <l-map
        :bounds="bounds"
        :center="center"
        :crs="crs"
        :zoom="zoom"
        :options="mapOptions"
        :attributionControl="false"
        :attribution="false"
        :closePopupOnClick="false"
        :preferCanvas="true"
        :z-index="0"
        @moveend="onMoveEnd($event, $root)"
        @zoom="onZoom($event, $root)"
        ref="map"
        id="leaflet-map"
      >
        <l-geo-json
          class="boundaries"
          ref="boundaries"
          :geojson="$store.state.boundaryData"
          :options="boundaryOptions"
          v-if="buildGeoJson"
        />
        <sector-names-overlay v-if="buildGeoJson" :fromZoomPercentage="15" :toZoomPercentage="65"/>
        <zone-name-overlay
          v-if="buildGeoJson"
          :alphaFromZoomPercentage="0"
          :alphaToZoomPercentage="40"
        />
        <map-islands
          v-if="buildIslandIcons"
          :showIconsFromPercentage="35"
          :alphaIconsToPercentage="30"
          :showCirclesFromPercentage="75"
        />
        <map-highlighter :normalIconFromZoomPercentage="35" :bigIconfromZoomPercentage="75"/>
        <map-account-checkmarker
          :normalIconFromZoomPercentage="35"
          :bigIconfromZoomPercentage="75"
        />
        <map-location-marker/>
        <map-legend :fadeOutFromZoomPercentage="75"/>
      </l-map>
    </no-ssr>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';
import MapLegend from '~/components/MapLegend.vue';
import MapIslands from '~/components/MapIslands.vue';
import MapHighlighter from '~/components/MapHighlighter.vue';
import ZoneNameOverlay from '~/components/ZoneNameOverlay.vue';
import SectorNamesOverlay from '~/components/SectorNamesOverlay.vue';
import MapLocationMarker from '~/components/MapLocationMarker.vue';
import MapAccountCheckmarker from '~/components/MapAccountCheckmarker.vue';
import BuildUpOverlay from '~/components/BuildUpOverlay.vue';
const isBrowser = typeof window !== 'undefined';

let leaflet;
if (isBrowser) {
  leaflet = require('leaflet');
}
export default {
  components: {
    MapLegend,
    MapIslands,
    MapHighlighter,
    ZoneNameOverlay,
    SectorNamesOverlay,
    MapLocationMarker,
    MapAccountCheckmarker,
    BuildUpOverlay
  },
  computed: {
    ...mapState(['islandData', 'boundaryData'])
  },
  methods: {
    onZoom: _.debounce((e, r) => {
      let zoomPercentage = Math.round(
        ((e.target._zoom - e.target.options.minZoom) /
          (e.target.options.maxZoom - e.target.options.minZoom)) *
          100
      );
      if (console && console.log) {
        console.log('Map zoom: ' + e.target._zoom);
        console.log('Map zoomPercentage: ' + zoomPercentage);
      }
      r.$store.commit('setZoomPercentage', zoomPercentage);
    }, 200),
    onMoveEnd: (e, r) => {
      r.$store.commit('setLatLng', e.target.getCenter());
    },
    zoomPercentageToLocalZoom: (zoom, min, max) => {
      let localZoom = (zoom / 100) * (max - min) + min;
      return localZoom;
    },
    async startBuildUpSequence () {
      let wait = ms =>
        new Promise((resolve, reject) => {
          setTimeout(() => resolve(), ms);
        });
      await wait(10);
      this.buildGeoJson = true;
      await wait(10);
      this.buildIslandIcons = true;
      await wait(10);
      if (
        this.$router.currentRoute &&
        this.$router.currentRoute.query &&
        this.$store.state.overlayLoaded &&
        this.currentMap
      ) {
        let zoomPercentage = Math.round(
          ((this.currentMap._zoom - this.currentMap.minZoom) /
            (this.currentMap.maxZoom - this.currentMap.minZoom)) *
            100
        );
        this.$store.commit('setZoomPercentage', zoomPercentage);
        let self = this;
        setTimeout(() => {
          if (self.$router.currentRoute.query.island && self.currentMap) {
            let islands = self.$store.state.islandData.features;
            let islandId = parseInt(self.$router.currentRoute.query.island);
            let filteredIslands = _.filter(islands, { id: islandId });
            if (filteredIslands.length) {
              let foundIsland = filteredIslands[0];
              let coords = foundIsland.geometry.coordinates;
              let localZoom = self.zoomPercentageToLocalZoom(
                90,
                self.currentMap.options.minZoom,
                self.currentMap.options.maxZoom
              );
              self.$store.commit('addHighlight', coords);
              self.currentMap.setView(coords, localZoom);
            }
          }

          if (
            self.$router.currentRoute.query.lat &&
            self.$router.currentRoute.query.lng &&
            self.$router.currentRoute.query.zoom &&
            self.currentMap
          ) {
            let lat = self.$router.currentRoute.query.lat;
            let lng = self.$router.currentRoute.query.lng;
            let localZoom = self.zoomPercentageToLocalZoom(
              self.$router.currentRoute.query.zoom,
              self.currentMap.options.minZoom,
              self.currentMap.options.maxZoom
            );
            self.currentMap.setView([lat, lng], localZoom);
          }
        }, 2000);
      }
      this.buildUpSequence = false;
    }
  },
  beforeMount () {
    this.crs = leaflet.CRS.Simple;
    this.$store.commit('setMapMode', this.mode);
    const checkMapObject = setInterval(async () => {
      if (
        this.$refs.map &&
        this.$refs.map.mapObject &&
        this.$store.state.boundaryData &&
        this.$store.state.islandData
      ) {
        this.$store.commit('loading', false);
        clearInterval(checkMapObject);
        this.currentMap = this.$refs.map.mapObject;
        this.currentMap.getRenderer(this.currentMap).options.padding = 0.5;
        await this.startBuildUpSequence();
      }
    }, 100);
  },
  mounted () {
    this.$store.commit('setHighlights', []);
    this.$bus.$on('zoomToIsland', coords => {
      let localZoom = this.zoomPercentageToLocalZoom(
        80,
        this.currentMap.options.minZoom,
        this.currentMap.options.maxZoom
      );
      this.$store.commit('setHighlights', [coords]);
      this.currentMap.setView(coords, localZoom);
      this.$bus.$emit('closeLegend');
    });
    this.$bus.$on('zoomToIslandWithoutHighlight', coords => {
      let localZoom = this.zoomPercentageToLocalZoom(
        80,
        this.currentMap.options.minZoom,
        this.currentMap.options.maxZoom
      );
      this.currentMap.setView(coords, localZoom);
      this.$bus.$emit('closeLegend');
    });
  },
  data () {
    return {
      currentMap: null,
      center: [-4750, 4750],
      bounds: [[0, 0], [-9500, 9500]],
      boundaryOptions: {
        style: function (feature) {
          return feature.properties;
        },
        interactive: false
      },
      buildUpSequence: true,
      buildGeoJson: false,
      buildIslandIcons: false,
      buildIslandCircles: false,
      crs: null,
      zoom: -4.6,
      mapOptions: {
        minZoom: -4.6,
        maxZoom: -0.4,
        zoomSnap: 0.2,
        zoomDelta: 0.2,
        wheelPxPerZoomPercentage: 400,
        attributionControl: true
      }
    };
  },
  props: {
    mode: {
      type: String,
      default: 'pve'
    }
  }
};
</script>

<style lang="scss" scoped>
#map-wrap {
  position: absolute;
  background: none;
  display: block;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-perspective: 1000;
  -moz-perspective: 1000;
  -ms-perspective: 1000;
  perspective: 1000;
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -ms-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  .leaflet-container {
    &.leaflet-control-container {
      .leaflet-control-zoom {
        background: #4f4141;
        border: 0px;
        border-radius: 0px;
        border-top: 5px solid #e0b084;
        border-bottom: 5px solid #e0b084;
        &-in {
          background: #0000;
          color: #e0b084;
          border-bottom: 0px solid #e0b084;
        }
        &-out {
          background: #0000;
          color: #e0b084;
        }
        a:hover {
          background: #0000;
          color: #ffe5c4;
          border-bottom: 0px solid #e0b084;
        }
      }

      .leaflet-bar a.leaflet-disabled {
        background: #453836;
        color: #5b4a4a;
      }

      .issue-links {
        background: rgba(79, 65, 65, 0.9);
        color: #ffe5c4;
        font-size: 11px;
        margin: 0;
        border: 0px;
        border-radius: 0px;
        border-top: 3px solid #e0b084;
        padding: 2px 10px;

        a {
          color: #ffe5c4;
          text-decoration: none;
        }
      }

      .leaflet-control-attribution {
        font-size: 11px;
        background: rgba(79, 65, 65, 0.9);
        color: #fff;
        border-top: 3px solid #e0af84;
        padding: 2px 10px;

        a {
          color: #ffe5c4;
        }
      }
    }
  }
  .vue2leaflet-map {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: block;
    z-index: 0;
  }
}
</style>
<style lang="scss">
.leaflet-overlay-pane svg g {
  path[fill='#339933'] {
    fill: #b1deab;
  }

  path[fill='#009999'] {
    fill: #aecbf5;
  }

  path[fill='#999999'] {
    fill: #e3c9f9;
  }

  path[fill='#996633'] {
    fill: #f7c38f;
  }

  path[fill='#ffffff'] {
    fill: #bbbbbb;
  }

  path[fill='#333333'] {
    fill: #403d84;
  }
}
</style>
