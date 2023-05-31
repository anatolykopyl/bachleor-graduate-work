<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  (event: "generate", value: {
    att: number,
    noiseScale: number
  }): void
}>();

const dialog = ref();

const att = ref(0.25);
const noiseScale = ref(2);
</script>

<template>
  <v-dialog
    v-model="dialog"
    width="auto"
  >
    <template #activator="{ props }">
      <v-btn
        color="primary"
        v-bind="props"
      >
        Сгенерировать рефлектограмму
      </v-btn>
    </template>

    <v-card class="card">
      <v-text-field
        v-model="att"
        label="Затухание (дБ/км)"
      />
      <v-text-field
        v-model="noiseScale"
        label="Масштаб шума"
      />

      <v-card-actions class="actions">
        <v-btn
          @click="dialog = false"
        >
          Закрыть
        </v-btn>

        <v-btn
          color="primary"
          @click="() => {
            dialog = false
            emit('generate', { att, noiseScale })
          }"
        >
          Сгенерировать рефлектограмму
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.card {
  padding: 25px;
}

.actions {
  display: flex;
  justify-content: space-evenly;
}
</style>
