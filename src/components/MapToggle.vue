<template>
  <l-control v-if="!this.$store.state.adminMode" id="mapToggle" position="topleft">
    <input type="checkbox" id="map-toggle-checkbox" @change="mapTypeToggle">
    <label for="map-toggle-checkbox">
      <div id="selectionBox"></div>
      <div class="server-type" id="pveBox">
        PvE
      </div>
      <div class="server-type" id="pvpBox">
        PvP
      </div>
    </label>
  </l-control>
</template>
<script>
import $ from "jquery";
import { LControl } from "vue2-leaflet";

export default {
  name: "MapToggle",
  components: {
    LControl,
  },
  methods: {
    mapTypeToggle: function(e) {
      if (e.srcElement.checked) {
        $("#wamap").addClass("pvp-server").removeClass("pve-server");
      }
      else {
        $("#wamap").addClass("pve-server").removeClass("pvp-server");
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#mapToggle {
  #map-toggle-checkbox {
    position: absolute;
    top: -9999px;

    &:checked ~ label[for=map-toggle-checkbox] {
      #selectionBox {
        top: 32px;
      }
    }
  }

  label[for=map-toggle-checkbox] {
    cursor: pointer;
    display: block;
    height: 60px;
    width: 30px;
    background: #4f4141;
    border-top: 5px #e0b084 solid;
    border-bottom: 5px #e0b084 solid;

    .server-type {
      line-height: 26px;
      font-size: 16px;
      color: #291a08;
      z-index: 2;
      position: relative;
      padding: 2px 0;
    }

    #selectionBox {
      height: 28px;
      width: 28px;
      border-radius: 2px;
      position: absolute;
      margin: 4px 1px;
      top: 2px;
      background: #e0b084;
      z-index: 1;
      transition: top 0.5s;
    }
  }
}
</style>
