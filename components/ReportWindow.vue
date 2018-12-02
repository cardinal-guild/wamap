<template>
  <div class="report-window-container">
    <v-dialog v-model="dialog" width="500" persistent dark class="report-window">
      <v-card>
        <v-card-title class="title" primary-title>Report metals for {{fullName}}</v-card-title>

        <v-card-text>Click add metal to add more metal tabs here and press report when done. You can only submit metal reports for each island once every 8 hours to prevent spamming.</v-card-text>

        <v-divider></v-divider>
        <div :key="key" v-for="(value, key) in metalCount">
          <v-card-actions row no-wrap>
            <v-layout small row no-wrap>
              <v-flex small xs10 mr-2>
                <v-select
                  v-validate="'required'"
                  :items="metalTypes"
                  item-text="name"
                  item-value="id"
                  return-object
                  label="Select metal"
                />
              </v-flex>
              <v-flex xs2>
                <v-select v-validate="'required'" shrink :items="qualities" label="Quality"/>
              </v-flex>
            </v-layout>
          </v-card-actions>
          <v-divider></v-divider>
        </div>
        <v-card-actions>
          <v-btn color="success" block @click="metalCount++">
            <v-icon>add_circle</v-icon>Add metal
          </v-btn>
        </v-card-actions>
        <v-divider></v-divider>
        <v-alert :value="showAlert" type="error">Not implemented yet, sorry, working on it!!!</v-alert>
        <v-card-actions>
          <v-btn color="secondary" flat @click="dialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="success" flat @click="showAlert = true">Send Report</v-btn>
        </v-card-actions>
      </v-card>
      <vue-recaptcha sitekey="recaptchaKey"/>
    </v-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import VueRecaptcha from 'vue-recaptcha';
export default {
  computed: {
    ...mapState(['islandData', 'metalTypes', 'recaptchaKey'])
  },
  components: { VueRecaptcha },
  created () {
    for (let i = 1; i <= 10; i++) {
      this.qualities.push(i);
    }
  },
  mounted () {
    this.$bus.$on('reportInformation', (data, props) => {
      this.dialog = true;
      console.log(data);
      this.fullName = props.fullName;
      this.id = props.id;
      this.metalCount = 0;
      this.showAlert = false;
    });
  },
  methods: {},

  data () {
    return {
      dialog: false,
      id: 0,
      fullName: '',
      showAlert: false,
      metalCount: 0,
      qualities: []
    };
  }
};
</script>
<style lang="scss" scoped>
.report-window {
  &-container {
    position: absolute;
    top: 0;
    left: 0;
  }
}
.v-card__title--primary {
  background-color: #3f2f2f !important;
}
.v-dialog__content {
  &.grey.lighten-2 {
    background-color: black;
  }
}
</style>

