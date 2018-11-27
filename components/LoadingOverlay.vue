<template>
  <div class="fullscreen-loader text-xs-center" v-if="loading">
    <v-container bg fill-height grid-list-md text-xs-center>
      <v-layout row wrap align-center>
        <v-flex>
          <v-progress-circular indeterminate color="primary" aria-setsize="20"></v-progress-circular>Loading map data ...
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState(['loading'])
  }
};
</script>

<style lang="scss" scoped>
.fullscreen-loader {
  background-color: rgba(0, 0, 0, 0.9);
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  font-size: 1.2rem;
  z-index: 2000;
  pointer-events: all;
  .v-progress-circular {
    margin-right: 20px;
  }
}
</style>
