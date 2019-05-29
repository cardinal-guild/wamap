<template>
  <v-layout row wrap justify-center>
    <v-flex v-if="loading === 100" shrink>
      <no-ssr>
        <MglMap
          id="wa-map"
          v-bind="mapOptions"
          :map-style.sync="mapStyle"
          @load="onMapLoad"
          @click="click"
        >
          <MglNavigationControl :show-compass="false" position="top-left" />
          <MglFullscreenControl position="bottom-right" />
          <MglGeojsonLayer
            source-id="geojson"
            layer-id="geojson"
            :source="{ type: 'geojson', data: mapGeoJson }"
            :layer="layer"
          />
          <MglMarker
            v-for="island in islandData"
            :key="island.id"
            :coordinates="convert(island.geometry.coordinates)"
          >
            <v-icon slot="marker">mdi-map-marker</v-icon>
          </MglMarker>
        </MglMap>
      </no-ssr>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'Map',
  data() {
    return {
      mapOptions: {
        maxBounds: [[0, -2], [2, 0]],
        center: [1, -1],
        dragRotate: false,
        pitchWithRotate: false // FOR NOW
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
  computed: {
    ...mapState(['loading', 'mapGeoJson', 'islandData'])
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
    },
    convert(coords) {
      const newCoords = []
      newCoords.push(coords[1] * 0.00021)
      newCoords.push(coords[0] * 0.00021)
      console.log(newCoords)
      return newCoords
    }
  }
}
</script>
<style lang="scss">
#wa-map {
  height: 80vh;
  width: 80vh;
}
</style>
