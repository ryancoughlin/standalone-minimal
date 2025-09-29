<template>
  <div
    class="folder-sidebar border-r"
    :class="{ 'sidebar-open': showFolderSidebar }"
  >
    <!-- Navigation List -->
    <div class="folder-list-container">
      <div class="px-3 py-3">
        <!-- Demo Library Section -->
        <div class="navigation-section">
          <div class="section-header">
            <span class="section-title">Demo Library</span>
          </div>

          <!-- All Demos -->
          <button
            @click="$emit('navigate-section', 'demos')"
            class="nav-item"
            :class="{ 'nav-selected': currentSection === 'demos' }"
            v-motion
            :initial="{ opacity: 0, x: -10 }"
            :enter="{
              opacity: 1,
              x: 0,
              transition: { duration: 150, delay: 100, ease: 'easeOut' },
            }"
            :hover="{ x: 2, transition: { duration: 150 } }"
          >
            <div class="nav-icon">
              <i class="fas fa-folder text-gray-500"></i>
            </div>
            <span class="nav-name">Demos</span>
            <div class="nav-badge">{{ totalDemoCount }}</div>
          </button>

          <!-- Recent Demos -->
          <button
            @click="$emit('navigate-section', 'recent')"
            class="nav-item"
            :class="{ 'nav-selected': currentSection === 'recent' }"
            v-motion
            :initial="{ opacity: 0, x: -10 }"
            :enter="{
              opacity: 1,
              x: 0,
              transition: { duration: 150, delay: 130, ease: 'easeOut' },
            }"
            :hover="{ x: 2, transition: { duration: 150 } }"
          >
            <div class="nav-icon">
              <i class="fas fa-clock text-gray-500"></i>
            </div>
            <span class="nav-name">Recent</span>
            <div class="nav-badge">{{ recentDemoCount }}</div>
          </button>

          <!-- Shared with me -->
          <button
            @click="$emit('navigate-section', 'shared')"
            class="nav-item"
            :class="{ 'nav-selected': currentSection === 'shared' }"
            v-motion
            :initial="{ opacity: 0, x: -10 }"
            :enter="{
              opacity: 1,
              x: 0,
              transition: { duration: 150, delay: 160, ease: 'easeOut' },
            }"
            :hover="{ x: 2, transition: { duration: 150 } }"
          >
            <div class="nav-icon">
              <i class="fas fa-users text-gray-500"></i>
            </div>
            <span class="nav-name">Shared with me</span>
            <div class="nav-badge">{{ sharedDemoCount }}</div>
          </button>
        </div>

        <!-- Starred Section -->
        <div class="starred-section">
          <div class="section-header">
            <span class="section-title">Starred</span>
          </div>
          <button
            @click="$emit('navigate-section', 'starred')"
            class="nav-item"
            :class="{ 'nav-selected': currentSection === 'starred' }"
            v-motion
            :initial="{ opacity: 0, x: -10 }"
            :enter="{
              opacity: 1,
              x: 0,
              transition: { duration: 150, delay: 200, ease: 'easeOut' },
            }"
            :hover="{ x: 2, transition: { duration: 150 } }"
          >
            <div class="nav-icon">
              <i class="fas fa-star text-gray-500"></i>
            </div>
            <span class="nav-name">Starred</span>
            <div class="nav-badge">{{ starredDemoCount }}</div>
          </button>

          <!-- Starred Items -->
          <div
            v-for="(item, index) in starredItems"
            :key="item.id"
            class="starred-group"
          >
            <button
              @click="$emit('select-starred-item', item)"
              class="nav-item starred-item"
              :class="{ 'nav-selected': currentStarredItem?.id === item.id }"
              v-motion
              :initial="{ opacity: 0, x: -10 }"
              :enter="{
                opacity: 1,
                x: 0,
                transition: {
                  duration: 150,
                  delay: 230 + index * 30,
                  ease: 'easeOut',
                },
              }"
              :hover="{ x: 2, transition: { duration: 150 } }"
            >
              <div class="nav-icon">
                <i class="fas fa-folder text-gray-500"></i>
              </div>
              <span class="nav-name">{{ item.title }}</span>
              <div class="nav-badge">{{ item.demoCount }}</div>
            </button>
          </div>
        </div>

        <!-- Folders Section -->
        <div class="folders-section">
          <div class="section-header">
            <span class="section-title">Folders</span>
            <button
              @click="$emit('create-folder')"
              class="add-folder-btn"
              title="Add Folder"
            >
              <i class="fas fa-plus text-gray-400"></i>
            </button>
          </div>
          <div
            v-for="(folder, index) in allFolders"
            :key="folder.id"
            class="folder-group"
          >
            <button
              @click="$emit('select-folder', folder)"
              class="nav-item"
              :class="{
                'nav-selected': currentFolder?.id === folder.id,
                'folder-parent': folder.parent_id === null,
                'folder-child': folder.parent_id !== null,
              }"
              v-motion
              :initial="{ opacity: 0, x: -10 }"
              :enter="{
                opacity: 1,
                x: 0,
                transition: {
                  duration: 150,
                  delay: 300 + index * 30,
                  ease: 'easeOut',
                },
              }"
              :hover="{ x: 2, transition: { duration: 150 } }"
            >
              <div class="nav-icon">
                <i class="fas fa-folder text-gray-500"></i>
              </div>
              <span class="nav-name">{{ folder.title }}</span>
              <div class="nav-badge">
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
  recentDemoCount: number;
  sharedDemoCount: number;
  starredDemoCount: number;
  starredItems: any[];
  currentSection: string;
  currentStarredItem: any;
}

interface Emits {
  (e: "select-folder", folder: any): void;
  (e: "navigate-section", section: string): void;
  (e: "select-starred-item", item: any): void;
  (e: "create-folder"): void;
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
  min-width: 0;
}

.folder-sidebar.sidebar-open {
  width: 190px;
  transform: translateX(0);
  min-width: 190px;
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

/* Starred Section */
.starred-section {
  @apply mb-4;
}

.starred-group {
  @apply space-y-1;
}

/* Folders Section */
.folders-section {
  @apply space-y-1;
}

.folder-group {
  @apply space-y-1;
}

/* Navigation Items */
.nav-item {
  @apply w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-md transition-all duration-200 hover:bg-reprise-off-white min-w-0;
}

.nav-item.nav-selected {
  @apply bg-reprise-sky text-reprise-deep-blue;
}

.nav-item.folder-parent {
  @apply font-medium;
}

.nav-item.folder-child {
  @apply ml-4;
}

.nav-item.starred-item {
  @apply ml-4;
}

.nav-icon {
  @apply flex-shrink-0 text-gray-500;
}

.nav-item.nav-selected .nav-icon {
  @apply text-reprise-deep-blue;
}

.nav-name {
  @apply text-xs font-medium text-gray-900 truncate flex-1 min-w-0;
}

.nav-item.nav-selected .nav-name {
  @apply text-reprise-deep-blue;
}

.nav-badge {
  @apply text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full font-medium;
}

.nav-item.nav-selected .nav-badge {
  @apply text-reprise-deep-blue bg-reprise-sky;
}

/* Section Header with Add Button */
.section-header {
  @apply px-2 py-2 flex items-center justify-between;
}

.add-folder-btn {
  @apply w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors;
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
