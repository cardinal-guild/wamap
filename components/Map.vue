<template>
  <div id="map-wrap">
      <no-ssr>
        <l-map  
        :bounds="bounds" 
        :center="center"
        :crs="crs"
        :minZoom="mapOptions.minZoom"
        :maxZoom="mapOptions.maxZoom"
        :options="mapOptions"
        :attributionControl="false"
        :attribution="false"
        @moveend="onMoveEnd($event, $root)"
        @zoom="onZoom($event, $root)"
        ref="map"
        >  
          <l-geo-json
            className="boundaries"
            ref="boundaries"
            :geojson="$store.state.boundaryData"
            :options="boundaryOptions" 
          /> 
          <map-island-circles :fromZoomlevel="75" :toZoomlevel="100" />
          <map-island-icons :fromZoomlevel="25" :toZoomlevel="75" />
          <map-legend :fadeOutFromZoomlevel="80" />
        </l-map> 
    </no-ssr>
  </div>
</template>

<script>
import MapLegend from '~/components/MapLegend.vue';
import MapIslandIcons from '~/components/MapIslandIcons.vue';
import MapIslandCircles from '~/components/MapIslandCircles.vue';
const isBrowser = typeof window !== 'undefined';

let leaflet;
if (isBrowser) {
  leaflet = require('leaflet');
}
export default {
  components: { MapLegend, MapIslandIcons, MapIslandCircles },
  methods: {
    onZoom: (e, r) => {
      let zoomLevel = Math.round(
        ((e.target._zoom - e.target.options.minZoom) /
          (e.target.options.maxZoom - e.target.options.minZoom)) *
          100
      );
      r.$store.commit('setZoomLevel', zoomLevel);
    },
    onMoveEnd: (e, r) => {
      r.$store.commit('setLatLng', e.target.getCenter());
    }
  },
  beforeMount () {
    let self = this;
    this.crs = leaflet.CRS.Simple;
    const checkMapObject = setInterval(() => {
      if (this.$refs.map && this.$refs.map.mapObject) {
        self.currentMap = this.$refs.map.mapObject;
        self.currentMap.getRenderer(self.currentMap).options.padding = 10;
        clearInterval(checkMapObject);
      }
    }, 100);
  },
  mounted () {
    this.$store.dispatch('loadBoundaries');
    this.$store.dispatch('loadIslands');
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
      zoom: 0,
      minZoom: -4.6,
      maxZoom: -0.4,
      mapOptions: {
        minZoom: -4.6,
        maxZoom: -0.4,
        zoomSnap: 0.2,
        zoomDelta: 0.2,
        wheelPxPerZoomLevel: 200,
        attributionControl: true
      }
    };
  },
  props: ['mode']
};
</script>

<style lang="scss" scoped>
#map-wrap {
  .leaflet-container {
    background: none;
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