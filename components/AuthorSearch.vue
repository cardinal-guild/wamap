<template>
  <l-control position="topleft" v-show="showAuthorSearch">
    <v-toolbar dense floating>
      <v-text-field hide-details prepend-icon="search" single-line />
      <v-btn icon>
        <v-icon>my_location</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-toolbar>
  </l-control>
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: "AuthorSearch",
  computed: {
    ...mapState(['zoomPercentage', 'islandData', 'showAuthorSearch'])
  },
}
</script>
