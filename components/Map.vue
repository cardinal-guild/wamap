<template>
  <div id="map-wrap">
      <no-ssr>
        <l-map  
        :bounds="bounds" 
        :center="center"
        :crs="crs"
        :minZoom="minZoom"
        :maxZoom="maxZoom"
        :zoomSnap="0.2"
        :zoomDelta="0.2"
        :wheelPxPerZoomLevel="200"
        :attributionControl="false"
        @zoom="onZoom"
        ref="map"
        >  
            <l-geo-json
              className="boundaries"
              ref="boundaries"
              :geojson="$store.state.boundaryData"
              :options="boundaryOptions"
            /> 
        </l-map> 
    </no-ssr>
  </div>
</template>

<script>
const isBrowser = typeof window !== 'undefined';
let leaflet;
if (isBrowser) {
  leaflet = require('leaflet');
}
export default {
  methods: {
    onZoom: e => {
      console.log(e.target._zoom);
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
      minZoom: -4.6,
      maxZoom: -0.4
    };
  },
  props: ['mode']
};
</script>

<style lang="scss" scoped>
#map-wrap {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  display: block;
  .leaflet-container {
    background: none;
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
