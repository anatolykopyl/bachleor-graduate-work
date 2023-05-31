<template>
  <v-dialog
    v-model="show"
    width="auto"
  >
    <v-card class="card">
      <v-switch
        v-model="isReflective"
        :label="isReflective ? 'отражающее событие' : 'неотражающее событие'"
      />
      <v-text-field
        v-model="loss"
        label="Потери (дБ)"
      />
      <v-text-field
        v-model="reflection"
        label="Отражение (дБ)"
      />

      <v-card-actions class="actions">
        <v-btn
          @click="show = false"
        >
          Закрыть
        </v-btn>
        <v-btn
          @click="crop"
        >
          <v-icon>
            mdi-content-cut
          </v-icon>
        </v-btn>
        <v-btn
          @click="addEvent"
        >
          Добавить событие
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const isReflective = ref(false);
const loss = ref(.5);
const reflection = ref(2);

const props = defineProps<{
  modelValue: boolean;
  clickX: number;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
  (event: "addEvent", value: {
    x: number,
    type: "reflection" | "loss",
    loss: number,
    reflection: number,
  }): void;
  (event: "crop", value: number): void;
}>();

const show = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

function crop(): void {
  emit("crop", props.clickX);
  show.value = false;
}

function addEvent(): void {
  show.value = false;
  emit("addEvent", {
    x: props.clickX,
    type: isReflective.value ? "reflection" : "loss",
    loss: loss.value,
    reflection: reflection.value,
  });
}
</script>

<style scoped lang="scss">
.card {
  padding: 25px;
}

.actions {
  display: flex;
  justify-content: space-evenly;
}
</style>
