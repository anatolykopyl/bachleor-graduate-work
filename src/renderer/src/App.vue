<script setup lang="ts">
import { ref } from 'vue'
import TraceChart from '@renderer/components/TraceChart.vue'
import TSor from 'src/models/sor'

const sor = ref<TSor>()

const openFile = async (): Promise<void> => {
  const dialogConfig = {
    properties: ['openFile']
  }

  const result = await window.electron.ipcRenderer.invoke('dialog', 'showOpenDialog', dialogConfig)
  const filePath = result.filePaths[0]

  sor.value = await window.electron.ipcRenderer.invoke('openSOR', filePath) as TSor
  console.log(sor.value)
}
</script>

<template>
  <v-app>
    <v-app-bar title="Главная" />

    <v-main>
      <TraceChart
        :sor="sor"
      />
      <div class="controls">
        <div class="controls__file">
          <div v-if="sor?.info">
            Открыт файл <b>{{ sor.info['filename'] }}</b>
          </div>
          <v-btn 
            class="controls__file__open"
            @click="openFile"
          >
            Открыть файл
          </v-btn>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped lang="scss">
.controls {
  padding: 30px;
  display: flex;
  gap: 10px;
}

.controls__file {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.controls__file__open {
  width: 150px;
}
</style>
