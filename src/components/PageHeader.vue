<template>
  <div v-if="showBreadcrumbs && breadcrumbs?.length" class="px-4 pt-2">
    <BreadcrumbNavigation
      :current-folder="currentFolder"
      :breadcrumbs="breadcrumbs"
      @navigate-breadcrumb="$emit('navigate-breadcrumb', $event)"
    />
  </div>

  <div class="flex items-center justify-between px-4 pt-3 pb-1">
    <div>
      <h2 class="text-sm font-semibold text-emphasis">{{ title }}</h2>
      <p v-if="description" class="text-xs text-muted mt-0.5">{{ description }}</p>
    </div>

    <!-- Sort -->
    <div v-if="showSort" class="relative shrink-0">
      <select
        :value="currentSort"
        @change="$emit('change-sort', ($event.target as HTMLSelectElement).value)"
        class="appearance-none bg-default border border-default rounded-md px-2 py-1 pr-6 text-xs text-default transition-colors focus:outline-none focus:ring-1 focus:ring-reprise-blue focus:border-reprise-blue"
      >
        <option value="lastModified">Last Modified</option>
        <option value="title">Name A-Z</option>
        <option value="views">Most Viewed</option>
        <option value="created">Date Created</option>
        <option value="type">Demo Type</option>
      </select>
      <i class="fal fa-chevron-down absolute right-1.5 top-1/2 -translate-y-1/2 icon-muted pointer-events-none text-xs"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadcrumbNavigation from "./BreadcrumbNavigation.vue";

interface Props {
  title: string;
  description?: string;
  showBreadcrumbs?: boolean;
  currentFolder?: any;
  breadcrumbs?: any[];
  showSort?: boolean;
  currentSort?: string;
}

interface Emits {
  (e: "navigate-breadcrumb", crumb: any): void;
  (e: "change-sort", sort: string): void;
}

withDefaults(defineProps<Props>(), {
  description: "",
  showBreadcrumbs: false,
  currentFolder: null,
  breadcrumbs: () => [],
  showSort: true,
  currentSort: "lastModified",
});

defineEmits<Emits>();
</script>
