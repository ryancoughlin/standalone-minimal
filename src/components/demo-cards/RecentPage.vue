<template>
  <PageTemplate
    page-title="Recent Demos"
    :demos="recentDemos"
    :folders-with-counts="foldersWithCounts"
    :loading="loading"
    :is-empty="isEmpty"
    empty-title="No recent demos"
    empty-description="Demos you access will appear here for quick reference."
    empty-icon="fal fa-clock"
    empty-action-text="Browse All Demos"
    :show-filters="true"
    :current-view="currentView"
    :current-sort="currentSort"
    :active-type-filters="activeTypeFilters"
    :active-status-filters="activeStatusFilters"
    :filtered-count="filteredCount"
    :total-count="totalCount"
    row-variant="compact"
    @create-new="$emit('create-new')"
    @change-view="$emit('change-view', $event)"
    @change-sort="$emit('change-sort', $event)"
    @toggle-type-filter="$emit('toggle-type-filter', $event)"
    @toggle-status-filter="$emit('toggle-status-filter', $event)"
    @clear-filters="$emit('clear-filters')"
    @remove-filter="$emit('remove-filter', $event)"
    @empty-action="$emit('browse-all')"
    @view-detail="$emit('view-detail', $event)"
    @play-demo="$emit('play-demo', $event)"
    @customize-demo="$emit('customize-demo', $event)"
    @copy-link="$emit('copy-link', $event)"
    @manage-links="$emit('manage-links', $event)"
  >
    <!-- Custom Recent Page Actions -->
    <template #actions>
      <div class="recent-actions"></div>
    </template>
  </PageTemplate>

  <!-- Recent Insights -->
  <div v-if="!isEmpty && !loading" class="recent-insights">
    <div class="insights-header">
      <h3 class="insights-title">Recent Insights</h3>
    </div>

    <div class="insights-grid">
      <div class="insight-card">
        <div class="insight-icon">
          <i class="fal fa-chart-line text-blue-500"></i>
        </div>
        <div class="insight-content">
          <div class="insight-title">Most Used</div>
          <div class="insight-value">{{ mostUsedDemo?.title || "None" }}</div>
        </div>
      </div>

      <div class="insight-card">
        <div class="insight-icon">
          <i class="fal fa-clock text-green-500"></i>
        </div>
        <div class="insight-content">
          <div class="insight-title">Last Accessed</div>
          <div class="insight-value">{{ lastAccessedTime }}</div>
        </div>
      </div>

      <div class="insight-card">
        <div class="insight-icon">
          <i class="fal fa-calendar text-purple-500"></i>
        </div>
        <div class="insight-content">
          <div class="insight-title">This Week</div>
          <div class="insight-value">{{ thisWeekCount }} demos</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PageTemplate from "./PageTemplate.vue";

interface Props {
  recentDemos: any[];
  foldersWithCounts: any[];
  loading: boolean;
  currentView: "list" | "grid";
  currentSort: string;
  activeTypeFilters: string[];
  activeStatusFilters: string[];
  filteredCount: number;
  totalCount: number;
}

interface Emits {
  (e: "create-new"): void;
  (e: "browse-all"): void;
  (e: "clear-recent"): void;
  (e: "refresh-recent"): void;
  (e: "change-view", view: "list" | "grid"): void;
  (e: "change-sort", sort: string): void;
  (e: "toggle-type-filter", type: string): void;
  (e: "toggle-status-filter", status: string): void;
  (e: "clear-filters"): void;
  (e: "remove-filter", filterKey: string): void;
  (e: "view-detail", demo: any): void;
  (e: "play-demo", demo: any): void;
  (e: "customize-demo", demo: any): void;
  (e: "copy-link", demo: any): void;
  (e: "manage-links", demo: any): void;
}

const props = defineProps<Props>();
defineEmits<Emits>();

const isEmpty = computed(() => props.recentDemos.length === 0);

const mostUsedDemo = computed(() => {
  if (props.recentDemos.length === 0) return null;
  return props.recentDemos.reduce((most, current) =>
    (current.views || 0) > (most.views || 0) ? current : most
  );
});

const lastAccessedTime = computed(() => {
  if (props.recentDemos.length === 0) return "Never";

  const lastDemo = props.recentDemos.reduce((latest, current) => {
    const latestDate = new Date(latest.lastModified);
    const currentDate = new Date(current.lastModified);
    return currentDate > latestDate ? current : latest;
  });

  const lastDate = new Date(lastDemo.lastModified);
  const now = new Date();
  const diffMs = now.getTime() - lastDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return lastDate.toLocaleDateString();
});

const thisWeekCount = computed(() => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return props.recentDemos.filter((demo) => {
    const demoDate = new Date(demo.lastModified);
    return demoDate >= oneWeekAgo;
  }).length;
});
</script>

<style scoped>
/* Recent Actions */
.recent-actions {
  @apply flex items-center gap-2;
}

.clear-recent-btn {
  @apply flex items-center px-3 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-md hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.refresh-btn {
  @apply flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors;
}

/* Recent Insights */
.recent-insights {
  @apply px-4 py-4 border-b border-gray-200;
}

.insights-header {
  @apply mb-3;
}

.insights-title {
  @apply text-sm font-semibold text-gray-900 m-0;
}

.insights-grid {
  @apply grid grid-cols-3 gap-4;
}

.insight-card {
  @apply flex items-center gap-3 p-3 bg-gray-50 rounded-lg;
}

.insight-icon {
  @apply w-8 h-8 flex items-center justify-center rounded-full bg-white;
}

.insight-content {
  @apply flex-1;
}

.insight-title {
  @apply text-xs text-gray-500 mb-1;
}

.insight-value {
  @apply text-sm font-medium text-gray-900 truncate;
}
</style>
