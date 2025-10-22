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
    @click="$emit('play-demo', demo)"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Demo Thumbnail -->
    <div class="demo-thumbnail" @click.stop="$emit('play-demo', demo)">
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

      <!-- Hover Overlay -->
      <div class="thumbnail-overlay">
        <i class="fas fa-arrow-up-right text-white text-lg"></i>
      </div>
    </div>

    <!-- Demo Content -->
    <div class="demo-content">
      <!-- Title -->
      <div class="demo-header">
        <h3 class="demo-title">{{ demo.title }}</h3>
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

      <!-- Shared Status -->
      <div v-if="demo.isShared" class="shared-status">
        <i class="fal fa-users text-xs"></i>
        <span class="shared-text">Shared</span>
      </div>
    </div>

    <!-- Context Menu -->
    <div class="demo-context-menu">
      <button
        @click.stop="toggleContextMenu"
        class="context-menu-trigger"
        title="More actions"
      >
        <i class="fas fa-ellipsis-v text-gray-400"></i>
      </button>

      <!-- Context Menu Dropdown -->
      <div v-if="showContextMenu" class="context-menu-dropdown" @click.stop>
        <button @click="handleCustomizeClick" class="context-menu-item">
          <i class="fal fa-cog text-gray-500"></i>
          <span>Customize</span>
        </button>
        <button @click="handleCopyLink" class="context-menu-item">
          <i class="fal fa-copy text-gray-500"></i>
          <span>Copy Link</span>
        </button>
        <button @click="handleManageLinks" class="context-menu-item">
          <i class="fal fa-link text-gray-500"></i>
          <span>Manage Links</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface Props {
  demo: any;
  delay?: number;
  isSelected?: boolean;
  foldersWithCounts?: any[];
  showViews?: boolean;
}

interface Emits {
  (e: "play-demo", demo: any): void;
  (e: "customize-demo", demo: any): void;
  (e: "manage-links", demo: any): void;
  (e: "copy-link", demo: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  isSelected: false,
  foldersWithCounts: () => [],
  showViews: false,
});

const emit = defineEmits<Emits>();

const imageError = ref(false);
const isHovered = ref(false);
const showContextMenu = ref(false);

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

const handleCustomizeClick = () => {
  emit("customize-demo", props.demo);
  showContextMenu.value = false;
};

const handleCopyLink = () => {
  emit("copy-link", props.demo);
  showContextMenu.value = false;
};

const handleManageLinks = () => {
  emit("manage-links", props.demo);
  showContextMenu.value = false;
};

const toggleContextMenu = () => {
  showContextMenu.value = !showContextMenu.value;
};

// Close context menu when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".demo-context-menu")) {
    showContextMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* Demo Row - Single consistent design */
.demo-row {
  @apply flex items-start gap-2 py-2 px-2 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0 min-w-0 relative;
}

/* Demo Thumbnail */
.demo-thumbnail {
  @apply w-24 h-16 flex-shrink-0 rounded-md border border-gray-200 overflow-hidden bg-gray-100 relative cursor-pointer transition-all duration-200;
}

.demo-thumbnail:hover {
  @apply border-gray-300 shadow-sm;
}

.demo-placeholder {
  @apply w-full h-full flex items-center justify-center;
}

.thumbnail-overlay {
  @apply absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 transition-opacity duration-200;
}

.demo-thumbnail:hover .thumbnail-overlay {
  @apply opacity-100;
}

/* Demo Content */
.demo-content {
  @apply flex-1 min-w-0 overflow-hidden pr-20;
}

.demo-header {
  @apply flex items-center justify-between mb-0.5;
}

.demo-title {
  @apply text-xs font-medium text-gray-900 truncate flex-1;
}

.shared-status {
  @apply flex items-center gap-1 mt-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs w-fit;
}

.shared-text {
  @apply text-xs font-medium;
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

/* Context Menu */
.demo-context-menu {
  @apply relative flex-shrink-0;
}

.context-menu-trigger {
  @apply w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-150;
}

.context-menu-trigger:hover {
  @apply text-gray-600;
}

.context-menu-dropdown {
  @apply absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-32;
}

.context-menu-item {
  @apply w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left;
}

.context-menu-item i {
  @apply w-4 h-4 flex-shrink-0;
}
</style>
