<template>
  <div id="map-footer">
    <l-control v-if="!this.$store.state.adminMode" position="bottomleft" class="issue-links">
      <a href="https://github.com/fearlessjake/wamap/issues">Report an Issue</a><br>
      <!-- <a href="www.google.com">Map Data issues</a> -->
    </l-control>

    <l-control v-if="!this.$store.state.adminMode" position="bottomright"
      class="custom-watermark">
      <a href="https://cardinalguild.com">
        <img src="/assets/logo.png" width="100vw" alt="Cardinal Guild Logo">
      </a>
    </l-control>
  </div>
</template>
<script>
import { LControl } from "vue2-leaflet";

export default {
  name: "MapFooter",
  components: {
    LControl,
  },
}
</script>
