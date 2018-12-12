<template>
  <div class="account-window-container">
    <v-dialog v-model="confirmLogoutDialog" max-width="340">
      <v-card>
        <v-card-text class="text-xs-center title">Logout on this or all devices?</v-card-text>

        <v-card-actions>
          <v-btn color="warning darken-2" block @click="confirmLogout">
            <v-icon color="white darken-2" pr-4>power_settings_new</v-icon>Logout on this device
          </v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn color="success darken-2" block @click="confirmLogoutAll">
            <v-icon color="white darken-2" pr-4>power_settings_new</v-icon>Logout on all devices
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showAccountDialog" persistent max-width="500px" dark class="account-window">
      <v-card>
        <v-card-title primary-title>
          <div>
            <div class="headline">Your account</div>
            <span class="grey--text">Keep track of visited islands on your characters</span>
          </div>
          <v-spacer/>
          <v-tooltip bottom v-if="loggedIn">
            <v-btn icon absolute top right slot="activator">
              <v-icon color="green lighten-2">wifi</v-icon>
            </v-btn>
            <span>You are connected</span>
          </v-tooltip>
          <v-tooltip bottom v-if="!loggedIn">
            <v-btn icon absolute top right slot="activator">
              <v-icon color="red darken-2">wifi_off</v-icon>
            </v-btn>
            <span>You are not connected</span>
          </v-tooltip>
        </v-card-title>
        <!-- <v-tooltip bottom v-if="!loggedIn"> -->
        <!-- <span>You are not connected</span>
        </v-tooltip>-->
        <v-card-text v-if="charactersLoading">Loading your characters ...
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
        <v-card-text
          v-if="!loggedIn && !charactersLoading"
          class="text-xs-center"
        >To use the account system, you need to login, click below to login with steam.
          <v-layout align-center justify-center pa-2>
            <a :href="API_URL+'/login/map?redirect='+encodeURI(redirectUrl)">
              <img src="~assets/login_steam.png">
            </a>
          </v-layout>
        </v-card-text>
        <AccountCharacterManager v-if="loggedIn && !charactersLoading"/>
        <v-card-actions>
          <v-btn flat @click="closeAccountWindow">Close</v-btn>
          <v-spacer/>
          <v-btn flat v-if="loggedIn" @click="confirmLogoutDialog = true">Logout</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import AccountCharacterManager from '~/components/AccountCharacterManager';
import { mapState } from 'vuex';
export default {
  components: {
    AccountCharacterManager
  },
  computed: {
    ...mapState('account', {
      showAccountDialog: 'showAccountDialog',
      loggedIn: 'loggedIn',
      charactersLoading: 'charactersLoading',
      apiToken: 'apiToken',
      characters: 'characters',
      data: 'data'
    })
  },
  mounted () {
    const a = document.createElement('a');
    a.href = this.$router.resolve(location).href;
    this.redirectUrl =
      a.protocol + '//' + a.host + a.pathname + a.search + a.hash;
  },
  methods: {
    confirmLogout () {
      this.$store.commit('account/logout');
      this.confirmLogoutDialog = false;
    },
    confirmLogoutAll () {
      this.$store.commit('account/logoutAll');
      this.confirmLogoutDialog = false;
    },
    closeAccountWindow () {
      this.$store.commit('account/setShowAddCharacter', false);
      this.$store.commit('account/showAccountDialog', false);
    }
  },
  data () {
    return {
      confirmLogoutDialog: false,
      redirectUrl: '',
      API_URL: process.env.API_URL
    };
  }
};
</script>
<style lang="scss" scoped>
.loading-characters {
  width: 100%;
  min-height: 240px;
}
.account-window {
  &-container {
    z-index: 2001;
    position: absolute;
    top: 0;
    left: 0;
  }
}
.submit-card {
  background-color: #725c5c !important;
}
.v-card__title--primary {
  background-color: #3f2f2f !important;
}
.v-alert {
  margin: 0;
}
.v-dialog__content {
  &.grey.lighten-2 {
    background-color: black;
  }
}
</style>

