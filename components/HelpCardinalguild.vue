<template>
  <div class="help-cardinal-guild">
    <v-dialog
      max-width="500px"
      v-model="welcomeDialog"
      persistent
      dark
      class="help-cardinal-guild-window"
    >
      <v-card>
        <v-card-title
          class="title text-xs-center"
          primary-title
        >The Cardinal Guild wants your help!</v-card-title>
        <v-layout align-center justify-center>
          <img src="~assets/we_want_your_metals.png">
        </v-layout>
        <v-card-text>
          <p>To make the map better for everyone else, try to report as much metals as you can on the map.</p>
          <p>When you are on a island you know on the map (be sure which server you are on), press report metals in the island popup.</p>
        </v-card-text>

        <v-layout align-center justify-center>
          <img src="~assets/report_btn.jpg">
        </v-layout>
        <v-card-text>Togheter we can improve the data for each island, so that people can find their quality faster. Thank you very much for helping us</v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-checkbox label="Don't show this message again" v-model="dontShowAgain"></v-checkbox>
          <v-spacer></v-spacer>
          <v-btn submit color="success" flat @click="welcomeDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  mounted() {
    let hideWelcome = this.$cookies.get('hide-welcome');
    if(typeof hideWelcome === 'undefined' || hideWelcome === null) {
      this.welcomeDialog = true;
    }
  },
  computed: {
    dontShowAgain: {
      // getter
      get: function () {
        let hideWelcome = this.$cookies.get('hide-welcome');
        if(typeof hideWelcome === 'undefined' || hideWelcome === null) {
          return false;
        }
        return true
      },
      // setter
      set: function (newValue) {
        this.$cookies.set('hide-welcome', true);
      }
    } 
  },
  data() {
    return {
      welcomeDialog: false,
    };
  }
};
</script>
<style lang="scss" scoped>
.report-window {
  &-container {
    z-index: 2000;
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

