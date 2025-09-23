<template>
  <div class="folder-navigation">
    <!-- Breadcrumb Navigation -->
    <div class="breadcrumb-container">
      <nav class="breadcrumb-nav" aria-label="Folder navigation">
        <button
          @click="navigateToRoot"
          class="breadcrumb-item root"
          :class="{ active: !currentFolder }"
        >
          <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M8 1L1 4v8l7 3 7-3V4L8 1zM2 5.5L8 3l6 2.5v5L8 12.5 2 10.5v-5z"
            />
          </svg>
          <span>All Folders</span>
        </button>

        <template v-for="(crumb, index) in breadcrumbs" :key="crumb.id">
          <svg
            class="breadcrumb-separator"
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path
              d="M6 4L10 8L6 12"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <button
            @click="navigateToBreadcrumb(crumb)"
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

    <!-- Folder Actions Bar -->
    <div class="folder-actions-bar">
      <div class="left-actions">
        <button
          @click="toggleViewMode"
          class="action-button"
          :class="{ active: viewMode === 'grid' }"
          title="Grid View"
        >
          <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1 1h6v6H1V1zm8 0h6v6H9V1zM1 9h6v6H1V9zm8 0h6v6H9V9z" />
          </svg>
        </button>
        <button
          @click="toggleViewMode"
          class="action-button"
          :class="{ active: viewMode === 'list' }"
          title="List View"
        >
          <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M1 2h14M1 6h14M1 10h14M1 14h14"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <div class="separator"></div>

        <div class="sort-controls">
          <select v-model="sortBy" class="sort-select">
            <option value="name">Name</option>
            <option value="date_created">Date Created</option>
            <option value="date_modified">Date Modified</option>
            <option value="size">Size</option>
          </select>
          <button
            @click="toggleSortOrder"
            class="action-button"
            :title="sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'"
          >
            <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <path
                d="M8 2L4 6h8L8 2zm0 12L4 10h8l-4 4z"
                v-if="sortOrder === 'asc'"
              />
              <path d="M8 2L12 6H4l4-4zm0 12L12 10H4l4 4z" v-else />
            </svg>
          </button>
        </div>
      </div>

      <div class="right-actions">
        <button
          @click="showCreateFolderModal = true"
          class="action-button primary"
          title="New Folder"
        >
          <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M8 1a1 1 0 0 1 1 1v2h2a1 1 0 0 1 0 2H9v2a1 1 0 0 1-2 0V6H5a1 1 0 0 1 0-2h2V2a1 1 0 0 1 1-1z"
            />
          </svg>
          <span>New Folder</span>
        </button>
      </div>
    </div>

    <!-- Folder Content -->
    <div class="folder-content">
      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid-view">
        <div class="folder-grid">
          <div
            v-for="folder in sortedFolders"
            :key="folder.id"
            @click="navigateToFolder(folder)"
            @contextmenu="showContextMenu($event, folder)"
            class="folder-card"
            :class="{ selected: selectedItems.includes(folder.id) }"
          >
            <div class="folder-icon">
              <svg class="w-8 h-8" viewBox="0 0 16 16" fill="currentColor">
                <path
                  d="M2 4a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293L9.414 4H13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4z"
                />
              </svg>
            </div>
            <div class="folder-info">
              <h3 class="folder-title">{{ folder.title }}</h3>
              <p class="folder-stats">
                {{ folder.ac_replay_count + folder.sc_replay_count }} demos
              </p>
            </div>
            <div class="folder-actions">
              <button
                @click.stop="toggleStarFolder(folder.id)"
                class="star-button"
                :class="{ starred: starredFolders.includes(folder.id) }"
                title="Star folder"
              >
                <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="list-view">
        <div class="folder-list">
          <div
            v-for="folder in sortedFolders"
            :key="folder.id"
            @click="navigateToFolder(folder)"
            @contextmenu="showContextMenu($event, folder)"
            class="folder-item"
            :class="{ selected: selectedItems.includes(folder.id) }"
          >
            <div class="folder-icon">
              <svg class="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                <path
                  d="M2 4a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293L9.414 4H13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4z"
                />
              </svg>
            </div>
            <div class="folder-details">
              <h3 class="folder-title">{{ folder.title }}</h3>
              <p class="folder-description">
                {{ folder.description || "No description" }}
              </p>
            </div>
            <div class="folder-meta">
              <span class="demo-count"
                >{{
                  folder.ac_replay_count + folder.sc_replay_count
                }}
                demos</span
              >
              <span class="last-modified">{{
                formatDate(folder.last_modified_at)
              }}</span>
            </div>
            <div class="folder-actions">
              <button
                @click.stop="toggleStarFolder(folder.id)"
                class="star-button"
                :class="{ starred: starredFolders.includes(folder.id) }"
                title="Star folder"
              >
                <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="sortedFolders.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg class="w-12 h-12" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M2 4a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293L9.414 4H13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4z"
            />
          </svg>
        </div>
        <h3 class="empty-title">No folders found</h3>
        <p class="empty-description">
          {{
            currentFolder
              ? "This folder is empty"
              : "Create your first folder to get started"
          }}
        </p>
        <button @click="showCreateFolderModal = true" class="empty-action">
          Create Folder
        </button>
      </div>
    </div>

    <!-- Context Menu -->
    <div
      v-if="contextMenu.visible"
      class="context-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
      @click.stop
    >
      <div
        v-for="action in contextMenuActions"
        :key="action.id"
        @click="handleContextAction(action)"
        class="context-menu-item"
      >
        <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
          <path :d="getActionIcon(action.icon)" />
        </svg>
        <span>{{ action.label }}</span>
      </div>
    </div>

    <!-- Create Folder Modal -->
    <div
      v-if="showCreateFolderModal"
      class="modal-overlay"
      @click="showCreateFolderModal = false"
    >
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Create New Folder</h2>
          <button @click="showCreateFolderModal = false" class="close-button">
            <svg class="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="folder-name">Folder Name</label>
            <input
              id="folder-name"
              v-model="newFolderName"
              type="text"
              placeholder="Enter folder name"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="folder-description">Description (Optional)</label>
            <textarea
              id="folder-description"
              v-model="newFolderDescription"
              placeholder="Enter folder description"
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showCreateFolderModal = false" class="btn-secondary">
            Cancel
          </button>
          <button
            @click="createFolder"
            class="btn-primary"
            :disabled="!newFolderName.trim()"
          >
            Create Folder
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useFolderService } from "../services/folderService";
import type { Folder, FolderAction } from "../types/folder";

