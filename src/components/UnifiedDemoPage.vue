<template>
  <div class="unified-demo-page">
    <!-- Page Header -->
    <PageHeader
      :title="pageTitle"
      :description="pageDescription"
      :show-breadcrumbs="showBreadcrumbs"
      :current-folder="currentFolder"
      :breadcrumbs="breadcrumbs"
      @navigate-breadcrumb="$emit('navigate-breadcrumb', $event)"
    >
      <template #actions>
        <slot name="actions"></slot>
      </template>
    </PageHeader>

    <!-- Filters (skip for home dashboard) -->
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

    <!-- Content Area -->
    <div class="page-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div v-for="i in 5" :key="i" class="loading-row">
          <div class="loading-thumbnail"></div>
          <div class="loading-content">
            <div class="loading-title"></div>
            <div class="loading-meta"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="isEmpty" class="empty-state">
        <div class="empty-icon">
          <i :class="emptyIcon" class="text-4xl text-gray-300"></i>
        </div>
        <h3 class="empty-title">{{ emptyTitle }}</h3>
        <p class="empty-description">{{ emptyDescription }}</p>
        <button
          v-if="emptyActionText"
          @click="$emit('empty-action')"
          class="empty-action-btn"
        >
          {{ emptyActionText }}
        </button>
      </div>

      <!-- Demo List -->
      <div v-else class="demo-list">
        <!-- List View -->
        <div v-if="currentView === 'list'" class="list-view">
          <DemoRow
            v-for="(demo, index) in demos"
            :key="demo.id"
            :demo="demo"
            :delay="index * 30"
            :is-selected="selectedDemoId === demo.id"
            :folders-with-counts="foldersWithCounts"
            :show-views="true"
            @view-detail="$emit('view-detail', $event)"
            @play-demo="$emit('play-demo', $event)"
            @customize-demo="$emit('customize-demo', $event)"
            @manage-links="$emit('manage-links', $event)"
            @copy-link="$emit('copy-link', $event)"
          />
        </div>

        <!-- Grid View -->
        <div v-else class="grid-view">
          <div
            v-for="(demo, index) in demos"
            :key="demo.id"
            class="demo-card"
            v-motion
            :initial="{ opacity: 0, scale: 0.95 }"
            :enter="{
              opacity: 1,
              scale: 1,
              transition: {
                duration: 200,
                delay: index * 50,
                ease: 'easeOut',
              },
            }"
            :hover="{ scale: 1.02, transition: { duration: 150 } }"
            @click="$emit('view-detail', demo)"
          >
            <!-- Card Thumbnail -->
            <div class="card-thumbnail">
              <img
                v-if="demo.screenshot_small && !imageErrors[demo.id]"
                :src="getScreenshotUrl(demo.screenshot_small)"
                @error="imageErrors[demo.id] = true"
                alt="demo screenshot"
                class="w-full h-full object-cover"
              />
              <div v-else class="card-placeholder">
                <i class="fal fa-play text-gray-400 text-2xl"></i>
              </div>

              <!-- Starred Indicator -->
              <div v-if="demo.starred" class="card-starred">
                <i class="fas fa-star text-yellow-400"></i>
              </div>
            </div>

            <!-- Card Content -->
            <div class="card-content">
              <h3 class="card-title">{{ demo.title }}</h3>
              <div class="card-meta">
                <span class="card-folder">{{
                  getFolderName(demo.folder_id)
                }}</span>
                <span class="card-views">{{ demo.views || 0 }} views</span>
              </div>
            </div>

            <!-- Card Actions -->
            <div class="card-actions">
              <button
                @click.stop="$emit('play-demo', demo)"
                class="card-action-btn primary"
                title="Play Demo"
              >
                <i class="fal fa-play"></i>
              </button>
              <button
                @click.stop="$emit('customize-demo', demo)"
                class="card-action-btn secondary"
                title="Customize"
              >
                <i class="fal fa-edit"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import PageHeader from "./PageHeader.vue";
import DemoRow from "./demo-cards/DemoRow.vue";
import DemoFilters from "./demo-cards/DemoFilters.vue";

interface Props {
  // Page identification
  pageType: "home" | "library" | "recent" | "shared" | "folder";

  // Page content
  demos: any[];
  foldersWithCounts?: any[];
  loading?: boolean;

  // Page header
  title?: string;
  description?: string;
  showBreadcrumbs?: boolean;
  currentFolder?: any;
  breadcrumbs?: any[];

  // Filters
  showFilters?: boolean;
  currentView?: "list" | "grid";
  currentSort?: string;
  selectedDemoType?: string;
  filteredCount?: number;
  totalCount?: number;
  selectedDemoId?: string;

  // Empty state
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: string;
  emptyActionText?: string;
}

