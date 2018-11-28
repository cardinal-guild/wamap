<template>
  <v-navigation-drawer right v-model="opened" :mini-variant="false" :width="320" fixed app>
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
    <v-divider></v-divider>
    <v-select class="pr-2"
      v-model="metal"
      prepend-icon="filter_list"
      :items="metalTypes"
      item-text="name"
      item-value="id"
      return-object
      label="Select metal"
      single-line
      @change="change"
    />
    <v-slider class="pr-2"
      v-model="quality"
      prepend-icon="Q"
      thumb-label
      ticks="always"
      tick-size="4"
      :min="0"
      :max="10"
      @change="change"
    />
    <div class="text-xs-center">
      <v-btn large @click="clear">Clear</v-btn>
    </div>
    <v-divider />
    <v-data-table class="filter-drawer-datatable"
      :headers="headers"
      :items="filteredIslands"
    >
      <template slot="items" slot-scope="props">
        <tr class="filter-drawer-row"
          @click="$bus.$emit('zoomToIsland', props.item.geometry.coordinates);"
        >
          <td class="filter-drawer-img">
            <img :src="props.item.properties.imageIcon">
          </td>
          <td class="filter-drawer-row-text">
            {{ props.item.properties.fullName }}
          </td>
          <td class="filter-drawer-row-text text-xs-right">
            {{ props.item.properties.creator }}
          </td>
        </tr>
      </template>
      <v-alert
        slot="no-results"
        :value="true"
        color="error"
        icon="warning"
      >No islands found!</v-alert>
    </v-data-table>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';
import _ from "lodash";
export default {
  methods: {
    closeDrawer () {
      this.$bus.$emit('closeSearchFilterDrawer');
    },
    clear () {
      this.$store.commit("clearHighlights");
      this.filteredIslands = [];
      this.metal = null;
      this.quality = 0;
    },
    change () {
      if (this.quality && this.metal) {
        let self = this;
        this.filteredIslands = _.filter(this.islandData.features, function (o) {
          let metals = _.filter(o.properties[self.$store.state.mapMode+"Metals"], { type_id: self.metal.id, quality: self.quality });
          return metals.length > 0;
        });
        let filteredCoords = this.filteredIslands.map(function (o) {
          return o.geometry.coordinates;
        })
        this.$store.commit("setHighlights", filteredCoords);
      }
    }
  },
  computed: {
    ...mapState(["islandData", "metalTypes"]),
    range: () => {
      return _.range(1,11);
    }
  },
  mounted () {
    this.$bus.$on('openFilterDrawer', e => {
      this.opened = true;
    });
    this.$bus.$on('openSearchDrawer', e => {
      this.opened = false;
    });
  },
  props: {
    searchFilterDrawer: {
      type: Boolean,
      default: false
    },
    filterDrawer: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      opened: false,
      islands: null,
      metal: null,
      quality: 0,
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
