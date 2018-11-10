<template>
  <div class="map">
    <l-map
      id="wamap"
      ref="map"
      :options="mapOptions"
      :center="center"
      :bounds="bounds"
      :crs="crs"
      @click="mapClick"
      v-if="loaded"
      >
      <l-geo-json
        className="geojson"
        ref="geojson"
        :geojson="geojson.data"
        :options="geojson.options"
      ></l-geo-json>
      <l-image-overlay 
        ref="zonenames"
        url="https://data.cardinalguild.com/zonenames.svg"
        className="zonenames"
        :bounds="bounds"
       />
      <l-control
        position="topright"
        class="map-legend">
        <div id="map-legend">
          This is the map Legend
        </div>
      </l-control>
      <l-control
        :position="'bottomright'"
        class="custom-watermark">
        <img src="../assets/logo.png" width="100vw" alt="Cardinal Guild Logo">
      </l-control>
    </l-map>
      <h1 class="map-title">Worlds Adrift Map</h1>
      <div class="loading-overlay" v-if="!loaded">
        <span>Loading...</span>
      </div>
  </div>
</template>



<script>
/* eslint-disable */
import Vue from "vue";
import L from "leaflet";
import {
  LMap,
  LImageOverlay,
  LLayerGroup,
  LGeoJson,
  LControl,
  LMarker
} from "vue2-leaflet";
import axios from "axios";

import { default as zoneData } from "../assets/zoneNameData.js";

let mapData = {};

export default {
  name: "Example",
  components: {
    LMap,
    LImageOverlay,
    LLayerGroup,
    LGeoJson,
    LControl,
    LMarker
  },
  methods: {
    mapClick: e => {
      console.log("[" + e.latlng.lat + ", " + e.latlng.lng + "],");
    }
  },
  created() {
    let self = this;
    self.loaded = false;
    axios.get("https://data.cardinalguild.com/wamap.geojson").then(response => {
      self.geojson.data = response.data;
      self.loaded = true;
      self.$nextTick(() => {
        self.map = self.$refs.map.mapObject;
        self.map.getRenderer(self.map).options.padding = 10;
      });
      // axios
      //   .get("https://data.cardinalguild.com/zonenames.svg")
      //   .then(response => {
      //     self.zoneNameData = response.data;
      //     self.loaded = true;
      //   });
    });
  },
  data() {
    return {
      loaded: false,

      mapOptions: {
        minZoom: -5,
        maxZoom: -1,
        zoomSnap: 0.5,
        zoomDelta: 0.5,
        zoom: -5,
        wheelPxPerZoomLevel: 200
      },
      map: null,
      center: L.latLng(-4750, 4750),
      bounds: [[0, 0], [-9500, 9500]],
      crs: L.CRS.Simple,
      attribution:
        "App made by the <a href='https://discord.gg/BVwKDwy'>Cardinal Guild</a>",
      zonenameOptions: {
        class: "zonenames"
      },
      geojson: {
        data: null,
        options: {
          style: function(feature) {
            return feature.properties;
          }
        }
      }
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~animate-sass/animate";

.map {
  display: block;
  height: 100vh;
  width: 100vw;

  font-family: "Noto Sans", sans-serif;
  .map-title {
    margin-top: 0;
    color: #ffe5c4;
    font-size: 40px;
  }
  .loading-overlay {
    display: flex;

    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
    color: #fff;
  }
}
.leaflet-container {
  background: rgba(0, 0, 0, 0);
  position: absolute;
  top: 0;
  display: block;
  height: 100%;
  width: 100%;
  .crosshair-cursor-enabled {
    cursor: crosshair;
  }
  #map-legend {
    background-color: rgba(79, 65, 65, 0.9);
    border: none;
    border-top: 5px rgb(224, 176, 132) solid;
    border-bottom: 5px rgb(224, 176, 132) solid;
    box-shadow: 0 0 7px 4px rgba(0, 0, 0, 0.35);
    box-sizing: border-box;
    padding: 5px;
    color: #ffe5c4;
    margin-right: 10px;
  }

  .map-background {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: #fff;
    opacity: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
<style lang="scss">
.leaflet-container .leaflet-overlay-pane {
  svg {
    z-index: 1;
  }
  .zonenames {
    opacity: 0.6;
  }
}
</style>


