<template>
  <div class="report-window-container">
    <v-dialog v-model="submitting" persistent width="300">
      <v-card color="primary" dark class="submit-card">
        <v-card-text>Submitting report ...
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showReportMessage" min-width="300" width="500">
      <v-card dark>
        <v-alert :value="true" :type="reportMessageType">{{ reportMessage }}</v-alert>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog"
      :disabled="submitting"
      max-width="500px"
      persistent
      dark
      class="report-window"
    >
      <v-form ref="reportForm" v-model="valid" lazy-validation>
        <v-card>
          <v-card-title class="title" primary-title>Report metals for {{fullName}}</v-card-title>

          <v-card-text>Click 'ADD METAL' to add more metal tabs here and press report when done. You can only submit metal reports for each island, once every 8 hours to prevent spamming.</v-card-text>

          <v-divider></v-divider>
          <div :key="key" v-for="(metal, key) in report.metals">
            <v-card-actions row no-wrap>
              <v-layout small row no-wrap>
                <v-flex small xs8 mr-2>
                  <v-select
                    v-model="metal.type"
                    :items="metalTypes"
                    :rules="[v => !!v || 'Metal type is required']"
                    item-text="name"
                    item-value="id"
                    required
                    label="Select metal"
                  />
                </v-flex>
                <v-flex xs4>
                  <v-select
                    v-model="metal.quality"
                    :rules="[v => !!v || 'Metal quality is required']"
                    :items="qualities"
                    required
                    label="Quality"
                  />
                </v-flex>
              </v-layout>
            </v-card-actions>
            <v-divider></v-divider>
          </div>
          <v-card-actions>
            <v-btn color="success" block @click="addMetalRow">
              <v-icon>add_circle</v-icon>Add metal
            </v-btn>
          </v-card-actions>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="secondary" flat @click="dialog = false">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              submit
              color="success"
              :disabled="!valid"
              flat
              @click="submitReport()"
            >Send Report</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState(['islandData', 'metalTypes', 'recaptchaKey'])
  },
  created () {
    for (let i = 1; i <= 10; i++) {
      this.qualities.push(i);
    }
  },
  mounted () {
    this.$bus.$on('reportInformation', (data, props) => {
      this.showReportMessage = false;
      this.reportMessage = '';
      this.dialog = true;
      this.fullName = props.fullName;
      this.report.mode = this.$store.state.mapMode === 'pve' ? 0 : 1;
      this.report.island = props.id;
      this.report.metals = [];
      this.valid = false;
    });
  },
  methods: {
    addMetalRow () {
      this.report.metals.push({ type: null, quality: null });
      this.valid = false;
    },
    async submitReport () {
      if (this.$refs.reportForm.validate()) {
        this.submitting = true;
        this.reportMessage = '';
        this.reportMessageType = 'success';
        this.showReportMessage = false;
        await this.$axios
          .$post(
            'https://surveyor.cardinalguild.com/api/report.json',
            this.report
          )
          .then(success => {
            this.dialog = false;
            this.submitting = false;
            if (success && success.message) {
              this.reportMessage = success.message;
              this.reportMessageType = 'success';
              this.showReportMessage = true;
              setTimeout(() => {
                this.dialog = false;
                this.submitting = false;
                this.showReportMessage = false;
              }, 10000).bind(this);
            }
          })
          .catch(error => {
            this.submitting = false;
            if (
              error &&
              error.response &&
              error.response.data &&
              error.response.data.message
            ) {
              this.reportMessage = error.response.data.message;
              this.reportMessageType = 'error';
              this.showReportMessage = true;
              let self = this;
              setTimeout(() => {
                self.showReportMessage = false;
              }, 10000);
            }
          });
      }
    }
  },

  data () {
    return {
      valid: false,
      dialog: false,
      submitting: false,
      reportMessage: '',
      reportMessageType: 'success',
      showReportMessage: false,
      serverMessage: '',
      id: 0,
      fullName: '',
      showAlert: false,
      metalCount: 0,
      report: {
        island: 0,
        mode: 0,
        metals: []
      },
      qualities: []
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

