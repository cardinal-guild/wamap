<template>
  <div class="help-cardinal-guild">
    <v-dialog
      v-model="newMapDialog"
      max-width="500px"
      persistent
      dark
      class="help-cardinal-guild-window"
    >
      <v-card>
        <v-card-title class="title text-xs-center" primary-title>Update 31: The end of the world</v-card-title>
        <v-card-text>
          <p>Hey there drifters, as you might already know, Worlds Adrift is shutting down.</p>
          <p>This is the final map that was given to the Cardinal Guild. All islands are present, but missing metal Q data.</p>
          <p>Please report as many Q materials as possible, it will help improve the map for others.</p>
          <br>
          <p>We thank the entire team at Bossa making the impossible game, possible and inspiring a lot of people with the freedom of the skies!</p>
          <p>We thank the CCC for doing a great job with the latest map!</p>
          <br>
          <p>
            <strong>Keep on grappling!</strong>
          </p>
          <br>
          <small>PS Dave is god!</small>
        </v-card-text>

        <v-card-actions>
          <v-checkbox v-model="dontShowAgain" label="Don't show this message again"/>
          <v-spacer/>
          <v-btn submit color="success" flat @click="newMapDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  mounted () {
    let hideNewMap = this.$cookies.get('hide-newmap-b');
    if (typeof hideNewMap === 'undefined' || hideNewMap === null) {
      this.newMapDialog = true;
    }
  },
  computed: {
    dontShowAgain: {
      // getter
      get: function () {
        let hideNewMap = this.$cookies.get('hide-newmap-b');
        if (typeof hideNewMap === 'undefined' || hideNewMap === null) {
          return false;
        }
        return true;
      },
      // setter
      set: function (newValue) {
        this.$cookies.set('hide-newmap-b', true, {
          path: '/',
          maxAge: 60 * 60 * 24 * 31
        });
      }
    }
  },
  data () {
    return {
      newMapDialog: false
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

