<template>
  <div v-if="showBreadcrumbs && breadcrumbs?.length" class="px-4 pt-2">
    <BreadcrumbNavigation
      :current-folder="currentFolder"
      :breadcrumbs="breadcrumbs"
      @navigate-breadcrumb="$emit('navigate-breadcrumb', $event)"
    />
  </div>

  <div class="flex items-center justify-between px-4 pt-3 pb-1">
    <h2 class="text-sm font-semibold text-emphasis">{{ title }}</h2>

    <div class="flex items-center gap-2 shrink-0">
      <!-- Environment type filter -->
      <div v-if="activeTab === 'environments'" class="relative">
        <select
          :value="envFilter"
          @change="$emit('change-env-filter', ($event.target as HTMLSelectElement).value)"
          class="appearance-none bg-default border border-default rounded-md px-2 py-1 pr-5 text-xs text-default transition-colors focus:outline-none focus:ring-1 focus:ring-reprise-blue focus:border-reprise-blue"
        >
          <option value="all">All Types</option>
          <option value="html">HTML</option>
          <option value="cloned">Cloned</option>
        </select>
        <i class="fal fa-chevron-down absolute right-1.5 top-1/2 -translate-y-1/2 icon-muted pointer-events-none text-[10px]"></i>
      </div>

      <!-- Sort -->
      <div v-if="showSort" class="relative">
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
  </div>
</template>

<script setup lang="ts">
import BreadcrumbNavigation from "./BreadcrumbNavigation.vue";

interface Props {
  title: string;
  activeTab?: "overlays" | "environments";
  envFilter?: "all" | "html" | "cloned";
  showBreadcrumbs?: boolean;
  currentFolder?: any;
  breadcrumbs?: any[];
  showSort?: boolean;
  currentSort?: string;
}

interface Emits {
  (e: "navigate-breadcrumb", crumb: any): void;
  (e: "change-env-filter", filter: "all" | "html" | "cloned"): void;
  (e: "change-sort", sort: string): void;
}

withDefaults(defineProps<Props>(), {
  activeTab: "overlays",
  envFilter: "all",
  showBreadcrumbs: false,
  currentFolder: null,
  breadcrumbs: () => [],
  showSort: true,
  currentSort: "lastModified",
});

defineEmits<Emits>();
</script>
