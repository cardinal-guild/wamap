<template>
  <v-app
    dark
    class="cg-app"
  >
    <report-window />
    <account-window />
    <v-navigation-drawer
      :mini-variant="miniVariant"
      v-model="drawer"
      class="main-drawer"
      fixed
      app
    >
      <v-list>
        <v-list-tile
          router
          exact
          to="/"
          @click="drawer=false"
        >
          <v-list-tile-action>
            <v-icon>apps</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Welcome</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          router
          exact
          to="/pve"
          @click="drawer=false"
        >
          <v-list-tile-action class="svg-tile">
            <PVEIcon />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>PVE Map</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile
          router
          exact
          to="/pvp"
          @click="drawer=false"
        >
          <v-list-tile-action class="svg-tile">
            <PVPIcon />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>PVP Map</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          router
          exact
          to="/credits"
          @click="drawer=false"
        >
          <v-list-tile-action>
            <v-icon>people</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Credits</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          router
          exact
          to="/config"
          @click="drawer=false"
        >
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          router
          exact
          to="/overheat"
          @click="drawer=false"
        >
          <v-list-tile-action>
            <v-icon>whatshot</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Overheat calculator</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :dense="$store.state.showMapControls"
      fixed
      app
      color="#504141"
      class="cg-toolbar"
    >
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'" />
      </v-btn>
      <v-toolbar-title>(Staging) - Cardinal Guild - {{ $store.state.pageTitle }}</v-toolbar-title>
      <v-spacer />
      <div
        class="toolbar-charname"
        @click="$store.commit('account/showAccountDialog', true)"
      >{{ currentCharName }}</div>
      <v-tooltip bottom>
        <v-btn
          slot="activator"
          icon
          @click="$store.commit('account/showAccountDialog', true)"
        >
          <v-icon :color="loggedIn ? 'green': 'red'">account_circle</v-icon>
        </v-btn>
        <span>Create a character and checkmark locations where you been</span>
      </v-tooltip>
      <template v-if="$store.state.showMapControls">
        <v-tooltip bottom>
          <v-btn
            slot="activator"
            icon
            @click="copyToClipboard"
          >
            <CopyPasteLink />
          </v-btn>
          <span>Copy the current zoomed in location to clipboard</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn
            slot="activator"
            :class="{visible: $store.state.showMarker}"
            icon
            @click="$store.commit('toggleMarker'); $bus.$emit('toggleMarker')"
          >
            <v-icon>add_location</v-icon>
          </v-btn>
          <span>Place a marker</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn
            slot="activator"
            icon
            @click="$bus.$emit('openFilterDrawer')"
          >
            <v-icon>filter_list</v-icon>
          </v-btn>
          <span>Filter islands by materials or databanks</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn
            slot="activator"
            icon
            @click="$bus.$emit('openSearchDrawer')"
          >
            <v-icon>search</v-icon>
          </v-btn>
          <span>Search for an island</span>
        </v-tooltip>
      </template>
    </v-toolbar>
    <v-content>
      <nuxt />
    </v-content>

    <map-search-drawer />
    <map-filter-drawer />
    <!-- <account-drawer/> -->
    <v-snackbar
      v-model="showSnack"
      :color="snackColor"
      :timeout="6000"
      bottom
      right
    >{{ snackText }}</v-snackbar>
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
      loggedIn: 'loggedIn',
      currentCharacter: 'currentCharacter',
      characters: 'characters'
    })
  },
  watch: {
    currentCharacter (newGuid, oldGuid) {
      if (newGuid !== '' && this.$store.state.account.characters.length) {
        let currentChar = _.chain(this.$store.state.account.characters)
          .filter(function (x) {
            return x.guid === newGuid;
          })
          .first()
          .value();
        if (currentChar) {
          this.currentCharName = currentChar.name;
        } else {
          this.currentCharName = '';
        }
      } else {
        this.currentCharName = '';
      }
    },
    characters (newArr, oldArr) {
      if (this.$store.state.account.currentCharacter !== '' && newArr.length) {
        let filterGuid = this.$store.state.account.currentCharacter;
        let currentChar = _.chain(newArr)
          .filter(function (x) {
            return x.guid === filterGuid;
          })
          .first()
          .value();
        if (currentChar) {
          this.currentCharName = currentChar.name;
        }
      } else {
        this.currentCharName = '';
      }
    }
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
  },
  data () {
    return {
      showSnack: false,
      snackColor: 'info',
      snackText: 'test',
      drawer: false,
      fixed: false,
      currentCharName: '',
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
  .toolbar-charname {
    cursor: pointer;
    user-select: none;
  }
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

