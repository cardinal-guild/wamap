<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Noto+Sans|Open+Sans|Roboto|Abril+Fatface");
@import "../node_modules/leaflet/dist/leaflet.css";

body {
  margin: 0;
  width: 100%;
  height: 100%;
}

#app {
  transform: translate3d(0, 0, 0);
  background: linear-gradient(to right, #cca7a0, #c0aca8, #cca7a0);
  display: block;
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
