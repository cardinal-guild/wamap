<template>
  <v-app dark class="cg-app">
    <report-window/>
    <account-window/>
    <v-navigation-drawer class="main-drawer" fixed app :mini-variant="miniVariant" v-model="drawer">
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
            <PVEIcon/>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>PVE Map</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile router exact @click="drawer=false" to="/pvp">
          <v-list-tile-action class="svg-tile">
            <PVPIcon/>
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
        <v-list-tile router exact @click="drawer=false" to="/config">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app color="#504141" class="cg-toolbar" :dense="$store.state.showMapControls">
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-toolbar-title>Cardinal Guild - {{ $store.state.pageTitle }}</v-toolbar-title>
      <v-spacer/>
      <v-tooltip bottom>
        <v-btn icon slot="activator" @click="$store.commit('account/showAccountDialog', true)">
          <v-icon :color="loggedIn ? 'green': 'red'">account_circle</v-icon>
        </v-btn>
        <span>Create a character and checkmark locations where you been</span>
      </v-tooltip>
      <template v-if="$store.state.showMapControls">
        <v-tooltip bottom>
          <v-btn icon slot="activator" @click="copyToClipboard">
            <CopyPasteLink/>
          </v-btn>
          <span>Copy the current zoomed in location to clipboard</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn
            icon
            slot="activator"
            @click="$store.commit('toggleMarker'); $bus.$emit('toggleMarker')"
            :class="{visible: $store.state.showMarker}"
          >
            <v-icon>add_location</v-icon>
          </v-btn>
          <span>Place a marker</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn icon slot="activator" @click="$bus.$emit('openFilterDrawer')">
            <v-icon>filter_list</v-icon>
          </v-btn>
          <span>Filter islands by materials or databanks</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn icon slot="activator" @click="$bus.$emit('openSearchDrawer')">
            <v-icon>search</v-icon>
          </v-btn>
          <span>Search for an island</span>
        </v-tooltip>
      </template>
    </v-toolbar>
    <v-content>
      <nuxt/>
    </v-content>

    <map-search-drawer/>
    <map-filter-drawer/>
    <!-- <account-drawer/> -->
    <v-snackbar bottom right v-model="showSnack" :color="snackColor" :timeout="6000">{{ snackText }}</v-snackbar>
  </v-app>
</template>

<script>
import CopyPasteLink from '~/assets/svg/copy_paste_link_icon.svg';
import PVEIcon from '~/assets/svg/pve_icon.svg';
import PVPIcon from '~/assets/svg/pvp_icon.svg';
import MapSearchDrawer from '~/components/MapSearchDrawer';
import MapFilterDrawer from '~/components/MapFilterDrawer';
// import AccountDrawer from '~/components/AccountDrawer';
import ReportWindow from '~/components/ReportWindow';
import AccountWindow from '~/components/AccountWindow';
import { mapState } from 'vuex';
export default {
  components: {
    CopyPasteLink,
    PVEIcon,
    PVPIcon,
    MapSearchDrawer,
    MapFilterDrawer,
    // AccountDrawer,
    ReportWindow,
    AccountWindow
  },
  computed: {
    ...mapState('account', {
      loggedIn: 'loggedIn'
    })
  },
  created: function () {
    this.$store.watch(
      state => state.snackText,
      () => {
        const msg = this.$store.state.snackText;
        const color = this.$store.state.snackColor;
        if (msg !== '' && color !== '') {
          this.snackText = msg;
          this.snackColor = color;
          this.showSnack = true;
          this.$store.commit('setSnack', {
            text: '',
            color: 'info'
          });
        }
      }
    );
  },
  beforeMount () {
    let showEditCookie = this.$cookies.get('showEdit');
    if (typeof showEditCookie !== 'undefined') {
      this.$store.commit('setConfigOption', {
        option: 'showEdit',
        value: Boolean(showEditCookie)
      });
    }
    let showMetalsCookie = this.$cookies.get('showAllMetals');
    if (typeof showMetalsCookie !== 'undefined') {
      this.$store.commit('setConfigOption', {
        option: 'showAllMetals',
        value: Boolean(showMetalsCookie)
      });
    }
  },
  mounted () {
    // let showMetalsCookie = this.$cookies.get('showAllMetals');
    // if (typeof showMetalsCookie !== 'undefined') {
    //   this.$store.commit('setConfigOption', {
    //     option: 'showAllMetals',
    //     value: Boolean(showMetalsCookie)
    //   });
    // }
    this.$bus.$on('closeSearchFilterDrawer', e => {
      this.searchFilterDrawer = false;
    });
    if (
      this.$router.currentRoute &&
      this.$router.currentRoute.query &&
      this.$router.currentRoute.query.charkey
    ) {
      this.$store.commit(
        'account/setCharKey',
        this.$router.currentRoute.query.charkey
      );
      this.$store.commit('account/showAccountDialog', true);
      setTimeout(() => {
        this.$router.replace({ name: this.$router.currentRoute.name });
      }, 5000).bind(this);
    }
  },
  data () {
    return {
      showSnack: false,
      snackColor: 'info',
      snackText: 'test',
      drawer: false,
      fixed: false,
      items: [
        { icon: 'apps', title: 'Welcome', to: '/' },
        { icon: PVEIcon, title: 'PVE Map', to: '/pve' },
        { icon: PVPIcon, title: 'PVP Map', to: '/pvp' },
        { icon: 'people', title: 'Credits', to: '/credits' }
      ],
      miniVariant: false
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
        this.$store.commit('setSnack', {
          text: 'Url copied to clipboard',
          color: 'success'
        });
      } catch (e) {
        this.$store.commit('setSnack', {
          text: 'There was an error copying the link to your clipboard',
          color: 'error'
        });
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
.cg-app.theme--dark.application {
  background-color: transparent;
  background: none;
  .svg-tile {
    svg {
      fill: white;
      width: 24px;
      height: 24px;
    }
  }

  .v-navigation-drawer {
    background-color: #504141;
  }
  &.v-toolbar__content,
  &.v-btn,
  &.v-btn--icon {
    color: #ffe5c4;
  }
  .v-btn__content {
    svg {
      width: 24px;
      height: 24px;
    }
  }
  .main-drawer {
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
    .v-btn--icon,
    .v-toolbar__content svg {
      color: #ffe5c4;
      fill: #ffe5c4;
    }
  }
}
</style>

