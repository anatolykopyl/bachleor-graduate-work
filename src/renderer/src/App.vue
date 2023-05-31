<script setup lang="ts">
import Home from "./views/Home/Index.vue";
import Library from "./views/Library/Index.vue";

import { useStore } from "./store";

const store = useStore();

const views = {
  home: Home,
  library: Library,
};
</script>

<template>
  <v-app>
    <component
      :is="views[store.view]"
    />
  </v-app>
</template>
