<script setup lang="ts">
import { ref, computed } from 'vue'
import TraceChart from '@renderer/components/TraceChart.vue'
import { datToTrace } from '@renderer/utils'
import sampleTraceRaw from '@renderer/assets/traces/sample1310_lowDR-trace.dat?raw'

const filePath = ref<string>('образец')
const trace = ref(datToTrace(sampleTraceRaw))

const fileName = computed(() => {
  const parts = filePath.value.split('/')
  return parts[parts.length - 1]
})

const openFile = async (): Promise<void> => {
  const dialogConfig = {
    properties: ['openFile']
  }

  const result = await window.electron.ipcRenderer.invoke('dialog', 'showOpenDialog', dialogConfig)
  filePath.value = result.filePaths[0]
  const file = await window.electron.ipcRenderer.invoke('readFile', filePath.value)
  trace.value = datToTrace(file)
}
</script>

<template>
  <v-app>
    <v-app-bar title="Главная" />

    <v-main>
      <TraceChart :trace="trace" />
      <div class="controls">
        <div class="controls__file">
          <div>
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
