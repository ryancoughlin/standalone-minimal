<template>
  <div class="demo-filters-container">
    <!-- Filter Bar -->
    <div class="filter-bar">
      <!-- View Toggle -->
      <div class="view-toggle">
        <button
          @click="$emit('change-view', 'list')"
          class="view-btn"
          :class="{ active: currentView === 'list' }"
          title="List View"
        >
          <i class="fal fa-list text-sm"></i>
        </button>
        <button
          @click="$emit('change-view', 'grid')"
          class="view-btn"
          :class="{ active: currentView === 'grid' }"
          title="Grid View"
        >
          <i class="fal fa-th text-sm"></i>
        </button>
      </div>

      <!-- Sort Dropdown -->
      <div class="sort-dropdown">
        <select
          :value="currentSort"
          @change="
            $emit('change-sort', ($event.target as HTMLSelectElement).value)
          "
          class="sort-select"
        >
          <option value="lastModified">Last Modified</option>
          <option value="title">Name A-Z</option>
          <option value="views">Most Viewed</option>
          <option value="created">Date Created</option>
          <option value="type">Demo Type</option>
        </select>
        <i class="fal fa-chevron-down sort-icon"></i>
      </div>

      <!-- Demo Type Filter -->
      <div class="demo-type-filter">
        <select
          @change="
            $emit(
              'change-demo-type',
              ($event.target as HTMLSelectElement).value
            )
          "
          class="demo-type-select"
          :value="selectedDemoType"
        >
          <option value="">All Types</option>
          <option value="replicate">Replicate</option>
          <option value="replay">Replay</option>
          <option value="reveal">Reveal</option>
        </select>
      </div>

      <!-- Clear Filters -->
      <button
        v-if="hasActiveFilters"
        @click="$emit('clear-filters')"
        class="clear-filters-btn"
        title="Clear All Filters"
      >
        <i class="fal fa-times text-xs"></i>
        Clear
      </button>
    </div>

    <!-- Results Summary -->
    <div class="results-summary">
      <div v-if="hasActiveFilters" class="active-filters">
        <span class="filters-label">Filters:</span>
        <div class="filter-tags">
          <span
            v-for="filter in activeFilterTags"
            :key="filter.key"
            class="filter-tag"
          >
            {{ filter.label }}
            <button
              @click="$emit('remove-filter', filter.key)"
              class="remove-filter-btn"
            >
              <i class="fal fa-times text-xs"></i>
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

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

const props = defineProps<Props>();
defineEmits<Emits>();

const demoTypes = [
  { value: "replicate", label: "Replicate", icon: "fal fa-magic" },
  { value: "replay", label: "Replay", icon: "fal fa-play-circle" },
  { value: "reveal", label: "Reveal", icon: "fal fa-eye" },
];

const hasActiveFilters = computed(() => {
  return props.selectedDemoType !== "";
});

const activeFilterTags = computed(() => {
  const tags: Array<{ key: string; label: string }> = [];

  if (props.selectedDemoType) {
    tags.push({
      key: `type:${props.selectedDemoType}`,
      label: `${
        props.selectedDemoType.charAt(0).toUpperCase() +
        props.selectedDemoType.slice(1)
      }`,
    });
  }

  return tags;
});
</script>

<style scoped>
/* Filter Container - Compact */
.demo-filters-container {
  @apply bg-white border-b border-gray-200 px-2 py-2;
}

/* Filter Bar - Compact */
.filter-bar {
  @apply flex items-center gap-2 mb-2;
}

/* View Toggle - Compact */
.view-toggle {
  @apply flex items-center bg-gray-100 rounded-md p-0.5;
}

.view-btn {
  @apply w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:text-gray-700 transition-colors;
}

.view-btn.active {
  @apply bg-white text-gray-900 shadow-sm;
}

/* Sort Dropdown - Compact */
.sort-dropdown {
  @apply relative;
}

.sort-select {
  @apply appearance-none bg-white border border-gray-300 rounded-md px-2 py-1 pr-6 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500;
}

.sort-icon {
  @apply absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs;
}

/* Demo Type Filter - Compact */
.demo-type-filter {
  @apply relative;
}

.demo-type-select {
  @apply appearance-none bg-white border border-gray-300 rounded-md px-2 py-1 pr-6 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500;
}

/* Clear Filters - Compact */
.clear-filters-btn {
  @apply flex items-center px-1.5 py-0.5 text-xs text-gray-500 hover:text-gray-700 transition-colors;
}

/* Results Summary - Compact */
.results-summary {
  @apply flex items-center justify-between;
}

.results-count {
  @apply flex items-center gap-1;
}

.count-number {
  @apply text-xs font-semibold text-gray-900;
}

.count-label {
  @apply text-xs text-gray-500;
}

.active-filters {
  @apply flex items-center gap-1;
}

.filters-label {
  @apply text-xs text-gray-500;
}

.filter-tags {
  @apply flex items-center gap-0.5;
}

.filter-tag {
  @apply flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full;
}

.remove-filter-btn {
  @apply text-blue-500 hover:text-blue-700 transition-colors;
}
</style>
