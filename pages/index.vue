<template>
  <div class="wooden-background">
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
              <v-btn color="primary" nuxt to="/pve">PVE Map (Kubo)</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" nuxt to="/pvp">PVP Map (Driss)</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  mounted () {
    this.$store.dispatch('loadBoundaries');
  }
};
</script>

<style lang="stylus" scoped>
.wooden-background {
  background-image: url('~assets/wood_background.jpg');
  background-repeat: repeat;
  height: 100%;
}
</style>

