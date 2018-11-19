<template>
  <div id="map-filter">
    <input type="checkbox" id="map-filter-checkbox" @change="toggleFilterMarker">
    <label for="map-filter-checkbox" title="Open Filter Menu">
      <FilterIcon />
    </label>
  </div>
</template>
<script>
import FilterIcon from "../../public/assets/filter.svg";
export default {
  name: "MapFilter",
  components: {
    FilterIcon
  }
}
</script>
<style lang="scss" scoped>
#map-filter {
  width: 30px;

  #map-filter-checkbox {
    position: absolute;
    top: -9999px;

    &:checked {
      ~ label[for=map-filter-checkbox] {
        path {
          fill: #ffe5c4;
        }
      }
    }
  }

  label[for=map-filter-checkbox] {
    cursor: pointer;
    display: block;
    height: 30px;
    width: 30px;
    background: #4f4141;
    border-top: 5px #e0b084 solid;
    border-bottom: 5px #e0b084 solid;

    svg {
      height: 24px;
      padding: 3px;

      path {
        fill: #e0b084;
      }
    }

    &:hover {
      path {
        fill: #ffe5c4;
      }
    }
  }
}
</style>
