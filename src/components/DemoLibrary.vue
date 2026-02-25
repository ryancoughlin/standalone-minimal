<template>
  <!-- Unified Demo Library with Expandable Folder Sidebar -->
  <div
    class="extension-chrome fixed top-5 flex overflow-x-hidden bg-default border-2 border-black rounded-md z-[10000] overflow-auto transition-all duration-300 ease-in-out h-[calc(100vh-40px)]"
    :class="[
      isOnRight ? 'right-5' : 'left-5',
      showNavigationSidebar ? 'w-[544px]' : 'w-96',
    ]"
    v-motion
    :initial="{ opacity: 0, scale: 0.95 }"
    :enter="{
      opacity: 1,
      scale: 1,
      transition: { duration: 300, ease: 'easeOut' },
    }"
  >
    <div class="flex flex-col flex-1 min-w-0 h-full">
      <!-- Global Navigation -->
      <GlobalNavigation
        v-motion
        :initial="{ opacity: 0, y: -10 }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: { duration: 200, delay: 100, ease: 'easeOut' },
        }"
        :is-on-right="isOnRight"
        @reposition="handleReposition"
        @back="handleBack"
        @close="handleClose"
      />

      <!-- Main View -->
      <div class="flex flex-col flex-1 h-full overflow-hidden">
        <!-- Search Bar -->
        <SearchBar
          v-motion
          :initial="{ opacity: 0, y: -5 }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: { duration: 200, delay: 150, ease: 'easeOut' },
          }"
          v-model:search-query="searchQuery"
          :show-navigation-sidebar="showNavigationSidebar"
          @toggle-sidebar="showNavigationSidebar = !showNavigationSidebar"
        />

        <!-- Content Area with Sidebar -->
        <div class="flex flex-1 relative min-h-0">
          <!-- Navigation Sidebar - Slides out from content area -->
          <NavigationSidebar
            :show-navigation-sidebar="showNavigationSidebar"
            :current-folder="currentFolder"
            :all-folders="foldersWithCounts"
            :total-demo-count="totalDemoCount"
            :recent-demo-count="recentDemoCount"
            :shared-demo-count="sharedDemoCount"
            :current-section="currentSection"
            @select-folder="handleSelectFolder"
            @navigate-section="handleNavigateSection"
            @create-folder="handleCreateFolder"
          />

          <!-- Main Content -->
          <div
            class="flex-1 min-h-0 transition-all duration-300 ease-in-out overflow-x-hidden flex flex-col"
            :class="showNavigationSidebar ? 'ml-[190px]' : 'ml-0'"
          >
            <!-- Scrollable Content Area -->
            <div class="flex-1 overflow-y-auto">
              <!-- Loading State -->
              <div
                v-if="loading"
                class="space-y-4"
                v-motion
                :initial="{ opacity: 0 }"
                :enter="{
                  opacity: 1,
                  transition: { duration: 200, delay: 300 },
                }"
              >
                <div v-for="i in 5" :key="i" class="animate-shimmer">
                  <div class="flex items-center space-x-4 p-2">
                    <div class="w-20 h-16 bg-gray-200 rounded" />
                    <div class="flex-1 space-y-2">
                      <div class="h-4 bg-gray-200 rounded w-3/4" />
                      <div class="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Unified Demo Page -->
              <UnifiedDemoPage
                :page-type="getPageType()"
                :demos="filteredDemos"
                :loading="loading"
                :title="getPageTitle()"
                :description="getPageDescription()"
                :show-breadcrumbs="!!currentFolder"
                :current-folder="currentFolder"
                :breadcrumbs="breadcrumbs"
                :current-view="currentView"
                :current-sort="currentSort"
                :selected-demo-type="selectedDemoType"
                :filtered-count="filteredTotalCount"
                :total-count="totalDemoCount"
                :empty-title="getEmptyTitle()"
                :empty-description="getEmptyDescription()"
                :empty-icon="getEmptyIcon()"
                :empty-action-text="getEmptyActionText()"
                @change-view="handleViewChange"
                @change-sort="handleSortChange"
                @change-demo-type="handleDemoTypeChange"
                @clear-filters="handleClearFilters"
                @remove-filter="handleRemoveFilter"
                @empty-action="handleEmptyAction"
                @play-demo="handlePlayDemo"
                @customize-demo="handleCustomizeDemo"
                @navigate-breadcrumb="navigateToBreadcrumb"
              />
            </div>
          </div>
        </div>

      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useDemoLibrary } from "../composables/useDemoLibrary";
