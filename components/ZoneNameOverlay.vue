<template>
  <div v-if="islandData">
    <no-ssr>
      <l-image-overlay
        url="https://data.cardinalguild.com/zonenames.svg"
        :attribution="attribution"
        :bounds="bounds"
        :z-index="1000";
      />
    </no-ssr>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: "ZoneNameOverlay",
  computed: {
    ...mapState(['zoomLevel', 'islandData'])
  },
  data () {
    return {
      attribution: "App made by the <a href='https://discord.gg/BVwKDwy'>Cardinal Guild</a>",
      bounds: [[0, 0], [-9500, 9500]],
    }
  }
}
</script>
