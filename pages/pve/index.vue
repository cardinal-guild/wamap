<template>
    <div id="pve-map-page">
        <LoadingOverlay />
        <Map mode="pve" />
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
#pve-map-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
</style>
