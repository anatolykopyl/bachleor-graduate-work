<script setup lang="ts">
import { ref, computed, toRaw } from 'vue'
import TraceChart from './TraceChart.vue'
import TSor from '../../../../models/sor'
import { useStore } from '@renderer/store'

const store = useStore()

const sor = ref<TSor | null>(null)
const lossThr = ref<string>()
const reflThr = ref<string>()
const teoThr = ref<string>("0.2")

const showBuiltin = ref<boolean>(true)
const showNaive = ref<boolean>(false)
const showTeo = ref<boolean>(true)

const justSavedToLib = ref<boolean>(false)

const openFile = async (): Promise<void> => {
  const dialogConfig = {
    properties: ['openFile']
  }

  const result = await window.electron.ipcRenderer.invoke('dialog', 'showOpenDialog', dialogConfig)
  const filePath = result.filePaths[0]

  sor.value = await window.electron.ipcRenderer.invoke('openSOR', filePath) as TSor
  lossThr.value = String(sor.value.info.FxdParams.lossThr)
  reflThr.value = String(sor.value.info.FxdParams.reflThr)
  justSavedToLib.value = false

  console.log(sor.value)
}

const inLibrary = computed((): boolean => {
  if (!sor.value) {
    return false
  }

  if (justSavedToLib.value) {
    return true
  }

  const library = window.electron.store.get('library')
  return library.some((s) => s.info.filename === sor.value?.info.filename)
})

const saveToLibrary = (): void => {
  if (!sor.value) {
    return
  }

  justSavedToLib.value = true
  const library = window.electron.store.get('library')
  library.push(toRaw(sor.value))
  window.electron.store.set('library', library)
}

const updateLoss = (value: string): void => {
  if (!sor.value) {
    return
  }

  sor.value.info.FxdParams.lossThr = parseFloat(value)
}

const updateRefl = (value: string): void => {
  if (!sor.value) {
    return
  }

  sor.value.info.FxdParams.reflThr = parseFloat(value)
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
      :teo-thr="parseFloat(teoThr)"
      :show-builtin="showBuiltin"
      :show-naive="showNaive"
      :show-teo="showTeo"
    />
    
    <div class="controls">
      <div class="controls__file">
        <div v-if="sor?.info">
          Открыт файл 
          <b class="controls__file__filename">{{ sor.info.filename }}</b>
        </div>
        <v-btn 
          class="controls__file__open"
          @click="openFile"
        >
          Открыть файл
        </v-btn>
        <v-btn 
          v-if="!inLibrary"
          class="controls__file__save"
          @click="saveToLibrary"
        >
          Сохранить файл в библиотеку
        </v-btn>
        <v-btn
          v-else
          class="controls__file__save"
          disabled
        >
          Файл в библиотеке
        </v-btn>
      </div>
      <div 
        v-if="sor"
        class="controls__settings"
      >
        <div class="controls__settings__naive">
          <v-text-field
            v-model="reflThr"
            label="Лимит отражения (дБ)"
            @update:model-value="updateRefl"
          />
          <v-text-field
            v-model="lossThr"
            label="Лимит неотражения (дБ)"
            @update:model-value="updateLoss"
          />
        </div>
        <div class="controls__settings__teo">
          <v-text-field
            v-model="teoThr"
            label="Лимит Тигера (дБ)"
          />

          <v-checkbox
            v-model="showBuiltin"
            label="Встроенные (черный)"
          ></v-checkbox>
          <v-checkbox
            v-model="showNaive"
            label="Простые (красный & синий)"
          ></v-checkbox>
          <v-checkbox
            v-model="showTeo"
            label="TEO (зеленый)"
          ></v-checkbox>
        </div>
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
}

.controls__file {
  gap: 10px;
  width: 300px;
  flex-direction: column;
}

.controls__file__filename {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}

.controls__settings {
  flex-direction: row;
  flex-grow: 1;
  flex-wrap: wrap;
  gap: 10px;

  > * {
    flex-grow: 1;
    box-sizing: border-box;
  }
}
</style>
