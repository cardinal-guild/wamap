<template>
  <v-navigation-drawer right v-model="opened" :mini-variant="false" :width="360" fixed app>
    <v-toolbar flat dense>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="title">Filter by metal</v-list-tile-title>
          <v-spacer/>
        </v-list-tile>
      </v-list>
      <v-btn icon @click="opened = false">
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-toolbar>

    <v-divider></v-divider>
    <v-text-field hide-details prepend-icon="search" single-line/>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';
export default {
  methods: {
    closeDrawer () {
      this.$bus.$emit('closeSearchFilterDrawer');
    }
  },
  mounted () {
    this.$bus.$on('openFilterDrawer', e => {
      this.opened = true;
    });
    this.$bus.$on('openSearchDrawer', e => {
      this.opened = false;
    });
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
  },
  data () {
    return {
      opened: false,
      islands: null
    };
  }
};
</script>