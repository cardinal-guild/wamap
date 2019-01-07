<template>
  <v-navigation-drawer
    v-model="opened"
    :mini-variant="false"
    :width="320"
    class="filter-drawer"
    right
    fixed
    app
  >
    <v-toolbar flat dense>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="title">Filter by metal</v-list-tile-title>
          <v-spacer/>
        </v-list-tile>
      </v-list>
      <v-btn icon @click="opened = false">
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider/>
    <v-card>
      <v-card-actions>
        <v-layout grid-list-xs text-xs-center row wrap>
          <v-flex xs12>
            <v-select
              v-model="metal"
              :items="metalTypes"
              class="pr-2"
              prepend-icon="filter_list"
              item-text="name"
              item-value="id"
              return-object
              label="Select metal"
              single-line
              @change="change"
            />
          </v-flex>
          <v-flex xs12>
            <v-layout row no-wrap>
              <v-flex>
                <v-slider
                  v-model="quality"
                  :min="1"
                  :max="10"
                  class="pr-2"
                  thumb-label
                  label="Min. Q"
                  @change="change"
                />
              </v-flex>
              <v-flex shrink>
                <h3 class="quality-label">{{ quality }}</h3>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-btn large block small @click="clear">Clear</v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
    <v-divider/>
    <v-data-table :headers="headers" :items="filteredIslands" class="filter-drawer-datatable">
      <template slot="items" slot-scope="props">
        <tr
          class="filter-drawer-row"
          @click="$bus.$emit('zoomToIslandWithoutHighlight', props.item.geometry.coordinates);"
        >
          <td class="filter-drawer-img">
            <img :src="props.item.properties.imageIcon">
          </td>
          <td class="filter-drawer-row-text">{{ props.item.properties.fullName }}</td>
          <td class="filter-drawer-row-text text-xs-right">{{ props.item.properties.creator }}</td>
        </tr>
      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="warning">No islands found!</v-alert>
    </v-data-table>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';
export default {
  methods: {
    clear () {
      this.$store.commit('clearHighlights');
      this.filteredIslands = [];
      this.metal = null;
      this.quality = 0;
    },
    change () {
      if (this.quality && this.metal) {
        let self = this;
        this.filteredIslands = _.filter(this.islandData.features, function (o) {
          let combinedMetals = [];
          let i;
          for (i = self.quality; i <= 10; i++) {
            combinedMetals = _.union(
              combinedMetals,
              _.filter(o.properties[self.$store.state.mapMode + 'Metals'], {
                type_id: self.metal.id,
                quality: i
              })
            );
          }
          return combinedMetals.length > 0;
        });
        let filteredCoords = this.filteredIslands.map(function (o) {
          return o.geometry.coordinates;
        });
        this.$store.commit('setHighlights', filteredCoords);
      }
    }
  },
  computed: {
    ...mapState(['islandData', 'metalTypes']),
    range: () => {
      return _.range(1, 11);
    }
  },
  mounted () {
    this.$bus.$on('openSearchDrawer', e => {
      this.opened = false;
    });
    this.$bus.$on('openAccountDrawer', e => {
      this.opened = false;
    });
    this.$bus.$on('openFilterDrawer', e => {
      this.opened = true;
    });
  },
  data () {
    return {
      opened: false,
      islands: null,
      metal: null,
      quality: 1,
      filteredIslands: [],
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
.filter-drawer {
  .quality-label {
    line-height: 60px;
  }
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
