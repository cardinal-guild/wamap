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
            <tr class="materials" v-if="pveMaterials && pveMaterials.length">
                <td>PVE Materials</td>
                <td> {{ pveMaterials.join(", ") }}</td>
            </tr>
            <tr class="materials" v-if="pveMaterials && pvpMaterials.length">
                <td>PVP Materials</td>
                <td> {{ pvpMaterials.join(", ") }}</td>
            </tr>
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
    "pveMaterials",
    "pvpMaterials",
    "workshop_link",
    "databanks",
    "image_link",
    "culture"
  ]
};
</script>
