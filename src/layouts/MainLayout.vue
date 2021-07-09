<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Courtney Addresses </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-list>
        <q-item-label header class="text-grey-8"> Navigation </q-item-label>
        <q-item
          v-for="link in linksList"
          :key="link.title"
          clickable
          exact
          :to="link.link"
        >
          <q-item-section v-if="link.icon" avatar>
            <q-icon :name="link.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
            <q-item-label caption>
              {{ link.caption }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
// import EssentialLink from 'src/components/delete.vue'

import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    // EssentialLink
  },
  data() {
    return {
      linksList: [
        {
          title: "Map",
          caption: "View of Map",
          icon: "map",
          link: "/",
        },
        {
          title: "Card",
          caption: "View of Cards",
          icon: "list",
          link: "/card",
        },
      ],
    };
  },
  mounted() {
    this.$store.dispatch("address/GET_ADDRESSES");
    this.$store.commit('address/SET_PLATFORM', this.$q.platform.is.desktop)
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      // essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
