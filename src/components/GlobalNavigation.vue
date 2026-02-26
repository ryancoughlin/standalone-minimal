<template>
  <div
    class="sticky top-0 z-10 flex items-center gap-4 px-4 py-3 bg-default border-b border-default"
  >
    <!-- Logo -->
    <img
      src="/src/reprise-logo.png"
      alt="Reprise"
      class="h-5 shrink-0 object-contain"
    />

    <!-- Search (iteration 4) -->
    <label v-if="iteration >= 4" class="flex-1 relative min-w-0">
      <i
        class="fas fa-search absolute left-2 top-1/2 -translate-y-1/2 text-xs icon-muted"
      ></i>
      <input
        type="text"
        placeholder="Search demos..."
        class="w-full pl-7 py-1.5 text-xs border border-default rounded-md bg-reprise-off-white transition-colors focus:outline-none focus:border-reprise-blue focus:ring-1 focus:ring-reprise-blue"
        :class="searchQuery ? 'pr-7' : 'pr-3'"
        :value="searchQuery"
        @input="
          $emit('update:searchQuery', ($event.target as HTMLInputElement).value)
        "
      />
      <button
        v-if="searchQuery"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-default transition-colors"
        title="Clear search"
        @click="$emit('update:searchQuery', '')"
      >
        <i class="fas fa-times-circle"></i>
      </button>
    </label>
    <div v-else class="flex-1"></div>

    <!-- Close -->
    <button
      class="size-7 shrink-0 flex items-center justify-center rounded text-muted transition-colors hover:bg-hover hover:text-default"
      title="Close"
      @click="$emit('close')"
    >
      <i class="fas fa-times text-xs"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useIteration } from "../composables/useIteration";

const iteration = useIteration();

interface Props {
  searchQuery: string;
}

interface Emits {
  (e: "close"): void;
  (e: "update:searchQuery", value: string): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>
