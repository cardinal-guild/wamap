<template>
  <v-navigation-drawer temporary right v-model="opened" fixed>
    <v-toolbar flat dense>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="title">Characters</v-list-tile-title>
          <v-spacer/>
        </v-list-tile>
      </v-list>
      <v-btn icon @click="closeDrawer">
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-toolbar>

    <v-divider></v-divider>
    <p>Under construction ...</p>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';
export default {
  methods: {
    closeDrawer () {
      this.opened = false;
      this.$bus.$emit('closeSearchFilterDrawer');
    }
  },
  mounted () {
    this.$bus.$on('openAccountDrawer', e => {
      this.opened = true;
    });
  },
  created () {},
  props: {
    opened: {
      type: Boolean,
      default: false
    }
  }
};
</script>