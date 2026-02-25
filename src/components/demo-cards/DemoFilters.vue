<template>
  <div class="w-full bg-white border-b border-gray-200 px-2 py-2">
    <!-- Filter Bar -->
    <div class="flex items-center gap-2">
      <!-- View Toggle -->
      <div class="flex items-center bg-gray-100 rounded-md p-0.5">
        <button
          @click="$emit('change-view', 'list')"
          class="w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:text-gray-700 transition-colors"
          :class="currentView === 'list' ? 'bg-white text-gray-900 shadow-sm' : ''"
          title="List View"
        >
          <i class="fal fa-list text-sm"></i>
        </button>
        <button
          @click="$emit('change-view', 'grid')"
          class="w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:text-gray-700 transition-colors"
          :class="currentView === 'grid' ? 'bg-white text-gray-900 shadow-sm' : ''"
          title="Grid View"
        >
          <i class="fal fa-th text-sm"></i>
        </button>
      </div>

      <!-- Sort -->
      <div class="relative">
        <select
          :value="currentSort"
          @change="$emit('change-sort', ($event.target as HTMLSelectElement).value)"
          class="appearance-none bg-white border border-gray-300 rounded-md px-2 py-1 pr-6 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="lastModified">Last Modified</option>
          <option value="title">Name A-Z</option>
          <option value="views">Most Viewed</option>
          <option value="created">Date Created</option>
          <option value="type">Demo Type</option>
        </select>
        <i class="fal fa-chevron-down absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs"></i>
      </div>

      <!-- Type Filter -->
      <select
        @change="$emit('change-demo-type', ($event.target as HTMLSelectElement).value)"
        :value="selectedDemoType"
        class="appearance-none bg-white border border-gray-300 rounded-md px-2 py-1 pr-6 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">All Types</option>
        <option value="overlay">Overlay</option>
        <option value="html_environment">HTML Environment</option>
        <option value="cloned_environment">Cloned Environment</option>
      </select>

      <!-- Clear -->
      <button
        v-if="selectedDemoType"
        @click="$emit('clear-filters')"
        class="flex items-center px-1.5 py-0.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
      >
        <i class="fal fa-times text-xs mr-0.5"></i>
        Clear
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentView: "list" | "grid";
  currentSort: string;
  selectedDemoType: string;
  filteredCount: number;
  totalCount: number;
}

interface Emits {
  (e: "change-view", view: "list" | "grid"): void;
  (e: "change-sort", sort: string): void;
  (e: "change-demo-type", type: string): void;
  (e: "clear-filters"): void;
  (e: "remove-filter", filterKey: string): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>
