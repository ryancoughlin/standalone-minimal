<template>
  <div class="page-header">
    <!-- Breadcrumbs (only for folder pages) -->
    <div
      v-if="showBreadcrumbs && breadcrumbs && breadcrumbs.length > 0"
      class="breadcrumbs-section"
    >
      <BreadcrumbNavigation
        :current-folder="currentFolder"
        :breadcrumbs="breadcrumbs"
        @navigate-breadcrumb="$emit('navigate-breadcrumb', $event)"
      />
    </div>

    <!-- Main Header Content -->
    <div class="header-content">
      <div class="header-left">
        <div class="title-section">
          <h2 class="page-title">{{ title }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadcrumbNavigation from "./BreadcrumbNavigation.vue";

interface Props {
  title: string;
  description?: string;
  showBreadcrumbs?: boolean;
  currentFolder?: any;
  breadcrumbs?: any[];
}

interface Emits {
  (e: "navigate-breadcrumb", crumb: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  description: "",
  showBreadcrumbs: false,
  currentFolder: null,
  breadcrumbs: () => [],
});

defineEmits<Emits>();
</script>

<style scoped>
/* Page Header - Consistent across all pages */
.page-header {
  @apply flex flex-col;
}

/* Breadcrumbs Section - Only for folder pages */
.breadcrumbs-section {
  @apply px-3 py-1;
}

/* Main Header Content */
.header-content {
  @apply flex items-center justify-between px-2 py-2;
}

.header-left {
  @apply flex-1;
}

.header-right {
  @apply flex-shrink-0;
}

/* Title Section */
.title-section {
  @apply flex flex-col;
}

.page-title {
  @apply text-sm font-semibold text-gray-900 m-0;
}

.page-description {
  @apply text-xs text-gray-500 mt-0.5 m-0;
}

/* Actions Section */
.actions-section {
  @apply flex items-center gap-2;
}
</style>
