<template>
  <div class="px-3 py-2">
    <nav class="breadcrumb-nav" aria-label="Folder navigation">
      <!-- Consolidated All/Folder Toggle Button -->
      <button
        @click="handleAllButtonClick"
        class="breadcrumb-item breadcrumb-all-toggle"
        :class="{
          active: !currentFolder,
          'sidebar-open': showFolderSidebar,
        }"
        :title="getAllButtonTooltip()"
      >
        <i class="fas fa-folder text-xs"></i>
        <span class="breadcrumb-text">All</span>
        <i
          class="fas fa-bars text-xs ml-1 transition-transform duration-200"
          :class="{ 'rotate-90': showFolderSidebar }"
        ></i>
      </button>

      <!-- Breadcrumb Path -->
      <div class="breadcrumb-path" ref="breadcrumbPath">
        <!-- Collapsed Intermediate Path -->
        <div
          v-if="showCollapsedPath"
          class="breadcrumb-collapsed"
          :title="collapsedPathTooltip"
        >
          <span class="breadcrumb-separator">/</span>
          <button
            @click="handleCollapsedClick"
            class="breadcrumb-item breadcrumb-collapsed-btn"
            title="Click to expand path"
          >
            <i class="fas fa-ellipsis-h text-xs"></i>
            <span class="breadcrumb-text">{{ collapsedCount }} more</span>
          </button>
        </div>

        <!-- Visible Breadcrumbs -->
        <template v-for="(crumb, index) in visibleBreadcrumbs" :key="crumb.id">
          <span class="breadcrumb-separator">/</span>
          <button
            @click="$emit('navigate-breadcrumb', crumb)"
            class="breadcrumb-item"
            :class="{
              active: index === visibleBreadcrumbs.length - 1,
              'breadcrumb-current': index === visibleBreadcrumbs.length - 1,
            }"
            :title="crumb.title"
          >
            <svg class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
              <path
                d="M2 4a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293L9.414 4H13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4z"
              />
            </svg>
            <span class="breadcrumb-text">{{
              truncateText(crumb.title, getMaxTextLength(index))
            }}</span>
          </button>
        </template>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from "vue";

interface Props {
  showFolderSidebar: boolean;
  currentFolder: any;
  breadcrumbs: any[];
}

