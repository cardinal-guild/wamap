<template>
  <div class="fullscreen-buildup text-xs-center">
    <v-container bg fill-height grid-list-md text-xs-center>
      <v-layout row wrap align-center>
        <v-flex>
          <p>
            <v-progress-circular indeterminate color="primary" aria-setsize="20"></v-progress-circular>Please wait while we hang your browser :-P
          </p>
          <p>
            <small>(building the map up first time, is CPU intensive)</small>
          </p>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState(['loading', 'overlayLoaded'])
  }
};
</script>

<style lang="scss" scoped>
.fullscreen-buildup {
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
