<template>
  <div>
    <no-ssr>
      <l-popup>
        <div class="island-popup">
          <template v-if="showPopup">
            <table class="island-data-table">
              <tr class="name">
                <th colspan="2">
                  <div class="island-title">
                    <div class="island-name">
                      <div
                        v-if="tcAlliance
                        && tcAlliance !== 'Unclaimed'"
                        class="tc-alliance"
                        @click="hiliteAlliance"
                      >
                        <span>Owned by:</span>
                        <strong>{{ tcAlliance }}</strong>
                      </div>
                      <component
                        :is="workshopUrl?'a':'div'"
                        :href="workshopUrl || ''"
                        class="island-name-link"
                        target="_blank"
                        rel="nofollow,noopener"
                      >
                        <span class="nickname">{{ nickName?nickName:name }}</span>
                        <span v-if="nickName" class="name">({{ name }})</span>
                        <img v-if="workshopUrl" src="/assets/steam_icon.png" >
                      </component>
                    </div>
                    <span class="by-author">by</span>
                    <component
                      :is="creatorWorkshopUrl?'a':'span'"
                      :href="creatorWorkshopUrl || ''"
                      class="creator-name"
                      target="_blank"
                      rel="nofollow,noopener"
                    >
                      <span class="username">{{ creator }}</span>
                      <img v-if="creatorWorkshopUrl" src="/assets/steam_icon.png" >
                    </component>
                  </div>
                </th>
              </tr>
              <tr>
                <td colspan="2" class="island-popup-image">
                  <a :href="imageOriginal" target="_blank">
                    <v-img :width="300" :src="imagePopup" />
                  </a>
                  <div class="island-popup-copy-paste">
                    <v-tooltip bottom>
                      <v-btn slot="activator" icon @click="copyToClipboard">
                        <CopyPasteLink />
                      </v-btn>
                      <span>Copy the current island location to clipboard</span>
                    </v-tooltip>
                  </div>
                </td>
              </tr>
              <tr>
                <table class="island-info-table mt-2">
                  <tr>
                    <td>Altitude</td>
                    <td>{{ altitude }}</td>
                  </tr>
                  <tr>
                    <td>Databanks</td>
                    <td>{{ databanks }}</td>
                  </tr>
                </table>
              </tr>
              <tr class="expansion-panels">
                <v-expansion-panel v-model="panel" expand>
                  <v-expansion-panel-content :ripple="true" class="island-extras">
                    <div slot="header" class="text-xs-center expansion-header subheading">More info</div>
                    <v-card>
                      <v-card-text class="py-2">
                        <table
                          v-if="(metals && metals.length > 0) || $store.state.config.showAllMetals"
                          class="island-materials-table"
                        >
                          <!-- Material Qualities changed so I commented this out. Can be removed later -->
                          <tr v-for="(metal, index) in activeMetals" :key="index">
                            <td>{{ metal.name }}</td>
                            <td>{{ getQuality(metal) }}</td>
                          </tr>
                        </table>
                        <div v-else class="island-materials-table">No metals data</div>
                        <table v-if="trees.length > 0" class="island-materials-table">
                          <tr v-for="(tree, index) in trees" :key="index">
                            <td>{{ tree }}</td>
                          </tr>
                        </table>
                        <div v-else class="island-materials-table">No tree data</div>
                        <div style="clear: both;" />
                        <div class="table-divider" />
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </tr>
              <tr v-if="currentChar.guid && currentChar.name">
                <v-container fluid pa-0>
                  <v-layout justify-center>
                    <v-flex shrink>
                      <v-card color="brown" class="pa-2 mt-2">
                        <v-checkbox
                          :label="'Visited with `'+currentChar.name+'`'"
                          v-model="islandVisited"
                          color="green"
                        />
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
              </tr>
            </table>
            <v-btn
              flat
              grow
              block
              class="island-popup-button"
              @click="$bus.$emit('reportInformation', $data, $props)"
            >
              <v-icon>insert_comment</v-icon>
              <span>Report metals</span>
            </v-btn>
            <v-btn
              v-if="config.showEdit"
              :href="'https://surveyor.cardinalguild.com/islands/'+id+'/edit'"
              color="green"
              class="island-popup-button"
              flat
              grow
              block
              target="_blank"
              rel="noopener,nofollow"
            >
              <v-icon>create</v-icon>
              <span>Edit</span>
            </v-btn>
          </template>
        </div>
      </l-popup>
    </no-ssr>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';
