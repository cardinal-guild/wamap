<template>
    <div id="pvp-map-page">
      <LoadingOverlay />
      <Map mode="pvp" />
    </div>
</template>
<script>
import LoadingOverlay from '~/components/LoadingOverlay';
import Map from '~/components/Map';

export default {
  mounted() {
    this.$store.commit('setShowMapControls', true);
    this.$store.commit('setPageTitle', 'Worlds Adrift PVP Map');
  },
  components: {
    Map,
    LoadingOverlay
  }
};
</script>

<style lang="stylus" scoped>
#pvp-map-page {
  background-image: url('~assets/wood_background.jpg');
  background-repeat: repeat;
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>