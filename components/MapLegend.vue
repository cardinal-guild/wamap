<template>
  <div>
    <no-ssr>
      <l-control position="topright" class="map-legend-control">
        <div class="map-legend" :class="{ 'fade-legend': (zoomPercentage > fadeOutFromZoomPercentage) , 'close-legend': !opened }">
          <div class="map-legend-toggle" @click="opened=!opened">
            <v-icon large>chevron_right</v-icon>
          </div>
          <div class="map-legend-content">
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
                  <img src="~/static/assets/island_icons/Island_S_L.png" />
                  <img src="~/static/assets/island_icons/Island_K_L.png" />
                </span>
                <span class="description">
                  Low Altitude
                </span>
              </li>
              <li class="map-legend-separator"></li>
              <li>
                <span class="icon">
                  <img src="~/static/assets/island_icons/Island_S_M.png" />
                  <img src="~/static/assets/island_icons/Island_K_M.png" />
                </span>
                <span class="description">
                  Medium Altitude
                </span>
              </li>
              <li class="map-legend-separator"></li>
              <li>
                <span class="icon">
                  <img src="~/static/assets/island_icons/Island_S_H.png" />
                  <img src="~/static/assets/island_icons/Island_K_H.png" />
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
                  <img src="~/static/assets/I_Frame_Databanks.png" />
                </span>
                <span class="description">
                  Databanks
                </span>
              </li>
              <li>
                <span class="icon single">
                  <img src="~/static/assets/I_Frame_Reviver.png" />
                </span>
                <span class="description">
                  Revival Chambers
                </span>
              </li>
              <li>
                <span class="icon single">
                  <img src="~/static/assets/I_Frame_Turret.png">
                </span>
                <span class="description">
                  Turrets
                </span>
              </li>
              <li>
                <span class="icon single culture">
                  <img src="~/static/assets/I_Frame_K-E.png">
                </span>
                <span class="description">
                  Kioki
                </span>
              </li>
              <li>
                <span class="icon single culture">
                  <img src="~/static/assets/I_Frame_S-E.png">
                </span>
                <span class="description">
                  Saborian
                </span>
              </li>
            </ul>
          </div>
        </div>
      </l-control>
    </no-ssr>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'MapLegend',
  computed: {
    ...mapState(['zoomPercentage'])
  },
  data () {
    return {
      opened: true
    };
  },
  props: {
    fadeOutFromZoomPercentage: {
      type: Number,
      default: 80
    }
  },
  mounted () {
    if (window && window.innerWidth) {
      if (window.innerWidth < 380) {
        this.opened = false;
      }
    }
    this.$bus.$on('closeLegend', e => {
      this.opened = false;
      // let self = this;
      // let closeTimeout;
      // clearTimeout(closeTimeout);
      // closeTimeout = setTimeout(() => {
      //   self.opened = false;
      // }, 10000);
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~sass-easing/_easings';

.map-legend {
  opacity: 1;
  transition: opacity $easeOutExpo 0.3s, transform $easeOutBack 0.6s;
  display: flex;
  margin-right: 0;
  align-items: flex-start;
  &-control {
    pointer-events: inherit;
    cursor: inherit;
  }
  &.fade-legend {
    opacity: 0.8;
  }
  &.close-legend {
    transform: translateX(190px);

    transition: opacity $easeOutExpo 0.3s, transform $easeInBack 0.3s;
    .map-legend-content {
      box-shadow: none !important;
    }
    .map-legend-toggle {
      i {
        transform: rotate(180deg);
      }
    }
  }
  &:hover {
    opacity: 1;
  }
  &-toggle {
    pointer-events: auto;
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
    display: block;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    font-size: 2.5em;
    transition: background-color $easeOutExpo 0.3s;
    &:hover,
    &:focus {
      background: rgba(0, 0, 0, 0.6);
    }
  }
  &-title {
    font-size: 1.8em;
    font-family: 'News Cycle', sans-serif;
    text-align: center;
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
  &-content {
    pointer-events: auto;
    background-color: rgb(79, 65, 65);
    border-top: 5px rgb(224, 176, 132) solid;
    border-bottom: 5px rgb(224, 176, 132) solid;
    box-shadow: 0 0 7px 4px rgba(0, 0, 0, 0.35);
    box-sizing: border-box;
    padding: 5px;
    color: #ffe5c4;
    width: 180px;
    cursor: default;
  }
}
</style>
