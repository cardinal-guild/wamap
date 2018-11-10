<template>
  <div class="map">
    <l-map
      id="wamap"
      ref="map"
      :options="mapOptions"
      :center="center"
      :bounds="bounds"
      :crs="crs"
      @zoom="onZoom($event, $data)"
      @click="mapClick"
      v-if="loaded">
      <l-geo-json
        className="geojson"
        ref="geojson"
        :geojson="geojson.data"
        :options="geojson.options"
      />
      <l-marker
        v-if="paneCreated"
        v-for="marker in sectorMarkers"
        :key="marker.name"
        :lat-lng="marker.latLng"
        :icon="marker.icon"
        pane="sectorNames"
        interactive="false"
      />
      <l-image-overlay
        ref="zonenames"
        url="https://data.cardinalguild.com/zonenames.svg"
        className="zonenames"
        :attribution="attribution"
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
    <!--<h1 class="map-title">Worlds Adrift Map</h1>-->
    <div class="loading-overlay" v-if="!loaded">
      <span>Loading...</span>
    </div>

    <!--the following are just to be copied-->
    <div class="header" id="map-header" style="display: none;">
      <a href="https://cardinalguild.com" style="height: 30px;">
        <img class="header-image" height="60px" id="cg-title" src="../assets/cg_title.png" alt="Cardinal Guild Title">
      </a>
      <span>Worlds Adrift Map</span>
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
      var latLngEvent = new CustomEvent("latLng", {
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
      document.dispatchEvent(latLngEvent);
    },
    onZoom: (e, d) => {
      if (
        e.target.options.minZoom &&
        e.target.options.maxZoom &&
        d &&
        d.zonenameMaxOpacity
      ) {
        let minZoom = e.target.options.minZoom;
        let maxZoom = e.target.options.maxZoom;
        let opacityPercentage =
          ((e.target._zoom - maxZoom) * 100) / (minZoom - maxZoom);
        let zoneOpacity = (opacityPercentage / 100) * d.zonenameMaxOpacity;
        document.getElementsByClassName(
          "zonenames"
        )[0].style.opacity = zoneOpacity;
      }

      if (e.target._zoom < -3.5)
        e.target.getPane("sectorNames").style.display = "none";
      else e.target.getPane("sectorNames").style.display = "block";

      let topControls = document.getElementsByClassName("leaflet-top");
      for (var i = 0; i < topControls.length; i++) {
        if (e.target._zoom < -2) {
          topControls[i].style.top = "50px";
          document.getElementById("map-header").style.top = "0"; //show
        } else {
          topControls[i].style.top = "0";
          document.getElementById("map-header").style.top = "-80px"; //hide
        }
      }
      // console.log(e.target._zoom)
      // if (e.target._zoom < -3.5) {
      //   document.getElementById("map-header").style.display = "block";
      //   console.log("show")
      // }
      // else {
      //   document.getElementById("map-header").style.display = "none";
      //   console.log("hide")
      // }
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
        document.getElementsByClassName("zonenames")[0].style.opacity =
          self.zonenameMaxOpacity;
        self.map.getRenderer(self.map).options.padding = 10;
        self.map.createPane("sectorNames");
        self.paneCreated = true;

        //creates top bar
        let topBar = document.getElementById("map-header");
        let topBarClone = topBar.cloneNode(true);
        //removes original elements
        topBar.parentNode.removeChild(topBar);
        topBarClone.style.display = "block";
        document
          .getElementsByClassName("leaflet-control-container")[0]
          .appendChild(topBarClone);
      });

      for (var i = 0; i < self.geojson.data.features.length; i++) {
        let currentFeature = self.geojson.data.features[i];
        if (/\D\d/.exec(currentFeature.properties.name) != null) {
          //weed out non-zones
          let lat = 0;
          let lng = 0;
          var j;
          for (j = 0; j < currentFeature.geometry.coordinates[0].length; j++) {
            lng += currentFeature.geometry.coordinates[0][j][0];
            lat += currentFeature.geometry.coordinates[0][j][1];
          }
          lat /= j;
          lng /= j;
          let marker = L.divIcon({
            html:
              '<div class="sector-label">' +
              currentFeature.properties.name +
              "</div>",
            className: "sector-label-div"
          });
          self.sectorMarkers.push({
            name: currentFeature.properties.name,
            latLng: L.latLng(lat, lng),
            icon: marker
          });
        }
      }
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
      paneCreated: false,
      mapOptions: {
        minZoom: -4.5,
        maxZoom: -1,
        zoomSnap: 0.2,
        zoomDelta: 0.2,
        wheelPxPerZoomLevel: 200
      },
      map: null,
      center: L.latLng(-4750, 4750),
      bounds: [[0, 0], [-9500, 9500]],
      crs: L.CRS.Simple,
      attribution:
        "App made by the <a href='https://discord.gg/BVwKDwy'>Cardinal Guild</a>",
      zonenameMaxOpacity: 0.5,
      geojson: {
        data: null,
        options: {
          style: function(feature) {
            return feature.properties;
          }
        }
      },
      sectorMarkers: []
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
    color: #291a08;
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
}

.zonenames {
  transition: opacity 0.5s;
}

.sector-label {
  font-size: 35px;
  font-family: "Roboto", sans-serif;
  color: #291a08;
}

.header {
  font-family: "Noto Sans", sans-serif;
  margin-top: 0;
  border: none;
  border-top: 5px rgb(244, 176, 132) solid;
  border-bottom: 5px rgb(244, 176, 132) solid;
  background: #4f4141;
  position: absolute;
  top: 0;
  z-index: 1000;
  width: 100%;
  transition: top 0.8s;
  height: 45px;
}

.leaflet-control-container .leaflet-top {
  top: 50px;
  transition: top 0.5s;
}

.leaflet-control-container .header span {
  color: #ffe5c4;
  font-size: 30px;
  text-align: center;
  margin: auto;
}

.header .header-image {
  position: absolute;
  top: -5px;
  left: 50px;
}
</style>


