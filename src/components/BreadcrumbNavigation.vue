<template>
  <div class="px-4 py-3">
    <nav class="breadcrumb-nav" aria-label="Folder navigation">
      <!-- Folder Toggle Button -->
      <button
        @click="$emit('toggle-sidebar')"
        class="folder-toggle-button"
        :class="{ 'toggle-active': showFolderSidebar }"
        title="Toggle Folders"
      >
        <i
          class="fas fa-bars text-sm transition-transform duration-200"
          :class="{ 'rotate-90': showFolderSidebar }"
        ></i>
      </button>

      <button
        @click="$emit('select-folder', null)"
        class="breadcrumb-item"
        :class="{ active: !currentFolder }"
      >
        <i class="fas fa-folder text-sm"></i>
        <span>All Folders</span>
      </button>

      <template v-for="(crumb, index) in breadcrumbs" :key="crumb.id">
        <span class="breadcrumb-separator">/</span>
        <button
          @click="$emit('navigate-breadcrumb', crumb)"
          class="breadcrumb-item"
          :class="{ active: index === breadcrumbs.length - 1 }"
        >
          <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M2 4a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293L9.414 4H13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4z"
            />
          </svg>
          <span>{{ crumb.title }}</span>
        </button>
      </template>
    </nav>
  </div>
</template>

<script setup lang="ts">
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

defineProps<Props>();
defineEmits<Emits>();
</script>

<style scoped>
/* Folder Toggle Button */
.folder-toggle-button {
  @apply w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200 mr-2;
}

.folder-toggle-button.toggle-active {
  @apply text-reprise-blue bg-reprise-sky;
}

/* Breadcrumb Navigation */
.breadcrumb-nav {
  @apply flex items-center space-x-2;
}

.breadcrumb-item {
  @apply flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors;
}

.breadcrumb-item.active {
  @apply text-reprise-blue bg-reprise-sky font-medium;
}

.breadcrumb-separator {
  @apply text-gray-400;
}
</style>
