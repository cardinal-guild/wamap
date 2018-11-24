<template>
  <l-control position="topright"> 
    <input type="checkbox" id="toggle-legend">
    <label for="toggle-legend">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z"/></svg>
    </label>
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
            <img src="~/assets/island_icons/Island_S_L.png" />
            <img src="~/assets/island_icons/Island_K_L.png" />
          </span>
          <span class="description">
            Low Altitude
          </span>
        </li>
        <li class="map-legend-separator"></li>
        <li>
          <span class="icon">
            <img src="~/assets/island_icons/Island_S_M.png" />
            <img src="~/assets/island_icons/Island_K_M.png" />
          </span>
          <span class="description">
            Medium Altitude
          </span>
        </li>
        <li class="map-legend-separator"></li>
        <li>
          <span class="icon">
            <img src="~/assets/island_icons/Island_S_H.png" />
            <img src="~/assets/island_icons/Island_K_H.png" />
          </span>
          <span class="description">
            High Altitude
          </span>
        </li>
        <li class="map-legend-separator"></li>
        <li>
          <span class="header">
            Icons
          </span>
        </li>
        <li>
          <span class="icon single">
            <img src="~/assets/I_Frame_Databanks.png" />
          </span>
          <span class="description">
            Databanks
          </span>
        </li>
        <li>
          <span class="icon single">
            <img src="~/assets/I_Frame_Reviver.png" />
          </span>
          <span class="description">
            Revival Chambers
          </span>
        </li>
        <li>
          <span class="icon single">
            <img src="~/assets/I_Frame_Turret.png">
          </span>
          <span class="description">
            Turrets
          </span>
        </li>
        <li>
          <span class="icon single culture">
            <img src="~/assets/I_Frame_K-E.png">
          </span>
          <span class="description">
            Kioki
          </span>
        </li>
        <li>
          <span class="icon single culture">
            <img src="~/assets/I_Frame_S-E.png">
          </span>
          <span class="description">
            Saborian
          </span>
        </li>
      </ul>
    </div>
  </l-control>
</template>

<script>
export default {
  name: 'MapLegend',
  props: ['zoomLevel'],
  data () {
    return {
      hideLegend: false
    };
  },
  watch: {
    zoomLevel: function (val) {
      this.zoomLevel = val;
    }
  }
};
</script>

<style lang="scss">
#toggle-legend,
label[for='toggle-legend'] {
  display: none;
}

.map-legend {
  z-index: 401;
  background-color: rgba(79, 65, 65, 0.9);
  border-top: 5px rgb(224, 176, 132) solid;
  border-bottom: 5px rgb(224, 176, 132) solid;
  opacity: 1;
  transition: opacity 0.3s;
  box-shadow: 0 0 7px 4px rgba(0, 0, 0, 0.35);
  box-sizing: border-box;
  padding: 5px;
  color: #ffe5c4;
  width: max-content;

  &-title {
    font-size: 1.5em;
  }
  &-separator {
    content: ' ';
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
      margin-bottom: 5px;
      margin-top: 5px;
      .icon {
        text-align: left;
        flex-wrap: nowrap;
        margin-right: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          display: inline-block;
          width: 30px;
          height: auto;
        }
        &.info {
          border-radius: 100%;
          background-color: rgba(white, 0.2);
          width: 40px;
          height: 40px;
        }
        &.single {
          margin-left: 5px;
          img {
            width: 40px;
            height: auto;
          }
        }
      }
      .description {
        text-align: right;
        white-space: nowrap;
        padding-right: 5px;
      }
      .header {
        margin: auto;
        font-size: 1.25em;
      }
    }
  }
}
</style>