const {
  currentFolder,
  breadcrumbs,
  viewMode,
  sortBy,
  sortOrder,
  selectedItems,
  expandedFolders,
  starredFolders,
  currentFolderChildren,
  navigateToFolder,
  navigateToBreadcrumb,
  toggleStarFolder,
  getFolderActions,
  createFolder: createFolderService,
} = useFolderService();

// Local state
const showCreateFolderModal = ref(false);
const newFolderName = ref("");
const newFolderDescription = ref("");
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  folder: null as Folder | null,
});

// Computed
const sortedFolders = computed(() => {
  const folders = [...currentFolderChildren.value];

  return folders.sort((a, b) => {
    let comparison = 0;

    switch (sortBy.value) {
      case "name":
        comparison = a.title.localeCompare(b.title);
        break;
      case "date_created":
        comparison =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case "date_modified":
        comparison =
          new Date(a.last_modified_at).getTime() -
          new Date(b.last_modified_at).getTime();
        break;
      case "size":
        comparison =
          a.ac_replay_count +
          a.sc_replay_count -
          (b.ac_replay_count + b.sc_replay_count);
        break;
    }

    return sortOrder.value === "asc" ? comparison : -comparison;
  });
});

const contextMenuActions = computed(() => {
  if (!contextMenu.value.folder) return [];
  return getFolderActions(contextMenu.value.folder);
});

// Methods
const navigateToRoot = () => {
  navigateToFolder(null);
};

const toggleViewMode = () => {
  viewMode.value = viewMode.value === "grid" ? "list" : "grid";
};

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
};

const showContextMenu = (event: MouseEvent, folder: Folder) => {
  event.preventDefault();
  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    folder,
  };
};

const handleContextAction = (action: FolderAction) => {
  contextMenu.value.visible = false;

  switch (action.action) {
    case "open":
      navigateToFolder(contextMenu.value.folder!);
      break;
    case "toggle-star":
      toggleStarFolder(contextMenu.value.folder!.id);
      break;
    case "rename":
      // Implement rename functionality
      break;
    case "move":
      // Implement move functionality
      break;
    case "duplicate":
      // Implement duplicate functionality
      break;
    case "share":
      // Implement share functionality
      break;
    case "archive":
      // Implement archive functionality
      break;
    case "delete":
      // Implement delete functionality
      break;
  }
};

