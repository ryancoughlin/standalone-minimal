<template>
  <div class="w-full bg-default border-b border-default px-4 py-4">
    <div class="flex items-center gap-2">
      <!-- Sort -->
      <div class="relative">
        <select
          :value="currentSort"
          @change="$emit('change-sort', ($event.target as HTMLSelectElement).value)"
          class="appearance-none bg-default border border-default rounded-md px-2 py-1 pr-6 text-xs text-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-primary"
        >
          <option value="lastModified">Last Modified</option>
          <option value="title">Name A-Z</option>
          <option value="views">Most Viewed</option>
          <option value="created">Date Created</option>
          <option value="type">Demo Type</option>
        </select>
        <i class="fal fa-chevron-down absolute right-1 top-1/2 -translate-y-1/2 icon-muted pointer-events-none text-xs"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentSort: string;
  filteredCount: number;
  totalCount: number;
}

interface Emits {
  (e: "change-sort", sort: string): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>
