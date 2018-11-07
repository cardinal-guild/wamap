<template>
  <l-map
    id="wamap"
    ref="map"
    :options="mapOptions"
    :center="center"
    :bounds="bounds"
    :crs="crs"
    @click="mapClick"
    @zoomstart="zoomStart"
    @zoom="onZoom"
    @zoomend="zoomEnd"
    >
    <h1 class="map-title">Worlds Adrift Map</h1>
    <l-image-overlay
      :url="url"
      :bounds="bounds"
      :attribution="attribution" />
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
    <l-geo-json
      :geojson="tier4Regions.geojson"
      :options="tier4Regions.options"
    />
    <l-geo-json
      :geojson="windWalls.geojson"
      :options="windWalls.options"
    />
    <l-geo-json
      :geojson="stormWalls.geojson"
      :options="stormWalls.options"
    />
    <l-geo-json
      :geojson="sandWalls.geojson"
      :options="sandWalls.options"
    />
    <l-geo-json
      :geojson="havenWall.geojson"
      :options="havenWall.options"
    />
    <l-geo-json
      :geojson="borderWalls.geojson"
      :options="borderWalls.options"
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
      v-for="item in zoneNames"
      :key="item.name"
      :lat-lng="item.latlng"
      :icon="item.icon"
      style="display:none;"
      interactive="false" />
  </l-map>
</template>



<script>
/* eslint-disable */
import Vue from "vue";
import L from "leaflet";
import { LMap, LImageOverlay, LGeoJson, LControl, LMarker } from "vue2-leaflet";

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
    zoomStart: e => {
      data.prevZoom = e.target._zoom;
      if (e.target._zoom == -1)
        e.target.getPane("markerPane").style.display = "none";
    },
    onZoom: e => {
      if (e.target._zoom == -1 && data.prevZoom == 0)
        e.target.getPane("markerPane").style.display = "block";
    },
    zoomEnd: e => {
      console.log("Zooming from " + data.prevZoom + " to " + e.target._zoom);
    },
    onLoad: e => {
      console.log(e)
    }
  },
  data() {
    return {
      mapOptions: {
        minZoom: -1,
        maxZoom: 2,
        zoom: -1
      },
      center: L.latLng(1000, 1000),
      bounds: [[0, 0], [1000, 1000]],
      wallWeight: 5,
      crs: L.CRS.Simple,
      attribution:
        "App made by the <a href='https://discord.gg/BVwKDwy'>Cardinal Guild</a>",
      center: [0, 0],
      url: require("../assets/map_background.png"),
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
      },
      tier4Regions: {
        geojson: data.tier4Regions,
        options: {
          stroke: false,
          fillColor: "#997A54",
          fillOpacity: 0.8
        }
      },
      havenWall: {
        geojson: data.havenWall,
        options: {
          color: "#660066",
          weight: 5,
          className: "thickwall"
        }
      },
      windWalls: {
        geojson: data.windWalls,
        options: {
          color: "#FFFFFF",
          weight: 5
        }
      },
      stormWalls: {
        geojson: data.stormWalls,
        options: {
          color: "#333333",
          weight: 5
        }
      },
      sandWalls: {
        geojson: data.sandWalls,
        options: {
          color: "#c19a6b",
          weight: 5
        }
      },
      borderWalls: {
        geojson: data.borderWalls,
        options: {
          color: "#000000",
          weight: 7
        }
      },
      zoneNames: [
        {
          name: "Avalon",
          latlng: L.latLng(980, 230),
          icon: L.divIcon({html: '<div>Avalon</div>', className: "zone-label"})
        },
        {
          name: "Lemuria",
          latlng: L.latLng(790, 30),
          icon: L.divIcon({html: '<div style="transform: rotate(28deg); letter-spacing: normal; font-size: 26px;">Lemuria</div>', className: "zone-label"})
        },
        {
          name: "Ophir",
          latlng: L.latLng(760,767),
          icon: L.divIcon({html: '<div style="transform: rotate(67deg); letter-spacing: normal; font-size: 35px;">Ophir</div>', className: "zone-label"})
        },
        {
          name: "Hades",
          latlng: L.latLng(630, 120),
          icon: L.divIcon({html: '<div style="transform: rotate(10deg);">Hades</div>', className: "zone-label"})
        },
        {
          name: "Roke",
          latlng: L.latLng(400,250),
          icon: L.divIcon({html: '<div style="transform: rotate(15deg);">Roke</div>', className: "zone-label"})
        },
        {
          name: "Kunlun",
          latlng: L.latLng(150, 180),
          icon: L.divIcon({html: '<div>Kunlun</div>', className: "zone-label"})
        },
        {
          name: "Haven",
          latlng: L.latLng(770, 947),
          icon: L.divIcon({html: '<div style="transform: rotate(90deg); color: #291a08ad;">Haven</div>', className: "zone-label"})
        }
      ]
    };
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Noto+Sans');

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
.zone-label {
  text-transform: uppercase;
  font-size: 56px;
  font-family: "Cambria";
  font-weight: bold;
  letter-spacing: 10px;
  color: #291a087d;
}

.map-background {
  background: #fff;
  opacity: 1;
}

.map-title {
  color: #ffe5c4;
  font-size: 40px;
  font-family: "Noto Sans", sans-serif;
}
</style>
