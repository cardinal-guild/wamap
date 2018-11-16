<template>
  <div class="map" :class="{ smallicons: useSmallIcons, header: showHeader }">
    <l-map
      id="wamap"
      ref="map"
      :options="mapOptions"
      :center="center"
      :bounds="bounds"
      :crs="crs"
      :zoom="-100"
      @zoomend="onZoomEnd($event, $data)"
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
        v-if="paneCreated && showSectorNames"
        v-for="marker in sectorMarkers"
        :key="marker.name"
        :lat-lng="marker.latLng"
        :icon="marker.icon"
        pane="sectorNames"
      />



      <!--Turret Markers-->
      <l-marker
        v-if="paneCreated && showIslandMarkers && turrets.data.length"
        v-for="turret in turrets.data"
        :key="turret.id"
        :lat-lng="turret.latLng"
        :icon="turrets.icon"
        pane="turretMarkers"
      />


      <!--Respawner Markers-->
      <l-marker
        v-if="paneCreated && showIslandMarkers && respawners.data.length"
        v-for="respawner in respawners.data"
        :key="respawner.id"
        :lat-lng="respawner.latLng"
        :icon="respawners.icon"
        pane="respawnerMarkers"
      />

      <!--Island Markers-->
      <l-marker
        v-if="paneCreated && showIslandMarkers && islandData.length"
        v-for="island in islandData"
        :key="island.properties.slug+'_'+island.id"
        :lat-lng="island.latLng"
        :icon="island.icon"
        pane="islandMarkers">
        <l-popup v-if="!adminMode">
          <IslandPopup  v-bind="island.properties" />
        </l-popup>
      </l-marker>
      <!--Island Image Borders-->
      <l-marker
        v-if="paneCreated && showIslandImageMarkers"
        v-for="island in islandData"
        :key="island.properties.slug + '_border'"
        :lat-lng="island.latLng"
        :icon="island.imageBorder"
        pane="islandImageBorders"
        :zIndexOffset="-100">
        <l-popup v-if="!adminMode">
          <IslandPopup v-bind="island.properties" />
        </l-popup>
      </l-marker>
      <!--Island Image Markers-->
      <l-marker
        v-if="paneCreated && showIslandImageMarkers"
        v-for="island in islandData"
        :key="island.properties.slug + '_' + island.id + '_image'"
        :lat-lng="island.latLng"
        :icon="island.imageIcon"
        pane="islandImageMarkers"
      />
      <l-image-overlay
        ref="zonenames"
        url="https://data.cardinalguild.com/zonenames.svg"
        className="zonenames"
        :interactive="false"
        :attribution="attribution"
        :bounds="bounds"
      />
      <l-control
        v-if="!adminMode"
        position="topright">
        <input type="checkbox" id="toggle-legend">
        <label for="toggle-legend">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z"/></svg>
        </label>
        <MapLegend :hideLegend="hideLegend" />
      </l-control>
      <l-control
        v-if="!adminMode"
        :position="'bottomright'"
        class="custom-watermark">
        <a href="https://cardinalguild.com">
          <img src="/assets/logo.png" width="100vw" alt="Cardinal Guild Logo">
        </a>
      </l-control>
    </l-map>
    <!--<h1 class="map-title">Worlds Adrift Map</h1>-->
    <div class="loading-overlay" v-if="!loaded">
      <span>Loading...</span>
    </div>

    <transition name="header-fade">
      <div class="header-bar" v-show="showHeader">
        <a href="https://cardinalguild.com" style="height: 30px;">
          <img class="header-image" height="60px" id="cg-title" src="/assets/cg_title.png" alt="Cardinal Guild Title">
        </a>
        <span>Worlds Adrift Map</span>
      </div>
    </transition>
  </div>
</template>
<script>
/* eslint-disable */
import Vue from "vue";
import L from "leaflet";
import _ from "lodash";
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
import MapLegend from "./MapLegend.vue";