import { useFolderService } from "../services/folderService";
import GlobalNavigation from "./GlobalNavigation.vue";
import NavigationSidebar from "./NavigationSidebar.vue";
import SearchBar from "./SearchBar.vue";
import UnifiedDemoPage from "./UnifiedDemoPage.vue";

const { allDemos, allFolders, loading, fetchAllDemos } = useDemoLibrary();

const {
  currentFolder,
  totalDemoCount,
  selectFolder,
  getFolderPath,
  getDemosInFolder,
  foldersWithCounts,
} = useFolderService(allDemos);

// Search functionality
const searchQuery = ref("");

// Navigation sidebar functionality
const showNavigationSidebar = ref(false);
const breadcrumbs = ref<any[]>([]);

// Extension positioning
const isOnRight = ref(true); // Start on right side

// Navigation section state
const currentSection = ref("home");

// Filter state for new content design system
const currentView = ref<"list" | "grid">("list");
const currentSort = ref("lastModified");
const selectedDemoType = ref("");

// Unified demo list - single source of truth
const allUnifiedDemos = computed(() => allDemos.value);

// Filtered demos based on search, folder, and current section
const filteredDemos = computed(() => {
  let demos = allUnifiedDemos.value;

  // Filter by current section
  if (currentSection.value === "recent") {
    demos = demos.filter((demo) => demo.isRecent);
  } else if (currentSection.value === "shared") {
    demos = demos.filter((demo) => demo.isShared);
  } else if (currentFolder.value) {
    // Filter by folder if a specific folder is selected
    demos = getDemosInFolder(currentFolder.value.id);
  } else if (
    currentSection.value === "home" ||
    currentSection.value === "demos"
  ) {
    // Home and demos sections show all demos
    demos = allUnifiedDemos.value;
  }

  // Filter by search (title + dataset name)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    demos = demos.filter(
      (demo) =>
        demo.title.toLowerCase().includes(q) ||
        (demo.dataset?.name && demo.dataset.name.toLowerCase().includes(q))
    );
  }

  return demos;
});

const filteredTotalCount = computed(() => filteredDemos.value.length);

// Computed properties for navigation counts
const recentDemoCount = computed(() => {
  return allUnifiedDemos.value.filter((demo) => demo.isRecent).length;
});

const sharedDemoCount = computed(() => {
  return allUnifiedDemos.value.filter((demo) => demo.isShared).length;
});

const folderDemos = computed(() => {
  if (!currentFolder.value) return [];
  return getDemosInFolder(currentFolder.value.id);
});

const handlePlayDemo = (demo: any) => {
  console.log("Playing demo:", demo);
};

const handleViewDemoDetail = (demo: any) => {
  console.log("View detail:", demo);
};

const handleCustomizeDemo = (demo: any) => {
  console.log("Customize demo:", demo);
};

