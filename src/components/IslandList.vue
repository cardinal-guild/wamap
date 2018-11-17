<template>
  <div class="island-list">
    <button v-for="island in islandList" class="island-button" @click="moveToIsland(island, island.options.latLng)">
      {{ island.options.name }}
    </button>
  </div>
</template>
<script>
export default {
  name: "IslandList",
  props: ["islandList"],
  methods: {
    moveToIsland: (layer, latLng) => {
      layer._map.setView(latLng, -2);
    }
  }
}
</script>
<style lang="scss" scoped>
  .island-list {
    background: #4f4141;
    border-top: 5px #e0b084 solid;
    border-bottom: 5px #e0b084 solid;

    &:empty {
      border: none;
    }
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
    width: 160px;

    &:hover {
      background-color: #ffe5c4;
    }
  }
</style>
<style lang="scss">
  #authorSearch {
    outline: none;
    background-color: #4f4141;
    border: 2px #e0b084 solid;
    border-radius: 2px;
    padding: 6px;
    color: #ffe5c4;

    &::placeholder {
      color: #ffe5c4;
    }

    &:focus {
      box-shadow: 0 0 2px 2px #291a08 inset;
    }
  }
</style>
