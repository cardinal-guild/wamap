<template>
    <div class="fullscreen-loader text-xs-center" v-if="loading || boundariesLoading || islandsLoading">
        <v-container bg fill-height grid-list-md text-xs-center>
        <v-layout row wrap align-center>
          <v-flex>
             <v-progress-circular
            indeterminate
            color="primary"
            aria-setsize="20"
        ></v-progress-circular>
        Loading map data ... 
          </v-flex>
        </v-layout> 
      </v-container>
    </div>
</template>

<script>
export default {
  computed: {
    loading () {
      return this.$store.state.loading;
    },
    boundariesLoading () {
      return this.$store.state.boundariesLoading;
    },
    islandsLoading () {
      return this.$store.state.islandsLoading;
    }
  }
};
</script>

<style lang="scss" scoped>
.fullscreen-loader {
  background-color: rgba(255, 255, 255, 0.9);
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  font-size: 1.2rem;
  .v-progress-circular {
    margin-right: 20px;
  }
}
</style>
