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
          @zoomend="zoom"
        >
          <MglNavigationControl :show-compass="false" position="top-left" />
          <MglGeojsonLayer
            source-id="geojson"
            layer-id="geojson"
            :source="{ type: 'geojson', data: mapGeoJson }"
            :layer="layer"
          />
          <MglGeojsonLayer
            source-id="islands"
            layer-id="islands"
            :source="{ type: 'geojson', data: $store.state.islandData }"
            :layer="markerLayer"
          />
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
        maxBounds: [[-0.5, -2.5], [2.5, 0.5]],
        maxZoom: 11.5,
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
      },
      markerLayer: {
        type: 'symbol',
        layout: {
          'icon-image': [
            'concat',
            ['get', 'type'],
            ['get', 'tier'],
            [
              'case',
              ['>', ['get', 'altitude'], 2200],
              'high',
              ['>', ['get', 'altitude'], 1800],
              'medium',
              'low'
            ]
          ],
          'icon-allow-overlap': true,
          'icon-size': 0.4
        }
      }
    }
  },
  computed: {
    ...mapState(['loading', 'mapGeoJson'])
  },
  methods: {
    onMapLoad(e) {
      this.map = e.map
      // this.map.dragPan.disable()
      console.log(this.map)
      // this.map.fitBounds([[0, 0], [-9500, 9500]])
      const cultures = ['kioki', 'saborian']
      const tiers = [1, 2, 3, 4]
      const altitudes = ['low', 'medium', 'high']
      for (const c of cultures) {
        for (const t of tiers) {
          for (const a of altitudes) {
            const img = new Image(50, 50)
            img.onload = () => this.map.addImage(`${c}${t}${a}`, img)
            const uri = `data:image/svg+xml,${encodeURIComponent(
              this.createSVG(c, t, a)
            )}`
            img.src = uri
          }
        }
      }
      console.log(this.map.getZoom())
    },
    click(e) {
      // this.map.setLayoutProperty('islands', 'visibility', 'none')
      console.log(e.mapboxEvent.lngLat)
    },
    zoom(e) {
      console.log(e.map.getZoom())
      if (e.map.getZoom() > 10.25)
        e.map.setLayoutProperty('islands', 'visibility', 'none')
      else {
        e.map.setLayoutProperty('islands', 'visibility', 'visible')
        e.map.setLayoutProperty(
          'islands',
          'icon-size',
          0.2857 * e.map.getZoom() - 1.9284
        )
      }
    },
    convert(coords) {
      const newCoords = []
      newCoords.push(coords[1] * 0.00021)
      newCoords.push(coords[0] * 0.00021)
      return newCoords
    },
    createSVG(culture, tier, altitude) {
      let svg = ''
      let style = 'stroke-width: 4px; '
      switch (tier) {
        case 1:
          switch (altitude) {
            case 'low':
              style += 'stroke: rgb(52, 70, 45); fill: rgb(88, 117, 75);'
              break
            case 'medium':
              style += 'stroke: rgb(88, 117, 75); fill: rgb(147, 196, 125);'
              break
            case 'high':
              style += 'stroke: rgb(126, 138, 121); fill: rgb(211, 231, 203);'
              break
          }
          break
        case 2:
          switch (altitude) {
            case 'low':
              style += 'stroke: rgb(39, 56, 84); fill: rgb(65, 94, 141);'
              break
            case 'medium':
              style += 'stroke: rgb(65, 94, 141); fill: rgb(109, 158, 235);'
              break
            case 'high':
              style += 'stroke: rgb(117, 129, 148); fill: rgb(196, 216, 247);'
              break
          }
          break
        case 3:
          switch (altitude) {
            case 'low':
              style += 'stroke: rgb(51, 44, 70); fill: rgb(85, 74, 117);'
              break
            case 'medium':
              style += 'stroke: rgb(85, 74, 117); fill: rgb(142, 124, 195);'
              break
            case 'high':
              style += 'stroke: rgb(125, 121, 138); fill: rgb(209, 202, 231);'
              break
          }
          break
        case 4:
          switch (altitude) {
            case 'low':
              style += 'stroke: rgb(88, 63, 38); fill: rgb(147, 106, 64);'
              break
            case 'medium':
              style += 'stroke: rgb(147, 106, 64); fill: rgb(246, 178, 107);'
              break
            case 'high':
              style += 'stroke: rgb(150, 134, 117); fill: rgb(251, 224, 195);'
              break
          }
          break
      }
      switch (culture) {
        case 'kioki':
          svg += `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><circle style='${style}' cx='15' cy='15' r='10' />`
          break
        case 'saborian':
          svg += `<svg style="transform: rotateZ(45deg);" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 40 40"><rect style='${style}' width='20' height='20' x='4' y='10'/>`
          break
      }
      svg += '</svg>'
      return svg
    }
  }
}
</script>
<style lang="scss">
#wa-map {
  position: fixed;
  top: 1vh;
  left: 0;
  height: 99vh;
  width: 100vw;
}

.mapboxgl-ctrl-top-left {
  margin-top: 6vh;
}
</style>