export default {
  name: "Map",
  components: {
    LMap,
    LImageOverlay,
    LLayerGroup,
    LGeoJson,
    LControl,
    LMarker,
    LPopup,
    IslandPopup,
    MapLegend
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
    onZoomEnd: _.debounce((e, d) => {
      //hiding map legend
      if (e.target._zoom > -2) {
        d.hideLegend = true;
      } else {
        d.hideLegend = false;
      }

      //tier names' opacities
      if (
        e.target.options.minZoom &&
        e.target.options.maxZoom &&
        d &&
        d.zonenameMaxOpacity
      ) {
        if (e.target._zoom > d.zonenameMinZoom) {
          $(".zonenames").addClass("hidden");
        } else {
          let opacity =
            ((e.target._zoom - d.zonenameMinZoom) /
              (e.target.options.minZoom - d.zonenameMinZoom)) *
            d.zonenameMaxOpacity;
          $(".zonenames").css("opacity", opacity);
          $(".zonenames").removeClass("hidden");
        }
      }
    }, 600),
    onZoom: _.debounce((e, d) => {
      // shows/hides sector names
      if (e.target._zoom > -3.7) {
        d.showSectorNames = true;
      } else {
        d.showSectorNames = false;
      }
      if (e.target._zoom < -3) {
        d.useSmallIcons = true;
      } else {
        d.useSmallIcons = false;
      }

      // shows/hides island markers
      if (e.target._zoom > -3.5 && e.target._zoom < -1.3) {
        d.showIslandMarkers = true;
      } else {
        d.showIslandMarkers = false;
      }

      // shows/hides island images
      if (e.target._zoom > -1.3) {
        d.showIslandImageMarkers = true;
      } else {
        d.showIslandImageMarkers = false;
      }
    }, 200)
  },
  created() {
    let self = this;
    // Hide header after 2 seconds
    setTimeout(function() {
      self.showHeader = false;
    }, 3000);
    if (self.$attrs.admin == "true") {
      self.showHeader = false;
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
        self.map.createPane("turretMarkers");
        self.map.createPane("respawnerMarkers");
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
          if (island.properties.turrets) {
            let turret = {};
            turret.latLng = island.latLng;
            turret.id = "turret_" + island.properties.slug + "_" + island.id;
            self.turrets.data.push(turret);
          }

          if (island.properties.respawners) {
            let respawner = {};
            respawner.latLng = island.latLng;
            respawner.id =
              "respawner_" + island.properties.slug + "_" + island.id;
            self.respawners.data.push(respawner);
          }
          let type = "";
          if (island.properties.respawners && island.properties.turrets)
            type = "both";
          else if (island.properties.respawners) type = "respawn";
          else if (island.properties.turrets) type = "turrets";
          else type = "plain";
          island.imageBorder = L.icon({
            iconUrl: self.islandTypes[island.properties.type][type],
            iconSize: [125, 125],
            className: "island-image-border"
          });
          island.imageIcon = L.icon({
            iconUrl: island.properties.imageIcon,
            iconSize: [100, 100],
            className: "island-image-icon"
          });
          let height = "";
          if (island.properties.altitude > 2200) height = "high";
          else if (island.properties.altitude > 1800) height = "medium";
          else height = "low";
          island.icon = L.icon({
            iconUrl: self.islandTypes[island.properties.type][height],
            iconSize: [30, 30],
            className: "island-icon"
          });
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
      useSmallIcons: true,
      hideLegend: false,
      showHeader: true,
      loaded: false,
      paneCreated: false,
      showSectorNames: false,
      showIslandImageMarkers: false,
      showIslandMarkers: false,
      hideHeader: false,
      adminMode: false,
      zoomBoundary0: 10,
      zoomBoundary1: 20,
      zoomBoundary2: 40,
      zoomBoundary3: 60,
      zoomBoundary4: 80,
      adminMarker: {
        lat: 0,
        lng: 0
      },
      mapOptions: {
        minZoom: -4.6,
        maxZoom: -0.4,
        zoomSnap: 0.2,
        zoomDelta: 0.6,
        wheelPxPerZoomLevel: 200,
        attributionControl: true
      },
      map: null,
      center: L.latLng(-4750, 4750),
      bounds: [[0, 0], [-9500, 9500]],
      crs: L.CRS.Simple,
      attribution:
        "App made by the <a href='https://discord.gg/BVwKDwy'>Cardinal Guild</a>",
      zonenameMaxOpacity: 0.8,
      zonenameMinZoom: -2.8,
      geojson: {
        data: null,
        options: {
          style: function(feature) {
            return feature.properties;
          },
          interactive: false,
        }
      },
      turrets: {
        data: [],
        icon: L.icon({
          iconUrl: "/assets/island_icons/turret.png",
          iconSize: [50, 30],
          className: "turret-icon"
        })
      },
      respawners: {
        data: [],
        icon: L.icon({
          iconUrl: "/assets/island_icons/respawner.png",
          iconSize: [50, 30],
          className: "respawner-icon"
        })
      },
      islandData: [],
      sectorMarkers: [],
      islandTypes: {
        kioki: {
          plain: "/assets/island_icons/Web_Island_Frame_Kioki.svg",
          respawn: "/assets/island_icons/Web_Island_Frame_Kioki_R.svg",
          turrets: "/assets/island_icons/Web_Island_Frame_Kioki_T.svg",
          both: "/assets/island_icons/Web_Island_Frame_Kioki_RT.svg",
          high: "/assets/island_icons/Island_K_H.png",
          medium: "/assets/island_icons/Island_K_M.png",
          low: "/assets/island_icons/Island_K_L.png"
        },
        saborian: {
          plain: "/assets/island_icons/Web_Island_Frame_Saborian.svg",
          respawn: "/assets/island_icons/Web_Island_Frame_Saborian_R.svg",
          turrets: "/assets/island_icons/Web_Island_Frame_Saborian_T.svg",
          both: "/assets/island_icons/Web_Island_Frame_Saborian_RT.svg",
          high: "/assets/island_icons/Island_S_H.png",
          medium: "/assets/island_icons/Island_S_M.png",
          low: "/assets/island_icons/Island_S_L.png"
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
  .header-bar {
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
.header-fade-enter-active,
.header-fade-leave-active {
  transition: opacity 1s;
}
.header-fade-leave, .header-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.zonenames {
  transition: opacity 1s;
  &.hidden {
    display: none;
    opacity: 0;
  }
}
.map {
  .leaflet-top {
    transition: top 0.5s;
  }
  &.header {
    .leaflet-top {
      top: 50px !important;
    }
  }
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
    }
  }

  .leaflet-popup {
    .leaflet-popup-content-wrapper {
      background: #4f4141f0;
      color: #ffe5c4;
      border-top: 5px rgb(224, 176, 132) solid;
      border-bottom: 5px rgb(224, 176, 132) solid;
      border-radius: 0;
    }
    a.leaflet-popup-close-button {
      padding-top: 9px;
    }
    a.leaflet-popup-close-button:hover {
      color: #d52a2a;
    }
  }
}

.leaflet-control-container {
  .leaflet-control-zoom {
    background: #4f4141;
    border: 0px;
    border-radius: 0px;
    border-top: 5px solid #e0b084;
    border-bottom: 5px solid #e0b084;
    &-in {
      background: #0000;
      color: #e0b084;
      border-bottom: 0px solid #e0b084;
    }
    &-out {
      background: #0000;
      color: #e0b084;
    }
    a:hover {
      background: #0000;
      color: #ffe5c4;
      border-bottom: 0px solid #e0b084;
    }
  }
  .leaflet-bar a.leaflet-disabled {
    background: #453836;
    color: #5b4a4a;
  }
}

@media screen and (max-width: 850px) {
  div#map-header {
    display: none;
  }
}

/* legend */
</style>

