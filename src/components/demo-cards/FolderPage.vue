<template>
  <PageTemplate
    :page-title="folderTitle"
    :page-description="folderDescription"
    :demos="folderDemos"
    :folders-with-counts="foldersWithCounts"
    :loading="loading"
    :is-empty="isEmpty"
    :empty-title="emptyTitle"
    :empty-description="emptyDescription"
    empty-icon="fal fa-folder-open"
    :empty-action-text="emptyActionText"
    :show-filters="true"
    :current-view="currentView"
    :current-sort="currentSort"
    :active-type-filters="activeTypeFilters"
    :active-status-filters="activeStatusFilters"
    :filtered-count="filteredCount"
    :total-count="totalCount"
    :show-breadcrumbs="true"
    :current-folder="currentFolder"
    :breadcrumbs="breadcrumbs"
    row-variant="compact"
    @create-new="$emit('create-new')"
    @change-view="$emit('change-view', $event)"
    @change-sort="$emit('change-sort', $event)"
    @toggle-type-filter="$emit('toggle-type-filter', $event)"
    @toggle-status-filter="$emit('toggle-status-filter', $event)"
    @clear-filters="$emit('clear-filters')"
    @remove-filter="$emit('remove-filter', $event)"
    @empty-action="$emit('empty-action')"
    @view-detail="$emit('view-detail', $event)"
    @play-demo="$emit('play-demo', $event)"
    @customize-demo="$emit('customize-demo', $event)"
    @copy-link="$emit('copy-link', $event)"
    @manage-links="$emit('manage-links', $event)"
    @navigate-breadcrumb="$emit('navigate-breadcrumb', $event)"
  >
    <!-- Custom Folder Page Actions -->
    <template #actions>
      <div class="folder-actions">
        <button @click="$emit('folder-settings')" class="settings-btn">
          <i class="fal fa-cog mr-2"></i>
          Settings
        </button>
        <button @click="$emit('delete-folder')" class="delete-btn">
          <i class="fal fa-trash mr-2"></i>
          Delete
        </button>
      </div>
    </template>
  </PageTemplate>

  <!-- Folder Info -->
  <div v-if="!isEmpty && !loading" class="folder-info">
    <div class="info-grid">
      <div class="info-card">
        <div class="info-icon">
          <i class="fal fa-folder text-blue-500"></i>
        </div>
        <div class="info-content">
          <div class="info-title">Total Demos</div>
          <div class="info-value">{{ totalCount }}</div>
        </div>
      </div>

      <div class="info-card">
        <div class="info-icon">
          <i class="fal fa-eye text-green-500"></i>
        </div>
        <div class="info-content">
          <div class="info-title">Total Views</div>
          <div class="info-value">{{ totalViews }}</div>
        </div>
      </div>

      <div class="info-card">
        <div class="info-icon">
          <i class="fal fa-clock text-orange-500"></i>
        </div>
        <div class="info-content">
          <div class="info-title">Last Updated</div>
          <div class="info-value">{{ lastUpdated }}</div>
        </div>
      </div>

      <div class="info-card">
        <div class="info-icon">
          <i class="fal fa-users text-purple-500"></i>
        </div>
        <div class="info-content">
          <div class="info-title">Collaborators</div>
          <div class="info-value">{{ collaboratorCount }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Subfolders -->
  <div v-if="subfolders.length > 0" class="subfolders-section">
    <div class="subfolders-header">
      <h3 class="subfolders-title">Subfolders</h3>
      <button @click="$emit('create-subfolder')" class="create-subfolder-btn">
        <i class="fal fa-plus mr-2"></i>
        New Subfolder
      </button>
    </div>

    <div class="subfolders-grid">
      <div
        v-for="subfolder in subfolders"
        :key="subfolder.id"
        class="subfolder-card"
        v-motion
        :initial="{ opacity: 0, scale: 0.95 }"
        :enter="{
          opacity: 1,
          scale: 1,
          transition: {
            duration: 200,
            delay: 50,
            ease: 'easeOut',
          },
        }"
        :hover="{ scale: 1.02, transition: { duration: 150 } }"
        @click="$emit('select-subfolder', subfolder)"
      >
        <div class="subfolder-icon">
          <i class="fal fa-folder text-blue-500"></i>
        </div>
        <div class="subfolder-content">
          <h4 class="subfolder-name">{{ subfolder.title }}</h4>
          <p class="subfolder-count">{{ subfolder.demo_count }} demos</p>
        </div>
        <div class="subfolder-actions">
          <button
            @click.stop="$emit('subfolder-settings', subfolder)"
            class="subfolder-action-btn"
            title="Settings"
          >
            <i class="fal fa-cog text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PageTemplate from "./PageTemplate.vue";

