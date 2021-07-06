<template>
  <!-- <q-page class="flex flex-center"> -->
    <q-btn @click="getAddresses"> Get </q-btn>
    <div id="map"></div>
  <!-- </q-page> -->
</template>

<script>
import { defineComponent } from "vue";
import maplibre from "maplibre-gl";
import "../../node_modules/maplibre-gl/dist/maplibre-gl.css";
import OriginalStyle from "../../data/original_style.json";

export default {
  name: "Map",
  data() {
    return {
      map: {},
    };
  },
  mounted: function () {
    this.initMap();
  },
  methods: {
    initMap: function () {
      const mapTilerKey = "get_your_own_OpIi9ZULNHzrESv6T2vL";
      // init the map
      const map = (this.map = new maplibre.Map({
        container: "map",
        style: OriginalStyle,
        minzoom: 1.3,
        center: [-105.0073, 39.7124], // Manhattan
        zoom: 12,
      }));

      map.addControl(new maplibre.NavigationControl(), "top-right");
    },
    getAddresses: function() {
      console.log('getting');
      fetch('https://storage.cloud.google.com/courtney-addresses/courtneyaddresses_202107040908.json')
  .then(response => response.json())
  .then(data => console.log(data));
    }
  },
};

// export default defineComponent({
//   name: 'PageIndex'
// })
</script>
<style>
#map {
  min-height: 75vh;
}
.maplibregl-ctrl-compass .maplibregl-ctrl-icon {
    background-image: url("../assets/compass.svg")!important;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: 70%;
    height: 100%;
    margin: 0;
    width: 100%;
    }


</style>