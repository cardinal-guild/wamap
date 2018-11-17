<template>
  <div class="map" :class="{ header: showHeader }">
    <l-map
      id="wamap"
      ref="map"
      :options="mapOptions"
      :bounds="bounds"
      :crs="crs"
      :zoom="-100"
      @zoomend="onZoomEnd($event, $data)"
      @zoom="onZoom($event, $data, $root)"
      @click="mapClick($event, $data, $root)"
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

      <!--Island Border Markers-->
      <l-marker
        v-if="paneCreated && showIslandBorders"
        v-for="island in islandData"
        :key="island.properties.slug+'_'+island.id+'_border'"
        :lat-lng="island.latLng"
        :icon="island.borderIcon"
        pane="islandBorderMarkers"
        :options="{ interactive: false }"
      />

      <!--Databank count Markers-->
      <l-marker
        v-if="paneCreated && showIslandBorders"
        v-for="island in islandData"
        :key="island.properties.slug+'_'+island.id+'_databank'"
        :lat-lng="island.latLng"
        :icon="island.databankIcon"
        pane="islandDatabankMarkers"
        :options="{ interactive: false }"
      />

      <!--Island Overlay Markers-->
      <l-marker
        v-if="paneCreated && showIslandBorders"
        v-for="island in islandData"
        :key="island.properties.slug+'_'+island.id+'_overlay'"
        :lat-lng="island.latLng"
        :icon="island.overlayIcon"
        pane="islandOverlayMarkers">
        <l-popup v-if="!adminMode">
          <IslandPopup  v-bind="island.properties" :latLng="island.latLng" />
        </l-popup>
      </l-marker>

      <!--Island Markers-->
      <l-marker
        v-if="paneCreated && showIslandMarkers && islandData.length"
        v-for="island in islandData"
        :key="island.properties.slug+'_'+island.id"
        :lat-lng="island.latLng"
        :icon="island.icon"
        :author="island.properties.author"
        pane="islandMarkers"
        name="layerMarkerGroup"
        layer-type="overlay">
        <l-popup v-if="!adminMode">
          <IslandPopup  v-bind="island.properties" :lat-lng="island.latLng" />
        </l-popup>
      </l-marker>

      <!--Island Image Markers-->
      <l-marker
        v-if="paneCreated && showIslandImageMarkers"
        v-for="island in islandData"
        :key="island.properties.slug + '_' + island.id + '_image'"
        :lat-lng="island.latLng"
        :icon="island.imageIcon"
        pane="islandImageMarkers">
      </l-marker>

      <!--Zone names-->
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
        position="topleft">
        <div id="authorSearch-div">
          <input type="checkbox" id="toggle-search">
          <label for="toggle-search">
            <SearchIcon />
          </label>
          <input type="text" v-model="author" id="authorSearch" placeholder="Search authors...">
          <IslandList :island-list="searchedIslands" :map="map"/>
        </div>
      </l-control>
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

import SearchIcon from "../../public/assets/search-icon.svg";