interface Props {
  currentFolder: any;
  folderDemos: any[];
  foldersWithCounts: any[];
  loading: boolean;
  currentView: "list" | "grid";
  currentSort: string;
  activeTypeFilters: string[];
  activeStatusFilters: string[];
  filteredCount: number;
  totalCount: number;
  breadcrumbs: any[];
}

interface Emits {
  (e: "create-new"): void;
  (e: "add-to-folder"): void;
  (e: "folder-settings"): void;
  (e: "delete-folder"): void;
  (e: "create-subfolder"): void;
  (e: "select-subfolder", subfolder: any): void;
  (e: "subfolder-settings", subfolder: any): void;
  (e: "empty-action"): void;
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
  (e: "navigate-breadcrumb", crumb: any): void;
}

const props = defineProps<Props>();
defineEmits<Emits>();

const folderTitle = computed(() => props.currentFolder?.title || "Folder");
const folderDescription = computed(() => {
  if (!props.currentFolder) return "";
  return `${props.totalCount} demos in this folder`;
});

const isEmpty = computed(() => props.folderDemos.length === 0);

const emptyTitle = computed(() => {
  return `${props.currentFolder?.title || "This folder"} is empty`;
});

const emptyDescription = computed(() => {
  return "Add demos to this folder to organize your content.";
});

const emptyActionText = computed(() => {
  return "Add Demo to Folder";
});

const subfolders = computed(() => {
  if (!props.currentFolder) return [];
  return props.foldersWithCounts.filter(
    (folder) => folder.parent_id === props.currentFolder.id
  );
});

const totalViews = computed(() => {
  return props.folderDemos.reduce(
    (total, demo) => total + (demo.views || 0),
    0
  );
});

const lastUpdated = computed(() => {
  if (props.folderDemos.length === 0) return "Never";

  const lastDemo = props.folderDemos.reduce((latest, current) => {
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

const collaboratorCount = computed(() => {
  // Count unique creators in this folder
  const creators = new Set(props.folderDemos.map((demo) => demo.createdBy));
  return creators.size;
});
</script>

<style scoped>
/* Folder Actions */
.folder-actions {
  @apply flex items-center gap-2;
}

.add-demo-btn {
  @apply flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors;
}

.settings-btn {
  @apply flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors;
}

.delete-btn {
  @apply flex items-center px-3 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-md hover:bg-red-200 transition-colors;
}

/* Folder Info */
.folder-info {
  @apply px-4 py-4 border-b border-gray-200;
}

.info-grid {
  @apply grid grid-cols-4 gap-4;
}

.info-card {
  @apply flex items-center gap-3 p-3 bg-gray-50 rounded-lg;
}

.info-icon {
  @apply w-8 h-8 flex items-center justify-center rounded-full bg-white;
}

.info-content {
  @apply flex-1;
}

.info-title {
  @apply text-xs text-gray-500 mb-1;
}

.info-value {
  @apply text-lg font-semibold text-gray-900;
}

/* Subfolders */
.subfolders-section {
  @apply px-4 py-4;
}

.subfolders-header {
  @apply flex items-center justify-between mb-3;
}

.subfolders-title {
  @apply text-sm font-semibold text-gray-900 m-0;
}

.create-subfolder-btn {
  @apply flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors;
}

.subfolders-grid {
  @apply grid grid-cols-2 gap-4;
}

.subfolder-card {
  @apply flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer;
}

.subfolder-icon {
  @apply w-8 h-8 flex items-center justify-center rounded-full bg-blue-100;
}

.subfolder-content {
  @apply flex-1;
}

.subfolder-name {
  @apply text-sm font-medium text-gray-900 mb-1 m-0;
}

.subfolder-count {
  @apply text-xs text-gray-500 m-0;
}

.subfolder-actions {
  @apply flex-shrink-0;
}

.subfolder-action-btn {
  @apply w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors;
}
</style>
