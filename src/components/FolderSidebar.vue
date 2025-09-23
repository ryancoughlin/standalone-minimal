<template>
  <div
    class="fixed top-0 left-0 h-full bg-white border-r border-gray-300 z-[9999] transition-all duration-300 ease-in-out"
    :class="isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'"
    style="box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1)"
  >
    <div class="h-full flex flex-col">
      <!-- Sidebar Header -->
      <div
        class="px-4 py-3 border-b border-gray-200 flex items-center justify-between"
      >
        <h2 class="text-sm font-medium text-gray-900">Folders</h2>
        <button
          @click="$emit('close')"
          class="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>

      <!-- Folder List -->
      <div class="flex-1 overflow-y-auto py-2">
        <div class="space-y-1">
          <!-- Root Folders -->
          <div v-for="folder in rootFolders" :key="folder.id" class="group">
            <button
              @click="toggleFolder(folder.id)"
              class="w-full px-4 py-2 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-gray-400 transition-transform duration-200"
                  :class="{ 'rotate-90': expandedFolders.includes(folder.id) }"
                  width="16"
                  height="16"
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
                <svg
                  class="w-4 h-4 text-gray-400"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path
                    d="M2 4a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293L9.414 4H13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4z"
                  />
                </svg>
                <span class="text-sm text-gray-900">{{ folder.title }}</span>
              </div>
              <span class="text-xs text-gray-500">{{
                folder.ac_replay_count + folder.sc_replay_count
              }}</span>
            </button>

            <!-- Subfolders -->
            <div
              v-if="expandedFolders.includes(folder.id)"
              class="ml-6 space-y-1"
            >
              <button
                v-for="subfolder in getSubfolders(folder.id)"
                :key="subfolder.id"
                @click="selectFolder(subfolder)"
                class="w-full px-4 py-1.5 text-left flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <svg
                  class="w-3 h-3 text-gray-400"
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path
                    d="M2 4a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293L9.414 4H13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4z"
                  />
                </svg>
                <span class="text-sm text-gray-700">{{ subfolder.title }}</span>
                <span class="text-xs text-gray-500">{{
                  subfolder.ac_replay_count + subfolder.sc_replay_count
                }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Backdrop -->
  <div
    v-if="isOpen"
    @click="$emit('close')"
    class="fixed inset-0 bg-black bg-opacity-25 z-[9998] transition-opacity duration-300"
  ></div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { folders } from "../data/mockData";

interface Folder {
  id: string;
  title: string;
  parent_id: string | null;
  sort_index: number;
  archived: boolean;
  acl: any;
  ac_replay_count: number;
  sc_replay_count: number;
  created_by: string;
}

interface Props {
  isOpen: boolean;
}

interface Emits {
  (e: "close"): void;
  (e: "selectFolder", folder: Folder): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const expandedFolders = ref<string[]>([]);

const rootFolders = computed(() => {
  return folders
    .filter((folder) => folder.parent_id === null)
    .sort((a, b) => a.sort_index - b.sort_index);
});

const getSubfolders = (parentId: string) => {
  return folders
    .filter((folder) => folder.parent_id === parentId)
    .sort((a, b) => a.sort_index - b.sort_index);
};

const toggleFolder = (folderId: string) => {
  const index = expandedFolders.value.indexOf(folderId);
  if (index > -1) {
    expandedFolders.value.splice(index, 1);
  } else {
    expandedFolders.value.push(folderId);
  }
};

const selectFolder = (folder: Folder) => {
  emit("selectFolder", folder);
};
</script>

<style scoped>
/* Custom scrollbar for webkit browsers */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
