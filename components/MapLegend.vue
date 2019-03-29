<template>
  <l-control position="topright" class="map-legend-control">
    <div
      :class="{ 'fade-legend': (zoomPercentage > fadeOutFromZoomPercentage) , 'close-legend': !opened }"
      class="map-legend"
    >
      <div class="map-legend-toggle" @click="opened=!opened">
        <v-icon large>chevron_right</v-icon>
      </div>
      <div class="map-legend-content">
        <div class="map-legend-title">Legend</div>
        <div class="map-legend-separator"/>
        <ul class="legend-list">
          <li>
            <span class="header">Altitudes</span>
          </li>
          <li>
            <span class="icon">
              <div class="island saborian low"/>
              <div class="island kioki low"/>
            </span>
            <span class="description">Low Altitude</span>
          </li>
          <li class="map-legend-separator"/>
          <li>
            <span class="icon">
              <div class="island saborian medium"/>
              <div class="island kioki medium"/>
            </span>
            <span class="description">Medium Altitude</span>
          </li>
          <li class="map-legend-separator"/>
          <li>
            <span class="icon">
              <div class="island saborian high"/>
              <div class="island kioki high"/>
            </span>
            <span class="description">High Altitude</span>
          </li>
          <li class="map-legend-separator"/>
          <li>
            <span class="header">Icons</span>
          </li>
          <li>
            <span class="icon single background">
              <div class="databank">
                <img src="~/static/island_icons/knowledge_icon.png">
              </div>
            </span>
            <span class="description">Databanks</span>
          </li>
          <li>
            <span class="icon single background">
              <div class="revival">
                <img src="~/static/island_icons/revival_icon.png">
              </div>
            </span>
            <span class="description">Revival Chambers</span>
          </li>
          <li>
            <span class="icon single background">
              <div class="turret">
                <img src="~/static/island_icons/turret_icon.png">
              </div>
            </span>
            <span class="description">Turrets</span>
          </li>
          <li>
            <span class="icon single culture background">
              <div class="kioki">
                <img src="~/static/island_icons/kioki_icon.png">
              </div>
            </span>
            <span class="description">Kioki</span>
          </li>
          <li>
            <span class="icon single culture background">
              <div class="sabor">
                <img src="~/static/island_icons/saborian_icon.png">
              </div>
            </span>
            <span class="description">Saborian</span>
          </li>
          <li>
            <span class="icon single background">
              <div class="dangerous"/>
            </span>
            <span class="description">Dangerous</span>
          </li>
        </ul>
      </div>
    </div>
  </l-control>
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
  .island {
    margin: 5px;
    &:first-child {
      margin-left: 15px;
      margin-right: 10px;
    }

    &.low {
      &:before {
        border: 2px solid #222;
        background-color: #666;
      }
    }
    &.medium {
      &:before {
        border: 2px solid #666;
        background-color: #bbb;
      }
    }

    &.high {
      &:before {
        border: 2px solid #999;
        background-color: #ddd;
      }
    }
    &.kioki {
      &:before {
        display: block;
        content: ' ';
        border-radius: 100%;
        width: 16px;
        height: 16px;
        box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.75);
      }
    }

    &.saborian {
      &:before {
        display: block;
        content: ' ';
        width: 14px;
        height: 14px;
        top: -2.5%;
        left: 2.5%;
        transform: rotateZ(45deg);
        box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.75);
      }
    }
  }
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

            &.databank {
              width: auto;
            }
          }

          &.background {
            width: 40px;
            div {
              width: 28px;
              height: 28px;
              display: flex;
              align-items: center;
              border-radius: 50%;

              &.databank {
                width: auto;
                height: auto;
              }

              &.revival {
                background: #14a014;
              }

              &.turret {
                background: #a01414;
              }

              &.sabor {
                background: #f0f0ff;
                width: 28px;
                height: 28px;
                border-radius: 0;
                transform: rotateZ(45deg);

                img {
                  transform: rotateZ(-45deg);
                  position: relative;
                  top: 1px;
                  left: 1px;
                }
              }

              &.kioki {
                background: #fff0dc;
                width: 32px;
                height: 32px;
              }

              &.dangerous {
                border: 3px #ea6d6d solid;
                background: gray;
              }

              img {
                width: auto;
                margin: auto;
              }
            }
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
