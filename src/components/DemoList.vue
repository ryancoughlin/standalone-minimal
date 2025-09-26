<template>
  <div class="px-4 pb-4">
    <!-- Recent Demos Section -->
    <div v-if="!currentFolder" class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-3">Recent Demos</h3>
      <div class="space-y-1">
        <!-- Recent Demo Rows -->
        <div
          v-for="(demo, index) in recentDemos"
          :key="`recent-${index}`"
          class="demo-row group"
          @click="$emit('view-detail', demo)"
        >
          <div class="demo-thumbnail">
            <img
              v-if="demo.screenshot_small && !imageErrors[`recent-${index}`]"
              :src="getScreenshotUrl(demo.screenshot_small)"
              @error="imageErrors[`recent-${index}`] = true"
              alt="demo screenshot"
              class="w-full h-full object-cover"
            />
            <div v-else class="demo-placeholder">
              <i class="fas fa-play text-gray-400"></i>
            </div>
          </div>
          <div class="demo-info">
            <div class="demo-title">{{ demo.title }}</div>
            <div class="demo-meta">
              <span class="demo-type">{{ getDemoType(demo) }}</span>
              <span class="demo-separator">•</span>
              <span class="demo-folder">{{
                getFolderName(demo.folder_id || demo.replay_folder_id)
              }}</span>
              <span class="demo-separator">•</span>
              <span class="demo-views">{{ demo.views || 0 }} views</span>
            </div>
          </div>
          <div class="demo-actions">
            <button
              @click.stop="$emit('play-demo', demo)"
              class="play-action-btn"
              title="Play Demo"
            >
              <i class="fas fa-play"></i>
            </button>
            <div class="demo-actions-overlay group-hover:opacity-100">
              <button
                @click.stop="$emit('customize-demo', demo)"
                class="customize-btn"
                title="Customize Demo"
              >
                <i class="fas fa-edit"></i>
                Customize
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- All Demos Section -->
    <div v-if="!currentFolder">
      <h3 class="text-lg font-semibold text-gray-900 mb-3">All Demos</h3>
      <div class="space-y-1">
        <!-- All Demo Rows -->
        <div
          v-for="(demo, index) in allDemos"
          :key="`all-${index}`"
          class="demo-row group"
          @click="$emit('view-detail', demo)"
        >
          <div class="demo-thumbnail">
            <img
              v-if="demo.screenshot_small && !imageErrors[`all-${index}`]"
              :src="getScreenshotUrl(demo.screenshot_small)"
              @error="imageErrors[`all-${index}`] = true"
              alt="demo screenshot"
              class="w-full h-full object-cover"
            />
            <div v-else class="demo-placeholder">
              <i class="fas fa-play text-gray-400"></i>
            </div>
          </div>
          <div class="demo-info">
            <div class="demo-title">{{ demo.title }}</div>
            <div class="demo-meta">
              <span class="demo-type">{{ getDemoType(demo) }}</span>
              <span class="demo-separator">•</span>
              <span class="demo-folder">{{
                getFolderName(demo.folder_id || demo.replay_folder_id)
              }}</span>
              <span class="demo-separator">•</span>
              <span class="demo-views">{{ demo.views || 0 }} views</span>
            </div>
          </div>
          <div class="demo-actions">
            <button
              @click.stop="$emit('play-demo', demo)"
              class="play-action-btn"
              title="Play Demo"
            >
              <i class="fas fa-play"></i>
            </button>
            <div class="demo-actions-overlay group-hover:opacity-100">
              <button
                @click.stop="$emit('customize-demo', demo)"
                class="customize-btn"
                title="Customize Demo"
              >
                <i class="fas fa-edit"></i>
                Customize
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Folder Demos Section -->
    <div v-else>
      <div class="space-y-1">
        <!-- Folder Demo Rows -->
        <div
          v-for="(demo, index) in folderDemos"
          :key="`folder-${index}`"
          class="demo-row group"
          @click="$emit('view-detail', demo)"
        >
          <div class="demo-thumbnail">
            <img
              v-if="demo.screenshot_small && !imageErrors[`folder-${index}`]"
              :src="getScreenshotUrl(demo.screenshot_small)"
              @error="imageErrors[`folder-${index}`] = true"
              alt="demo screenshot"
              class="w-full h-full object-cover"
            />
            <div v-else class="demo-placeholder">
              <i class="fas fa-play text-gray-400"></i>
            </div>
          </div>
          <div class="demo-info">
            <div class="demo-title">{{ demo.title }}</div>
            <div class="demo-meta">
              <span class="demo-type">{{ getDemoType(demo) }}</span>
              <span class="demo-separator">•</span>
              <span class="demo-views">{{ demo.views || 0 }} views</span>
            </div>
          </div>
          <div class="demo-actions">
            <button
              @click.stop="$emit('play-demo', demo)"
              class="play-action-btn"
              title="Play Demo"
            >
              <i class="fas fa-play"></i>
            </button>
            <div class="demo-actions-overlay group-hover:opacity-100">
              <button
                @click.stop="$emit('customize-demo', demo)"
                class="customize-btn"
                title="Customize Demo"
              >
                <i class="fas fa-edit"></i>
                Customize
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="totalDemoCount === 0" class="text-center py-8 px-4">
      <div class="text-gray-400 mb-3">
        <span class="text-3xl">📁</span>
      </div>
      <h3 class="text-base font-medium text-gray-900 mb-1 m-0">
        No demos found
      </h3>
      <p class="text-sm text-gray-500 m-0">
        Create your first demo to get started.
      </p>
    </div>

    <!-- No Search Results -->
    <div
      v-else-if="searchQuery && filteredTotalCount === 0"
      class="text-center py-8 px-4"
    >
      <div class="text-gray-400 mb-3">
        <span class="text-3xl">🔍</span>
      </div>
      <h3 class="text-base font-medium text-gray-900 mb-1 m-0">
        No demos match your search
      </h3>
      <p class="text-sm text-gray-500 m-0">Try adjusting your search terms.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  currentFolder: any;
  recentDemos: any[];
  allDemos: any[];
  folderDemos: any[];
  totalDemoCount: number;
  filteredTotalCount: number;
  searchQuery: string;
  rootFolders: any[];
  foldersWithCounts: any[];
}