const createFolder = () => {
  if (!newFolderName.value.trim()) return;

  createFolderService(
    {
      title: newFolderName.value,
      description: newFolderDescription.value,
    },
    currentFolder.value?.id
  );

  // Reset form
  newFolderName.value = "";
  newFolderDescription.value = "";
  showCreateFolderModal.value = false;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const getActionIcon = (iconName: string) => {
  const icons: Record<string, string> = {
    "folder-open":
      "M2 4a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293L9.414 4H13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4z",
    star: "M8 1l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z",
    "star-filled": "M8 1l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z",
    edit: "M11 1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM4 3h8v2H4V3zm0 4h8v2H4V7zm0 4h5v2H4v-2z",
    move: "M8 1l4 4-4 4V8H1V6h7V1z",
    copy: "M4 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2V1zm8 0H6v14h6V1zm2 0h-2v14h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z",
    share:
      "M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm8 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    archive: "M2 4h12v1H2V4zm0 2h12v8H2V6zm2 2h8v4H4V8z",
    trash: "M5 1h6l1 2h4v1H1V3h4l1-2zm1 3v10h4V4H6z",
  };
  return icons[iconName] || icons["folder-open"];
};

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".context-menu")) {
    contextMenu.value.visible = false;
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
.folder-navigation {
  @apply flex flex-col h-full;
}

/* Breadcrumb Navigation */
.breadcrumb-container {
  @apply px-4 py-3 border-b border-gray-200 bg-white;
}

.breadcrumb-nav {
  @apply flex items-center space-x-2;
}

.breadcrumb-item {
  @apply flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors;
}

.breadcrumb-item.root {
  @apply font-medium;
}

.breadcrumb-item.active {
  @apply text-reprise-blue bg-reprise-sky font-medium;
}

.breadcrumb-separator {
  @apply text-gray-400;
}

/* Folder Actions Bar */
.folder-actions-bar {
  @apply flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white;
}

.left-actions {
  @apply flex items-center gap-2;
}

.right-actions {
  @apply flex items-center gap-2;
}

.action-button {
  @apply flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors;
}

.action-button.active {
  @apply text-reprise-blue bg-reprise-sky;
}

.action-button.primary {
  @apply bg-reprise-blue text-white hover:bg-reprise-deep-blue;
}

.separator {
  @apply w-px h-6 bg-gray-300 mx-2;
}

.sort-controls {
  @apply flex items-center gap-2;
}

.sort-select {
  @apply px-2 py-1 text-sm border border-gray-200 rounded-md bg-white;
}

/* Folder Content */
.folder-content {
  @apply flex-1 overflow-y-auto p-4;
}

/* Grid View */
.grid-view {
  @apply w-full;
}

.folder-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4;
}

.folder-card {
  @apply p-4 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:border-reprise-sky hover:shadow-sm bg-white;
}

.folder-card.selected {
  @apply border-reprise-blue bg-reprise-sky;
}

.folder-icon {
  @apply text-gray-400 mb-3;
}

.folder-info {
  @apply mb-3;
}

.folder-title {
  @apply text-sm font-medium text-gray-900 mb-1;
}

.folder-stats {
  @apply text-xs text-gray-500;
}

.folder-actions {
  @apply flex justify-end;
}

.star-button {
  @apply p-1 text-gray-400 hover:text-yellow-500 transition-colors;
}

.star-button.starred {
  @apply text-yellow-500;
}

/* List View */
.list-view {
  @apply w-full;
}

.folder-list {
  @apply space-y-2;
}

.folder-item {
  @apply flex items-center gap-4 p-3 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:border-reprise-sky hover:shadow-sm bg-white;
}

.folder-item.selected {
  @apply border-reprise-blue bg-reprise-sky;
}

.folder-details {
  @apply flex-1 min-w-0;
}

.folder-description {
  @apply text-xs text-gray-500 mt-1;
}

.folder-meta {
  @apply flex flex-col items-end text-xs text-gray-500;
}

.demo-count {
  @apply font-medium;
}

.last-modified {
  @apply mt-1;
}

/* Empty State */
.empty-state {
  @apply flex flex-col items-center justify-center py-12 text-center;
}

.empty-icon {
  @apply text-gray-300 mb-4;
}

.empty-title {
  @apply text-lg font-medium text-gray-900 mb-2;
}

.empty-description {
  @apply text-sm text-gray-500 mb-4;
}

.empty-action {
  @apply px-4 py-2 bg-reprise-blue text-white rounded-md hover:bg-reprise-deep-blue transition-colors;
}

/* Context Menu */
.context-menu {
  @apply absolute z-50 bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-48;
}

.context-menu-item {
  @apply flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer;
}

/* Modal */
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.modal {
  @apply bg-white rounded-lg shadow-xl max-w-md w-full mx-4;
}

.modal-header {
  @apply flex items-center justify-between p-4 border-b border-gray-200;
}

.modal-header h2 {
  @apply text-lg font-medium text-gray-900;
}

.close-button {
  @apply p-1 text-gray-400 hover:text-gray-600;
}

.modal-body {
  @apply p-4 space-y-4;
}

.form-group {
  @apply space-y-2;
}

.form-group label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-reprise-blue focus:border-transparent;
}

.form-textarea {
  @apply w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-reprise-blue focus:border-transparent resize-none;
}

.modal-footer {
  @apply flex justify-end gap-3 p-4 border-t border-gray-200;
}

.btn-secondary {
  @apply px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50;
}

.btn-primary {
  @apply px-4 py-2 text-sm text-white bg-reprise-blue rounded-md hover:bg-reprise-deep-blue disabled:opacity-50 disabled:cursor-not-allowed;
}

/* Custom scrollbar */
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
