<template>
  <v-layout row wrap>
    <v-flex xs12>
      <no-ssr>
        <MglMap :map-style.sync="mapStyle" @load="onMapLoad" @click="click">
          <MglGeojsonLayer
            :source.sync="data"
            source-id="geojson"
            layer-id="geojson"
            :layer="layer"
          />
        </MglMap>
      </no-ssr>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  name: 'Map',
  data() {
    return {
      data: {
        type: 'geojson',
        data: require('../static/data/new.json')
      },
      mapStyle: {
        version: 8,
        name: 'WAMap',
        sources: {},
        layers: []
      },
      layer: {
        type: 'fill',
        paint: {
          'fill-color': ['get', 'fillColor']
        }
      }
    }
  },
  methods: {
    onMapLoad(e) {
      this.map = e.map
      // this.map.dragPan.disable()
      console.log(this.map)
      // this.map.fitBounds([[0, 0], [-9500, 9500]])
    },
    click(e) {
      console.log(e.mapboxEvent.lngLat)
    }
  }
}
</script>
<style lang="scss">
.mgl-map-wrapper {
  height: 80vh;
}
</style>
