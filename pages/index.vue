<template>
  <div class="welcome-page">
    <v-container>
      <v-layout column justify-center align-center>
        <v-flex xs12 sm8 md6>
          <div class="text-xs-center">
            <img src="~/assets/logo_badge.png" alt="Cardinal guild logo" class="mb-5" />
          </div>
          <v-card >
            <v-card-text class="headline text-xs-center">Welcome to the Cardinal Guild Worlds Adrift Map</v-card-text>
            <v-card-text class="text-xs-center">
              <p>We are a group of fanatic WA gamers that try to survey and map the entire world.</p>
              <p>What we know is that trees are placed on the islands by creators, the types are defined by them.</p>
              <p>The quality of trees is decided by random quality defined by that region, so we cannot map that part.</p>
              <p>Metals on the PVE and PVP server on the otherhand, are for each islands fixed defined with a certain quality.</p>
              <p>This all said, please choose the map on which you are currently playing:</p>
            </v-card-text>
            <v-card-actions>
              <v-btn class="welcome-btn" nuxt to="/pve">
                <PVEIcon />
                <span>PVE Map (Kubo)</span>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn class="welcome-btn" nuxt to="/pvp">
                <PVPIcon />
                <span>PVE Map (Kubo)</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import PVEIcon from '~/assets/svg/pve_icon.svg';
import PVPIcon from '~/assets/svg/pvp_icon.svg';
export default {
  components: {
    PVEIcon,
    PVPIcon
  },
  mounted () {
    this.$store.commit('setShowMapControls', false);
    this.$store.dispatch('loadBoundaries');
    this.$store.dispatch('loadIslands');
    this.$store.commit('setPageTitle', 'Welcome');
  }
};
</script>

<style lang="scss">
@import '~sass-easing/_easings';

.welcome-btn {
  height: auto;
  transition: background-color $easeOutExpo 0.6s;
  background-color: #e0af84 !important;
  .v-btn__content {
    display: flex;
    flex-direction: column;
    color: black;
    svg {
      transition: fill $easeOutExpo 0.6s;
      width: auto;
      height: 80px;
      display: block;
      fill: black;
    }
  }
  &:hover {
  background-color: #463939 !important;
    .v-btn__content {
      color: white;
      svg {
        fill: white;
      }
    }
  }
}
</style>

