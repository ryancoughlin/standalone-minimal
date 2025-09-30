<template>
  <PageTemplate
    page-title="Shared with me"
    :demos="sharedDemos"
    :folders-with-counts="foldersWithCounts"
    :loading="loading"
    :is-empty="isEmpty"
    empty-title="No shared demos"
    empty-description="Demos shared with you by teammates will appear here."
    empty-icon="fal fa-users"
    empty-action-text="Browse All Demos"
    :show-filters="true"
    :current-view="currentView"
    :current-sort="currentSort"
    :active-type-filters="activeTypeFilters"
    :active-status-filters="activeStatusFilters"
    :filtered-count="filteredCount"
    :total-count="totalCount"
    row-variant="detailed"
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
    <!-- Custom Shared Page Actions -->
    <template #actions>
      <div class="shared-actions"></div>
    </template>
  </PageTemplate>

  <!-- Sharing Insights -->
  <div v-if="!isEmpty && !loading" class="sharing-insights">
    <div class="insights-header">
      <h3 class="insights-title">Sharing Activity</h3>
    </div>

    <div class="insights-content">
      <!-- Top Sharers -->
      <div class="insight-section">
        <h4 class="insight-section-title">Top Sharers</h4>
        <div class="sharers-list">
          <div
            v-for="(sharer, index) in topSharers"
            :key="sharer.name"
            class="sharer-item"
          >
            <div class="sharer-avatar">
              <span class="avatar-text">{{ getInitials(sharer.name) }}</span>
            </div>
            <div class="sharer-info">
              <div class="sharer-name">{{ sharer.name }}</div>
              <div class="sharer-count">{{ sharer.count }} demos</div>
            </div>
            <div class="sharer-rank">#{{ index + 1 }}</div>
          </div>
        </div>
      </div>

      <!-- Recent Shares -->
      <div class="insight-section">
        <h4 class="insight-section-title">Recent Shares</h4>
        <div class="shares-list">
          <div v-for="share in recentShares" :key="share.id" class="share-item">
            <div class="share-icon">
              <i class="fal fa-share text-blue-500"></i>
            </div>
            <div class="share-content">
              <div class="share-text">{{ share.text }}</div>
              <div class="share-time">{{ formatTimeAgo(share.timestamp) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PageTemplate from "./PageTemplate.vue";

interface Props {
  sharedDemos: any[];
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
  (e: "refresh-shared"): void;
  (e: "manage-permissions"): void;
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

const isEmpty = computed(() => props.sharedDemos.length === 0);

const topSharers = computed(() => {
  // Group demos by creator and count them
  const sharerCounts: Record<string, number> = {};

  props.sharedDemos.forEach((demo) => {
    const creator = demo.createdBy;
    sharerCounts[creator] = (sharerCounts[creator] || 0) + 1;
  });

  // Convert to array and sort by count
  return Object.entries(sharerCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3); // Top 3
});

const recentShares = computed(() => {
  // Mock recent shares data - in real app this would come from API
  return [
    {
      id: "1",
      text: "Jim Halpert shared 'TPSM App Dev SKO2025'",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
    {
      id: "2",
      text: "Pam Beesly shared 'AI/BI Dashboard Demo'",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
    {
      id: "3",
      text: "Michael Scott shared 'Q4 Product Launch'",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    },
  ];
});

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const formatTimeAgo = (timestamp: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return timestamp.toLocaleDateString();
};
</script>

<style scoped>
/* Shared Actions */
.shared-actions {
  @apply flex items-center gap-2;
}

.refresh-btn {
  @apply flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors;
}

.permissions-btn {
  @apply flex items-center px-3 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-md hover:bg-blue-200 transition-colors;
}

/* Sharing Insights */
.sharing-insights {
  @apply px-4 py-4 border-b border-gray-200;
}

.insights-header {
  @apply mb-4;
}

.insights-title {
  @apply text-sm font-semibold text-gray-900 m-0;
}

.insights-content {
  @apply grid grid-cols-2 gap-6;
}

.insight-section {
  @apply space-y-3;
}

.insight-section-title {
  @apply text-xs font-semibold text-gray-500 uppercase tracking-wide m-0;
}

/* Top Sharers */
.sharers-list {
  @apply space-y-2;
}

.sharer-item {
  @apply flex items-center gap-3 p-2 bg-gray-50 rounded-lg;
}

.sharer-avatar {
  @apply w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs font-medium;
}

.avatar-text {
  @apply text-xs;
}

.sharer-info {
  @apply flex-1;
}

.sharer-name {
  @apply text-sm font-medium text-gray-900;
}

.sharer-count {
  @apply text-xs text-gray-500;
}

.sharer-rank {
  @apply text-xs font-bold text-gray-400;
}

/* Recent Shares */
.shares-list {
  @apply space-y-2;
}

.share-item {
  @apply flex items-center gap-3 p-2 bg-gray-50 rounded-lg;
}

.share-icon {
  @apply w-6 h-6 flex items-center justify-center rounded-full bg-blue-100;
}

.share-content {
  @apply flex-1;
}

.share-text {
  @apply text-sm text-gray-900;
}

.share-time {
  @apply text-xs text-gray-500;
}
</style>
