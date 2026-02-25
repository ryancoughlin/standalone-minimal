<template>
  <div
    class="flex flex-col absolute top-0 left-0 h-full bg-white border-r border-gray-200 overflow-hidden transition-all duration-300 ease-in-out z-30"
    :class="showNavigationSidebar ? 'w-[190px] min-w-[190px] translate-x-0' : 'w-0 min-w-0 -translate-x-full'"
  >
    <div class="flex-1 overflow-y-auto">
      <div class="px-3 py-3">
        <div class="mb-4">
          <div class="px-2 py-2 flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Demo Library</span>
          </div>

          <!-- Home -->
          <button
            @click="$emit('navigate-section', 'home')"
            class="w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-md transition-all duration-200 hover:bg-reprise-off-white min-w-0"
            :class="currentSection === 'home' ? 'bg-reprise-sky text-reprise-deep-blue' : ''"
          >
            <i class="fas fa-home flex-shrink-0" :class="currentSection === 'home' ? 'text-reprise-deep-blue' : 'text-gray-500'"></i>
            <span class="text-xs font-medium truncate flex-1 min-w-0" :class="currentSection === 'home' ? 'text-reprise-deep-blue' : 'text-gray-900'">Home</span>
            <span class="text-xs px-1.5 py-0.5 rounded-full font-medium" :class="currentSection === 'home' ? 'text-reprise-deep-blue bg-reprise-sky' : 'text-gray-500 bg-gray-100'">{{ totalDemoCount }}</span>
          </button>

          <!-- All Demos -->
          <button
            @click="$emit('navigate-section', 'demos')"
            class="w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-md transition-all duration-200 hover:bg-reprise-off-white min-w-0"
            :class="currentSection === 'demos' ? 'bg-reprise-sky text-reprise-deep-blue' : ''"
          >
            <i class="fas fa-folder flex-shrink-0" :class="currentSection === 'demos' ? 'text-reprise-deep-blue' : 'text-gray-500'"></i>
            <span class="text-xs font-medium truncate flex-1 min-w-0" :class="currentSection === 'demos' ? 'text-reprise-deep-blue' : 'text-gray-900'">Library</span>
            <span class="text-xs px-1.5 py-0.5 rounded-full font-medium" :class="currentSection === 'demos' ? 'text-reprise-deep-blue bg-reprise-sky' : 'text-gray-500 bg-gray-100'">{{ totalDemoCount }}</span>
          </button>

          <!-- Recent Demos -->
          <button
            @click="$emit('navigate-section', 'recent')"
            class="w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-md transition-all duration-200 hover:bg-reprise-off-white min-w-0"
            :class="currentSection === 'recent' ? 'bg-reprise-sky text-reprise-deep-blue' : ''"
          >
            <i class="fas fa-clock flex-shrink-0" :class="currentSection === 'recent' ? 'text-reprise-deep-blue' : 'text-gray-500'"></i>
            <span class="text-xs font-medium truncate flex-1 min-w-0" :class="currentSection === 'recent' ? 'text-reprise-deep-blue' : 'text-gray-900'">Recent</span>
            <span class="text-xs px-1.5 py-0.5 rounded-full font-medium" :class="currentSection === 'recent' ? 'text-reprise-deep-blue bg-reprise-sky' : 'text-gray-500 bg-gray-100'">{{ recentDemoCount }}</span>
          </button>

          <!-- Shared with me -->
          <button
            @click="$emit('navigate-section', 'shared')"
            class="w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-md transition-all duration-200 hover:bg-reprise-off-white min-w-0"
            :class="currentSection === 'shared' ? 'bg-reprise-sky text-reprise-deep-blue' : ''"
          >
            <i class="fas fa-users flex-shrink-0" :class="currentSection === 'shared' ? 'text-reprise-deep-blue' : 'text-gray-500'"></i>
            <span class="text-xs font-medium truncate flex-1 min-w-0" :class="currentSection === 'shared' ? 'text-reprise-deep-blue' : 'text-gray-900'">Shared with me</span>
            <span class="text-xs px-1.5 py-0.5 rounded-full font-medium" :class="currentSection === 'shared' ? 'text-reprise-deep-blue bg-reprise-sky' : 'text-gray-500 bg-gray-100'">{{ sharedDemoCount }}</span>
          </button>
        </div>

        <!-- Folders Section -->
        <div class="space-y-1">
          <div class="px-2 py-2 flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Folders</span>
          </div>
          <div
            v-for="folder in allFolders"
            :key="folder.id"
            class="space-y-1"
          >
            <button
              @click="$emit('select-folder', folder)"
              class="w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-md transition-all duration-200 hover:bg-reprise-off-white min-w-0"
              :class="[
                currentFolder?.id === folder.id ? 'bg-reprise-sky text-reprise-deep-blue' : '',
                folder.parent_id === null ? 'font-medium' : 'ml-4',
              ]"
            >
              <i class="fas fa-folder flex-shrink-0" :class="currentFolder?.id === folder.id ? 'text-reprise-deep-blue' : 'text-gray-500'"></i>
              <span class="text-xs font-medium truncate flex-1 min-w-0" :class="currentFolder?.id === folder.id ? 'text-reprise-deep-blue' : 'text-gray-900'">{{ folder.title }}</span>
              <span class="text-xs px-1.5 py-0.5 rounded-full font-medium" :class="currentFolder?.id === folder.id ? 'text-reprise-deep-blue bg-reprise-sky' : 'text-gray-500 bg-gray-100'">{{ folder.total_demo_count }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showNavigationSidebar: boolean;
  currentFolder: any;
  allFolders: any[];
  totalDemoCount: number;
  recentDemoCount: number;
  sharedDemoCount: number;
  currentSection: string;
}

interface Emits {
  (e: "select-folder", folder: any): void;
  (e: "navigate-section", section: string): void;
  (e: "create-folder"): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<style scoped>
/* Scrollbar — pseudo-elements require CSS */
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
