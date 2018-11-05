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
      :bounds="bounds" />
    <l-geo-json
      :geojson="haven.geojson"
      :options="haven.options"
    />
    <l-geo-json
      :geojson="tier1Regions.geojson"
      :options="tier1Regions.options"
    />
    <l-geo-json
      :geojson="tier2Regions.geojson"
      :options="tier2Regions.options"
    />
    <l-geo-json
      :geojson="tier3Regions.geojson"
      :options="tier3Regions.options"
    />
  </l-map>
</template> 



<script>
/* eslint-disable */
import Vue from "vue";
import L from "leaflet";
import { LMap, LImageOverlay, LGeoJson } from "vue2-leaflet";

import { default as data } from "../assets/map.js";

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
    LGeoJson
  },
  methods: {
    mapClick: e => {
      console.log("[" + e.latlng.lng + ", " + e.latlng.lat + "],");
    }
  },
  data() {
    return {
      bounds: [[0, 0], [1000, 1000]],
      zoom: -2,
      minZoom: -2,
      crs: L.CRS.Simple,
      center: [0, 0],
      url: require("../assets/map.png"),
      haven: {
        geojson: data.haven,
        options: {
          stroke: false,
          fillColor: "#6666FF",
          fillOpacity: 0.8
        }
      },
      tier1Regions: {
        geojson: data.tier1Regions,
        options: {
          stroke: false,
          fillColor: "#3C953C",
          fillOpacity: 0.8
        }
      },
      tier2Regions: {
        geojson: data.tier2Regions,
        options: {
          stroke: false,
          fillColor: "#008888",
          fillOpacity: 0.8
        }
      },
      tier3Regions: {
        geojson: data.tier3Regions,
        options: {
          stroke: false,
          fillColor: "#888888",
          fillOpacity: 0.8
        }
      }
    };
  }
};
</script>