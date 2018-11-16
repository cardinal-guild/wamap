<template>
  <div class="map-legend" :class="{ faded: hideLegend }">
    <div class="map-legend-title">Legend</div>
    <div class="map-legend-separator"></div>
    <ul class="legend-list">
      <li>
        <span class="header">
          Altitudes
        </span>
      </li>
      <li>
        <span class="icon">
          <img class="icon" width="40px" src="/assets/island_icons/Island_S_L.png" />
          <img class="icon" width="40px" src="/assets/island_icons/Island_K_L.png" />
        </span>
        <span class="description">
          Low Altitude
        </span>
      </li>
      <div class="map-legend-separator"></div>
      <li>
        <span class="icon">
          <img class="icon" src="/assets/island_icons/Island_S_M.png" />
          <img class="icon" src="/assets/island_icons/Island_K_M.png" />
        </span>
        <span class="description">
          Medium Altitude
        </span>
      </li>
      <div class="map-legend-separator"></div>
      <li>
        <span class="icon">
          <img class="icon" width="40px" src="/assets/island_icons/Island_S_H.png" />
          <img class="icon" width="40px" src="/assets/island_icons/Island_K_H.png" />
        </span>
        <span class="description">
          High Altitude
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "MapLegend",
  props: [
    "hideLegend"
  ]
};
</script>

<style lang="scss">
#toggle-legend,
label[for=toggle-legend] {
  display: none;
}

.map-legend {
  background-color: rgba(79, 65, 65, 0.9);
  border-top: 5px rgb(224, 176, 132) solid;
  border-bottom: 5px rgb(224, 176, 132) solid;
  opacity: 1;
  transition: opacity 0.3s;
  box-shadow: 0 0 7px 4px rgba(0, 0, 0, 0.35);
  box-sizing: border-box;
  padding: 5px;
  color: #ffe5c4;
  width: 200px;

  &-title {
    padding: 0;
    margin: 0;
    margin-left: -5px;
    margin-right: -5px;
    font-size: 1rem;
    padding-bottom: 5px;
  }
  &-separator {
    content: " ";
    background-color: #e0b084;
    display: block;
    padding: 0;
    margin: 5px 0;
    height: 2px;
    width: 100%;
  }
  &.faded {
    opacity: 0.2;
  }
  &:hover {
    opacity: 1;
  }
  .legend-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
    li {
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
      align-items: center;
      .icon {
        text-align: left;
        flex-wrap: nowrap;
        padding-right: 5px;
        img {
          display: inline-block;
          width: 30px;
          height: 30px;
        }
      }
      .description {
        text-align: left;
        white-space: nowrap;
        padding-right: 10px;
      }
      .header {
        margin: auto;
        font-size: 1.5em;
      }
    }
  }
}

.leaflet-top.leaflet-right.mobile { /* legend on mobile */
  #toggle-legend {
    position: absolute;
    top: -9999px;
    display: block;

    &:checked ~ .map-legend {
      left: 210px;
      box-shadow: none;
    }

    &:checked ~ label[for=toggle-legend] {
      left: 180px;
      svg {
        transform: rotate(-180deg);
      }
    }
  }
  label[for=toggle-legend] {
    display: initial;
    content: " ";
    width: 30px;
    height: 30px;
    background-color: #777777;
    position: absolute;
    left: -30px;
    top: 5px;
    float: left;
    transition: left 0.5s;

    svg {
      padding: 3px 2px 3px 4px;
      transform: rotate(0deg);
      transition: 0.5s transform;
    }
  }

  .map-legend {
    position: relative;
    left: 0;
    transition: box-shadow 0.5s, left 0.5s;
  }
}
</style>
