<template>
<div class="map">
  <h1 class="map-title">Worlds Adrift Map</h1>
  <l-map
    id="wamap"
    ref="map"
    :options="mapOptions"
    :center="center"
    :bounds="bounds"
    :crs="crs"
    :zoom="defaultZoom"
    @click="mapClick"
    >
    <div class="loading-overlay"  v-if="loading">
      <span>Loading...</span>
    </div>
    <l-image-overlay
      :url="url"
      :bounds="bounds"
      :attribution="attribution" />

    <l-geo-json
     v-if="show && loaded"
      :geojson="geojson.data"
      :options="geojson.options"
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
    <l-marker
      v-show="!hideMainLabels"
      v-for="item in zoneNames"
      :key="item.name"
      :lat-lng="item.latlng"
      :icon="item.icon"
      interactive="false" />
  </l-map>
</div>
</template>



<script>
/* eslint-disable */
import Vue from "vue";
import L from "leaflet";
import { LMap, LImageOverlay, LGeoJson, LControl, LMarker } from "vue2-leaflet";
import axios from "axios";

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
    LGeoJson,
    LControl,
    LMarker
  },
  methods: {
    mapClick: e => {
      console.log("[" + e.latlng.lat + ", " + e.latlng.lng + "],");
    },
    zoomEnd: e => {
      console.log("Zooming from " + this.prevZoom + " to " + e.target._zoom);
    },
    zoomStart: e => {
      this.prevZoom = e.target._zoom;
      if (e.target._zoom >= -2) this.hideMainLabels = true;
      console.log(this.hideMainLabels);
    },
    onLoad: e => {
      console.log(e);
    }
  },
  created() {
    this.loading = true;
    axios.get("/assets/wamap.geojson").then(response => {
      this.geojson.data = response.data;
      this.loading = false;
      this.loaded = true;
    });
  },
  data() {
    return {
      loading: false,
      loaded: false,
      show: true,
      mapOptions: {
        minZoom: -4,
        maxZoom: 2
      },
      defaultZoom: -10,
      center: L.latLng(-4750, -4750),
      bounds: [[0, 0], [-9500, 9500]],
      wallWeight: 5,
      hideMainLabels: false,
      crs: L.CRS.Simple,
      attribution:
        "App made by the <a href='https://discord.gg/BVwKDwy'>Cardinal Guild</a>",
      center: [0, 0],
      url: require("../assets/map_background.png"),
      geojson: {
        data: null,
        options: {
          style: function(feature) {
            return feature.properties;
          }
        }
      },
      zoneNames: [
        {
          name: "Avalon",
          latlng: L.latLng(-400, 2500),
          icon: L.divIcon({
            html: "<div>Avalon</div>",
            className: "zone-label"
          })
        },
        {
          name: "Lemuria",
          latlng: L.latLng(-1900, 700),
          icon: L.divIcon({
            html:
              '<div style="transform: rotate(28deg); letter-spacing: normal; font-size: 26px;">Lemuria</div>',
            className: "zone-label"
          })
        },
        {
          name: "Ophir",
          latlng: L.latLng(-2500, 7550),
          icon: L.divIcon({
            html:
              '<div style="transform: rotate(67deg); letter-spacing: normal; font-size: 35px;">Ophir</div>',
            className: "zone-label"
          })
        },
        {
          name: "Hades",
          latlng: L.latLng(-3600, 1600),
          icon: L.divIcon({
            html: '<div style="transform: rotate(10deg);">Hades</div>',
            className: "zone-label"
          })
        },
        {
          name: "Roke",
          latlng: L.latLng(-6000, 2700),
          icon: L.divIcon({
            html: '<div style="transform: rotate(15deg);">Roke</div>',
            className: "zone-label"
          })
        },
        {
          name: "Kunlun",
          latlng: L.latLng(-8100, 2500),
          icon: L.divIcon({
            html: "<div>Kunlun</div>",
            className: "zone-label"
          })
        },
        {
          name: "Haven",
          latlng: L.latLng(-2600, 9000),
          icon: L.divIcon({
            html:
              '<div style="transform: rotate(90deg);color: #291a08ad;">Haven</div>',
            className: "zone-label"
          })
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~animate-sass/animate";

@import url("https://fonts.googleapis.com/css?family=Noto+Sans|Open+Sans|Roboto");
.map {
  height: 100%;
  width: 100%;

  .map-title {
    margin: 0;
    color: #ffe5c4;
    font-size: 40px;
    font-family: "Noto Sans", sans-serif;
    z-index: 1;
  }
}
.leaflet-container {
  z-index: -1;
  position: absolute;
  top: 0;
  display: block;
  height: 100%;
  width: 100%;
  .leaflet-image-layer {
    opacity: 1;
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
    background: #fff;
    opacity: 1;
  }
}
</style>

<style lang="scss">
.zone-label {
  text-transform: uppercase;
  font-size: 3.5rem;
  font-family: "Open Sans", sans-serif;
  font-weight: bold;
  letter-spacing: 10px;
  color: #291a087d;
}
</style>

