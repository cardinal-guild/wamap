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
      @click="mapClick($event, $data)"
      v-if="loaded">
      <l-geo-json
        className="geojson"
        ref="geojson"
        :geojson="geojson.data"
        :options="geojson.options"
      />
      <l-marker
        v-if="adminMode"
        :lat-lng="adminMarker"
        :draggable="false"
      />
      <!--Sector Markers-->
      <l-marker
        v-if="paneCreated"
        v-for="marker in sectorMarkers"
        :key="marker.name"
        :lat-lng="marker.latLng"
        :icon="marker.icon"
        pane="sectorNames"
        interactive="false"
      />
      <!--Island Markers-->
      <l-marker
        v-if="paneCreated && !adminMode"
        v-for="island in islandData"
        :key="island.properties.name"
        :lat-lng="island.latLng"
        :icon="island.icon"
        pane="islandMarkers"
        interactive="false"
      />
      <!--Island Image Borders-->
      <l-marker
        v-if="paneCreated"
        v-for="island in islandData"
        :key="island.properties.name + '_border'"
        :lat-lng="island.latLng"
        :icon="island.imageBorder"
        pane="islandImageBorders"
        interactive="false"
        :zIndexOffset="-100">
        <l-popup>
          <IslandPopup
            :name="island.properties.name"
            :altitude="island.properties.altitude"
            :image_link="island.properties.imageMedium"
            :databanks="island.properties.databanks"
            :culture="island.properties.type.charAt(0).toUpperCase() + island.properties.type.slice(1)"
          />
        </l-popup>
      </l-marker>
      <!--Island Image Markers-->
      <l-marker
        v-if="paneCreated"
        v-for="island in islandData"
        :key="island.properties.name + '_image'"
        :lat-lng="island.latLng"
        :icon="island.imageIcon"
        pane="islandImageMarkers"
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
        v-if="!adminMode"
        position="topright"
        class="map-legend">
        <div id="map-legend">
          This is the map Legend
        </div>
      </l-control>
      <l-control
        v-if="!adminMode"
        :position="'bottomright'"
        class="custom-watermark">
        <a href="https://cardinalguild.com">
          <img src="../assets/logo.png" width="100vw" alt="Cardinal Guild Logo">
        </a>
      </l-control>
    </l-map>
    <!--<h1 class="map-title">Worlds Adrift Map</h1>-->
    <div class="loading-overlay" v-if="!loaded">
      <span>Loading...</span>
    </div>

    <!--the following are just to be copied-->
    <div class="header" id="map-header" style="display: none;" v-if="!hideHeader || !adminMode">
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
  LMarker,
  LPopup
} from "vue2-leaflet";
import axios from "axios";

import IslandPopup from "./IslandPopup.vue";

import { default as zoneData } from "../assets/zoneNameData.js";

