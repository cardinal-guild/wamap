<template>
  <div class="account-window-container">
    <v-dialog v-model="showAccountDialog" persistent max-width="500px" dark class="account-window">
      <v-card>
        <v-card-title primary-title>
          <div>
            <div class="headline">Your account</div>
            <span class="grey--text">Keep track of visited islands on your characters</span>
          </div>
        </v-card-title>
        <v-alert :value="true" type="error">This account system is still under heavy development.</v-alert>
        <template v-if="!loggedIn">
          <v-card-text
            class="text-xs-center"
          >To use the account system, you need to login, click below to login with steam.</v-card-text>
          <v-layout align-center justify-center pa-2>
            <a :href="process.env.API_URL+'/login/map?redirect='+encodeURI(redirectUrl)">
              <img src="~assets/login_steam.png">
            </a>
          </v-layout>
          <v-card-actions>
            <v-btn flat @click="$store.commit('account/showAccountDialog', false)">Close</v-btn>
          </v-card-actions>
        </template>
        <template v-else>
          <v-card-text class="text-xs-center">You are now connected</v-card-text>
          <v-card-text class="text-xs-center">
            <strong>{{ apiToken }}</strong>
          </v-card-text>
          <v-card-actions>
            <v-btn flat @click="$store.commit('account/showAccountDialog', false)">Close</v-btn>
            <v-spacer/>
            <v-btn flat @click="$store.commit('account/logout')">Logout</v-btn>
          </v-card-actions>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState('account', {
      showAccountDialog: 'showAccountDialog',
      loggedIn: 'loggedIn',
      apiToken: 'apiToken',
      data: 'data'
    })
  },
  mounted () {
    const a = document.createElement('a');
    a.href = this.$router.resolve(location).href;
    this.redirectUrl =
      a.protocol + '//' + a.host + a.pathname + a.search + a.hash;
  },
  methods: {},
  data () {
    return {
      redirectUrl: ''
    };
  }
};
</script>
<style lang="scss" scoped>
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

