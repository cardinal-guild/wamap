<template>
  <div>
    <no-ssr>
      <l-popup>
        <div class="island-popup">

          <table class="island-data-table">
            <tr class="name">
              <th colspan="2">
                <div class="island-title">
                  <component class="island-name" :is="workshopUrl?'a':'div'" :href="workshopUrl || ''" target="_blank" rel="nofollow,noopener">
                    <span class="nickname">{{nickName?nickName:name}}</span>
                    <span v-if="nickName" class="name">({{name}})</span>
                    <img src="/assets/steamicon.png" v-if="workshopUrl">
                  </component>
                  <span class="by-author">by</span>
                  <component class="creator-name" :is="creatorWorkshopUrl?'a':'div'" :href="creatorWorkshopUrl || ''" target="_blank" rel="nofollow,noopener">
                    <span class="username">{{creator}}&nbsp;</span>
                    <img src="/assets/steamicon.png" v-if="creatorWorkshopUrl">
                  </component>
                </div>
              </th>
            </tr>
            <tr>
              <td colspan="2" class="island-popup-image">
                <a :href="imageOriginal" target="_blank"><img :src="imagePopup" /></a>
                <div class="island-popup-copy-paste">
                  <v-tooltip bottom>
                    <v-btn icon slot="activator" @click="copyToClipboard">
                      <CopyPasteLink />
                    </v-btn>
                    <span>Copy the current island location to clipboard</span>
                  </v-tooltip>
                </div>
              </td>
            </tr>
            <tr class="altitude">
              <td>Altitude</td>
              <td>{{ altitude }}</td>
            </tr>
            <tr class="databanks">
              <td>Databanks</td>
              <td>{{ databanks }}</td>
            </tr>
            <tr class="culture">
              <td>Culture</td>
              <td> {{ type | capitalize }}</td>
            </tr>
            <tr v-if="trees && trees.length">
              <td colspan="2" class="materials-info-title"><strong>Trees:</strong></td>
            </tr>
            <tr v-if="trees && trees.length">
              <td colspan="2" class="materials-info-content">{{ trees.join(", ") }}</td>
            </tr>
            <template v-if="metals && metals.length">
              <tr>
                <td colspan="2" class="materials-info-title"><strong>{{$store.state.mapMode|upper}} Metals:</strong></td>
              </tr>
              <tr>
                <td colspan="2" class="materials-info-content">{{ metals|metalsToString }}</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="2" class="materials-info-title"><strong>No {{$store.state.mapMode|upper}} metals reported yet</strong></td>
              </tr>
            </template>
            <tr>
              <td colspan="2" class="island-popup-toolbar">
                <v-btn flat class="island-popup-report-btn">
                  <v-icon>insert_comment</v-icon>
                  <span>Report metals</span>
                </v-btn>
              </td>
            </tr>
          </table>
          <div class="more-info-block" :class="{'opened': showMore}">
            <div class="more-info-block-toggle" @click="showMore = !showMore">More Info</div>
            <div class="more-info-block-content">
              <table class="content-inner">
                <tr v-if="surveyCreatedBy">
                  <td>Survey created by:</td>
                  <td>{{surveyCreatedBy}}</td>
                </tr>
                <tr v-if="createdAt">
                  <td>Created at:</td>
                  <td>{{createdAt}}</td>
                </tr>
                <tr><td colspan="2">&nbsp;</td></tr>
                <tr v-if="surveyUpdatedBy">
                  <td>Survey updated by:</td>
                  <td>{{surveyUpdatedBy}}</td>
                </tr>
                <tr v-if="updatedAt">
                  <td>Updated at:</td>
                  <td>{{updatedAt}}</td>
                </tr>
                <tr class="island-toolbar">
                  <td colspan="2">
                    <v-btn flat target="_blank" rel="noopener,nofollow" :href="'https://surveyor.cardinalguild.com/islands/'+id+'/edit'">
                      <v-icon>create</v-icon>
                      <span>Edit</span>
                    </v-btn>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </l-popup>
    </no-ssr>
  </div>
