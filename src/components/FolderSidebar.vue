<template>
  <div
    class="folder-sidebar border-r"
    :class="{ 'sidebar-open': showFolderSidebar }"
  >
    <!-- Folder List -->
    <div class="folder-list-container">
      <div class="px-3 py-3">
        <!-- All Folders Option -->
        <button
          @click="$emit('select-folder', null)"
          class="folder-item"
          :class="{ 'folder-selected': !currentFolder }"
        >
          <div class="folder-icon">
            <i class="fas fa-folder text-gray-500"></i>
          </div>
          <span class="folder-name">All Folders</span>
          <div class="folder-badge">{{ totalDemoCount }}</div>
        </button>

        <!-- All Folders (Flat List) -->
        <div class="folder-section">
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
  @apply flex flex-col w-0 overflow-hidden transition-all duration-300 ease-in-out;
  width: 0;
}

.folder-sidebar.sidebar-open {
  width: 160px;
}

/* Folder List */
.folder-list-container {
  @apply flex-1 overflow-y-auto;
}

.folder-section {
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
