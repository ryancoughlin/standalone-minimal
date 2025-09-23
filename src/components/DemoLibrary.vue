<template>
  <!-- Folder Sidebar -->
  <FolderSidebar
    :isOpen="sidebarOpen"
    @close="sidebarOpen = false"
    @selectFolder="handleFolderSelect"
  />

  <div
    class="fixed top-5 right-5 w-96 max-h-[600px] bg-white border-2 border-black rounded-md z-[10000] overflow-hidden transition-all duration-300"
    :class="{ 'ml-64': sidebarOpen }"
    style="
      position: fixed;
      top: 20px;
      right: 20px;
      width: 384px;
      max-height: 600px;
      background: white;
      border: 2px solid black;
      border-radius: 6px;
      box-shadow: 0 0 0 5px #11182729, 0 4px 24px #0000001a,
        0 20px 40px -5px #00000080;
      z-index: 10000;
      overflow: hidden;
    "
  >
    <div class="max-h-[580px] overflow-y-auto">
      <!-- Top Bar with Logo and Close Button -->
      <div class="px-4 py-3 border-b border-gray-200">
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-2">
            <button
              @click="sidebarOpen = true"
              class="w-7 h-7 flex items-center justify-center border-none bg-transparent text-gray-500 cursor-pointer rounded transition-all duration-200 hover:bg-gray-100 hover:text-gray-700"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path
                  d="M2 4a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293L9.414 4H13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4z"
                />
              </svg>
            </button>
            <img
              src="/src/Reprise Logo.svg"
              alt="Reprise Logo"
              class="w-5 h-5 object-contain"
            />
            <span class="text-sm font-medium text-gray-600">Reprise</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="w-7 h-7 flex items-center justify-center border-none bg-transparent text-gray-500 cursor-pointer rounded transition-all duration-200 hover:bg-gray-100 hover:text-gray-700"
              @click="handleBack"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button
              class="w-7 h-7 flex items-center justify-center border-none bg-transparent text-gray-500 cursor-pointer rounded transition-all duration-200 hover:bg-gray-100 hover:text-gray-700"
              @click="handleClose"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path
                  d="M12 4L4 12M4 4L12 12"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Title with Breadcrumbs -->
      <div class="px-4 py-3">
        <div v-if="currentFolder" class="mb-2">
          <nav class="flex items-center gap-1 text-xs text-gray-500">
            <button
              @click="goToRoot"
              class="hover:text-gray-700 transition-colors"
            >
              All Demos
            </button>
            <span>/</span>
            <span class="text-gray-900">{{ currentFolder.title }}</span>
          </nav>
        </div>
        <h1 class="text-lg font-semibold text-gray-900 m-0">
          {{ currentFolder ? currentFolder.title : "Demos" }}
        </h1>
      </div>

      <!-- Search Bar with Filter and New Demo Button -->
      <div class="px-4 pb-3">
        <div class="flex items-center gap-3">
          <div class="flex-1 relative flex items-center">
            <svg
              class="absolute left-3 text-gray-400 z-10"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path
                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search Demos"
              class="w-full pl-9 pr-9 py-2 border border-gray-300 rounded text-sm bg-white transition-all duration-200 focus:outline-none focus:border-gray-400"
              v-model="searchQuery"
            />
            <button
              class="absolute right-3 w-5 h-5 flex items-center justify-center border-none bg-transparent text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path
                  d="M2 4h12M4 8h8M6 12h4"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>
          <button
            class="px-4 py-2 bg-purple-600 text-white border-none rounded text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-purple-700"
          >
            New Demo
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <div class="animate-pulse" v-for="i in 5" :key="i">
          <div class="flex items-center space-x-4">
            <div class="w-20 h-16 bg-gray-200 rounded" />
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-3/4" />
              <div class="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>

      <!-- Demo Content -->
      <div v-else class="px-4 pb-4">
        <!-- All Demos List -->
        <div class="flex flex-col gap-2">
          <!-- Maestro Demos (Reveal) -->
          <div
            v-for="(demo, index) in filteredMaestroDemos"
            :key="`maestro-${index}`"
            class="flex items-center gap-3 p-3 rounded cursor-pointer transition-all duration-200 hover:bg-gray-50 border border-transparent hover:border-gray-200"
            @click="handlePlayDemo(demo)"
          >
            <div
              class="w-12 h-8 flex-shrink-0 rounded overflow-hidden bg-gray-100"
            >
              <img
                v-if="demo.poster_image && !imageErrors[`maestro-${index}`]"
                :src="demo.poster_image"
                @error="imageErrors[`maestro-${index}`] = true"
                alt="demo screenshot"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-gray-100 flex items-center justify-center"
              >
                <span class="text-lg text-gray-400">📷</span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-900 mb-1 leading-tight">
                {{ demo.title }}
              </div>
              <div class="flex flex-col gap-0.5">
                <div class="flex items-center gap-1">
                  <span
                    class="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
                  >
                    <svg
                      class="text-gray-400"
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path
                        d="M3 2h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"
                      />
                    </svg>
                    No Dataset
                  </span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="flex items-center gap-1 text-xs text-gray-500">
                    <svg
                      class="text-gray-400"
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path
                        d="M2 4a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293L9.414 4H13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4z"
                      />
                    </svg>
                    {{ getFolderName(demo.replay_folder_id) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <svg
                class="text-gray-500"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="currentColor"
                  stroke-width="1"
                  fill="none"
                />
                <path d="M6 4L12 8L6 12V4z" fill="currentColor" />
              </svg>
              <span class="text-xs text-gray-500 font-medium">{{
                demo.play_count || 0
              }}</span>
            </div>
          </div>

          <!-- Legacy Demos (Replay) -->
          <div
            v-for="(demo, index) in filteredLegacyDemos"
            :key="`legacy-${index}`"
            class="flex items-center gap-3 p-3 rounded cursor-pointer transition-all duration-200 hover:bg-gray-50 border border-transparent hover:border-gray-200"
            @click="handlePlayDemo(demo)"
          >
            <div
              class="w-12 h-8 flex-shrink-0 rounded overflow-hidden bg-gray-100"
            >
              <img
                v-if="demo.screenshot_small && !imageErrors[`legacy-${index}`]"
                :src="getScreenshotUrl(demo.screenshot_small)"
                @error="imageErrors[`legacy-${index}`] = true"
                alt="demo screenshot"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-gray-100 flex items-center justify-center"
              >
                <span class="text-lg text-gray-400">📷</span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-900 mb-1 leading-tight">
                {{ demo.title }}
              </div>
              <div class="flex flex-col gap-0.5">
                <div class="flex items-center gap-1">
                  <span
                    class="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
                  >
                    <svg
                      class="text-gray-400"
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path
                        d="M3 2h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"
                      />
                    </svg>
                    No Dataset
                  </span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="flex items-center gap-1 text-xs text-gray-500">
                    <svg
                      class="folder-icon"
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path
                        d="M2 4a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293L9.414 4H13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4z"
                      />
                    </svg>
                    {{ getFolderName(demo.folder_id) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <svg
                class="text-gray-500"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="currentColor"
                  stroke-width="1"
                  fill="none"
                />
                <path d="M6 4L12 8L6 12V4z" fill="currentColor" />
              </svg>
              <span class="play-number">0</span>
            </div>
          </div>

          <!-- Live Demos (Replicate) -->
          <div
            v-for="(demo, index) in filteredLiveDemos"
            :key="`live-${index}`"
            class="flex items-center gap-3 p-3 rounded cursor-pointer transition-all duration-200 hover:bg-gray-50 border border-transparent hover:border-gray-200"
            @click="handlePlayDemo(demo)"
          >
            <div
              class="w-12 h-8 flex-shrink-0 rounded overflow-hidden bg-gray-100"
            >
              <img
                v-if="demo.screenshot_small && !imageErrors[`live-${index}`]"
                :src="getScreenshotUrl(demo.screenshot_small)"
                @error="imageErrors[`live-${index}`] = true"
                alt="demo screenshot"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-gray-100 flex items-center justify-center"
              >
                <span class="text-lg text-gray-400">📷</span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-900 mb-1 leading-tight">
                {{ demo.title }}
              </div>
              <div class="flex flex-col gap-0.5">
                <div class="flex items-center gap-1">
                  <span
                    class="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
                  >
                    <svg
                      class="text-gray-400"
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path
                        d="M3 2h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"
                      />
                    </svg>
                    No Dataset
                  </span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="flex items-center gap-1 text-xs text-gray-500">
                    <svg
                      class="folder-icon"
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path
                        d="M2 4a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293L9.414 4H13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4z"
                      />
                    </svg>
                    {{ getFolderName(demo.folder_id) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <svg
                class="text-gray-500"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="currentColor"
                  stroke-width="1"
                  fill="none"
                />
                <path d="M6 4L12 8L6 12V4z" fill="currentColor" />
              </svg>
              <span class="play-number">0</span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="totalDemoCount === 0" class="text-center py-8 px-4">
          <div class="text-gray-400 mb-3">
            <span class="text-3xl">📁</span>
          </div>
          <h3 class="text-base font-medium text-gray-900 mb-1 m-0">
            No demos found
          </h3>
          <p class="text-sm text-gray-500 m-0">
            Create your first demo to get started.
          </p>
        </div>

        <!-- No Search Results -->
        <div
          v-else-if="searchQuery && filteredTotalCount === 0"
          class="text-center py-8 px-4"
        >
          <div class="text-gray-400 mb-3">
            <span class="text-3xl">🔍</span>
          </div>
          <h3 class="text-base font-medium text-gray-900 mb-1 m-0">
            No demos match your search
          </h3>
          <p class="text-sm text-gray-500 m-0">
            Try adjusting your search terms.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useDemoLibrary } from "../composables/useDemoLibrary";
import FolderSidebar from "./FolderSidebar.vue";
import { folders } from "../data/mockData";

const {
  maestroDemos,
  legacyDemos,
  liveDemos,
  totalDemoCount,
  loading,
  fetchAllDemos,
} = useDemoLibrary();

// Search functionality
const searchQuery = ref("");
const imageErrors = ref<Record<string, boolean>>({});

// Sidebar and folder functionality
const sidebarOpen = ref(false);
const currentFolder = ref<any>(null);

// Filtered demos based on search
const filteredMaestroDemos = computed(() => {
  if (!searchQuery.value) return maestroDemos.value;
  return maestroDemos.value.filter((demo) =>
    demo.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredLegacyDemos = computed(() => {
  if (!searchQuery.value) return legacyDemos.value;
  return legacyDemos.value.filter((demo) =>
    demo.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredLiveDemos = computed(() => {
  if (!searchQuery.value) return liveDemos.value;
  return liveDemos.value.filter((demo) =>
    demo.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredTotalCount = computed(
  () =>
    filteredMaestroDemos.value.length +
    filteredLegacyDemos.value.length +
    filteredLiveDemos.value.length
);

const getFolderName = (folderId: string) => {
  // Simple folder mapping - in real app this would come from folder service
  const folders: Record<string, string> = {
    folder1: "Marketing Demos",
    folder2: "Sales Demos",
    folder3: "Training",
  };
  return folders[folderId] || "Default";
};

const getScreenshotUrl = (screenshotSmall: string) => {
  if (!screenshotSmall) return "";
  if (screenshotSmall.startsWith("data:")) {
    return screenshotSmall;
  }
  return `data:image/png;base64,${screenshotSmall}`;
};

const handlePlayDemo = (demo: any) => {
  console.log("Playing demo:", demo);
  // In real app, this would open the demo
  alert(`Playing demo: ${demo.title}`);
};

const handleBack = () => {
  console.log("Back button clicked");
  // In real app, this would navigate back
};

const handleClose = () => {
  console.log("Close button clicked");
  // In real app, this would close the extension
};

// Folder handling functions
const handleFolderSelect = (folder: any) => {
  currentFolder.value = folder;
  sidebarOpen.value = false;
  // Filter demos by folder
  // This would be implemented to filter demos based on folder
};

const goToRoot = () => {
  currentFolder.value = null;
};

onMounted(async () => {
  await fetchAllDemos();
});
</script>

<style scoped>
/* Import fonts */
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap");

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
