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
      window.parent.dispatchEvent(latLngEvent);
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
}

.sector-label {
  font-size: 35px;
  font-family: "Roboto", sans-serif;
  color: #291a08;
}
</style>