interface Emits {
  (e: "toggle-sidebar"): void;
  (e: "select-folder", folder: any): void;
  (e: "navigate-breadcrumb", crumb: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Responsive breadcrumb logic
const breadcrumbPath = ref<HTMLElement | null>(null);
const containerWidth = ref(300); // Default width for extension bar

// Calculate how many breadcrumbs can fit
const maxVisibleBreadcrumbs = computed(() => {
  // Reserve space for: toggle button (32px) + "All" button (60px) + separators + padding
  const reservedSpace = 100;
  const availableSpace = containerWidth.value - reservedSpace;
  const breadcrumbWidth = 80; // Approximate width per breadcrumb
  return Math.max(1, Math.floor(availableSpace / breadcrumbWidth));
});

// Determine which breadcrumbs to show
const visibleBreadcrumbs = computed(() => {
  if (props.breadcrumbs.length <= maxVisibleBreadcrumbs.value) {
    return props.breadcrumbs;
  }

  // Always show the last breadcrumb (current folder)
  const lastBreadcrumb = props.breadcrumbs[props.breadcrumbs.length - 1];

  // If we can fit 2 or more, show first + last
  if (maxVisibleBreadcrumbs.value >= 2) {
    const firstBreadcrumb = props.breadcrumbs[0];
    return [firstBreadcrumb, lastBreadcrumb];
  }

  // If only 1 fits, show only the last (current folder)
  return [lastBreadcrumb];
});

// Show collapsed path indicator
const showCollapsedPath = computed(() => {
  return (
    props.breadcrumbs.length > maxVisibleBreadcrumbs.value &&
    maxVisibleBreadcrumbs.value >= 2
  );
});

// Count of collapsed breadcrumbs
const collapsedCount = computed(() => {
  return Math.max(0, props.breadcrumbs.length - maxVisibleBreadcrumbs.value);
});

// Tooltip for collapsed path
const collapsedPathTooltip = computed(() => {
  if (!showCollapsedPath.value) return "";

  const collapsedBreadcrumbs = props.breadcrumbs.slice(1, -1);
  return collapsedBreadcrumbs.map((crumb) => crumb.title).join(" / ");
});

// Handle collapsed path click
const handleCollapsedClick = () => {
  // Navigate to the first collapsed breadcrumb
  if (props.breadcrumbs.length > 2) {
    emit("navigate-breadcrumb", props.breadcrumbs[1]);
  }
};

// Handle consolidated All button click
const handleAllButtonClick = () => {
  if (props.showFolderSidebar) {
    // If sidebar is open, close it
    emit("toggle-sidebar");
  } else {
    // If sidebar is closed, open it and select all folders
    emit("toggle-sidebar");
    emit("select-folder", null);
  }
};

// Get tooltip for All button
const getAllButtonTooltip = () => {
  if (props.showFolderSidebar) {
    return "Close folder sidebar";
  }
  if (!props.currentFolder) {
    return "Currently viewing all folders - Click to open folder sidebar";
  }
  return "View all folders and open folder sidebar";
};

// Text truncation based on position
const getMaxTextLength = (index: number) => {
  const isLast = index === visibleBreadcrumbs.value.length - 1;
  const isFirst = index === 0;

  if (isLast) return 20; // Current folder gets more space
  if (isFirst) return 12; // First folder gets less space
  return 15; // Middle folders
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
};

// Update container width on resize
const updateContainerWidth = () => {
  if (breadcrumbPath.value) {
    const rect = breadcrumbPath.value.getBoundingClientRect();
    containerWidth.value = rect.width + 60; // Add padding
  }
};

onMounted(() => {
  nextTick(() => {
    updateContainerWidth();
  });
});

// Listen for window resize
const handleResize = () => {
  updateContainerWidth();
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
/* Consolidated All/Folder Toggle Button */
.breadcrumb-all-toggle {
  @apply flex-shrink-0;
}

.breadcrumb-all-toggle.sidebar-open {
  @apply text-reprise-blue;
}

.breadcrumb-all-toggle.sidebar-open .fas.fa-bars {
  @apply text-reprise-blue;
}

/* Breadcrumb Navigation */
.breadcrumb-nav {
  @apply flex items-center gap-1 min-w-0;
}

.breadcrumb-path {
  @apply flex items-center gap-1 min-w-0 flex-1;
}

/* Breadcrumb Items */
.breadcrumb-item {
  @apply flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors whitespace-nowrap;
}

.breadcrumb-item.active {
  @apply text-reprise-blue font-semibold;
}

.breadcrumb-item.breadcrumb-current {
  @apply text-reprise-deep-blue font-bold;
}

.breadcrumb-item.breadcrumb-all-toggle {
  @apply flex-shrink-0;
}

.breadcrumb-item.breadcrumb-collapsed-btn {
  @apply text-gray-500 hover:text-gray-700;
}

.breadcrumb-text {
  @apply truncate;
}

.breadcrumb-separator {
  @apply text-gray-400 text-xs flex-shrink-0;
}

.breadcrumb-collapsed {
  @apply flex items-center gap-1 flex-shrink-0;
}

/* Responsive adjustments */
@media (max-width: 320px) {
  .breadcrumb-item {
    @apply px-1 py-0.5;
  }

  .breadcrumb-text {
    @apply text-xs;
  }
}

/* Compact mode for very small spaces */
.breadcrumb-nav.compact {
  @apply gap-0;
}

.breadcrumb-nav.compact .breadcrumb-item {
  @apply px-1 py-0.5 text-xs;
}

.breadcrumb-nav.compact .breadcrumb-separator {
  @apply mx-0.5;
}

/* Hover states for better UX */
.breadcrumb-item:hover .breadcrumb-text {
  @apply text-gray-900;
}

.breadcrumb-item.active:hover .breadcrumb-text {
  @apply text-reprise-blue;
}

/* Focus states for accessibility */
.breadcrumb-item:focus {
  @apply outline-none ring-2 ring-reprise-blue ring-opacity-50;
}

.folder-toggle-button:focus {
  @apply outline-none ring-2 ring-reprise-blue ring-opacity-50;
}
</style>
