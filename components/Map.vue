<template>
  <v-layout row wrap>
    <v-flex xs12>
      <no-ssr>
        <MglMap :map-style.sync="mapStyle">
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
      data: require('../static/data/wamap.json'),
      mapStyle: {
        version: 8,
        name: 'WAMap',
        sources: {},
        layers: []
      },
      layer: {
        type: 'line',
        paint: {
          'line-color': '#00ffff'
        }
      }
    }
  }
}
</script>