interface Emits {
  (e: "play-demo", demo: any): void;
  (e: "view-detail", demo: any): void;
  (e: "customize-demo", demo: any): void;
  (e: "manage-links", demo: any): void;
  (e: "view-analytics", demo: any): void;
}

const props = defineProps<Props>();
defineEmits<Emits>();

const imageErrors = ref<Record<string, boolean>>({});

const getFolderName = (folderId: string) => {
  const folder =
    props.rootFolders.find((f) => f.id === folderId) ||
    props.foldersWithCounts.find((f) => f.id === folderId);
  return folder?.title || "Unknown Folder";
};

const getDemoType = (demo: any) => {
  if (demo.replay_type === "LEGACY") return "Legacy";
  if (demo.replay_folder_id) return "Maestro";
  if (demo.folder_id && !demo.replay_type) return "Live";
  return "Demo";
};

const getScreenshotUrl = (screenshotSmall: string) => {
  if (!screenshotSmall) return "";
  if (screenshotSmall.startsWith("data:")) {
    return screenshotSmall;
  }
  return `data:image/png;base64,${screenshotSmall}`;
};
</script>

<style scoped>
/* Demo Row Layout */
.demo-row {
  @apply flex items-center gap-3 py-2 px-3 cursor-pointer transition-colors hover:bg-gray-50 border-b border-gray-100 last:border-b-0;
}

.demo-thumbnail {
  @apply w-12 h-8 flex-shrink-0 rounded overflow-hidden bg-gray-100;
}

.demo-placeholder {
  @apply w-full h-full flex items-center justify-center;
}

.demo-info {
  @apply flex-1 min-w-0;
}

.demo-title {
  @apply text-sm font-medium text-gray-900 truncate;
}

.demo-meta {
  @apply text-xs text-gray-500 mt-0.5;
}

.demo-type {
  @apply font-medium;
}

.demo-separator {
  @apply mx-1;
}

.demo-folder {
  @apply text-gray-600;
}

.demo-views {
  @apply text-gray-500;
}

.demo-actions {
  @apply flex-shrink-0 relative;
}

.play-action-btn {
  @apply w-full h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-150 text-xs;
}

.demo-actions-overlay {
  @apply absolute inset-0 flex items-center justify-end gap-2 pr-2 opacity-0 transition-opacity duration-200 pointer-events-none;
  right: 2rem; /* Move overlay to the left to avoid covering play icon */
}

.group:hover .demo-actions-overlay {
  @apply opacity-100 pointer-events-auto;
}

.customize-btn {
  @apply flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-400 rounded transition-all duration-150 pointer-events-auto shadow-sm;
}
</style>
