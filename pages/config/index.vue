<template>
  <div class="configuration-page">
    <v-container>
      <v-layout column justify-center align-center>
        <v-card color="#4f4141">
          <v-card-actions>
            <table>
              <tr>
                <th style="align-text:center">
                  Island Popup Options
                </th>
              </tr>
              <tr>
                <v-checkbox v-model="showEdit" hide-details color="#ffe5c4" label="Show edit button" class="ma-0 pa-0"/>
              </tr>
              <tr>
                <v-checkbox v-model="showAllMetals" hide-details color="#ffe5c4" label="Show all metals" class="ma-0 pa-0"/>
              </tr>
            </table>
          </v-card-actions>
        </v-card>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  mounted () {
    this.$store.commit('setShowMapControls', false);
    this.$store.commit('setPageTitle', this.title);
  },
  computed: {
    showEdit: {
      get () {
        return this.$store.state.config.showEdit;
      },
      set (value) {
        this.$store.commit('setConfigOption', { option: 'showEdit', value: value });
      }
    },
    showAllMetals: {
      get () {
        return this.$store.state.config.showAllMetals;
      },
      set (value) {
        this.$store.commit('setConfigOption', { option: 'showAllMetals', value: value })
      }
    }
  },
  head () {
    return { title: 'Cardinal Guild - ' + this.title };
  },
  data () {
    return {
      title: 'Settings'
    };
  }
};
</script>

