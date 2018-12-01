<template>
  <div class="configuration-page">
    <v-container>
      <v-layout column justify-center align-center>
        <v-card>
          <v-card-actions>
            <v-checkbox label="Show edit button in each island popup" v-model="showEdit"></v-checkbox>
          </v-card-actions>
        </v-card>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  mounted() {
    this.$store.commit('setShowMapControls', false);
    this.$store.commit('setPageTitle', this.title);
  },
  computed: {
    showEdit: {
      get() {
        return this.$store.state.showEdit;
      },
      set(value) {
        this.$store.commit('setShowEdit', value);
      }
    }
  },
  head() {
    return { title: 'Cardinal Guild - ' + this.title };
  },
  data() {
    return {
      title: 'Configuration'
    };
  }
};
</script>

