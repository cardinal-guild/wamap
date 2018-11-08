<template>
  <div id="app">
    <Map />
  </div>
</template>

<script>
import Map from "./components/Map.vue";

export default {
  name: "app",
  components: {
    Map
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Noto+Sans|Open+Sans|Roboto|Abril+Fatface");
@import "../node_modules/leaflet/dist/leaflet.css";

.leaflet-fake-icon-image-2x {
  background-image: url(../node_modules/leaflet/dist/images/marker-icon-2x.png);
}
.leaflet-fake-icon-shadow {
  background-image: url(../node_modules/leaflet/dist/images/marker-shadow.png);
}
.leaflet-container.crosshair-cursor-enabled {
  cursor: crosshair;
}
.leaflet-container {
  background-image: linear-gradient(to right, #4f4141, #5c4949, #4f4141);
}

.leaflet-image-layer {
  background-color: #4f4141;
}

body {
  margin: 0;
  width: 100%;
  height: 100%;
}
#app {
  padding: 0;
  margin: 0;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
