<template>
    <div class="island-popup" :id="name">
        <table class="island-data-table">
            <tr class="name">
                <th colspan="2">
                    {{ name }}
                </th>
            </tr>
            <tr class="image">
                <td colspan="2">
                    <img :src="image_link" width="300px">
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
                <td> {{ culture }}</td>
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
  props: [
    "name",
    "altitude",
    "creator",
    "surveyor",
    "respawners",
    "turrets",
    "pveMaterials",
    "pvpMaterials",
    "workshop_link",
    "databanks",
    "image_link",
    "culture"
  ]
};
</script>
