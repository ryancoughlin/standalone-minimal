<template>
  <!-- Unified Demo Library with Expandable Folder Sidebar -->
  <div
    class="demo-library-container"
    :class="{ 'with-sidebar': showFolderSidebar }"
    style="
      position: fixed;
      top: 20px;
      right: 20px;
      width: 384px;
      height: calc(100vh - 40px);
      background: white;
      border: 2px solid black;
      border-radius: 6px;
      box-shadow: 0 0 0 5px #11182729, 0 4px 24px #0000001a,
        0 20px 40px -5px #00000080;
      z-index: 10000;
      overflow: hidden;
      transition: all 0.3s ease-in-out;
    "
  >
    <!-- Folder Sidebar (Left Side) -->
    <div class="folder-sidebar" :class="{ 'sidebar-open': showFolderSidebar }">
      <!-- Folder List -->
      <div class="folder-list-container">
        <div class="px-3 py-3">
          <!-- All Folders Option -->
          <button
            @click="handleSelectFolder(null)"
            class="folder-item"
            :class="{ 'folder-selected': !currentFolder }"
          >
            <div class="folder-icon">
              <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path
                  d="M8 1L1 4v8l7 3 7-3V4L8 1zM2 5.5L8 3l6 2.5v5L8 12.5 2 10.5v-5z"
                />
              </svg>
            </div>
            <span class="folder-name">All Folders</span>
            <div class="folder-badge">{{ totalDemoCount }}</div>
          </button>

          <!-- Root Folders -->
          <div class="folder-section">
            <div
              v-for="folder in rootFolders"
              :key="folder.id"
              class="folder-group"
            >
              <button
                @click="toggleFolder(folder.id)"
                class="folder-item folder-parent"
                :class="{ 'folder-selected': currentFolder?.id === folder.id }"
              >
                <div class="folder-icon">
                  <svg
                    class="w-4 h-4 transition-transform duration-200"
                    :class="{
                      'rotate-90': expandedFolders.includes(folder.id),
                    }"
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
                </div>
                <span class="folder-name">{{ folder.title }}</span>
                <div class="folder-badge">
                  {{ folder.total_demo_count }}
                </div>
              </button>

              <!-- Subfolders -->
              <div
                v-if="expandedFolders.includes(folder.id)"
                class="subfolder-container"
              >
                <button
                  v-for="subfolder in getSubfolders(folder.id)"
                  :key="subfolder.id"
                  @click="selectFolder(subfolder)"
                  class="folder-item folder-child"
                  :class="{
                    'folder-selected': currentFolder?.id === subfolder.id,
                  }"
                >
                  <div class="folder-icon">
                    <svg
                      class="w-3 h-3"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path
                        d="M2 4a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293L9.414 4H13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4z"
                      />
                    </svg>
                  </div>
                  <span class="folder-name">{{ subfolder.title }}</span>
                  <div class="folder-badge">
                    {{ subfolder.total_demo_count }}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Demo Content (Right Side) -->
    <div class="demo-content">
      <!-- Global Navigation -->
      <GlobalNavigation @back="handleBack" @close="handleClose" />

      <!-- Content Area -->
      <div class="flex-1 overflow-y-auto">
        <!-- Welcome Message -->
        <div class="px-4 py-8">
          <h2 class="text-2xl font-serif text-gray-900 text-center">
            Welcome, Will.
          </h2>
        </div>

        <!-- Breadcrumb Navigation -->
        <div class="px-4 py-3">
          <nav class="breadcrumb-nav" aria-label="Folder navigation">
            <!-- Folder Toggle Button -->
            <button
              @click="showFolderSidebar = !showFolderSidebar"
              class="folder-toggle-button"
              :class="{ 'toggle-active': showFolderSidebar }"
              title="Toggle Folders"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="transition-transform duration-200"
                :class="{ 'rotate-180': showFolderSidebar }"
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
            </button>

            <button
              @click="handleSelectFolder(null)"
              class="breadcrumb-item"
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

        <!-- Search Bar with Filter and New Demo Button -->
        <div class="px-4 pb-4">
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
                class="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-md text-sm bg-reprise-off-white transition-all duration-200 focus:outline-none focus:border-reprise-blue focus:ring-1 focus:ring-reprise-blue"
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
              class="px-4 py-2.5 bg-reprise-blue text-white border-none rounded-md text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-reprise-deep-blue"
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
          <div class="flex flex-col gap-1">
            <!-- Maestro Demos (Reveal) -->
            <div
              v-for="(demo, index) in filteredMaestroDemos"
              :key="`maestro-${index}`"
              class="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-reprise-off-white border border-gray-100 hover:border-reprise-sky hover:shadow-sm group"
              @click="handlePlayDemo(demo)"
            >
              <div
                class="w-20 h-14 flex-shrink-0 rounded-md overflow-hidden bg-reprise-off-white border border-gray-100"
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
                <div
                  class="text-sm font-medium text-gray-900 mb-1 leading-tight group-hover:text-reprise-deep-blue transition-colors"
                >
                  {{ demo.title }}
                </div>
                <div class="flex flex-col gap-0.5">
                  <div class="flex items-center gap-1">
                    <span
                      class="flex items-center gap-1 text-xs text-reprise-deep-blue bg-reprise-sky px-2 py-1 rounded-md font-medium"
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
                    <span
                      class="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md"
                    >
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
              class="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-reprise-off-white border border-gray-100 hover:border-reprise-sky hover:shadow-sm group"
              @click="handlePlayDemo(demo)"
            >
              <div
                class="w-20 h-14 flex-shrink-0 rounded-md overflow-hidden bg-reprise-off-white border border-gray-100"
              >
                <img
                  v-if="
                    demo.screenshot_small && !imageErrors[`legacy-${index}`]
                  "
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
                <div
                  class="text-sm font-medium text-gray-900 mb-1 leading-tight group-hover:text-reprise-deep-blue transition-colors"
                >
                  {{ demo.title }}
                </div>
                <div class="flex flex-col gap-0.5">
                  <div class="flex items-center gap-1">
                    <span
                      class="flex items-center gap-1 text-xs text-reprise-deep-blue bg-reprise-sky px-2 py-1 rounded-md font-medium"
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
                    <span
                      class="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md"
                    >
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
              class="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-reprise-off-white border border-gray-100 hover:border-reprise-sky hover:shadow-sm group"
              @click="handlePlayDemo(demo)"
            >
              <div
                class="w-20 h-14 flex-shrink-0 rounded-md overflow-hidden bg-reprise-off-white border border-gray-100"
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
                <div
                  class="text-sm font-medium text-gray-900 mb-1 leading-tight group-hover:text-reprise-deep-blue transition-colors"
                >
                  {{ demo.title }}
                </div>
                <div class="flex flex-col gap-0.5">
                  <div class="flex items-center gap-1">
                    <span
                      class="flex items-center gap-1 text-xs text-reprise-deep-blue bg-reprise-sky px-2 py-1 rounded-md font-medium"
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
                    <span
                      class="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md"
                    >
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useDemoLibrary } from "../composables/useDemoLibrary";
import { useFolderService } from "../services/folderService";
import GlobalNavigation from "./GlobalNavigation.vue";

