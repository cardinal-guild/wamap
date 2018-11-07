<template>
  <l-map

    ref="map"
    :zoom="zoom"
    :crs="crs"
    :min-zoom="minZoom"
    :center="center"
    :bounds="bounds"
    v-on:click="mapClick"
    >
    <l-image-overlay
      :url="url"
      :bounds="bounds"
      :attribution="attribution" />
       <l-geo-json
      :geojson="geomap.geojson"
      :options="geomap.options"
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
      <img src="../assets/logo.png" width="180px" alt="Cardinal Guild Logo">
    </l-control>
  </l-map>
</template>



<script>
/* eslint-disable */
import Vue from "vue";
import L from "leaflet";
import { LMap, LImageOverlay, LGeoJson, LControl } from "vue2-leaflet";

import { default as geodata } from "../assets/geomap.js";

var baseballIcon = L.icon({
  iconUrl: "static/images/baseball-marker.png",
  iconSize: [32, 37],
  iconAnchor: [16, 37],
  popupAnchor: [0, -28]
});

// function onEachFeature(feature, layer) {
//   let PopupCont = Vue.extend(PopupContent);
//   let popup = new PopupCont({
//     propsData: {
//       type: feature.geometry.type,
//       text: feature.properties.popupContent
//     }
//   });
//   layer.bindPopup(popup.$mount().$el);
// }

export default {
  name: "Example",
  components: {
    LMap,
    LImageOverlay,
    LGeoJson,
    LControl
  },
  methods: {
    mapClick: e => {
      console.log("[" + e.latlng.lng + ", " + e.latlng.lat + "],");
    }
  },
  data() {
    return {
      bounds: [[0, 0], [-9500, 9500]],
      zoom: -2,
      minZoom: -5,
      wallWeight: 5,
      crs: L.CRS.Simple,
      attribution:
        "App made by the <a href='https://discord.gg/BVwKDwy'>Cardinal Guild</a>",
      center: [0, 0],
      url: require("../assets/map.png"),

      geomap: {
        geojson: geodata,
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

<style>
.leaflet-image-layer {
  opacity: 0.3;
}
#map-legend {
  background-color: rgba(79, 65, 65, 0.9);
  border: none;
  border-top: 5px rgb(224, 176, 132) solid;
  border-bottom: 5px rgb(224, 176, 132) solid;
  box-shadow: 6px 9px 14px -7px rgba(0, 0, 0, 0.75);
  box-sizing: border-box;
  padding: 5px;
  color: #ffe5c4;
}
</style>