</template>

<script>
import _ from 'lodash'
import CopyPasteLink from '~/assets/svg/copy_paste_link_icon.svg'
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
        metalNames.push(metal.name+' Q'+metal.quality);
      });
      return metalNames.join(', ');
    }
  },
  methods: {
    async copyToClipboard (e) {
      const a = document.createElement('a');
      a.href = this.$router.resolve(location).href;
      let fullUrl = a.protocol + '//' + a.host + a.pathname + a.search + a.hash + '?island=' + this.id
      try {
        await this.$copyText(fullUrl);
        this.$store.commit('setSnack', {
          text: 'Url copied to clipboard',
          color: 'success'
        });
      } catch (e) {
        this.$store.commit('setSnack', {
          text: 'There was an error copying the link to your clipboard',
          color:'error'
        });
      }
    }
  },
  mounted () {
      if(this.$store.state.mapMode === 'pvp') {
        this.metals = this.pvpMetals;
      } else {
        this.metals = this.pveMetals;
      }
  },
  data () {
    return {
      showMore: false,
      metals: null
    }
  },
  props: [
    'id',
    'name',
    'nickName',
    'fullName',
    'slug',
    'type',
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
    'latLng'
  ]
};
</script>

<style lang="scss">
@import '~sass-easing/_easings';
.island-popup {
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
        background-color: rgba(0,0,0,0.3) !important;
      }
      .v-ripple__container {

        border-radius: 0 !important;
        border-top-right-radius: 10px !important;
        background-color: rgba(0,0,0,0.3) !important;
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
    tr.name {
      th {
        line-height: 22px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
      }
      a {
        text-decoration: none;
        color: #e0b084;

        &.island-name {
          display: block;
        }

        img {
          position: relative;
          top: 2px;
        }
      }
      .by-author {
        font-size: 12px;
      }

      .island-title {
        font-size: 16px;
      }
      span.name {
        font-size: 12px;
      }
      .creator-name {
        font-size: 12px;
      }
    }
  }
  .more-info-block {
    margin-top: 10px;
    margin-bottom: 1.2rem 0;
    &-toggle {
      display: block;

      padding-left: 5px;
      font-weight: bold;
      font-size: 14px;
      text-align: left;

      color: black;
      background: #dbac82;

      cursor: pointer;

      transition: color 0.25s ease-out;
    }

    &-toggle:hover {
      color: #7c5a0b;
    }

    &-toggle::before {
      content: ' ';
      display: inline-block;

      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-left: 5px solid currentColor;
      vertical-align: middle;
      margin-right: 0.7rem;
      transform: translateY(-2px);
      transition: transform 0.2s $easeOutBack;
    }
    &-content {
      max-height: 0px;
      overflow: hidden;
      transition: max-height 0.25s $easeOutExpo;
      .content-inner {
        width: 100%;
        padding: 0.5rem 1rem;
        background: rgba(0, 0, 0, 0.2);
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        .island-toolbar {
          a {
            margin: 0;
            padding: 5px  !important;
            font-size: 1rem;
            line-height: 1rem;
            min-width: auto !important;
            min-height: auto !important;
            background-color: rgba(#D6A277, 0.5);
            text-transform: initial !important;
            height: auto;
            color: #E5CBAB;
            .v-icon {
              font-size: 1rem !important;
              margin-right: 5px;
            }
            .v-btn__content {
              margin: 0 !important;
            }
          }
          td {
            padding-top: 10px;
            padding-bottom: 10px;
          }
        }
      }
    }
    &.opened {
      .more-info-block {
        &-toggle:before {
          transform: rotate(90deg) translateX(-3px);
        }
        &-content {
          max-height: 350px;
          transition: max-height 0.25s $easeInExpo;
        }
      }

    }
  }
}
</style>