interface Emits {
  (e: "create-new"): void;
  (e: "change-view", view: "list" | "grid"): void;
  (e: "change-sort", sort: string): void;
  (e: "change-demo-type", type: string): void;
  (e: "clear-filters"): void;
  (e: "remove-filter", filterKey: string): void;
  (e: "empty-action"): void;
  (e: "view-detail", demo: any): void;
  (e: "play-demo", demo: any): void;
  (e: "customize-demo", demo: any): void;
  (e: "copy-link", demo: any): void;
  (e: "manage-links", demo: any): void;
  (e: "navigate-breadcrumb", crumb: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  foldersWithCounts: () => [],
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
  selectedDemoId: "",
  emptyTitle: "No demos found",
  emptyDescription: "Create your first demo to get started.",
  emptyIcon: "fal fa-folder",
  emptyActionText: "",
});

defineEmits<Emits>();

const imageErrors = ref<Record<string, boolean>>({});

// Computed properties for page header
const pageTitle = computed(() => {
  if (props.title) return props.title;

  switch (props.pageType) {
    case "home":
      return "Recent Demos";
    case "library":
      return "All Demos";
    case "recent":
      return "Recent Demos";
    case "shared":
      return "Shared with me";
    case "folder":
      return props.currentFolder?.title || "Folder";
    default:
      return "Demos";
  }
});

const pageDescription = computed(() => {
  if (props.description) return props.description;

  switch (props.pageType) {
    case "home":
      return `${props.filteredCount} recent demos`;
    case "library":
      return `${props.filteredCount} demos`;
    case "recent":
      return `${props.filteredCount} recent demos`;
    case "shared":
      return `${props.filteredCount} shared demos`;
    case "folder":
      return `${props.demos.length} demos in this folder`;
    default:
      return `${props.filteredCount} demos`;
  }
});

const showBreadcrumbs = computed(() => {
  return props.showBreadcrumbs || props.pageType === "folder";
});

const isEmpty = computed(() => props.demos.length === 0);

// Helper functions
const getFolderName = (folderId: string) => {
  if (!folderId) return "Unorganized";
  const folder = props.foldersWithCounts?.find((f) => f.id === folderId);
  return folder?.title || "Unknown Folder";
};

const getScreenshotUrl = (screenshotSmall: string) => {
  if (!screenshotSmall) return "";
  if (screenshotSmall.startsWith("/")) return screenshotSmall;
  if (screenshotSmall.startsWith("data:")) return screenshotSmall;
  return `data:image/png;base64,${screenshotSmall}`;
};
</script>

<style scoped>
/* Unified Demo Page */
.unified-demo-page {
  @apply flex flex-col h-full bg-reprise-light-tan;
}

/* Page Content */
.page-content {
  @apply flex-1 overflow-y-auto;
}

/* Loading State */
.loading-state {
  @apply px-2 py-2 space-y-2;
}

.loading-row {
  @apply flex items-center gap-2 py-1;
}

.loading-thumbnail {
  @apply w-8 h-6 bg-gray-200 rounded animate-pulse;
}

.loading-content {
  @apply flex-1 space-y-1;
}

.loading-title {
  @apply h-3 bg-gray-200 rounded animate-pulse w-3/4;
}

.loading-meta {
  @apply h-2 bg-gray-200 rounded animate-pulse w-1/2;
}

/* Empty State */
.empty-state {
  @apply flex flex-col items-center justify-center py-8 px-2 text-center;
}

.empty-icon {
  @apply mb-2;
}

.empty-title {
  @apply text-sm font-medium text-gray-900 mb-1 m-0;
}

.empty-description {
  @apply text-xs text-gray-500 mb-2 m-0;
}

.empty-action-btn {
  @apply px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors;
}

/* Demo List */
.demo-list {
  @apply px-2 py-1;
}

/* List View */
.list-view {
  @apply space-y-0.5;
}

/* Grid View */
.grid-view {
  @apply grid grid-cols-1 gap-2;
}

.demo-card {
  @apply bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer;
}

.card-thumbnail {
  @apply relative w-full h-20 bg-gray-100;
}

.card-placeholder {
  @apply w-full h-full flex items-center justify-center;
}

.card-starred {
  @apply absolute top-2 right-2;
}

.card-content {
  @apply p-3;
}

.card-title {
  @apply text-sm font-medium text-gray-900 mb-1 m-0 truncate;
}

.card-meta {
  @apply flex items-center justify-between text-xs text-gray-500;
}

.card-folder {
  @apply text-gray-600 font-medium;
}

.card-views {
  @apply text-gray-500;
}

.card-actions {
  @apply flex items-center gap-1 p-2 border-t border-gray-100;
}

.card-action-btn {
  @apply flex-1 flex items-center justify-center px-2 py-1 text-xs font-medium rounded transition-colors;
}

.card-action-btn.primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.card-action-btn.secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}
</style>
