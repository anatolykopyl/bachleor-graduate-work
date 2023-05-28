<script setup lang="ts">
import { ref } from 'vue'
import TraceChart from './TraceChart.vue'
import TSor from '../../../../models/sor'
import { useStore } from '@renderer/store'

const store = useStore()

const sor = ref<TSor | null>(null)
const lossThr = ref<string>()

const openFile = async (): Promise<void> => {
  const dialogConfig = {
    properties: ['openFile']
  }

  const result = await window.electron.ipcRenderer.invoke('dialog', 'showOpenDialog', dialogConfig)
  const filePath = result.filePaths[0]

  sor.value = await window.electron.ipcRenderer.invoke('openSOR', filePath) as TSor

  console.log(sor.value)
}

const saveToLibrary = (): void => {
  return
}

const updateLoss = (value: string): void => {
  if (!sor.value) {
    return
  }

  sor.value = {
    ...sor.value,
    info: {
      ...sor.value.info,
      FxdParams: {
        ...sor.value.info.FxdParams,
        lossThr: parseFloat(value)
      }
    }
  }
}
</script>

<template>
  <v-app-bar title="Главная">
    <template #append>
      <v-btn @click="store.navigate('library')">
        Библиотека файлов
      </v-btn>
    </template>
  </v-app-bar>

  <v-main>
    <TraceChart
      v-if="sor"
      :sor="sor"
    />
    
    <div class="controls">
      <div class="controls__file">
        <div v-if="sor?.info">
          Открыт файл <b>{{ sor.info.filename }}</b>
        </div>
        <v-btn 
          class="controls__file__open"
          @click="openFile"
        >
          Открыть файл
        </v-btn>
        <v-btn 
          class="controls__file__save"
          @click="saveToLibrary"
        >
          Сохранить файл в библиотеку
        </v-btn>
      </div>
      <div 
        v-if="sor"
        class="controls__settings"
      >
        <v-text-field
          v-model="sor.info.FxdParams.reflThr"
          label="Лимит отражения (дБ)"
        />
        <v-text-field
          v-model="lossThr"
          label="Лимит неотражения (дБ)"
          @update:model-value="updateLoss"
        />
      </div>
    </div>
  </v-main>
</template>

<style scoped lang="scss">
.controls {
  padding: 30px;
  display: flex;
  gap: 10px;
}

.controls__file,
.controls__settings {
  display: flex;
  flex-direction: column;
}

.controls__file {
  gap: 10px;
}

.controls__settings {
  flex-grow: 1;
}
</style>
