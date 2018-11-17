<template>
  <div class="island-list">
    <button v-for="island in islandList" :key="island.properties.name+'_button'" class="island-button" @click="moveTo(island)">
      {{ island.properties.name }}
    </button>
  </div>
</template>
<script>
import L from "leaflet";

export default {
  name: "IslandList",
  props: ["islandList", "map"],
  methods: {
    moveTo: function(island) {
      this.map.setView(island.latLng, -1);
      let glowMarkerIcon = L.icon({
        iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        iconSize: [100, 100],
        className: "glow-icon"
      });
      new L.Marker(island.latLng, {icon: glowMarkerIcon, pane: "glowMarkers"}).addTo(this.map);
      setTimeout(function () {
        $(".glow-icon").addClass("stop-glow");
      }, 500);
    }
  }
}
</script>
<style lang="scss">
#authorSearch-div {
  overflow: hidden;
  position: relative;
  width: 216px;
  z-index: -3;

  #toggle-search {
    position: absolute;
    top: -9999px;

    &:checked {
      ~ #authorSearch {
        left: 30px;
      }

      ~ .island-list {
        left: 0px;
      }

      ~ label > svg {
        transform: rotate(90deg);
      }
    }
  }

  label[for=toggle-search] {
    display: block;
    background: #4f4141;
    border-top: 5px #e0b084 solid;
    border-bottom: 5px #e0b084 solid;
    height: 30px;
    width: 30px;
    z-index: 1;

    svg {
      margin: 4px;
      transition: transform 0.5s;

      .search-icon {
        fill: #e0b084;
      }
    }

    &:hover .search-icon {
      fill: #ffe5c4;
    }
  }
  #authorSearch {
    outline: none;
    background-color: #4f4141;
    border: none;
    border-top: 5px #e0b084 solid;
    border-bottom: 5px #e0b084 solid;
    border-radius: 2px;
    padding: 6px;
    color: #ffe5c4;
    width: 174px;
    font-size: 16px;
    position: absolute;
    top: 0px;
    left: -186px;
    transition: left 0.5s;
    z-index: -1;

    &::placeholder {
      color: #ffe5c4;
    }
  }

  .island-list {
    background: #4f4141;
    border: none;
    border-top: 5px #e0b084 solid;
    border-bottom: 5px #e0b084 solid;
    max-height: 600px;
    overflow: auto;
    z-index: -2;
    position: relative;
    left: -216px;
    transition: top 0.5s, left 0.5s;

    &:empty {
      border: none;
    }

    .island-button {
      background-color: rgb(224,176,132);
      border: none;
      border-radius: 2px;
      display: block;
      padding: 4px;
      margin: 4px auto;
      color: #4f4141;
      font-size: 18px;
      font-weight: bold;
      width: 180px;

      &:hover {
        background-color: #ffe5c4;
      }
    }
  }
}
</style>
