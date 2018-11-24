<template>
    <div 
        class="islandMarkers" 
        v-if="islandData &&
            islandData.features &&
            islandData.features.length &&
            zoomLevel >= fromZoomlevel &&
            zoomLevel <= toZoomlevel">
        <l-marker
            v-for="island in islandData.features"
            :key="island.properties.key"
            :lat-lng="island.geometry.coordinates"
            :icon="island.icon"
            :author="island.properties.author"
            :id="island.id"
            layer-type="overlay">
        </l-marker>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState(['zoomLevel', 'islandData'])
  },
  props: {
    fromZoomlevel: {
      type: Number,
      default: 15
    },
    toZoomlevel: {
      type: Number,
      default: 80
    }
  },
  data () {
    return {};
  }
};
</script>