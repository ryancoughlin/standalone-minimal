<template>
  <IterationPicker v-model="iteration" />
  <DemoLibrary />
</template>

<script setup lang="ts">
import { provideIteration } from "./composables/useIteration";
import IterationPicker from "./components/IterationPicker.vue";
import DemoLibrary from "./components/DemoLibrary.vue";

const iteration = provideIteration(1);
</script>
