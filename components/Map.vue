<template>
  <v-layout row wrap>
    <v-flex xs12>
      <no-ssr>
        <MglMap :map-style.sync="mapStyle">
          <MglNavigationControl position="top-left" />
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
      mapStyle: {
        version: 8,
        name: 'WAMap',
        sources: {
          geojson: {
            type: 'geojson',
            data: '/data/wamap.json'
          }
        },
        layers: [
          {
            id: 'geojson',
            type: 'line',
            source: 'geojson'
          }
        ]
      }
    }
  }
}
</script>
