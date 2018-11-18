<template>
  <div id="map-marker">
    <input type="checkbox" id="map-marker-checkbox" @change="toggleMarker">
    <label for="map-marker-checkbox" title="Place a Custom Marker">
      <MapMark />
    </label>
  </div>
</template>
<script>
import MapMark from "../../public/assets/Map_marker.svg";
import L from "leaflet";
import Clipboard from "clipboard";

export default {
  name: "MapMarker",
  props: ["map"],
  components: {
    MapMark
  },
  created() {
    // eslint-disable-next-line
    let clip = new Clipboard(".copy-button");
  },
  methods: {
    toggleMarker: function(e) {
      if (!this.marker) {
        this.marker = new L.Marker(this.map.getCenter(), { draggable: true });
        this.marker.on("dragend", function(e) {
          let url =
            location.origin +
            location.pathname +
            "?lat=" +
            e.target.getLatLng().lat +
            "&lng=" +
            e.target.getLatLng().lng +
            "&point=true";
          e.target.bindPopup(
            "<button class='copy-button' data-clipboard-text='" +
              url +
              "'>Copy to clipboard</button>"
          );
        });
      }
      if (e.srcElement.checked) {
        this.marker.addTo(this.map);
        let url =
          location.origin +
          location.pathname +
          "?lat=" +
          this.marker.getLatLng().lat +
          "&lng=" +
          this.marker.getLatLng().lng +
          "&point=true";
        this.marker.bindPopup(
          "<button class='copy-button' data-clipboard-text='" +
            url +
            "'>Copy to clipboard</button>"
        );
        //console.log(this.map.getCenter());
      } else {
        this.map.removeLayer(this.marker);
        this.marker = null;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#map-marker {
  width: 30px;
  transition: width 0.5s;

  #map-marker-checkbox {
    position: absolute;
    top: -9999px;

    &:checked {
      ~ label[for="map-marker-checkbox"] svg {
        transform: rotate(-90deg);

        path {
          fill: #ffe5c4;
        }
      }
    }
  }

  label[for="map-marker-checkbox"] {
    cursor: pointer;
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
<style lang="scss">
.copy-button {
  border: none;
  border-radius: 2px;
  background-color: rgb(224, 176, 132);
  border: none;
  border-radius: 2px;
  display: block;
  padding: 4px;
  margin: 4px auto;
  color: #4f4141;
  font-size: 18px;
  font-weight: bold;

  &:hover {
    background-color: #ffe5c4;
  }

  &:focus {
    box-shadow: 0 0 1px 1px #291a08 inset;
    background-color: #ffe5c4;
    outline: 0;
  }
}
</style>
