<template>
  <v-navigation-drawer right v-model="opened" :mini-variant="false" :width="320" fixed app>
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


    <v-layout row wrap>
      <v-flex xs9>
        <v-select
          hide-details
          prepend-icon="filter_list"
          :items="metalTypes"
          item-text="name"
          item-value="id"
          return-object
          label="Select metal"
          single-line
        />
      </v-flex>
      <v-flex xs3>
        <v-select
          hide-details
          :items="range"
          single-line
          prepend-icon="Q"
        />
      </v-flex>
    </v-layout>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';
import _ from "lodash";
export default {
  methods: {
    closeDrawer () {
      this.$bus.$emit('closeSearchFilterDrawer');
    }
  },
  computed: {
    ...mapState(["islandData", "metalTypes"]),
    range: () => {
      return _.range(1,11);
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
