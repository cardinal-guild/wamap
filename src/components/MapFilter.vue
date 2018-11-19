<template>
  <div id="map-filter">
    <input type="checkbox" id="map-filter-checkbox" @change="toggleFilterMarker">
    <label for="map-filter-checkbox" title="Open Filter Menu">
      <FilterIcon />
    </label>
    <div id="filters">
      <h3>Map Filters</h3>
      <h4>Metal</h4>
      <div id="metal-filters" class="type-filter">
        <div v-for="n in numOfFilters" :key="n" :id="'filter_' + n" class="metal-filter">
          <select :id="'metal-select_'+n" class="metal-select">
            <option value="" selected></option>
            <option v-for="metal in metals" :key="metal" :value="metal">{{ metal }}</option>
          </select>
          <select :id="'quality-select_'+n" class="quality-select">
            <option value="" selected></option>
            <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
          </select>
          <button class="add-filter" :id="'add-filter_' + n" @click="numOfFilters++" />
          <label :for="'add-filter_' + n" title="Add a new filter">
            <AddIcon class="add-icon"/>
          </label>
        </div>
      </div>
      <h4>Wood</h4>
      <div id="wood-filters" class="type-filter">
        <div v-for="n in numOfFiltersW" :key="n" :id="'wood-filter_'+n" class="wood-filter">
          <select :id="'wood-select_'+n" class="wood-select">
            <option value="" selected></option>
            <option v-for="wood in woods" :key="wood" :value="wood">{{ wood }}</option>
          </select>
          <button class="add-filter" :id="'add-filter-wood_' + n" @click="numOfFiltersW++" />
          <label :for="'add-filter-wood_' + n" title="Add a new filter">
            <AddIcon class="add-icon"/>
          </label>
        </div>
      </div>
      <div id="noIslandFound">
        No islands found!
      </div>
      <div class="buttonCtn">
        <button class="filter-button" @click="applyFilters">Apply</button>
        <button class="filter-button" @click="clearFilters">Clear</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import L from "leaflet";
import { LMarker } from "vue2-leaflet";

