<template>
  <div id="filter-drawer">
    <v-toolbar flat dense>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="title">Filter by metal</v-list-tile-title>
          <v-spacer/>
        </v-list-tile>
      </v-list>
      <v-btn icon @click="closeDrawer">
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-toolbar>

    <v-divider></v-divider>
    <v-text-field hide-details prepend-icon="search" single-line/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  methods: {
    closeDrawer () {
      this.$bus.$emit('closeSearchFilterDrawer');
    }
  },
  created () {
    this.$bus.$emit('closeLegend');
  },
  props: {
    searchFilterDrawer: {
      type: Boolean,
      default: false
    },
    filterDrawer: {
      type: Boolean,
      default: false
    }
  }
};
</script>