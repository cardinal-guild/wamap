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
  components: {
    Map,
    LoadingOverlay
  }
};
</script>

<style lang="stylus" scoped>
#pvp-map-page {
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -ms-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>