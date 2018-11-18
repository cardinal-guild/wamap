<template>
  <div id="map-marker">
    <input type="checkbox" id="map-marker-checkbox" @change="toggleMarker">
    <label for="map-marker-checkbox">
      <MapMark />
    </label>
  </div>
</template>
<script>
import MapMark from "../../public/assets/Map_marker.svg"
import L from "leaflet";

export default {
  name: "MapMarker",
  props: ["map"],
  components: {
    MapMark,
  },
  created() {
    //this.marker = new L.Marker(this.map.getCenter())
  },
  methods: {
    toggleMarker: function(e) {
      if (!this.marker) {
        this.marker = new L.Marker(this.map.getCenter(), {draggable: true});
        this.marker.on("dragend", function(e) {
          e.target.bindPopup("<a href='" + location.origin + location.pathname + "?lat=" + e.target.getLatLng().lat + "&lng=" + e.target.getLatLng().lng + "&point=true'>Link to point</a>");
        })
      }
      if (e.srcElement.checked) {
        this.marker.addTo(this.map);
        this.marker.bindPopup("<a href='" + location.origin + location.pathname + "?lat=" + this.marker.getLatLng().lat + "&lng=" + this.marker.getLatLng().lng + "&point=true'>Link to point</a>");
        //console.log(this.map.getCenter());
      }
      else {
        this.map.removeLayer(this.marker);
        this.marker = null;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#map-marker {
  width: 30px;
  transition: width 0.5s;

  #map-marker-checkbox {
    position: absolute;
    top: -9999px;

    &:checked {
      ~ label[for=map-marker-checkbox] svg {
        transform: rotate(-90deg);

        path {
          fill: #ffe5c4;
        }
      }
    }
  }

  label[for=map-marker-checkbox] {
    display: block;
    height: 30px;
    width: 30px;
    background: #4f4141;
    border-top: 5px #e0b084 solid;
    border-bottom: 5px #e0b084 solid;

    &:hover path {
      fill: #ffe5c4;
    }

    svg {
      height: 24px;
      padding: 3px;
      transition: transform 0.5s;

      path {
        fill: #e0b084;
      }
    }
  }
}
</style>
