<template>
    <div class="island-popup">
        <table class="island-data-table" :id="name">
            <tr>
                <th colspan="2">
                    {{ name }}
                </th>
            </tr>
            <tr class="image-row">
                <td colspan="2">
                    <img :src="image_link" width="200px">
                </td>
            </tr>
            <tr>
                <td>Altitude</td>
                <td>{{ altitude }}</td>
            </tr>
            <tr>
                <td>Databanks</td>
                <td>{{ databanks }}</td>
            </tr>
            <tr>
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
