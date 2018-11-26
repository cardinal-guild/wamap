<template>
  <v-app dark>
    <v-navigation-drawer
      fixed
      app
      :mini-variant="miniVariant"
      v-model="drawer" 
    >
      <v-list>
         <v-list-tile router exact @click="drawer=false" to="/">
           <v-list-tile-action>
            <v-icon>apps</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Welcome</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile router exact @click="drawer=false" to="/pve">
          <v-list-tile-action class="svg-tile">
            <PVEIcon />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>PVE Map</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile router exact @click="drawer=false" to="/pvp">
          <v-list-tile-action class="svg-tile">
            <PVPIcon />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>PVP Map</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile router exact @click="drawer=false" to="/credits">
          <v-list-tile-action>
            <v-icon>people</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Credits</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app color="#504141" class="cg-toolbar" :dense="$store.state.showMapControls">
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-toolbar-title>Cardinal Guild - {{ $store.state.pageTitle }}</v-toolbar-title>
        <v-spacer />
      <div v-if="$store.state.showMapControls">
        <v-tooltip bottom>
          <v-btn icon slot="activator" @click="copyToClipboard">
            <CopyPasteLink />
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
          <v-btn icon slot="activator" @click="searchPopup = !searchPopup"> 
            <v-icon>search</v-icon>
          </v-btn>
          <span>Search for an island or metals</span>
        </v-tooltip>
      </div>
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
    <v-footer :fixed="fixed" app v-if="!$store.state.showMapControls">
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>

     <v-snackbar
      bottom right
      v-model="clipboardSnack"
      :color="clipboardSnackError ? 'error' : 'success'"
      :timeout="6000"
    >{{ clipboardSnackText }}</v-snackbar>
  </v-app>
</template>

<script>
import CopyPasteLink from '~/assets/svg/copy_paste_link_icon.svg';
import PVEIcon from '~/assets/svg/pve_icon.svg';
import PVPIcon from '~/assets/svg/pvp_icon.svg';
export default {
  components: {
    CopyPasteLink,
    PVEIcon,
    PVPIcon
  },
  head () {
    return { title: 'Cardinal Guild - ' + this.$store.state.pageTitle };
  },
  data () {
    return {
      clipboardSnack: false,
      clipboardSnackError: false,
      clipboardSnackText: 'test',
      drawer: false,
      fixed: false,
      items: [
        { icon: 'apps', title: 'Welcome', to: '/' },
        { icon: PVEIcon, title: 'PVE Map', to: '/pve' },
        { icon: PVPIcon, title: 'PVP Map', to: '/pvp' },
        { icon: 'people', title: 'Credits', to: '/credits' }
      ],
      miniVariant: false,
      searchDrawer: false,
      accountDrawer: false
    };
  },
  methods: {
    async copyToClipboard (e) {
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
<style lang="scss">
body,
html {
  background-image: url('/assets/wood_background.jpg');
  background-repeat: repeat;
}
.svg-tile {
  svg {
    fill: white;
    width: 24px;
    height: 24px;
  }
}
.theme--dark {
  &.application {
    background-color: transparent;
    background: none !important;
  }
  .v-navigation-drawer {
    background-color: #504141;
  }
  &.v-toolbar__content,
  &.v-btn,
  &.v-btn--icon {
    color: #ffe5c4;
  }
}
.v-btn__content {
  svg {
    width: 24px;
    height: 24px;
  }
}
.v-navigation-drawer {
  border-right: 5px #e0af84 solid;
  .v-list {
    padding: 0;
  }
}
.cg-toolbar {
  .v-toolbar__content {
    font-family: 'News Cycle', sans-serif;
    border-bottom: 5px #e0af84 solid;
    color: #ffe5c4;
  }
  .v-toolbar__content,
  .v-btn,
  .v-btn--icon {
    color: #ffe5c4;
  }
}
</style>

