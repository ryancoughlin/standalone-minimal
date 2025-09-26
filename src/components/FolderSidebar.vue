<template>
  <div
    class="folder-sidebar border-r"
    :class="{ 'sidebar-open': showFolderSidebar }"
  >
    <!-- Navigation List -->
    <div class="folder-list-container">
      <div class="px-3 py-3">
        <!-- Home Section -->
        <div class="navigation-section">
          <div class="section-header">
            <span class="section-title">Navigation</span>
          </div>
          <button
            @click="$emit('select-folder', null)"
            class="folder-item"
            :class="{ 'folder-selected': !currentFolder }"
          >
            <div class="folder-icon">
              <i class="fas fa-home text-gray-500"></i>
            </div>
            <span class="folder-name">Home</span>
            <div class="folder-badge">{{ totalDemoCount }}</div>
          </button>
        </div>

        <!-- Folders Section -->
        <div class="folders-section">
          <div class="section-header">
            <span class="section-title">Folders</span>
          </div>
          <div
            v-for="folder in allFolders"
            :key="folder.id"
            class="folder-group"
          >
            <button
              @click="$emit('select-folder', folder)"
              class="folder-item"
              :class="{
                'folder-selected': currentFolder?.id === folder.id,
                'folder-parent': folder.parent_id === null,
                'folder-child': folder.parent_id !== null,
              }"
            >
              <div class="folder-icon">
                <i class="fas fa-folder text-gray-500"></i>
              </div>
              <span class="folder-name">{{ folder.title }}</span>
              <div class="folder-badge">
                {{ folder.total_demo_count }}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showFolderSidebar: boolean;
  currentFolder: any;
  allFolders: any[];
  totalDemoCount: number;
}

interface Emits {
  (e: "select-folder", folder: any): void;
  (e: "toggle-folder", folderId: string): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<style scoped>
/* Folder Sidebar */
.folder-sidebar {
  @apply flex flex-col absolute top-0 left-0 h-full bg-white border-r border-gray-200 z-20 overflow-hidden transition-all duration-300 ease-in-out;
  width: 0;
  transform: translateX(-100%);
}

.folder-sidebar.sidebar-open {
  width: 190px;
  transform: translateX(0);
}

/* Navigation List */
.folder-list-container {
  @apply flex-1 overflow-y-auto;
}

/* Section Headers */
.section-header {
  @apply px-2 py-2;
}

.section-title {
  @apply text-xs font-semibold text-gray-500 uppercase tracking-wide;
}

/* Navigation Section */
.navigation-section {
  @apply mb-4;
}

/* Folders Section */
.folders-section {
  @apply space-y-1;
}

.folder-group {
  @apply space-y-1;
}

.folder-item {
  @apply w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-md transition-all duration-200 hover:bg-reprise-off-white;
}

.folder-item.folder-selected {
  @apply bg-reprise-sky text-reprise-deep-blue;
}

.folder-item.folder-parent {
  @apply font-medium;
}

.folder-item.folder-child {
  @apply ml-4;
}

.folder-icon {
  @apply flex-shrink-0 text-gray-500;
}

.folder-item.folder-selected .folder-icon {
  @apply text-reprise-deep-blue;
}

.folder-name {
  @apply text-xs font-medium text-gray-900 truncate flex-1;
}

.folder-item.folder-selected .folder-name {
  @apply text-reprise-deep-blue;
}

.folder-badge {
  @apply text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full font-medium;
}

.folder-item.folder-selected .folder-badge {
  @apply text-reprise-deep-blue bg-reprise-sky;
}

.subfolder-container {
  @apply space-y-1;
}

/* Folder Parent Container */
.folder-parent-container {
  @apply flex items-center;
}

/* Custom scrollbar for webkit browsers */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
