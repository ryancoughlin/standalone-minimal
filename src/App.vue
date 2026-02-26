<template>
  <SprintPicker v-model="sprint" />
  <DemoLibrary />
</template>

<script setup lang="ts">
import { provideSprint } from "./composables/useSprint";
import SprintPicker from "./components/SprintPicker.vue";
import DemoLibrary from "./components/DemoLibrary.vue";

const sprint = provideSprint(1);
</script>
