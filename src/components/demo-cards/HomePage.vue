<template>
  <div class="home-page">
    <PageTemplate
      page-title="Recent Demos"
      :demos="displayDemos"
      :folders-with-counts="foldersWithCounts"
      :loading="loading"
      :is-empty="isEmpty"
      empty-title="No recent demos"
      empty-description="Demos you access will appear here for quick reference."
      empty-icon="fal fa-clock"
      empty-action-text="Browse All Demos"
      :show-filters="false"
      :current-view="currentView"
      :current-sort="currentSort"
      :selected-demo-type="selectedDemoType"
      :filtered-count="filteredCount"
      :total-count="totalCount"
      row-variant="detailed"
      @create-new="$emit('create-new')"
      @change-view="$emit('change-view', $event)"
      @change-sort="$emit('change-sort', $event)"
      @change-demo-type="$emit('change-demo-type', $event)"
      @clear-filters="$emit('clear-filters')"
      @remove-filter="$emit('remove-filter', $event)"
      @empty-action="$emit('create-new')"
      @view-detail="$emit('view-detail', $event)"
      @play-demo="$emit('play-demo', $event)"
      @customize-demo="$emit('customize-demo', $event)"
      @copy-link="$emit('copy-link', $event)"
      @manage-links="$emit('manage-links', $event)"
    >
      <!-- Custom Home Page Content -->
      <template #actions>
        <div class="home-actions"></div>
      </template>
    </PageTemplate>

    <!-- Recent Demos Section -->
    <div v-if="!isEmpty && !loading" class="recent-demos-section">
      <div class="section-header">
        <h3 class="section-title">Recent Demos</h3>
      </div>

      <div class="recent-demos-list">
        <DemoRow
          v-for="(demo, index) in recentDemos.slice(0, 5)"
          :key="demo.id"
          :demo="demo"
          :folders-with-counts="foldersWithCounts"
          :delay="index * 50"
          :show-views="false"
          @view-detail="$emit('view-detail', $event)"
          @play-demo="$emit('play-demo', $event)"
        />
      </div>
    </div>

    <!-- Quick Stats Section -->
    <div v-if="!isEmpty && !loading" class="quick-stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fal fa-clock text-blue-500"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ recentCount }}</div>
            <div class="stat-label">Recent</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fal fa-users text-green-500"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ sharedCount }}</div>
            <div class="stat-label">Shared</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fal fa-folder text-purple-500"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ totalCount }}</div>
            <div class="stat-label">Total</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity Section -->
    <div v-if="!isEmpty && !loading" class="recent-activity-section">
      <div class="section-header">
        <h3 class="section-title">Recent Activity</h3>
      </div>

      <div class="activity-list">
        <div
          v-for="(activity, index) in recentActivity"
          :key="activity.id"
          class="activity-item"
          v-motion
          :initial="{ opacity: 0, x: -10 }"
          :enter="{
            opacity: 1,
            x: 0,
            transition: {
              duration: 200,
              delay: index * 100,
              ease: 'easeOut',
            },
          }"
        >
          <div class="activity-icon" :class="`activity-${activity.type}`">
            <i :class="getActivityIcon(activity.type)" class="text-sm"></i>
          </div>
          <div class="activity-content">
            <div class="activity-text">{{ activity.text }}</div>
            <div class="activity-time">
              {{ formatTimeAgo(activity.timestamp) }}
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
import DemoRow from "./DemoRow.vue";

interface Props {
  demos: any[];
  foldersWithCounts: any[];
  loading: boolean;
  currentView: "list" | "grid";
  currentSort: string;
  selectedDemoType: string;
  filteredCount: number;
  totalCount: number;
  recentCount: number;
  sharedCount: number;
  starredCount: number;
}

interface Emits {
  (e: "create-new"): void;
  (e: "view-all"): void;
  (e: "view-recent"): void;
  (e: "change-view", view: "list" | "grid"): void;
  (e: "change-sort", sort: string): void;
  (e: "change-demo-type", type: string): void;
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

const isEmpty = computed(() => props.totalCount === 0);

const displayDemos = computed(() => {
  // Show recent demos first, then others
  const recentDemos = props.demos.filter((demo) => demo.isRecent);
  const otherDemos = props.demos.filter((demo) => !demo.isRecent);
  return [...recentDemos, ...otherDemos].slice(0, 8); // Show max 8 on home
});

const recentDemos = computed(() => {
  return props.demos.filter((demo) => demo.isRecent);
});

const recentActivity = computed(() => {
  // Mock recent activity data - in real app this would come from API
  return [
    {
      id: "1",
      type: "play",
      text: "Played 'Enterprise Cloud Integration'",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: "2",
      type: "share",
      text: "Shared 'TPSM App Dev SKO2025' with team",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
    {
      id: "3",
      type: "create",
      text: "Created 'AI/BI Dashboard Demo'",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    },
  ];
});

const getActivityIcon = (type: string) => {
  const icons = {
    play: "fal fa-play",
    share: "fal fa-share",
    create: "fal fa-plus",
    edit: "fal fa-edit",
  };
  return icons[type as keyof typeof icons] || "fal fa-circle";
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
/* Home Page Container */
.home-page {
  @apply flex flex-col h-full;
}

/* Recent Demos Section */
.recent-demos-section {
  @apply px-2 py-2 border-b border-gray-200;
}

.recent-demos-list {
  @apply space-y-0.5;
}

/* Home Actions - Compact */
.home-actions {
  @apply flex items-center gap-1;
}

.view-all-btn {
  @apply flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200 transition-colors;
}

/* Quick Stats - Compact */
.quick-stats-section {
  @apply px-2 py-2 border-b border-gray-200;
}

.stats-grid {
  @apply grid grid-cols-4 gap-2;
}

.stat-card {
  @apply flex items-center gap-2 p-2 bg-gray-50 rounded-lg;
}

.stat-icon {
  @apply w-6 h-6 flex items-center justify-center rounded-full bg-white;
}

.stat-content {
  @apply flex-1;
}

.stat-number {
  @apply text-sm font-semibold text-gray-900;
}

.stat-label {
  @apply text-xs text-gray-500;
}

/* Recent Activity - Compact */
.recent-activity-section {
  @apply px-2 py-2;
}

.section-header {
  @apply flex items-center justify-between mb-2;
}

.section-title {
  @apply text-xs font-semibold text-gray-900 m-0;
}

.view-more-btn {
  @apply flex items-center text-xs text-blue-600 hover:text-blue-700 transition-colors;
}

.activity-list {
  @apply space-y-1;
}

.activity-item {
  @apply flex items-center gap-2 py-1;
}

.activity-icon {
  @apply w-5 h-5 flex items-center justify-center rounded-full text-white;
}

.activity-icon.activity-play {
  @apply bg-blue-500;
}

.activity-icon.activity-share {
  @apply bg-green-500;
}

.activity-icon.activity-create {
  @apply bg-purple-500;
}

.activity-icon.activity-edit {
  @apply bg-orange-500;
}

.activity-content {
  @apply flex-1;
}

.activity-text {
  @apply text-xs text-gray-900;
}

.activity-time {
  @apply text-xs text-gray-500;
}
</style>
