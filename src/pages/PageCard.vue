<template>
  <div class="q-pa-md">
    <q-table
      grid
      title="Friends & Family"
      :rows="addressesData.features"
      :columns="columns"
      row-key="Name"
      :filter="filter"
      hide-header
      :pagination="pagination"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
          clearable
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card>
            <q-card-section class="text-center">
              <q-parallax
                :src="props.row.properties.Photo"
                :height="150"
              />
              <strong>{{ props.row.properties.Name }}</strong>
              <div>{{ props.row.properties.Address }}</div>
            </q-card-section>
            <q-separator />
            <q-card-section class="flex flex-center">
              <q-btn @click="log(props.row.geometry.coordinates)" to="/" flat
                >See in Map</q-btn
              >
              <q-btn flat>Edit</q-btn>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>

  <!-- <q-page class="">
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card" v-for="address in addressesData.features" :key="address.properties.id">
        <q-card-section class="">
          <div class="text-h6">{{ address.properties.Name }}</div>
          <div class="text-subtitle2">{{ address.properties.Address }}</div>
        </q-card-section>

        <q-card-actions align="around">
          <q-btn @click="log(address.geometry.coordinates)" to="/" flat>See in Map</q-btn>
          <q-btn flat>Edit</q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page> -->
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";

export default {
  name: "Card",
  data() {
    return {
      filter: "",
      pagination: {
        rowsPerPage: 30, // current rows per page being displayed
      },
      columns: [
        {
          name: "Name",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.properties.Name,
          // format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "Address",
          label: "Address",
          field: (row) => row.properties.Address,
          sortable: true,
        },
        // { name: "carbs", label: "Carbs (g)", field: "carbs" },
      ],
    };
  },
  mounted: function () {},
  methods: {
    log: function (coords) {
      this.$store.commit("address/SET_ZOOMTO", coords);
    },
  },
  computed: {
    ...mapState({
      addressesData: (state) => state.address.addressesData,
      zoomTo: (state) => state.address.zoomTo,
    }),
  },
};
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>