export default {
  name: "Example",
  components: {
    LMap,
    LImageOverlay,
    LLayerGroup,
    LGeoJson,
    LControl,
    LMarker,
    LPopup,
    IslandPopup
  },
  methods: {
    mapClick: (e, d) => {
      // console.log("[" + e.latlng.lat + ", " + e.latlng.lng + "],");
      let lat = e.latlng.lat;
      let lng = e.latlng.lng;
      if (d.adminMode) {
        if (lat > 0) {
          lat = 0;
        }
        if (lat < -9500) {
          lat = -9500;
        }
        if (lng < 0) {
          lng = 0;
        }
        if (lng > 9500) {
          lng = 9500;
        }
        d.adminMarker.lat = lat;
        d.adminMarker.lng = lng;
        window.parent.postMessage(
          {
            lat: lat,
            lng: lng
          },
          "*"
        );
      }
    },
    onZoom: (e, d) => {
      //hiding map legend
      let legend = $(".leaflet-top.leaflet-right");
      if (e.target._zoom > -2) {
        legend.addClass("faded");
      } else {
        legend.removeClass("faded");
      }

      //tier names' opacities
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

      // shows/hides sector names
      if (e.target._zoom < -3.5) {
        e.target.getPane("sectorNames").style.display = "none";
      } else {
        e.target.getPane("sectorNames").style.display = "block";
      }

      // shows/hides island markers
      if (e.target._zoom > -2.8 && e.target._zoom < -1.3) {
        e.target.getPane("islandMarkers").style.display = "block";
      } else {
        e.target.getPane("islandMarkers").style.display = "none";
      }

      // shows/hides island images
      if (e.target._zoom > -1.3) {
        e.target.getPane("islandImageMarkers").style.display = "block";
        e.target.getPane("islandImageBorders").style.display = "block";
      } else {
        e.target.getPane("islandImageMarkers").style.display = "none";
        e.target.getPane("islandImageBorders").style.display = "none";
      }

      // shows/hides top bar
      let topControls = document.getElementsByClassName("leaflet-top");
      if (!d.hideHeader) {
        for (var i = 0; i < topControls.length; i++) {
          if (e.target._zoom < -2) {
            topControls[i].classList.remove("noheader");
            document.getElementById("map-header").classList.remove("noheader"); //show
          } else {
            topControls[i].classList.add("noheader");
            document.getElementById("map-header").classList.add("noheader"); //hide
          }
        }
      } else {
        for (var i = 0; i < topControls.length; i++) {
          topControls[i].style.transition = "none";
          topControls[i].classList.add("noheader");
        }
      }
    }
  },
  created() {
    //resolve url
    let self = this;
    if (self.$attrs.hideheader == "true") {
      self.hideHeader = true;
    }
    if (self.$attrs.admin == "true") {
      self.adminMode = true;
      self.mapOptions.attributionControl = false;
      if (self.$attrs.lat) {
        self.adminMarker.lat = self.$attrs.lat;
      }
      if (self.$attrs.lng) {
        self.adminMarker.lng = self.$attrs.lng;
      }
    }
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
        self.map.createPane("islandMarkers");
        self.map.createPane("islandImageMarkers");
        self.map.createPane("islandImageBorders");
        self.paneCreated = true;

        //attempts to set view to lat & lng from url
        // if (self.adminMarker.lat && self.adminMarker.lng) {
        //   console.log("test")
        //   self.center = L.latLng(self.adminMarker.lat, self.adminMarker.lng);
        //   //self.map.zoomIn(2);
        // }

        //add mobile class if screen width size < 850
        if (screen.width <= 850) {
          let controls = document.getElementsByClassName(
            "leaflet-control-container"
          )[0].children;
          for (var i = 0; i < controls.length; i++) {
            controls[i].classList.add("mobile");
          }
        }

        if (!self.hideHeader) {
          //creates top bar
          let topBar = document.getElementById("map-header");
          let topBarClone = topBar.cloneNode(true);
          //removes original elements
          topBar.parentNode.removeChild(topBar);
          topBarClone.style.display = "";
          document
            .getElementsByClassName("leaflet-control-container")[0]
            .appendChild(topBarClone);
        }
      });

      let islandUrl = "https://surveyor.cardinalguild.com/api/islands.json";
      if (self.adminMode) {
        islandUrl =
          islandUrl +
          "?anticache=" +
          Math.random()
            .toString(11)
            .replace("0.", "");
      }
      axios.get(islandUrl).then(response => {
        let islandDataJson = response.data.features;
        let islands = [];
        for (var i = 0; i < islandDataJson.length; i++) {
          let island = {};
          island.properties = islandDataJson[i].properties;
          island.latLng = L.latLng(
            islandDataJson[i].geometry.coordinates[0],
            islandDataJson[i].geometry.coordinates[1]
          );
          let type = ""
          if (island.properties.respawners && island.properties.turrets) type = "both";
          else if (island.properties.respawners) type = "respawn";
          else if (island.properties.turrets) type = "turrets";
          else type = "plain";
          island.imageBorder = L.icon({
            iconUrl: self.islandTypes[island.properties.type][type],
            iconSize: [80, 80],
            className: "island-image-border"
          });
          island.imageIcon = L.icon({
            iconUrl: island.properties.imageIcon,
            iconSize: [80, 80],
            className: "island-image-icon"
          });
          let height = "";
          if (island.properties.altitude > 2200) height = "high";
          else if (island.properties.altitude > 1800) height = "medium";
          else height = "low";
          island.icon = L.icon({
            iconUrl: self.islandTypes[island.properties.type][height],
            iconSize: [50, 50],
            className: "island-icon"
          })
          islands.push(island);
        }
        self.islandData = islands;
      });

      //calculates middle pos for sector names (possibly too much calculations)
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
      hideHeader: false,
      adminMode: false,
      adminMarker: {
        lat: 0,
        lng: 0
      },
      mapOptions: {
        minZoom: -4.6,
        maxZoom: -0.4,
        zoomSnap: 0.2,
        zoomDelta: 0.2,
        wheelPxPerZoomLevel: 200,
        attributionControl: true
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
      islandData: null,
      sectorMarkers: [],
      islandTypes: {
        kioki: {
          plain: "../assets/island_icons/Web_Island_Frame_Kioki.svg",
          respawn: "../assets/island_icons/Web_Island_Frame_Kioki_R.svg",
          turrets: "../assets/island_icons/Web_Island_Frame_Kioki_T.svg",
          both: "../assets/island_icons/Web_Island_Frame_Kioki_RT.svg",
          high: "../assets/island_icons/Island_K_H.png",
          medium: "../assets/island_icons/Island_K_M.png",
          low: "../assets/island_icons/Island_K_L.png"
        },
        saborian: {
          plain: "../assets/island_icons/Web_Island_Frame_Saborian.svg",
          respawn: "../assets/island_icons/Web_Island_Frame_Saborian_R.svg",
          turrets: "../assets/island_icons/Web_Island_Frame_Saborian_T.svg",
          both: "../assets/island_icons/Web_Island_Frame_Saborian_RT.svg",
          high: "../assets/island_icons/Island_S_H.png",
          medium: "../assets/island_icons/Island_S_M.png",
          low: "../assets/island_icons/Island_S_L.png"
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
.zonenames {
  transition: opacity 1s;
}

.leaflet-container {
  .leaflet-overlay-pane {
    svg {
      z-index: 1;
    }
  }
  .sector-label {
    font-size: 35px;
    font-family: "Roboto", sans-serif;
    color: #291a08;
  }

  .leaflet-islandImageMarkers-pane {
    img.island-image-icon {
      border-radius: 50%;
      filter: drop-shadow(4px 4px 4px #00264d);
    }
  }
}

.leaflet-control-container {
  .leaflet-top {
    top: 50px;
    transition: top 0.5s;
  }
  .leaflet-top.mobile,
  .leaflet-top.noheader {
    top: 0;
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

    span {
      color: #ffe5c4;
      font-size: 30px;
      text-align: center;
      margin: auto;
    }
    .header-image {
      position: absolute;
      top: -5px;
      left: 50px;
    }
  }
  .header.noheader {
    top: -80px;
  }

  .leaflet-top.leaflet-right {
    #map-legend {
      opacity: 1;
      transition: opacity 0.3s;
    }
  }
  .leaflet-top.leaflet-right.faded {
    #map-legend {
      opacity: 0.2;
    }
    #map-legend:hover {
      opacity: 1;
    }
  }
}

@media screen and (max-width: 850px) {
  div#map-header {
    display: none;
  }
}

/* legend */
</style>

