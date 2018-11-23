<template>
    <div>
        <LoadingOverlay />
        <Map mode="pve" />
    </div>
</template>
<script>
import LoadingOverlay from '~/components/LoadingOverlay'
import Map from '~/components/Map'

export default {
  components: {
    Map,
    LoadingOverlay
  }
}
</script> 