const { maestroDemos, legacyDemos, liveDemos, loading, fetchAllDemos } =
  useDemoLibrary();

const {
  currentFolder,
  expandedFolders,
  rootFolders,
  totalDemoCount,
  getSubfolders,
  toggleFolder,
  selectFolder,
  getFolderPath,
  getDemosInFolder,
} = useFolderService();

// Search functionality
const searchQuery = ref("");
const imageErrors = ref<Record<string, boolean>>({});

// Folder sidebar functionality
const showFolderSidebar = ref(false);
const breadcrumbs = ref<any[]>([]);

// Filtered demos based on search and folder
const filteredMaestroDemos = computed(() => {
  const folderDemos = getDemosInFolder(currentFolder.value?.id || null);
  let demos = folderDemos.maestro;

  // Filter by search
  if (searchQuery.value) {
    demos = demos.filter((demo) =>
      demo.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return demos;
});

const filteredLegacyDemos = computed(() => {
  const folderDemos = getDemosInFolder(currentFolder.value?.id || null);
  let demos = folderDemos.legacy;

  // Filter by search
  if (searchQuery.value) {
    demos = demos.filter((demo) =>
      demo.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return demos;
});

const filteredLiveDemos = computed(() => {
  const folderDemos = getDemosInFolder(currentFolder.value?.id || null);
  let demos = folderDemos.live;

  // Filter by search
  if (searchQuery.value) {
    demos = demos.filter((demo) =>
      demo.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return demos;
});

const filteredTotalCount = computed(
  () =>
    filteredMaestroDemos.value.length +
    filteredLegacyDemos.value.length +
    filteredLiveDemos.value.length
);

const getFolderName = (folderId: string) => {
  const folder =
    rootFolders.value.find((f) => f.id === folderId) ||
    foldersWithCounts.value.find((f) => f.id === folderId);
  return folder?.title || "Unknown Folder";
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
const handleSelectFolder = (folder: any) => {
  selectFolder(folder);
  updateBreadcrumbs(folder);
};

const updateBreadcrumbs = (folder: any) => {
  if (folder) {
    breadcrumbs.value = getFolderPath(folder.id).map((f) => ({
      id: f.id,
      title: f.title,
      level: breadcrumbs.value.length,
    }));
  } else {
    breadcrumbs.value = [];
  }
};

const navigateToBreadcrumb = (crumb: any) => {
  const folder =
    rootFolders.value.find((f) => f.id === crumb.id) ||
    foldersWithCounts.value.find((f) => f.id === crumb.id);
  handleSelectFolder(folder || null);
};

onMounted(async () => {
  await fetchAllDemos();
});
</script>

<style scoped>
/* Unified Container Layout */
.demo-library-container {
  @apply flex;
}

.demo-library-container.with-sidebar {
  width: 544px !important; /* 384px + 160px */
}

/* Folder Sidebar */
.folder-sidebar {
  @apply flex flex-col w-0 overflow-hidden transition-all duration-300 ease-in-out;
  width: 0;
}

.folder-sidebar.sidebar-open {
  width: 160px;
}

/* Folder Toggle Button */
.folder-toggle-button {
  @apply w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200 mr-2;
}

.folder-toggle-button.toggle-active {
  @apply text-reprise-blue bg-reprise-sky;
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

/* Demo Content */
.demo-content {
  @apply flex flex-col flex-1 min-w-0;
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
