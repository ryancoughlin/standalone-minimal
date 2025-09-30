<template>
  <div
    class="demo-row group"
    :class="{
      'row-selected': isSelected,
      'row-hover': isHovered,
    }"
    v-motion
    :initial="{ opacity: 0, y: 5 }"
    :enter="{
      opacity: 1,
      y: 0,
      transition: {
        duration: 150,
        delay: delay || 0,
        ease: 'easeOut',
      },
    }"
    :hover="{ scale: 1.01, transition: { duration: 150 } }"
    :tap="{ scale: 0.99, transition: { duration: 100 } }"
    @click="$emit('view-detail', demo)"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Demo Thumbnail -->
    <div class="demo-thumbnail">
      <img
        v-if="demo.screenshot_small && !imageError"
        :src="getScreenshotUrl(demo.screenshot_small)"
        @error="imageError = true"
        alt="demo screenshot"
        class="w-full h-full object-cover"
      />
      <div v-else class="demo-placeholder">
        <i class="fal fa-play text-gray-400 text-sm"></i>
      </div>
    </div>

    <!-- Demo Content -->
    <div class="demo-content">
      <!-- Title and Shared Tag -->
      <div class="demo-header">
        <h3 class="demo-title">{{ demo.title }}</h3>
        <span v-if="demo.isShared" class="shared-tag">Shared</span>
      </div>

      <!-- Metadata -->
      <div class="demo-metadata">
        <div class="folder-info">
          <i class="fal fa-folder text-gray-400 mr-1 text-xs"></i>
          <span class="demo-folder">{{ getFolderName(demo.folder_id) }}</span>
        </div>
        <span class="demo-separator">•</span>
        <span v-if="showViews" class="demo-views"
          >{{ demo.views || 0 }} views</span
        >
        <span v-else class="demo-date">{{
          formatDate(demo.lastModified)
        }}</span>
      </div>
    </div>

    <!-- Play Button -->
    <div class="demo-actions">
      <button
        @click.stop="$emit('play-demo', demo)"
        class="play-action-btn"
        :title="getActionTitle(demo.productType)"
      >
        <i :class="getActionIcon(demo.productType)" class="text-sm"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  demo: any;
  delay?: number;
  isSelected?: boolean;
  foldersWithCounts?: any[];
  showViews?: boolean;
}

interface Emits {
  (e: "view-detail", demo: any): void;
  (e: "play-demo", demo: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  isSelected: false,
  foldersWithCounts: () => [],
  showViews: false,
});

defineEmits<Emits>();

const imageError = ref(false);
const isHovered = ref(false);

// Helper functions
const getFolderName = (folderId: string) => {
  if (!folderId) return "Unorganized";
  const folder = props.foldersWithCounts?.find((f) => f.id === folderId);
  return folder?.title || "Unknown Folder";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Today";
  if (diffDays === 2) return "Yesterday";
  if (diffDays <= 7) return `${diffDays - 1} days ago`;
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};

const getScreenshotUrl = (screenshotSmall: string) => {
  if (!screenshotSmall) return "";
  if (screenshotSmall.startsWith("/")) return screenshotSmall;
  if (screenshotSmall.startsWith("data:")) return screenshotSmall;
  return `data:image/png;base64,${screenshotSmall}`;
};

const getActionIcon = (productType: string) => {
  const icons = {
    replicate: "fal fa-magic",
    replay: "fal fa-play",
    reveal: "fal fa-external-link",
  };
  return icons[productType as keyof typeof icons] || "fal fa-play";
};

const getActionTitle = (productType: string) => {
  const titles = {
    replicate: "Run Demo",
    replay: "Play Demo",
    reveal: "Open Demo",
  };
  return titles[productType as keyof typeof titles] || "Play Demo";
};
</script>

<style scoped>
/* Demo Row - Single consistent design */
.demo-row {
  @apply flex items-center gap-2 py-2 px-2 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0 min-w-0;
}

.demo-row.row-hover {
  @apply bg-gray-50;
}

.demo-row.row-selected {
  @apply bg-blue-50 border-blue-200;
}

/* Demo Thumbnail */
.demo-thumbnail {
  @apply w-12 h-8 flex-shrink-0 rounded overflow-hidden bg-gray-100;
}

.demo-placeholder {
  @apply w-full h-full flex items-center justify-center;
}

/* Demo Content */
.demo-content {
  @apply flex-1 min-w-0 overflow-hidden;
}

.demo-header {
  @apply flex items-center justify-between mb-0.5;
}

.demo-title {
  @apply text-xs font-medium text-gray-900 truncate flex-1;
}

.shared-tag {
  @apply text-xs px-1 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium ml-2 flex-shrink-0;
}

/* Metadata */
.demo-metadata {
  @apply flex items-center text-xs text-gray-500;
}

.folder-info {
  @apply flex items-center;
}

.demo-folder {
  @apply text-gray-600 font-medium;
}

.demo-separator {
  @apply mx-1;
}

.demo-date {
  @apply text-gray-500;
}

.demo-views {
  @apply text-gray-500;
}

/* Actions */
.demo-actions {
  @apply flex-shrink-0;
}

.play-action-btn {
  @apply w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-150;
}

.play-action-btn:hover {
  transform: translate(-1px, -1px);
}
</style>
