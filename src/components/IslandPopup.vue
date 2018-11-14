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
                    <img :src="image_link" width="200px">
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
    "workshop_link",
    "databanks",
    "image_link",
    "culture"
    ]
}
</script>