import FilterIcon from "../../public/assets/filter.svg";
import AddIcon from "../../public/assets/add-icon.svg";
import $ from "jquery";
export default {
  name: "MapFilter",
  props: ["map"],
  components: {
    FilterIcon,
    AddIcon,
    LMarker,
  },
  methods: {
    toggleFilterMarker: function(e) {
      if (e.srcElement.checked) {
        $("#map-filter").css("width", "216px");
      }
      else {
        $("#map-filter").css("width", "30px");
      }
    },
    applyFilters: function() {
      let filters = [];
      let filterSearch = "https://surveyor.cardinalguild.com/api/search.json?";
      for (var i = 1; i <= this.numOfFilters; i++) {
        if (!$("#metal-select_"+i).val() || !$("#quality-select_"+i).val()) continue; //if filter is not filled out
        filters.push(axios.get(filterSearch + "metal=" + $("#metal-select_"+i).val() + "&quality=" + $("#quality-select_"+i).val()))
      }

      for (var j = 1; j <= this.numOfFiltersW; j++) {
        if (!$("#wood-select_"+j).val()) continue;
        filters.push(axios.get(filterSearch + "tree=" + $("#wood-select_"+j).val()));
      }

      axios.all(filters).then((res) => {
        if (res.length < 1) return;
        let intersection = res[0].data;
        for (var i = 1; i < res.length; i++) {
          let toRemove = [];
          for (var j = 0; j < intersection.length; j++) {
            let found = false;
            for (var k = 0; k < res[i].data.length; k++) {
              if (res[i].data[k].id == intersection[j].id) found = true;
            }
            if (!found) {
              toRemove.push(j);
            }
          }
          let newInt = [];
          for (var l = 0; l < intersection.length; l++) {
            if (!toRemove.includes(l)) newInt.push(intersection[l]);
          }
          intersection = newInt;
        }
        for (i = 0; i < this.markers.length; i++) {
          this.map.removeLayer(this.markers[i]);
        }
        this.markers = [];
        if (intersection.length < 1) {
          $("#noIslandFound").css("visibility", "visible");
        }
        else {
          for (i = 0; i < intersection.length; i++) {
            let marker = new L.Marker(intersection[i].latLng);
            marker.addTo(this.map);
            this.markers.push(marker);
          }
        }
      })
    },
    clearFilters: function() {
      this.numOfFilters = 1;
      this.numOfFiltersW = 1;
      $("#metal-select_1").val("");
      $("#quality-select_1").val("");
      $("#wood-select_1").val("");
      $("#noIslandFound").css("visibility", "hidden");
      for (var i = 0; i < this.markers.length; i++) {
        this.map.removeLayer(this.markers[i]);
      }
      this.markers = [];
    },
  },
  data() {
    return {
      metals: ["Aluminium", "Titanium", "Tin", "Iron", "Steel", "Bronze", "Nickel", "Copper", "Silver", "Lead", "Gold", "Tungsten"],
      woods: ["Cedar", "Hemlock", "Chestnut", "Elm", "Birch", "Ash", "Oak", "Palm"],
      numOfFilters: 1,
      numOfFiltersW: 1,
      markers: [],
    }
  }
}
</script>
<style lang="scss" scoped>
#map-filter {
  width: 30px;
  transition: width 0.5s;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: -3;

  #map-filter-checkbox {
    position: absolute;
    top: -9999px;

    &:checked {
      ~ label[for=map-filter-checkbox] {
        path {
          fill: #ffe5c4;
        }
      }
      ~ #filters {
        left: 0;
      }
    }
  }

  label[for=map-filter-checkbox] {
    cursor: pointer;
    display: block;
    height: 30px;
    width: 30px;
    background: #4f4141;
    border-top: 5px #e0b084 solid;
    border-bottom: 5px #e0b084 solid;
    z-index: 1;

    svg {
      height: 24px;
      padding: 3px;

      path {
        fill: #e0b084;
      }
    }

    &:hover {
      path {
        fill: #ffe5c4;
      }
    }
  }

  #filters {
    width: 216px;
    background: #4f4141;
    border-top: 5px #e0b084 solid;
    border-bottom: 5px #e0b084 solid;
    position: relative;
    top: -40px;
    left: -216px;
    transition: left 0.5s;
    z-index: -2;
    color: #ffe5c4;

    h3 {
      margin: 0;
      padding: 5px;
      font-size: 20px;
      line-height: 1;
      border-bottom: 5px #e0b084 solid;
    }

    h4 {
      margin: 5px;
      margin-left: 7px;
      line-height: 1;
      font-size: 14px;
      text-align: left;
    }

    .type-filter {


      .metal-filter,
      .wood-filter {
        height: 30px;
        margin: 5px;

        select {
          float: left;
          height: 28px;
          font-size: 16px;
          margin: 1px;
          margin-right: 5px;
          background: gray;
          border: 1px #e0b084 solid;

          &:hover,
          &:focus {
            border-color: #ffe5c4;
          }
        }

        label[for^=add-filter] {
          height: 26px;
          margin: 2px;
          margin-right: 7px;
          position: absolute;
          right: 0;
          cursor: pointer;

          &:not(:last-child) {
            display: none;
          }

          svg {
            height: 100%;

            path {
              fill: #e0b084;
            }
          }

          &:hover path {
            fill: #ffe5c4;
          }
        }
        .add-filter {
          position: absolute;
          top: -9999px;
        }

        &:not(:last-child) label { //hides all but one add filter button
          display: none;
        }
      }
    }

    #noIslandFound {
      color: #ff6262;
      font-size: 16px;
      visibility: hidden;
    }

    .buttonCtn {
      width: 100%;

      .filter-button {
        background-color: rgb(224, 176, 132);
        border: none;
        border-radius: 2px;
        padding: 4px;
        margin: 4px auto;
        color: #4f4141;
        font-size: 18px;
        font-weight: bold;
      }

      button:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