import CopyPasteLink from '~/assets/svg/copy_paste_link_icon.svg';
export default {
  components: {
    CopyPasteLink
  },
  name: 'IslandPopup',
  filters: {
    capitalize: function (value) {
      if (!value) return '';
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    upper: function (value) {
      return value.toUpperCase();
    },
    metalsToString: function (metals) {
      let metalNames = [];
      _.forEach(metals, function (metal) {
        metalNames.push(metal.name + ' Q' + metal.quality);
      });
      return metalNames.join(', ');
    }
  },
  methods: {
    hiliteAlliance () {
      let closeBtns = document.querySelectorAll('.leaflet-popup-close-button');
      if (closeBtns) {
        for (var i = 0; i < closeBtns.length; i++) {
          closeBtns[i].click();
        }
      }
      let self = this;
      this.filteredIslands = _.filter(
        self.$store.state.islandData.features,
        function (o) {
          return (
            o.properties.tc[self.$store.state.mapMode].alliance ===
            self.tcAlliance
          );
        }
      );
      let filteredCoords = this.filteredIslands.map(function (o) {
        return o.geometry.coordinates;
      });
      this.$store.commit('setHighlights', filteredCoords);
    },
    changeIslandVisited (visited) {
      if (visited) {
        this.$store.commit('account/addIslandVisited', this.id);
      } else {
        this.$store.commit('account/removeIslandVisited', this.id);
      }
    },
    async copyToClipboard (e) {
      let url = window.location.origin + window.location.pathname;
      if (url.substring(url.length - 1) !== '/') {
        url = url + '/';
      }
      url = url + this.id;
      try {
        await this.$copyText(url);
        this.$store.commit('setSnack', {
          text: 'Url copied to clipboard',
          color: 'success'
        });
      } catch (e) {
        this.$store.commit('setSnack', {
          text: 'There was an error copying the link to your clipboard',
          color: 'error'
        });
      }
    },
    getQuality (metal) {
      if (!metal.quality) {
        let foundMetal = _.find(this.metals, o => o.name === metal.name);
        return foundMetal ? foundMetal.quality : 'N/A';
      }
      return metal.quality;
    }
  },
  mounted () {
    if (this.$store.state.mapMode === 'pvp') {
      this.metals = this.pvpMetals;
      this.tcAlliance = this.tc['pvp'].alliance;
      this.tcName = this.tc['pvp'].tower_name;
    } else {
      this.metals = this.pveMetals;
      this.tcAlliance = this.tc['pve'].alliance;
      this.tcName = this.tc['pve'].tower_name;
    }
    if (this.currentCharacter && this.characters && this.characters.length) {
      let filterGuid = this.currentCharacter;
      this.currentChar = _.chain(this.characters)
        .filter(function (x) {
          return x.guid === filterGuid;
        })
        .first()
        .value();
    }
  },
  computed: {
    ...mapState(['config', 'islandPopupId']),
    ...mapState('account', {
      loggedIn: 'loggedIn',
      currentCharacter: 'currentCharacter',
      characters: 'characters'
    }),
    islandVisited: {
      get () {
        if (this.currentCharacter && this.characters.length) {
          let filterGuid = this.currentCharacter;
          let characterData = _.chain(this.characters)
            .filter(function (x) {
              return x.guid === filterGuid;
            })
            .first()
            .value();
          if (
            characterData &&
            characterData.visited_islands &&
            characterData.visited_islands.length
          ) {
            if (
              characterData.visited_islands.indexOf(this.id.toString()) >= 0
            ) {
              return true;
            }
          }
        }
        return false;
      },
      set (value) {
        if (this.id) {
          if (value) {
            this.$store.commit('account/addIslandVisited', this.id);
          } else {
            this.$store.commit('account/removeIslandVisited', this.id);
          }
        }
      }
    },
    activeMetals () {
      if (this.$cookies.get('showAllMetals'))
        return this.$store.state.metalTypes;
      return this.metals;
    }
  },

  watch: {
    islandPopupId (newId, oldId) {
      if (newId === this.id) {
        this.showPopup = true;
        if (
          this.currentCharacter &&
          this.characters &&
          this.characters.length
        ) {
          let filterGuid = this.currentCharacter;
          this.currentChar = _.chain(this.characters)
            .filter(function (x) {
              return x.guid === filterGuid;
            })
            .first()
            .value();
        }
      }
    },
    currentCharacter (newGuid, oldGuid) {
      if (newGuid !== '' && this.$store.state.account.characters.length) {
        let currentChar = _.chain(this.$store.state.account.characters)
          .filter(function (x) {
            return x.guid === newGuid;
          })
          .first()
          .value();
        if (currentChar) {
          this.currentChar = currentChar;
        } else {
          this.currentChar = { name: '', guid: '' };
        }
      } else {
        this.currentChar = { name: '', guid: '' };
      }
    },
    characters (newArr, oldArr) {
      if (this.$store.state.account.currentCharacter !== '' && newArr.length) {
        let filterGuid = this.$store.state.account.currentCharacter;
        let currentChar = _.chain(newArr)
          .filter(function (x) {
            return x.guid === filterGuid;
          })
          .first()
          .value();
        if (currentChar) {
          this.currentCharName = currentChar;
        }
      } else {
        this.currentCharName = { name: '', guid: '' };
      }
    }
  },
  data () {
    return {
      tcAlliance: '',
      tcName: '',
      currentChar: { name: '', guid: '' },
      showReportNotImplemented: false,
      showMore: false,
      metals: null,
      showPopup: false,
      panel: [false, false, false]
    };
  },
  props: [
    'id',
    'name',
    'nickName',
    'fullName',
    'slug',
    'type',
    'tier',
    'databanks',
    'altitude',
    'creator',
    'creatorWorkshopUrl',
    'surveyCreatedBy',
    'surveyUpdatedBy',
    'respawners',
    'dangerous',
    'turrets',
    'spikes',
    'nonGrappleWalls',
    'workshopUrl',
    'trees',
    'pveMetals',
    'pvpMetals',
    'imageIcon',
    'imageIconBig',
    'imagePopup',
    'imageMedium',
    'imageLarge',
    'imageOriginal',
    'createdAt',
    'updatedAt',
    'latLng',
    'tc'
  ]
};
</script>

<style lang="scss">
@import '~sass-easing/_easings';
.island-popup {
  display: block;
  &-toolbar {
    padding: 0;
    margin: 0;
    padding-top: 10px;
  }
  &-image {
    width: 100%;
    position: relative;
    margin: 0;
    padding: 0;
    img {
      margin: 0;
      padding: 0;
      display: block;
      width: 100%;
      height: auto;
    }
  }
  .island-name {
    display: flex;
    flex-direction: column;

    .tc-alliance {
      padding: 0.5rem;
      background-color: darkred;
      display: flex;
      flex-direction: column;
      width: 100%;
      font-size: 1rem;
      cursor: pointer;
      &:hover {
        background-color: red;
      }
      strong {
        font-size: 1.4rem;
        font-weight: 600;
      }
    }
  }
  .island-popup-button.theme--dark.v-btn {
    margin: 0;
    padding: 5px;
    &.v-btn:not(.v-btn--disabled):not(.v-btn--floating):not(.v-btn--icon)
      .v-btn__content
      .v-icon {
      padding-right: 10px;
    }
  }
  &-copy-paste {
    position: absolute;
    bottom: 0;
    left: 0;
    .v-btn {
      padding: 0;
      margin: 0;
      &:before {
        display: block;
        opacity: 1;
        border-radius: 0 !important;
        border-top-right-radius: 10px !important;
        background-color: rgba(0, 0, 0, 0.3) !important;
      }
      .v-ripple__container {
        border-radius: 0 !important;
        border-top-right-radius: 10px !important;
        background-color: rgba(0, 0, 0, 0.3) !important;
        .v-ripple__animation {
          border-radius: 0 !important;
          border-top-right-radius: 10px !important;
        }
      }
    }
  }
  &-report-btn {
    margin: 0 !important;
    padding: 5px !important;
    background-color: rgba(darkgreen, 0.6);
    text-transform: initial !important;
    font-size: 1rem;
    line-height: 1rem;
    min-height: auto !important;
    height: auto !important;
    .v-icon {
      line-height: 1rem;
      font-size: 1rem;
      margin-right: 10px;
    }
    .v-btn__content {
      text-transform: initial !important;
    }
  }
  .island-link {
    position: absolute;
    top: 4px;
    right: 25px;
    font-size: 12px;
  }
  .island-data-table {
    border-collapse: collapse;

    .materials-info-title {
      font-size: 1rem;
    }
    tr {
      td,
      th {
        width: 50%;

        &.island-popup-image {
          background: #3a312b;
          border: 1px #ffe5c4 inset;
          border-top: none;

          img {
            margin: 4px;
            width: calc(100% - 8px);
          }
        }
      }
      th {
        width: 100%;
      }
      &.name {
        th {
          line-height: 22px;
          text-align: center;
          border: 1px #ffe5c4 inset;
          border-bottom: none;
          background: #3a312b;
          padding-top: 2px;
          font-size: 12px;
        }
        a {
          text-decoration: none;
          color: #e0b084;

          &:hover {
            text-decoration: underline;
          }

          &.island-name {
            img {
              height: 20px;
              width: 20px;
              top: 3px;
            }
          }

          &.creator-name {
            img {
              height: 17px;
              width: 17px;
              top: 4px;
            }
          }

          img {
            position: relative;
          }
        }
        .nickname {
          font-size: 18px;
        }
      }

      .island-info-table {
        background: #3a312b;
        border-collapse: collapse;
        line-height: 20px;
        width: 100%;
        color: #ffe5c4;
        font-size: 16px;

        tr:first-child td {
          padding-top: 5px;
        }

        tr:last-child td {
          padding-bottom: 5px;
        }

        td:first-child {
          text-align: right;
          padding-right: 10px;
        }
        td:last-child {
          padding-left: 10px;
          color: #e89020;
        }
      }

      .table-divider {
        background: #e0b084;
        height: 2px;
        margin: 3px 0 4px 0;
      }

      &.expansion-panels {
        .v-expansion-panel {
          .v-expansion-panel__header {
            background-color: #e0b084;
            color: #232323;
            font-size: 14px;
            padding: 0 24px;
            min-height: 30px;

            .v-expansion-panel__header__icon .material-icons.v-icon {
              color: #232323;
            }
          }
          .v-expansion-panel__body {
            background: transparent;
          }
          .v-expansion-panel__body .v-card {
            background: #3a312b;
            color: #ffe5c4;
            font-size: 16px;
          }

          .island-extras-table {
            font-size: 12px;
            border-collapse: collapse;
            width: 100%;

            td:first-child {
              text-align: right;
              padding-right: 5px;
            }

            td:last-child {
              text-align: left;
              padding-left: 5px;
            }

            // div.table-divider {
            //   width: 80%;
            //   margin: auto;
            // }

            td:first-child:last-child {
              text-align: center;
              padding: 0;
            }
          }

          .island-materials-table {
            width: 50%;
            font-size: 12px;
            line-height: 20px;
            float: left;
            text-align: center;

            &:last-child {
              float: right;
            }

            th {
              font-size: 16px;
              text-align: center;
            }
            td {
              text-align: center;
            }
            td:first-child:not(:last-child) {
              text-align: right;
              padding-right: 5px;
            }
            td:last-child:not(:first-child) {
              text-align: left;
              padding-left: 10px;
              color: #e89020;
            }
          }

          div.island-materials-table {
            font-size: 16px;
            color: #fd5050;
          }
        }
        .v-expansion-panel__container {
          background: #3a312b;
        }
      }

      .v-input.v-input--checkbox {
        height: 24px !important;
      }

      .v-input--selection-controls {
        margin-top: 0px !important;
        padding-top: 0 !important;
      }
    }
  }
}
</style>
