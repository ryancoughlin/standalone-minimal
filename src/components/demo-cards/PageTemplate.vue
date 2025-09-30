<template>
  <div class="page-template">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-title-section">
        <h2 class="page-title">{{ pageTitle }}</h2>
        <p v-if="pageDescription" class="page-description">
          {{ pageDescription }}
        </p>
      </div>

      <!-- Page Actions -->
      <div class="page-actions">
        <slot name="actions"> </slot>
      </div>
    </div>

    <!-- Filters -->
    <DemoFilters
      v-if="showFilters"
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
            @copy-link="$emit('copy-link', $event)"
            @manage-links="$emit('manage-links', $event)"
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
                <i
                  :class="getProductTypeIcon(demo.productType)"
                  class="text-gray-400 text-2xl"
                ></i>
              </div>

              <!-- Type Badge -->
              <div class="card-type-badge" :class="`type-${demo.productType}`">
                <i
                  :class="getProductTypeIcon(demo.productType)"
                  class="text-xs"
                ></i>
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
                :title="getPrimaryActionLabel(demo.productType)"
              >
                <i :class="getPrimaryActionIcon(demo.productType)"></i>
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
import DemoRow from "./DemoRow.vue";
import DemoFilters from "./DemoFilters.vue";

interface Props {
  pageTitle: string;
  pageDescription?: string;
  demos: any[];
  foldersWithCounts?: any[];
  loading?: boolean;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: string;
  emptyActionText?: string;
  showFilters?: boolean;
  currentView?: "list" | "grid";
  currentSort?: string;
  selectedDemoType?: string;
  filteredCount?: number;
  totalCount?: number;
  selectedDemoId?: string;
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
}

const props = withDefaults(defineProps<Props>(), {
  foldersWithCounts: () => [],
  loading: false,
  isEmpty: false,
  emptyTitle: "No demos found",
  emptyDescription: "Create your first demo to get started.",
  emptyIcon: "fal fa-folder",
  emptyActionText: "",
  showFilters: true,
  currentView: "list",
  currentSort: "lastModified",
  selectedDemoType: "",
  filteredCount: 0,
  totalCount: 0,
  selectedDemoId: "",
});

defineEmits<Emits>();

const imageErrors = ref<Record<string, boolean>>({});

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
/* Page Template - Compact for Chrome Extension */
.page-template {
  @apply flex flex-col h-full;
}

/* Page Header - Compact */
.page-header {
  @apply flex items-center justify-between px-2 py-2 border-b border-gray-200;
}

.page-title-section {
  @apply flex-1;
}

.page-title {
  @apply text-sm font-semibold text-gray-900 m-0;
}

.page-description {
  @apply text-xs text-gray-500 mt-0.5 m-0;
}

.page-actions {
  @apply flex-shrink-0;
}

.new-demo-btn {
  @apply flex items-center px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors;
}

/* Page Content - Compact */
.page-content {
  @apply flex-1 overflow-y-auto;
}

/* Loading State - Compact */
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

/* Empty State - Compact */
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

/* Demo List - Compact */
.demo-list {
  @apply px-2 py-1;
}

/* List View - Compact */
.list-view {
  @apply space-y-0.5;
}

/* Grid View - Compact */
.grid-view {
  @apply grid grid-cols-1 gap-2;
}
</style>
