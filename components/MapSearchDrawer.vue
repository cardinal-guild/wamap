<template>
  <v-navigation-drawer right v-model="opened" :mini-variant="false" :width="320" fixed app>
    <v-toolbar flat dense>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="title">Search an island</v-list-tile-title>
          <v-spacer/>
        </v-list-tile>
      </v-list>
      <v-btn icon @click="opened = false">
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-toolbar>

    <v-divider></v-divider>
    <v-list v-if="islandData && islandData.features && islandData.features.length">
      <v-list-tile>
        <v-text-field
          v-model="search"
          append-icon="search"
          placeholder="Search by creator or name"
          single-line
          hide-details
        ></v-text-field>
      </v-list-tile>
      <v-data-table
        class="search-drawer-datatable"
        :headers="headers"
        :search="search"
        :items="islandData.features"
      >
        <template slot="items" slot-scope="props">
          <tr
            class="search-drawer-row"
            @click="$bus.$emit('zoomToIsland', props.item.geometry.coordinates);"
          >
            <td class="search-drawer-img">
              <img :src="props.item.properties.imageIcon">
            </td>
            <td class="search-drawer-row-text">{{ props.item.properties.fullName }}</td>
            <td class="search-drawer-row-text text-xs-right">{{ props.item.properties.creator }}</td>
          </tr>
        </template>
        <v-alert
          slot="no-results"
          :value="true"
          color="error"
          icon="warning"
        >Your search for "{{ search }}" found no results.</v-alert>
      </v-data-table>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState(['islandData'])
  },
  mounted () {
    this.$bus.$on('openFilterDrawer', e => {
      this.opened = false;
    });
    this.$bus.$on("openAccountDrawer", e => {
      this.opened = false;
    });
     this.$bus.$on('openSearchDrawer', e => {
      this.opened = true;
    });
  },
  data () {
    return {
      opened: false,
      islands: null,
      search: '',
      headers: [
        {
          text: ' ',
          align: 'left',
          sortable: false,
          width: '40px'
        },
        {
          text: 'Name',
          align: 'left',
          value: 'properties.fullName'
        },
        {
          text: 'Creator',
          align: 'right',
          value: 'properties.creator'
        }
      ]
    };
  }
};
</script>
<style lang="scss">
.search-drawer {
  &-img {
    margin: 0 !important;
    padding: 5px !important;
    width: 40px !important;
    img {
      display: block;
      height: 40px !important;
      width: 40px !important;
    }
  }
  &-datatable {
    .theme--dark.v-table,
    .theme--dark.v-datatable .v-datatable__actions {
      background-color: transparent !important;
      background: none !important;
    }
    tr,
    th {
      margin: 0 !important;
      padding: 5px !important;
    }
  }
  &-row {
    height: 50px;
    width: 100%;
    cursor: pointer;
  }
  &-row-text {
    padding: 5px !important;
  }
}
</style>
