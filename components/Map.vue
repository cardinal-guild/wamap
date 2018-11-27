<template>
  <div id="map-wrap" v-if="islandData && boundaryData">
    <no-ssr>
      <l-map
        :bounds="bounds"
        :center="center"
        :crs="crs"
        :zoom="zoom"
        :options="mapOptions"
        :attributionControl="false"
        :attribution="false"
        :closePopupOnClick="false"
        @moveend="onMoveEnd($event, $root)"
        @zoom="onZoom($event, $root)"
        ref="map"
      >
        <l-geo-json
          class="boundaries"
          ref="boundaries"
          :geojson="$store.state.boundaryData"
          :options="boundaryOptions"
        />
        <zone-name-overlay :alphaFromZoomPercentage="0" :alphaToZoomPercentage="35"/>
        <sector-names-overlay :fromZoomPercentage="35" :toZoomPercentage="70"/>
        <map-highlighter
          :bigIconfromZoomPercentage="70"
          :showFromZoomPercentage="30"
          :iconHeightSmall="100"
          :iconHeightBig="240"
        />
        <map-island-circles :fromZoomPercentage="70" :toZoomPercentage="100"/>
        <map-island-icons :fromZoomPercentage="30" :toZoomPercentage="70"/>
        <l-layer-group ref="grid" :bounds="bounds"></l-layer-group>
        <map-legend :fadeOutFromZoomPercentage="70"/>
      </l-map>
    </no-ssr>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';
import MapLegend from '~/components/MapLegend.vue';
import MapIslandIcons from '~/components/MapIslandIcons.vue';
import MapIslandCircles from '~/components/MapIslandCircles.vue';
import MapHighlighter from '~/components/MapHighlighter.vue';
import ZoneNameOverlay from '~/components/ZoneNameOverlay.vue';
import SectorNamesOverlay from '~/components/SectorNamesOverlay.vue';
const isBrowser = typeof window !== 'undefined';

let leaflet;
if (isBrowser) {
  leaflet = require('leaflet');
}
export default {
  components: {
    MapLegend,
    MapIslandIcons,
    MapIslandCircles,
    MapHighlighter,
    ZoneNameOverlay,
    SectorNamesOverlay
  },
  computed: {
    ...mapState(['islandData', 'boundaryData'])
  },
  methods: {
    onZoom: (e, r) => {
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
    },
    onMoveEnd: (e, r) => {
      r.$store.commit('setLatLng', e.target.getCenter());
    },
    zoomPercentageToLocalZoom: (zoom, min, max) => {
      let localZoom = (zoom / 100) * (max - min) + min;
      return localZoom;
    }
  },
  beforeMount () {
    let self = this;
    this.crs = leaflet.CRS.Simple;
    this.$store.commit('setMapMode', this.mode);
    const checkMapObject = setInterval(() => {
      if (
        this.$refs.map &&
        this.$refs.map.mapObject &&
        this.$store.state.boundaryData &&
        this.$store.state.zoneNamesLoaded &&
        this.$store.state.islandData
      ) {
        self.currentMap = this.$refs.map.mapObject;
        self.currentMap.getRenderer(self.currentMap).options.padding = 10;

        if (
          self.$router.currentRoute &&
          self.$router.currentRoute.query &&
          self.currentMap
        ) {
          if (self.$router.currentRoute.query.island && self.currentMap) {
            let islands = this.$store.state.islandData.features;
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
            // self.$router.push({ name: self.$router.currentRoute.name });
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
            // self.$router.push({ name: self.$router.currentRoute.name });
          }
        }

        clearInterval(checkMapObject);
      }
    }, 1000);
  },
  mounted () {
    this.$store.dispatch('loadAll');
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
      crs: null,
      zoom: -4.6,
      mapOptions: {
        minZoom: -4.6,
        maxZoom: -0.4,
        zoomSnap: 0.2,
        zoomDelta: 0.2,
        wheelPxPerZoomPercentage: 200,
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
  background: none;
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
  }
}
</style>
