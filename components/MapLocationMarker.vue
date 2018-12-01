<template>
  <l-marker v-if="$store.state.showMarker"
    :lat-lng="latLng"
    :icon="icon"
    :draggable="true"
  >
    <l-popup>
      Heyo
    </l-popup>
  </l-marker>
</template>
<script>
const isBrowser = typeof window !== 'undefined';

let leaflet;
if (isBrowser) {
  leaflet = require('leaflet');
}

export default {
  name: "MapLocationMarker",
  mounted () {
    this.$bus.$on('toggleMarker', e => {
      this.latLng = leaflet.latLng(this.$store.state.lat, this.$store.state.lng);
    });
    this.latLng = leaflet.latLng(this.$store.state.lat, this.$store.state.lng);
  },
  computed: {
    icon () {
      return new leaflet.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    }
  },
  data () {
    return {
      latLng: null
    }
  }
}
</script>
<style lang="scss">
.visible.v-btn .v-btn__content i.v-icon.material-icons {
  color: #14a014;
}
</style>
