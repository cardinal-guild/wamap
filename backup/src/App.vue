<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import $ from "jquery";

$("meta[name='og:title']").attr("content", "Hello");

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
  font-family: "Noto Sans","Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss">
.button,
.leaflet-container > a.button {
  display: inline-block;
  padding: 5px;
  border-radius: 5px;
  text-decoration: none;
  color: #524747;
  background: #d4ad88;
  line-height: 16px;
  &:hover,
  &:focus,
  &:active {
    color: #524747;
    background: #d4ad88;
  }
  svg {
    fill: #524747;
    width: 16px;
    height: 16px;
  }
  &.-hollow {
    background: none;
    border: 3px solid #d4ad88; // The thickness should correspond with the thickness set above
    &:hover,
    &:focus,
    &:active {
      color: #524747;
      background: #d4ad88;
    }
  }
}
</style>
