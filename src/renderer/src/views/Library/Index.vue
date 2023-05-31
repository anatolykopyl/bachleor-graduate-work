<script setup lang="ts">
import { useStore } from "@renderer/store";

const store = useStore();

const library = window.electron.store.get("library");

function open(sor): void {
  store.sor = sor;
  store.view = "home";
}
</script>

<template>
  <v-app-bar title="Библиотека файлов">
    <template #append>
    </template>
  </v-app-bar>

  <v-main>
    <v-list>
      <template
        v-for="(sor, index) in library"
        :key="sor.info.filename"
      >
        <v-hover
          v-slot="{ isHovering, props }"
        >
          <v-list-item
            v-bind="props"
            class="library__item"
            :class="{
              'bg-grey-darken-1': isHovering
            }"
            :title="sor.info.filename"
            lines="three"
            @click="open(sor)"
          >
            <template #subtitle>
              <div>{{ sor.info.FxdParams.date }}</div>
              <div class="library__item__lineInfo">
                <span>{{ sor.infoRaw.GenParams["cable ID"] }}</span>
                <span>{{ sor.infoRaw.GenParams["fiber ID"] }}</span>
                <span>{{ sor.info.FxdParams.wavelength }}</span>
              </div>
              <div>{{ sor.infoRaw.GenParams["comments"] }}</div>
            </template>
          </v-list-item>
        </v-hover>

        <v-divider
          v-if="index + 1 < library.length"
          :key="index"
        ></v-divider>
      </template>
    </v-list>
  </v-main>
</template>

<style scoped lang="scss">
.library__item {
  cursor: pointer;
}

.library__item__lineInfo {
  display: flex;
  gap: 8px;
}
</style>
