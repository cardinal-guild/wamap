<template>
  <div id="pvp-map-page">
    <LoadingOverlay/>
    <Map mode="pvp"/>
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
      title: 'PVP Map'
    };
  },
  components: {
    Map,
    LoadingOverlay
  }
};
</script>

<style lang="stylus" scoped>
#pvp-map-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
