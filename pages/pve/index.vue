<template>
  <div id="pve-map-page">
    <!-- <LoadingOverlay/>
    <Map mode="pve"/>-->
    <v-container bg fill-height grid-list-md text-xs-center>
      <v-layout row wrap align-center>
        <v-flex>
          <h1>Current map is invalid. Disabled untill region surveying is finished in update 31 ...</h1>
          <a
            href="https://www.worldsadrift.com/category/patch-notes/"
            target="_blank"
          >Read patch notes</a>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import LoadingOverlay from '~/components/LoadingOverlay';
import Map from '~/components/Map';

export default {
  mounted () {
    this.$store.commit('setShowMapControls', true);
    this.$store.commit('setPageTitle', this.title);
  },
  head () {
    return { title: 'Cardinal Guild - ' + this.title };
  },
  data () {
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