const handleBack = () => {
  console.log("Back button clicked");
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

// New navigation handlers
const handleNavigateSection = (section: string) => {
  currentSection.value = section;
  currentFolder.value = null;

  // Update breadcrumbs based on section
  switch (section) {
    case "home":
      breadcrumbs.value = [{ name: "Home", id: null }];
      break;
    case "demos":
      breadcrumbs.value = [{ name: "Demo Library", id: null }];
      break;
    case "recent":
      breadcrumbs.value = [{ name: "Recent Demos", id: null }];
      break;
    case "shared":
      breadcrumbs.value = [{ name: "Shared with me", id: null }];
      break;
  }
};

const handleCreateFolder = () => {
  // TODO: Implement folder creation
  console.log("Create folder clicked");
};

const navigateToBreadcrumb = (crumb: any) => {
  const folder = foldersWithCounts.value.find((f) => f.id === crumb.id);
  handleSelectFolder(folder || null);
};


// Filter event handlers for new content design system
const handleViewChange = (view: "list" | "grid") => {
  currentView.value = view;
};

const handleSortChange = (sort: string) => {
  currentSort.value = sort;
};

const handleDemoTypeChange = (type: string) => {
  selectedDemoType.value = type;
};

const handleClearFilters = () => {
  selectedDemoType.value = "";
};

const handleRemoveFilter = (filterKey: string) => {
  if (filterKey.startsWith("type:")) {
    const type = filterKey.replace("type:", "");
    if (selectedDemoType.value === type) {
      selectedDemoType.value = "";
    }
  }
};

// Helper functions for unified template
const getPageType = () => {
  if (currentFolder.value) return "folder";
  switch (currentSection.value) {
    case "home":
      return "home";
    case "demos":
      return "library";
    case "recent":
      return "recent";
    case "shared":
      return "shared";
    default:
      return "library";
  }
};

const getPageTitle = () => {
  if (currentFolder.value) return currentFolder.value.title;
  switch (currentSection.value) {
    case "home":
      return "Recent Demos";
    case "demos":
      return "All Demos";
    case "recent":
      return "Recent Demos";
    case "shared":
      return "Shared with me";
    default:
      return "All Demos";
  }
};

const getPageDescription = () => {
  if (currentFolder.value) {
    return `${folderDemos.value.length} demos in this folder`;
  }
  switch (currentSection.value) {
    case "home":
      return `${filteredTotalCount.value} recent demos`;
    case "demos":
    case "recent":
    case "shared":
    default:
      return `${filteredTotalCount.value} demos`;
  }
};

const getEmptyTitle = () => {
  if (currentFolder.value) {
    return `${currentFolder.value.title} is empty`;
  }
  switch (currentSection.value) {
    case "home":
      return "No recent demos";
    case "recent":
      return "No recent demos";
    case "shared":
      return "No shared demos";
    default:
      return "No demos found";
  }
};

const getEmptyDescription = () => {
  if (currentFolder.value) {
    return "Add demos to this folder to organize your content.";
  }
  switch (currentSection.value) {
    case "home":
      return "Demos you access will appear here for quick reference.";
    case "recent":
      return "Demos you access will appear here for quick reference.";
    case "shared":
      return "Demos shared with you by teammates will appear here.";
    default:
      return "Create your first demo to get started.";
  }
};

const getEmptyIcon = () => {
  if (currentFolder.value) return "fal fa-folder-open";
  switch (currentSection.value) {
    case "home":
      return "fal fa-clock";
    case "recent":
      return "fal fa-clock";
    case "shared":
      return "fal fa-users";
    default:
      return "fal fa-folder";
  }
};

const getEmptyActionText = () => {
  if (currentFolder.value) return "Add Demo to Folder";
  switch (currentSection.value) {
    case "home":
      return "Browse All Demos";
    case "recent":
    case "shared":
      return "Browse All Demos";
    default:
      return "Browse All Demos";
  }
};

const handleEmptyAction = () => {
  if (currentFolder.value) {
    // TODO: Handle add to folder
    console.log("Add demo to folder");
  } else {
    // Navigate to all demos
    handleNavigateSection("demos");
  }
};

onMounted(async () => {
  await fetchAllDemos();
});
</script>

<style scoped>
/* Extension chrome — complex shadow can't be expressed in Tailwind utilities */
.extension-chrome {
  box-shadow:
    0 0 0 5px rgba(17, 24, 39, 0.16),
    0 4px 24px rgba(0, 0, 0, 0.1),
    0 20px 40px -5px rgba(0, 0, 0, 0.5);
}

/* Scrollbar — pseudo-elements require CSS */
.extension-chrome::-webkit-scrollbar {
  width: 6px;
}
.extension-chrome::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}
.extension-chrome::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
.extension-chrome::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
