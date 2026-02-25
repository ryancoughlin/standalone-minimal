<template>
  <div class="flex flex-col h-full w-full bg-default">
    <!-- Content Nav: Sidebar toggle + Tabs -->
    <div class="bg-default border-b border-default px-4 flex items-center gap-1">
      <!-- Sidebar Toggle -->
      <button
        @click="$emit('toggle-sidebar')"
        class="w-7 h-7 flex-shrink-0 flex items-center justify-center border-none bg-transparent text-default cursor-pointer rounded transition-all duration-200 hover:bg-hover hover:text-emphasis"
        :class="{ 'text-reprise-blue': showNavigationSidebar }"
        :title="showNavigationSidebar ? 'Close sidebar' : 'Open sidebar'"
      >
        <i class="fas fa-bars text-sm"></i>
      </button>

      <!-- Tab Buttons -->
      <div class="flex gap-4">
        <button
          @click="$emit('change-tab', 'overlays')"
          class="relative py-2 text-xs font-medium transition-colors"
          :class="activeTab === 'overlays' ? 'text-reprise-deep-blue' : 'text-muted hover:text-emphasis'"
        >
          Overlays
          <span
            v-if="activeTab === 'overlays'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-reprise-blue rounded-full"
          ></span>
        </button>
        <button
          @click="$emit('change-tab', 'environments')"
          class="relative py-2 text-xs font-medium transition-colors"
          :class="activeTab === 'environments' ? 'text-reprise-deep-blue' : 'text-muted hover:text-emphasis'"
        >
          Environments
          <span
            v-if="activeTab === 'environments'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-reprise-blue rounded-full"
          ></span>
        </button>
      </div>
    </div>

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
      v-if="showFilters"
      :current-sort="currentSort"
      :filtered-count="filteredCount"
      :total-count="totalCount"
      @change-sort="$emit('change-sort', $event)"
    />

    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Loading -->
      <div v-if="loading" class="p-4 space-y-2">
        <div v-for="i in 5" :key="i" class="flex items-center gap-2 py-1">
          <div class="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div class="flex-1 space-y-1">
            <div class="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div class="h-2 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="isEmpty" class="flex flex-col items-center justify-center py-8 px-4 text-center">
        <i :class="emptyIcon" class="text-4xl text-muted mb-2"></i>
        <h3 class="text-sm font-medium text-emphasis mb-1">{{ emptyTitle }}</h3>
        <p class="text-xs text-muted mb-2">{{ emptyDescription }}</p>
        <button
          v-if="emptyActionText"
          @click="$emit('empty-action')"
          class="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
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
          @play-demo-with-notes="$emit('play-demo-with-notes', $event)"
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
  pageType: "library" | "recent" | "shared" | "folder";
  demos: any[];
  activeTab: "overlays" | "environments";
  showNavigationSidebar: boolean;
  loading?: boolean;
  title?: string;
  description?: string;
  showBreadcrumbs?: boolean;
  currentFolder?: any;
  breadcrumbs?: any[];
  showFilters?: boolean;
  currentSort?: string;
  filteredCount?: number;
  totalCount?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: string;
  emptyActionText?: string;
}

interface Emits {
  (e: "change-tab", tab: "overlays" | "environments"): void;
  (e: "toggle-sidebar"): void;
  (e: "change-sort", sort: string): void;
  (e: "empty-action"): void;
  (e: "play-demo", demo: any): void;
  (e: "play-demo-with-notes", demo: any): void;
  (e: "navigate-breadcrumb", crumb: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showBreadcrumbs: false,
  currentFolder: null,
  breadcrumbs: () => [],
  showFilters: true,
  currentSort: "lastModified",
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
