<template>
  <!-- Unified Demo Library with Expandable Folder Sidebar -->
  <div
    class="demo-library-container"
    :class="{
      'with-sidebar': showFolderSidebar,
      'on-left': !isOnRight,
      'on-right': isOnRight,
    }"
    :style="{
      position: 'fixed',
      top: '20px',
      [isOnRight ? 'right' : 'left']: '20px',
      width: showFolderSidebar ? '544px' : '384px',
      height: 'calc(100vh - 40px)',
      background: 'white',
      border: '2px solid black',
      borderRadius: '6px',
      boxShadow:
        '0 0 0 5px #11182729, 0 4px 24px #0000001a, 0 20px 40px -5px #00000080',
      zIndex: '10000',
      overflow: 'hidden',
      transition: 'all 0.3s ease-in-out',
    }"
  >
    <!-- Folder Sidebar -->
    <FolderSidebar
      :show-folder-sidebar="showFolderSidebar"
      :current-folder="currentFolder"
      :root-folders="rootFolders"
      :expanded-folders="expandedFolders"
      :total-demo-count="totalDemoCount"
      :get-subfolders="getSubfolders"
      @select-folder="handleSelectFolder"
    />

    <!-- Main Demo Content -->
    <div class="demo-content">
      <!-- Global Navigation -->
      <GlobalNavigation
        :is-on-right="isOnRight"
        @reposition="handleReposition"
        @back="handleBack"
        @close="handleClose"
      />

      <!-- Search Bar -->
      <SearchBar v-model:search-query="searchQuery" @new-demo="handleNewDemo" />

      <!-- Content Area -->
      <div class="flex-1 overflow-y-auto">
        <!-- Welcome Message -->
        <div class="px-4 py-8">
          <h2 class="text-2xl font-serif text-gray-900 text-center">
            Welcome, Will.
          </h2>
        </div>

        <!-- Breadcrumb Navigation -->
        <BreadcrumbNavigation
          :show-folder-sidebar="showFolderSidebar"
          :current-folder="currentFolder"
          :breadcrumbs="breadcrumbs"
          @toggle-sidebar="showFolderSidebar = !showFolderSidebar"
          @select-folder="handleSelectFolder"
          @navigate-breadcrumb="navigateToBreadcrumb"
        />

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

        <!-- Demo List -->
        <DemoList
          v-else
          :current-folder="currentFolder"
          :recent-demos="recentDemos"
          :all-demos="allDemos"
          :folder-demos="folderDemos"
          :total-demo-count="totalDemoCount"
          :filtered-total-count="filteredTotalCount"
          :search-query="searchQuery"
          :root-folders="rootFolders"
          :folders-with-counts="foldersWithCounts"
          @play-demo="handlePlayDemo"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useDemoLibrary } from "../composables/useDemoLibrary";
import { useFolderService } from "../services/folderService";
import GlobalNavigation from "./GlobalNavigation.vue";
import FolderSidebar from "./FolderSidebar.vue";
import SearchBar from "./SearchBar.vue";
import BreadcrumbNavigation from "./BreadcrumbNavigation.vue";
import DemoList from "./DemoList.vue";

const { maestroDemos, legacyDemos, liveDemos, loading, fetchAllDemos } =
  useDemoLibrary();

const {
  currentFolder,
  expandedFolders,
  rootFolders,
  totalDemoCount,
  getSubfolders,
  selectFolder,
  getFolderPath,
  getDemosInFolder,
  foldersWithCounts,
} = useFolderService();

// Search functionality
const searchQuery = ref("");

// Folder sidebar functionality
const showFolderSidebar = ref(false);
const breadcrumbs = ref<any[]>([]);

// Extension positioning
const isOnRight = ref(true); // Start on right side

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

// New computed properties for homepage layout
const recentDemos = computed(() => {
  const allDemos = [
    ...filteredMaestroDemos.value,
    ...filteredLegacyDemos.value,
    ...filteredLiveDemos.value,
  ];
  return allDemos
    .sort(
      (a, b) =>
        new Date(b.last_modified_at || b.lastModified).getTime() -
        new Date(a.last_modified_at || a.lastModified).getTime()
    )
    .slice(0, 5); // Show 5 most recent
});

const allDemos = computed(() => {
  const allDemos = [
    ...filteredMaestroDemos.value,
    ...filteredLegacyDemos.value,
    ...filteredLiveDemos.value,
  ];
  return allDemos
    .sort(
      (a, b) =>
        new Date(b.last_modified_at || b.lastModified).getTime() -
        new Date(a.last_modified_at || a.lastModified).getTime()
    )
    .slice(5); // Show rest after recent
});

const folderDemos = computed(() => {
  const folderDemos = getDemosInFolder(currentFolder.value?.id || null);
  return [...folderDemos.maestro, ...folderDemos.legacy, ...folderDemos.live];
});

const handlePlayDemo = (demo: any) => {
  console.log("Playing demo:", demo);
  // In real app, this would open the demo
  alert(`Playing demo: ${demo.title}`);
};

const handleNewDemo = () => {
  console.log("New demo button clicked");
  // In real app, this would open new demo creation
};

const handleBack = () => {
  console.log("Back button clicked");
  // In real app, this would navigate back
};

const handleClose = () => {
  console.log("Close button clicked");
  // In real app, this would close the extension
};

const handleReposition = () => {
  isOnRight.value = !isOnRight.value;
  console.log(`Extension moved to ${isOnRight.value ? "right" : "left"} side`);
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

.demo-library-container.on-left {
  left: 20px !important;
  right: auto !important;
}

.demo-library-container.on-right {
  right: 20px !important;
  left: auto !important;
}

/* Demo Content */
.demo-content {
  @apply flex flex-col flex-1 min-w-0;
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
