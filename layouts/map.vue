<template>
  <v-app dark>
    <v-navigation-drawer
      fixed
      app
      :mini-variant="miniVariant"
      v-model="drawer"
    >
      <v-list>
        <v-list-tile
          router
          :to="item.to"
          :key="i"
          v-for="(item, i) in items"
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <v-btn icon slot="activator" @click="copyToClipboard">
          <v-icon>link</v-icon>
        </v-btn>
        <span>Copy the current zoomed in location to clipboard</span>
      </v-tooltip> 
      <v-tooltip bottom> 
        <v-btn icon slot="activator" @click="accountDrawer = !accountDrawer">
          <v-icon>account_circle</v-icon>
        </v-btn>
        <span>Create a character and checkmark locations where you been</span>
      </v-tooltip>
      <v-tooltip bottom> 
        <v-btn icon slot="activator" @click="searchDrawer = !searchDrawer">
          <v-icon>search</v-icon>
        </v-btn>
        <span>Search for an island or metals</span>
      </v-tooltip>
    </v-toolbar>
    <v-content>
        <nuxt />
    </v-content>
    <v-navigation-drawer
      temporary
      right
      v-model="searchDrawer"
      fixed
    >
      <v-list>
       <v-list-tile-title class="headline">Search</v-list-tile-title>
      </v-list>
    </v-navigation-drawer>

     <v-navigation-drawer
      temporary
      right
      v-model="accountDrawer"
      fixed
    >
      <v-list>
       <v-list-tile-title class="headline">Account</v-list-tile-title>
      </v-list>
    </v-navigation-drawer>
     <v-snackbar
      bottom right
      v-model="clipboardSnack"
      :color="clipboardSnackError ? 'error' : 'success'"
      :timeout="6000"
    >{{ clipboardSnackText }}</v-snackbar>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipboardSnack: false,
      clipboardSnackError: false,
      clipboardSnackText: 'test',
      drawer: true,
      fixed: false,
      items: [
        { icon: 'apps', title: 'Welcome', to: '/' },
        { icon: 'explore', title: 'PVE Map', to: '/pve' },
        { icon: 'explore', title: 'PVP Map', to: '/pvp' },
        { icon: 'people', title: 'Credits', to: '/credits' }
      ],
      miniVariant: true,
      searchDrawer: false,
      accountDrawer: false,
      title: 'Worlds Adrift Map'
    };
  },
  methods: {
    async copyToClipboard(e) {
      const a = document.createElement('a');
      a.href = this.$router.resolve(location).href;
      let fullUrl = a.protocol + '//' + a.host + a.pathname + a.search + a.hash;
      let qryStr =
        '?lat=' +
        this.$store.state.lat +
        '&lng=' +
        this.$store.state.lng +
        '&zoom=' +
        this.$store.state.zoomPercentage;
      fullUrl += qryStr;
      try {
        await this.$copyText(fullUrl);
        this.clipboardSnackText = 'Url copied to clipboard';
        this.clipboardSnackError = false;
        this.clipboardSnack = true;
      } catch (e) {
        this.clipboardSnackText =
          'There was an error copying the link to your clipboard';
        this.clipboardSnackError = true;
        this.clipboardSnack = true;
      }
    }
  }
};
</script>
