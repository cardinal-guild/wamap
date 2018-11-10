<template>
  <div class="map">
    <l-map
      id="wamap"
      ref="map"
      :options="mapOptions"
      @move="onLoad"
      :center="center"
      :bounds="bounds"
      :crs="crs"
      @click="mapClick"
      @zoomstart="zoomStart"
      @zoomend="zoomEnd"
      @ready="onLoad"
      @zoomanim="zoomAnim"
      >
      <h1 class="map-title">Worlds Adrift Map</h1>
      <div class="loading-overlay"  v-if="loading">
        <span>Loading...</span>
      </div>
      <l-image-overlay
        :url="bUrl"
        :bounds="bounds"
        :attribution="attribution" />
      <l-geo-json
       v-if="show && loaded"
        :geojson="geojson.data"
        :options="geojson.options"
      />
      <l-marker
        v-if="loaded"
        v-for="item in zoneNames"
        pane="zoneNamePane"
        :key="item.name"
        :lat-lng="item.latLng"
        :icon="item.icon"
        interactive="false" />
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
        <img src="../assets/logo.png" width="300vw" alt="Cardinal Guild Logo">
      </l-control>
    </l-map>
  </div>
</template>



<script>
/* eslint-disable */
import Vue from "vue";
import L from "leaflet";
import { LMap, LImageOverlay, LGeoJson, LControl, LMarker } from "vue2-leaflet";
import axios from "axios";

import {default as zoneData} from "../assets/zoneNameData.js"

//import { default as data } from "../assets/map.js";

// var baseballIcon = L.icon({
//   iconUrl: "static/images/baseball-marker.png",
//   iconSize: [32, 37],
//   iconAnchor: [16, 37],
//   popupAnchor: [0, -28]
// });

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
let mapData = {};

//make icons
for (var i = 0; i < zoneData.length; i++) {
  let html = "<div data-fontSize='" + zoneData[i].fontSize + "' class='zone-label' style='transform: rotate(" + zoneData[i].rotate + "deg); font-size: " + zoneData[i].fontSize + "rem; letter-spacing: " + zoneData[i].spacing + "; transition: font-size 0.32s cubic-bezier(.58,.99,.65,1);'>" + zoneData[i].name + "</div>";
  zoneData[i].icon = L.divIcon({html: html, className: "zone-label-div"});
}

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
      console.log("Zooming from " + mapData.prevZoom + " to " + e.target._zoom);
    },
    zoomStart: e => {
      mapData.prevZoom = e.target._zoom;
    },
    onLoad: e => {
      if (!mapData.mapObj) {
        mapData.mapObj = e.target;
      }
    },
    zoomAnim: e => {
      // let labels = document.getElementsByClassName("zone-label");
      // if (e.zoom > mapData.prevZoom) {
      //   for (var i = 0; i < labels.length; i++) {
      //     let oldSize = parseFloat(/\d+(\.\d+|)/.exec(labels[i].style.fontSize)[0])
      //     labels[i].style.fontSize = oldSize * 2 + "rem";
      //   }
      // }
      // else if (e.zoom < mapData.prevZoom) {
      //   for (var i = 0; i < labels.length; i++) {
      //     let oldSize = parseFloat(/\d+(\.\d+|)/.exec(labels[i].style.fontSize)[0])
      //     labels[i].style.fontSize = oldSize / 2 + "rem";
      //   }
      // }
      let labels = document.getElementsByClassName("zone-label");
      for (var i = 0; i < labels.length; i++) {
        labels[i].style.fontSize = (15 + ((8 + 5/6) * e.zoom) + (2 * e.zoom**2) + (1/6 * e.zoom**3)) * labels[i].getAttribute("data-fontSize") + "rem";
      }
    },
  },
  created() {
    this.loading = true;
    axios.get("https://data.cardinalguild.com/wamap.geojson").then(response => {
      this.geojson.data = response.data;
      this.loading = false;
      this.loaded = true;
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.map = this.$refs.map.mapObject;
      this.map.getRenderer(this.map).options.padding = 100;
      this.map.createPane("zoneNamePane");
      this.map.setZoom(-4);
    })
  },
  data() {
    return {
      loading: false,
      loaded: false,
      show: true,
      mapOptions: {
        minZoom: -4,
        maxZoom: 0,
        zoomSnap: 0.5,
        zoomDelta: 0.5,
        zoom: -4,
        wheelPxPerZoomLevel: 200,
      },
      map: null,
      center: L.latLng(-4750, -4750),
      bounds: [[0, 0], [-9500, 9500]],
      crs: L.CRS.Simple,
      attribution:
        "App made by the <a href='https://discord.gg/BVwKDwy'>Cardinal Guild</a>",
      bUrl: require("../assets/map_background.png"),
      geojson: {
        data: null,
        options: {
          style: function(feature) {
            return feature.properties;
          }
        }
      },
      zoneNames: Object.assign({}, zoneData),
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~animate-sass/animate";

.map {
  height: 100%;
  width: 100%;

  .map-title {
    margin-top: 0;
    color: #ffe5c4;
    font-size: 40px;
    font-family: "Noto Sans", sans-serif;
  }
}
.leaflet-container {
  z-index: -1;
  position: absolute;
  top: 0;
  display: block;
  height: 100%;
  width: 100%;
  background-image: linear-gradient(to right, #4f4141, #5c4949, #4f4141);
  .leaflet-image-layer {
    opacity: 1;
    background-color: #4f4141;
  }
  .leaflet-fake-icon-image-2x {
    background-image: url(../../node_modules/leaflet/dist/images/marker-icon-2x.png);
  }
  .leaflet-fake-icon-shadow {
    background-image: url(../../node_modules/leaflet/dist/images/marker-shadow.png);
  }
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
    background: #fff;
    opacity: 1;
  }
}
</style>

<style lang="scss">
.zone-label {
  text-transform: uppercase;
  font-family: "Abril Fatface", cursive;
  font-weight: bold;
  letter-spacing: 10px;
  color: #291a087d;
}
</style>

