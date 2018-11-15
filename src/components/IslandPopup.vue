<template>
    <div class="island-popup" :id="name">
        <table class="island-data-table">
            <tr class="name">
                <th colspan="2">
                    <div class="island-name" v-if="workshopUrl">
                        <a target="blank" rel="nofollow,noopener" :href="workshopUrl">{{ fullName }}&nbsp;<img src="/assets/steamicon.png"></a>
                    </div>
                    <div class="island-name" v-else>
                        {{ fullName }}
                    </div>
                    <div class="creator-name" v-if="creatorWorkshopUrl">
                        by <a target="blank" rel="nofollow,noopener" :href="creatorWorkshopUrl">{{creator}}&nbsp;<img src="/assets/steamicon.png"></a>
                    </div>
                    <div class="creator-name" v-else>
                        by {{creator}}
                    </div>
                     
                </th>
            </tr>
            <tr class="image">
                <td colspan="2">
                    <img :src="imagePopup">
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
            <tr class="respawners">
                <td>Does this island have respawners?</td>
                <td>{{ respawners?'Yes':'No' }}</td>
            </tr>
            <tr class="turrets">
                <td>Does this island have turrets?</td>
                <td>{{ turrets?'Yes':'No' }}</td>
            </tr>
            <template v-if="pveMaterials && pveMaterials.length">
                <tr class="materials">
                    <td colspan="2">PVE Materials</td>
                </tr>
                <tr>
                    <td colspan="2"> {{ pveMaterials.join(", ") }}</td>
                </tr>
            </template>
            <template v-if="pvpMaterials && pvpMaterials.length">
                <tr class="materials">
                    <td colspan="2">PVP Materials:</td>
                </tr>
                <tr>
                    <td colspan="2"> {{ pvpMaterials.join(", ") }}</td>
                </tr>
            </template>
        </table>
    </div>
</template>

<script>
export default {
  name: "IslandPopup",
  filters: {
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  props: [
    "name",
    "nickName",
    "fullName",
    "slug",
    "type",
    "databanks",
    "altitude",
    "creator",
    "creatorWorkshopUrl",
    "surveyCreatedBy",
    "surveyUpdatedBy",
    "respawners",
    "dangerous",
    "turrets",
    "spikes",
    "nonGrappleWalls",
    "workshopUrl",
    "pveMaterials",
    "pvpMaterials",
    "imageIcon",
    "imageIconBig",
    "imagePopup",
    "imageMedium",
    "imageLarge",
    "imageOriginal"
  ]
};
</script>

<style lang="scss" scoped>
@import "~animate-sass/animate";
.island-data-table {
  border-collapse: collapse;
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
    }
    .island-name {
      font-size: 16px;
      margin-right: 10px;
    }
    .creator-name {
      font-size: 12px;
    }
  }
}
</style>