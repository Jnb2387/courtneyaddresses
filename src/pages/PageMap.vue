<template>
  <q-page>
    <div style="min-height: inherit" id="map"></div>
  </q-page>
</template>

<script>
import { Map, NavigationControl, Popup } from "maplibre-gl";
import "../../node_modules/maplibre-gl/dist/maplibre-gl.css";
import OriginalStyle from "../../data/original_style.json";
import userImage from "../assets/user.png";

import { mapActions, mapGetters, mapState } from "vuex";


export default {
  name: "Map",
  data() {
    return {
      map: {},
      loaded: false,
    };
  },

  mounted: function () {
    this.initMap();
  },
  computed: {
    ...mapState({
      addressesData: (state) => state.address.addressesData,
      zoomTo: (state) => state.address.zoomTo,
    }),
  },
  watch: {
    addressesData(newValue, oldValue) {
      this.map.once("idle", (_) => {
        console.log(`Updating Addresses`);
        this.setAddressesLayer();
      });
    },
    zoomTo(newCoords, oldCoords) {
      this.map.flyTo({
        center: [newCoords[0], newCoords[1]],
        zoom: 15,
        speed: 10,
      });
    },
  },
  methods: {
    initMap: function () {
      const map = (this.map = new Map({
        container: "map",
        style: OriginalStyle,
        minzoom: 1.3,
        center: [-105, 39],
        zoom: 4,
      }));

      map.addControl(new NavigationControl(), "top-right");
      map.loadImage(userImage, function (error, image) {
        if (error) throw error;
        map.addImage("address-image", image);
      });

      map.on("click", "addresses", function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var name =
          e.features[0].properties.Name +
          "<br>" +
          e.features[0].properties.Address;
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        new Popup({
          anchor: "bottom",
          offset: [0, -50],
        })
          .setLngLat(coordinates)
          .setHTML(name)
          .addTo(map);
      });

      // Change the cursor to a pointer when the mouse is over the places layer.
      map.on("mouseenter", "addresses", function () {
        map.getCanvas().style.cursor = "pointer";
      });

      // Change it back to a pointer when it leaves.
      map.on("mouseleave", "addresses", function () {
        map.getCanvas().style.cursor = "";
      });

      map.on("load", () => {
        this.loaded = true;
        map.addSource("addresses", {
          type: "geojson",
          data: this.addressesData,
        });

        map.addLayer({
          id: "addresses",
          type: "symbol",
          source: "addresses",
          layout: {
            "icon-image": "address-image",
            "icon-anchor": "bottom",
            "icon-offset": [0, 10],
            "icon-size": 0.5,
            "icon-allow-overlap": true,
          },
        });
        map.addLayer({
          id: "addresses-labels",
          type: "symbol",
          source: "addresses",
          layout: {
            "text-field": ["get", "Name"],
            "text-font": ["Noto Sans Bold Italic"],
            "text-size": ["interpolate", ["linear"], ["zoom"], 10, 10, 14, 14],
            "text-variable-anchor": ["top", "bottom", "left", "right"],
            // "text-allow-overlap": true,
            // "text-radial-offset": 0.5,
            // "text-justify": "auto",
          },
          paint: {
            "text-color": "rgba(0, 0, 0, 1)",
            "text-halo-color": "hsl(0, 0%, 100%)",
            "text-halo-width": 1.2,
          },
        });
      });
    },

    setAddressesLayer: function () {
      this.map.getSource("addresses").setData(this.addressesData);
    },
  },
};
</script>
<style>
#map {
  min-height: 100vh;
}
.maplibregl-ctrl-compass .maplibregl-ctrl-icon {
  background-image: url("../assets/compass.svg") !important;
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: 70%;
  height: 100%;
  margin: 0;
  width: 100%;
}
</style>
