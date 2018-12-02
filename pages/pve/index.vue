<template>
  <div id="pve-map-page">
    <LoadingOverlay/>
    <Map mode="pve"/>
  </div>
</template>
<script>
import LoadingOverlay from '~/components/LoadingOverlay';
import Map from '~/components/Map';

export default {
  mounted() {
    this.$store.commit('setShowMapControls', true);
    this.$store.commit('setPageTitle', this.title);
  },
  head() {
    return { title: 'Cardinal Guild - ' + this.title };
  },
  data() {
    return {
      title: 'PVE Map'
    };
  },
  components: {
    Map,
    LoadingOverlay
  }
};
</script>

<style lang="stylus" scoped>
#pve-map-page {
  position: absolute;
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
