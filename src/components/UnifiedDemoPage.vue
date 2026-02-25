<template>
  <div class="flex flex-col h-full w-full bg-white">
    <!-- Page Header -->
    <PageHeader
      :title="pageTitle"
      :description="pageDescription"
      :show-breadcrumbs="showBreadcrumbs"
      :current-folder="currentFolder"
      :breadcrumbs="breadcrumbs"
      @navigate-breadcrumb="$emit('navigate-breadcrumb', $event)"
    />

    <!-- Filters -->
    <DemoFilters
      v-if="showFilters && pageType !== 'home'"
      :current-view="currentView"
      :current-sort="currentSort"
      :selected-demo-type="selectedDemoType"
      :filtered-count="filteredCount"
      :total-count="totalCount"
      @change-view="$emit('change-view', $event)"
      @change-sort="$emit('change-sort', $event)"
      @change-demo-type="$emit('change-demo-type', $event)"
      @clear-filters="$emit('clear-filters')"
      @remove-filter="$emit('remove-filter', $event)"
    />

    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Loading -->
      <div v-if="loading" class="p-2 space-y-2">
        <div v-for="i in 5" :key="i" class="flex items-center gap-2 py-1">
          <div class="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div class="flex-1 space-y-1">
            <div class="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div class="h-2 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="isEmpty" class="flex flex-col items-center justify-center py-8 px-2 text-center">
        <i :class="emptyIcon" class="text-4xl text-gray-300 mb-2"></i>
        <h3 class="text-sm font-medium text-gray-900 mb-1">{{ emptyTitle }}</h3>
        <p class="text-xs text-gray-500 mb-2">{{ emptyDescription }}</p>
        <button
          v-if="emptyActionText"
          @click="$emit('empty-action')"
          class="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          {{ emptyActionText }}
        </button>
      </div>

      <!-- Demo List -->
      <div v-else>
        <DemoRow
          v-for="(demo, index) in demos"
          :key="demo.id"
          :demo="demo"
          :delay="index * 30"
          :show-views="true"
          @play-demo="$emit('play-demo', $event)"
          @customize-demo="$emit('customize-demo', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PageHeader from "./PageHeader.vue";
import DemoRow from "./demo-cards/DemoRow.vue";
import DemoFilters from "./demo-cards/DemoFilters.vue";

interface Props {
  pageType: "home" | "library" | "recent" | "shared" | "folder";
  demos: any[];
  loading?: boolean;
  title?: string;
  description?: string;
  showBreadcrumbs?: boolean;
  currentFolder?: any;
  breadcrumbs?: any[];
  showFilters?: boolean;
  currentView?: "list" | "grid";
  currentSort?: string;
  selectedDemoType?: string;
  filteredCount?: number;
  totalCount?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: string;
  emptyActionText?: string;
}

interface Emits {
  (e: "change-view", view: "list" | "grid"): void;
  (e: "change-sort", sort: string): void;
  (e: "change-demo-type", type: string): void;
  (e: "clear-filters"): void;
  (e: "remove-filter", filterKey: string): void;
  (e: "empty-action"): void;
  (e: "play-demo", demo: any): void;
  (e: "customize-demo", demo: any): void;
  (e: "navigate-breadcrumb", crumb: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showBreadcrumbs: false,
  currentFolder: null,
  breadcrumbs: () => [],
  showFilters: true,
  currentView: "list",
  currentSort: "lastModified",
  selectedDemoType: "",
  filteredCount: 0,
  totalCount: 0,
  emptyTitle: "No demos found",
  emptyDescription: "Create your first demo to get started.",
  emptyIcon: "fal fa-folder",
  emptyActionText: "",
});

defineEmits<Emits>();

const pageTitle = computed(() => {
  if (props.title) return props.title;
  const titles: Record<string, string> = {
    home: "Recent Demos",
    library: "All Demos",
    recent: "Recent Demos",
    shared: "Shared with me",
    folder: props.currentFolder?.title || "Folder",
  };
  return titles[props.pageType] || "Demos";
});

const pageDescription = computed(() => {
  if (props.description) return props.description;
  return `${props.filteredCount} demos`;
});

const showBreadcrumbs = computed(() => {
  return props.showBreadcrumbs || props.pageType === "folder";
});

const isEmpty = computed(() => props.demos.length === 0);
</script>
