<script setup lang="ts">
import { ref, computed } from 'vue'
import TraceChart from '@renderer/components/TraceChart.vue'
import datToTrace from '@renderer/utils/datToTrace'

const filePath = ref<string>()
const traceChart = ref()

const fileName = computed(() => {
  if (!filePath.value) {
    return null
  }

  const parts = filePath.value.split('/')
  return parts[parts.length - 1]
})

const openFile = async (): Promise<void> => {
  const dialogConfig = {
    properties: ['openFile']
  }

  const result = await window.electron.ipcRenderer.invoke('dialog', 'showOpenDialog', dialogConfig)
  filePath.value = result.filePaths[0]

  const { trace, dump } = await window.electron.ipcRenderer.invoke('openSOR', filePath.value)
  console.log(trace)
  traceChart.value = datToTrace(dump)
}
</script>

<template>
  <v-app>
    <v-app-bar title="Главная" />

    <v-main>
      <TraceChart
        :trace="traceChart"
      />
      <div class="controls">
        <div class="controls__file">
          <div v-if="fileName">
            Открыт файл <b>{{ fileName }}</b>
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
