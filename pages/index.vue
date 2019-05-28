<template>
  <div class="welcome-page">
    <HelpCardinalguild/>
    <v-container>
      <v-layout column justify-center align-center>
        <v-flex xs12 sm8 md6>
          <div class="text-xs-center">
            <img src="~/static/assets/logo_badge.png" alt="Cardinal guild logo" class="mb-5">
          </div>
          <v-card>
            <v-card-text
              class="headline text-xs-center"
            >Welcome to the Cardinal Guild Worlds Adrift Map</v-card-text>
            <v-card-text class="text-xs-center">
              <p>Please choose the server map you are playing on:</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn class="welcome-btn" nuxt to="/pve">
                <PVEIcon/>
                <span>PVE Map (Kubo)</span>
              </v-btn>
              <v-spacer/>
              <v-btn class="welcome-btn" nuxt to="/pvp">
                <PVPIcon/>
                <span>PVP Map (Driss)</span>
              </v-btn>
              <v-spacer/>
            </v-card-actions>
            <v-card-text>
              <p>
                <strong>Map info:</strong>
              </p>
              <p>Trees on islands are placed by creators, the quality is random defined by the region. Because of this, we do not map tree qualities, only the types placed.</p>
              <p>Metals on the PVE and PVP server are for each islands fixed defined with a certain quality, so choose the correct map.</p>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import PVEIcon from '~/assets/svg/pve_icon.svg';
import PVPIcon from '~/assets/svg/pvp_icon.svg';
import HelpCardinalguild from '~/components/HelpCardinalguild';
export default {
  components: {
    PVEIcon,
    PVPIcon,
    HelpCardinalguild
  },
  head () {
    return { title: 'Cardinal Guild - ' + this.title };
  },
  data () {
    return {
      title: 'Welcome'
    };
  },
  mounted () {
    this.$store.commit('setShowMapControls', false);
    this.$store.commit('setPageTitle', this.title);
  }
};
</script>

<style lang="scss">
@import '~sass-easing/_easings';

.welcome-btn.theme--dark.v-btn:not(.v-btn--icon):not(.v-btn--flat) {
  height: auto;
  min-height: 100px;
  transition: background-color $easeOutExpo 0.6s;
  background-color: #e0af84;
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
    background-color: #463939;
    .v-btn__content {
      color: white;
      svg {
        fill: white;
      }
    }
  }
}
</style>