import IslandPopup from "./IslandPopup.vue";
import MapLegend from "./MapLegend.vue";
import IslandList from "./IslandList.vue"
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
    MapLegend,
    IslandList,
    SearchIcon,
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
    onZoomEnd: _.debounce((e, d, r) => {
      //hiding map legend
      if (e.target._zoom > -2) {
        d.hideLegend = true;
      } else {
        d.hideLegend = false;
      }

      //setInfoIconSizes(e, d);
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
    onZoom: _.debounce((e, d, r) => {
      console.log(e.target._zoom);
      // shows/hides sector names
      if (e.target._zoom > -3.7) {
        d.showSectorNames = true;
      } else {
        d.showSectorNames = false;
      }
      //setInfoIconSizes(e, d);

      // shows/hides island markers
      if (e.target._zoom > -3.5 && e.target._zoom < -1.3) {
        d.showIslandMarkers = true;
      } else {
        d.showIslandMarkers = false;
      }

      // shows/hides island images
      if (e.target._zoom > -1.4) {
        d.showIslandImageMarkers = true;
        d.showIslandBorders = true;
      } else {
        d.showIslandImageMarkers = false;
        d.showIslandBorders = false;
      }
    }, 200)
  },
  created() {
    let self = this;

    self.$watch("author", (newVal, oldVal) => {
      let islands = [];
      if (!newVal) {
        islands = [];
        self.searchedIslands = [];
        return;
      }
      //console.log(self.islandData);
      for (var i in self.islandData) {
        let island = self.islandData[i];
        if (island.properties.creator.toLowerCase().startsWith(newVal.toLowerCase())) {
          islands.push(island);
        }
      }
      // let group = self.$refs.searchMarkerLayer.mapObject;
      // group.eachLayer((layer) => {
      //   if (layer.options.author.toLowerCase().startsWith(newVal.toLowerCase())) {
      //     islands.push(layer)
      //   }
      // })
      self.searchedIslands = islands;
    });

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
        self.map.createPane("glowMarkers");
        self.map.createPane("islandImageMarkers");
        self.map.createPane("islandBorderMarkers");
        self.map.createPane("islandDatabankMarkers");
        self.map.createPane("islandOverlayMarkers");
        self.paneCreated = true;

        if (self.$attrs.lat && self.$attrs.lng && !self.adminMode) {
          self.map.setView([self.$attrs.lat, self.$attrs.lng], -1.2);
          let glowMarkerIcon = L.icon({
            iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
            iconSize: [100, 100],
            className: "glow-icon"
          });
          let marker = new L.Marker([self.$attrs.lat, self.$attrs.lng],{icon: glowMarkerIcon, pane: "glowMarkers"});
          marker.addTo(self.map);

          setTimeout(function() {
            $(".glow-icon").addClass("stop-glow");
          }, 8000);

          setTimeout(function(mapObj) {
            mapObj.removeLayer(marker);
          }, 13000, self.map);
        }

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

          //set border markers
          let type = "";
          if (island.properties.respawners && island.properties.turrets) type = "both";
          else if (island.properties.respawners) type = "respawn";
          else if (island.properties.turrets) type = "turrets";
          else type = "plain";
          island.borderIcon = L.icon({
            iconUrl: self.islandTypes[island.properties.type][type],
            iconSize: [150, 150],
            className: "island-border-icon"
          });

          //set databanks number
          island.databankIcon = L.icon({
            iconUrl: "/assets/island_icons/databanks/I_Frame_Data-" + island.properties.databanks + ".png",
            iconSize: [150, 150],
            className: "island-databank-icon"
          });

          //Set image icon icons
          island.imageIcon = L.icon({
            iconUrl: island.properties.imageIcon,
            iconSize: [100, 100],
            className: "island-image-icon"
          });

          //Set island icons when zoomed out with height
          let height = "";
          if (island.properties.altitude > 2200) height = "high";
          else if (island.properties.altitude > 1800) height = "medium";
          else height = "low";
          island.icon = L.icon({
            iconUrl: self.islandTypes[island.properties.type][height],
            iconSize: [30, 30],
            className: "island-icon"
          });

          island.overlayIcon = self.transparentIcon;
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
    });
  },
  data() {
    return {
      hideLegend: false,
      showHeader: true,
      loaded: false,
      paneCreated: false,
      showSectorNames: false,
      showInfoMarkers: false,
      showIslandImageMarkers: false,
      showIslandMarkers: false,
      showIslandBorders: false,
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
      zonenameMaxOpacity: 0.8,
      zonenameMinZoom: -2.8,
      geojson: {
        data: null,
        options: {
          style: function(feature) {
            return feature.properties;
          },
          interactive: false
        }
      },
      transparentIcon: new L.Icon({
        iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        iconSize: [110, 110],
        className: "transparent-island-icon",
      }),
      islandData: [],
      sectorMarkers: [],
      searchedIslands: [],
      author: "",
      islandTypes: {
        kioki: {
          plain: "/assets/island_icons/I_Frame_K.png",
          respawn: "/assets/island_icons/I_Frame_K-R.png",
          turrets: "/assets/island_icons/I_Frame_K-T.png",
          both: "/assets/island_icons/I_Frame_K-RT.png",
          high: "/assets/island_icons/Island_K_H.png",
          medium: "/assets/island_icons/Island_K_M.png",
          low: "/assets/island_icons/Island_K_L.png"
        },
        saborian: {
          plain: "/assets/island_icons/I_Frame_S.png",
          respawn: "/assets/island_icons/I_Frame_S-R.png",
          turrets: "/assets/island_icons/I_Frame_S-T.png",
          both: "/assets/island_icons/I_Frame_S-RT.png",
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

.transparent-island-icon {
  border-radius: 50%;
}

.island-databank-count {
  font-family: "Roboto", sans-serif;
  font-size: 16px;
}

.glow-icon {
  box-shadow: none;
  border-radius: 50%;
  transition: box-shadow 5s;
}

.glow-icon:not(.stop-glow) {
  box-shadow: 0 0 20px 20px #ffe5c4;
}

</style>

