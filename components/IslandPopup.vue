<template>
  <div>
    <no-ssr>
      <l-popup>
        <div class="island-popup">
          <table class="island-data-table">
            <tr class="name">
              <th colspan="2">
                <div class="island-name" v-if="workshopUrl"><a target="blank" rel="nofollow,noopener" :href="workshopUrl">{{ name }}&nbsp;<span class="nickname" v-if="nickName">({{nickName}})&nbsp;</span><img src="/assets/steamicon.png"></a>
                  <div class="creator-name" v-if="creatorWorkshopUrl">by&nbsp;<a target="blank" rel="nofollow,noopener" :href="creatorWorkshopUrl">{{creator}}&nbsp;<img src="/assets/steamicon.png"></a>
                  </div>
                  <div class="creator-name" v-else>
                    by {{creator}}
                  </div>
                </div>
                <div class="island-name" v-else>{{ name }}&nbsp;<span class="nickname" v-if="nickName">({{nickName}})</span><br>
                  <div class="creator-name" v-if="creatorWorkshopUrl">by&nbsp;<a target="blank" rel="nofollow,noopener" :href="creatorWorkshopUrl">{{creator}}&nbsp;<img src="/assets/steamicon.png"></a>
                  </div>
                  <div class="creator-name" v-else>
                    by {{creator}}
                  </div>
                </div>
              </th>
            </tr>
            <tr class="image">
              <td colspan="2">
                <a :href="imageOriginal" target="_blank">
                  <img :src="imagePopup">
                </a>
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
              <td colspan="2" class="materials-info-title">Trees:</td>
            </tr>
            <tr v-if="trees && trees.length">
              <td colspan="2" class="materials-info-content">{{ trees.join(", ") }}</td>
            </tr>
            <tr v-if="pveMetals && pveMetals.length" class="only-pve-server default-hide">
              <td colspan="2" class="materials-info-title">PVE Metals:</td>
            </tr>
            <tr v-if="pveMetals && pveMetals.length" class="only-pve-server default-hide">
              <td colspan="2" class="materials-info-content">{{ pveMetals.join(", ") }}</td>
            </tr>
            <tr v-if="pvpMetals && pvpMetals.length" class="only-pvp-server default-hide">
              <td colspan="2" class="materials-info-title">PVP Metals:</td>
            </tr>
            <tr v-if="pvpMetals && pvpMetals.length" class="only-pvp-server default-hide">
              <td colspan="2" class="materials-info-content">{{ pvpMetals.join(", ") }}</td>
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
export default {
  name: 'IslandPopup',
  filters: {
    capitalize: function (value) {
      if (!value) return '';
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  data () {
    return {
      showMore: false
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

<style lang="scss" scoped>
@import '~sass-easing/_easings';
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
  .name {
    th {
      line-height: 22px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
    }
    a {
      text-decoration: none;
      color: #e0b084;

      img {
        position: relative;
        top: 2px;
      }
    }
    .island-name {
      font-size: 16px;
    }
    .nickname {
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
</style>
<style lang="scss">
#wamap {
  .default-hide {
    display: none;
  }

  &.pve-server:not(.pvp-server) .only-pve-server:not(.only-pvp-server) {
    display: table-row;
  }

  &.pvp-server:not(.pve-server) .only-pvp-server:not(.only-pve-server) {
    display: table-row;
  }
}
</style>
