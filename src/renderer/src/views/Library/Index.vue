<script setup lang="ts">
import { useStore } from "@renderer/store";
import type TSor from "src/models/sor";

const store = useStore();

const library = window.electron.store.get("library");

function open(sor: TSor): void {
  store.sor = sor;
  store.view = "home";
}

function deleteFromLib(sor: TSor): void {
  const library = window.electron.store.get("library");
  window.electron.store.set("library", library.filter((s) => s.info.filename !== sor.info.filename));
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
            <template #append>
              <v-icon
                class="library__item__close"
                @click="deleteFromLib(sor)"
              >
                mdi-close
              </v-icon>
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

.library__item__close {
  z-index: 20;
}
</style>
