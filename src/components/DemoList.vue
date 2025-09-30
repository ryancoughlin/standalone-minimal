<template>
  <div class="px-4 pb-4">
    <!-- Folder Content -->
    <div v-if="currentFolder" class="mb-6">
      <h3 class="heading-secondary mb-3">{{ currentFolder.title }}</h3>
      <div class="space-y-1">
        <!-- Folder Demo Rows -->
        <DemoRow
          v-for="(demo, index) in folderDemos"
          :key="`folder-${index}`"
          :demo="demo"
          :folders-with-counts="foldersWithCounts"
          :delay="50 + index * 30"
          :show-views="true"
          @view-detail="$emit('view-detail', demo)"
          @play-demo="$emit('play-demo', demo)"
        />
      </div>
    </div>

    <!-- Recent Demos Section (only show for home) -->
    <div v-if="!currentFolder && currentSection === 'home'" class="mb-6">
      <h3 class="heading-secondary mb-3">Recent Demos</h3>
      <div class="space-y-1">
        <!-- Recent Demo Rows -->
        <DemoRow
          v-for="(demo, index) in recentDemos"
          :key="`recent-${index}`"
          :demo="demo"
          :folders-with-counts="foldersWithCounts"
          :delay="50 + index * 30"
          :show-views="true"
          @view-detail="$emit('view-detail', demo)"
          @play-demo="$emit('play-demo', demo)"
        />
      </div>
    </div>

    <!-- Dynamic Section Content -->
    <div v-if="!currentFolder">
      <h3 class="heading-secondary mb-3">{{ sectionTitle }}</h3>
      <div class="space-y-1">
        <!-- Demo Rows -->
        <DemoRow
          v-for="(demo, index) in displayDemos"
          :key="`all-${index}`"
          :demo="demo"
          :folders-with-counts="foldersWithCounts"
          :delay="50 + index * 30"
          :show-views="true"
          @view-detail="$emit('view-detail', demo)"
          @play-demo="$emit('play-demo', demo)"
        />
      </div>
    </div>

    <!-- Folder Demos Section -->
    <div v-else>
      <div class="space-y-1">
        <!-- Folder Demo Rows -->
        <DemoRow
          v-for="(demo, index) in folderDemos"
          :key="`folder-${index}`"
          :demo="demo"
          :folders-with-counts="foldersWithCounts"
          :delay="50 + index * 30"
          :show-views="true"
          @view-detail="$emit('view-detail', demo)"
          @play-demo="$emit('play-demo', demo)"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="totalDemoCount === 0"
      class="text-center py-8 px-4"
      v-motion
      :initial="{ opacity: 0, scale: 0.95 }"
      :enter="{
        opacity: 1,
        scale: 1,
        transition: { duration: 200, ease: 'easeOut' },
      }"
    >
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
      v-motion
      :initial="{ opacity: 0, scale: 0.95 }"
      :enter="{
        opacity: 1,
        scale: 1,
        transition: { duration: 200, ease: 'easeOut' },
      }"
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
import { computed } from "vue";
import DemoRow from "./demo-cards/DemoRow.vue";

interface Props {
  currentFolder: any;
  currentSection: string;
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

// Computed properties for section handling
const sectionTitle = computed(() => {
  switch (props.currentSection) {
    case "home":
      return "All Demos";
    case "demos":
      return "All Demos";
    case "recent":
      return "Recent Demos";
    case "shared":
      return "Shared with me";
    default:
      return "All Demos";
  }
});

const displayDemos = computed(() => {
  switch (props.currentSection) {
    case "home":
      return props.allDemos;
    case "demos":
      return props.allDemos;
    case "recent":
      return props.recentDemos;
    case "shared":
      return props.recentDemos; // recentDemos prop contains filtered demos for current section
    default:
      return props.allDemos;
  }
});
</script>

<style scoped>
/* Primary Typography Classes */
.heading-primary {
  @apply text-xl font-semibold text-gray-900;
}

.heading-secondary {
  @apply text-base font-medium text-gray-900;
}
</style>
