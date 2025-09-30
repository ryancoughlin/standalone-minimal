<template>
  <!-- Unified Demo Library with Expandable Folder Sidebar -->
  <div
    ref="demoLibraryContainer"
    class="demo-library-container"
    v-motion
    :initial="{ opacity: 0, scale: 0.95 }"
    :enter="{
      opacity: 1,
      scale: 1,
      transition: { duration: 300, ease: 'easeOut' },
    }"
    :class="{
      'with-sidebar': showNavigationSidebar,
      'on-left': !isOnRight,
      'on-right': isOnRight,
    }"
    :style="{
      position: 'fixed',
      top: '20px',
      [isOnRight ? 'right' : 'left']: '20px',
      width: showNavigationSidebar ? '544px' : '384px',
      height: 'calc(100vh - 40px)',
      background: 'white',
      border: '2px solid black',
      borderRadius: '6px',
      boxShadow:
        '0 0 0 5px #11182729, 0 4px 24px #0000001a, 0 20px 40px -5px #00000080',
      zIndex: '10000',
      overflow: 'auto',
      transition: 'all 0.3s ease-in-out',
    }"
    @scroll="handleScroll"
  >
    <!-- Main Demo Content -->
    <div class="demo-content">
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
        @undo="handleUndo"
        @redo="handleRedo"
        @assist-click="handleAssistClick"
      />

      <!-- Main View -->
      <div
        v-if="currentViewType === 'main' && !showAIExperience"
        class="flex flex-col flex-1 h-full overflow-hidden"
      >
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
          @new-demo="handleNewDemo"
          @toggle-sidebar="showNavigationSidebar = !showNavigationSidebar"
        />

        <!-- Content Area with Sidebar -->
        <div class="content-area-with-sidebar flex-1 min-h-0">
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
            class="main-content"
            :class="{ 'with-sidebar': showNavigationSidebar }"
          >
            <!-- Welcome Message (only on home) -->
            <div
              v-if="currentSection === 'home'"
              class="px-4 py-8 hero-section"
              :style="heroTransform"
              v-motion
              :initial="{ opacity: 0, y: 5 }"
              :enter="{
                opacity: 1,
                y: 0,
                transition: { duration: 200, delay: 200, ease: 'easeOut' },
              }"
            >
              <h2 class="welcome-message text-center">Welcome, Will.</h2>
            </div>

            <!-- Breadcrumb Navigation -->
            <BreadcrumbNavigation
              v-motion
              :initial="{ opacity: 0, y: 5 }"
              :enter="{
                opacity: 1,
                y: 0,
                transition: { duration: 200, delay: 250, ease: 'easeOut' },
              }"
              :current-folder="currentFolder"
              :breadcrumbs="breadcrumbs"
              @navigate-breadcrumb="navigateToBreadcrumb"
            />

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

              <!-- New Content Design System Pages -->
              <!-- Home Page -->
              <HomePage
                v-if="currentSection === 'home' && !currentFolder"
                :demos="filteredDemos"
                :folders-with-counts="foldersWithCounts"
                :loading="loading"
                :current-view="currentView"
                :current-sort="currentSort"
                :selected-demo-type="selectedDemoType"
                :filtered-count="filteredTotalCount"
                :total-count="totalDemoCount"
                :recent-count="recentDemoCount"
                :shared-count="sharedDemoCount"
                :starred-count="starredDemoCount"
                @create-new="handleNewDemo"
                @view-all="handleNavigateSection('demos')"
                @view-recent="handleNavigateSection('recent')"
                @change-view="handleViewChange"
                @change-sort="handleSortChange"
                @change-demo-type="handleDemoTypeChange"
                @clear-filters="handleClearFilters"
                @remove-filter="handleRemoveFilter"
                @view-detail="handleViewDemoDetail"
                @play-demo="handlePlayDemo"
                @customize-demo="handleCustomizeDemo"
                @copy-link="handleCopyLink"
                @manage-links="handleManageLinks"
              />

              <!-- Recent Page -->
              <RecentPage
                v-else-if="currentSection === 'recent' && !currentFolder"
                v-motion
                :initial="{ opacity: 0, y: 10 }"
                :enter="{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 200, delay: 300, ease: 'easeOut' },
                }"
                :recent-demos="filteredDemos"
                :folders-with-counts="foldersWithCounts"
                :loading="loading"
                :current-view="currentView"
                :current-sort="currentSort"
                :active-type-filters="activeTypeFilters"
                :active-status-filters="activeStatusFilters"
                :filtered-count="filteredTotalCount"
                :total-count="totalDemoCount"
                @create-new="handleNewDemo"
                @browse-all="handleNavigateSection('demos')"
                @change-view="handleViewChange"
                @change-sort="handleSortChange"
                @toggle-type-filter="handleToggleTypeFilter"
                @toggle-status-filter="handleToggleStatusFilter"
                @clear-filters="handleClearFilters"
                @remove-filter="handleRemoveFilter"
                @view-detail="handleViewDemoDetail"
                @play-demo="handlePlayDemo"
                @customize-demo="handleCustomizeDemo"
                @copy-link="handleCopyLink"
                @manage-links="handleManageLinks"
              />

              <!-- Shared Page -->
              <SharedPage
                v-else-if="currentSection === 'shared' && !currentFolder"
                v-motion
                :initial="{ opacity: 0, y: 10 }"
                :enter="{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 200, delay: 300, ease: 'easeOut' },
                }"
                :shared-demos="filteredDemos"
                :folders-with-counts="foldersWithCounts"
                :loading="loading"
                :current-view="currentView"
                :current-sort="currentSort"
                :active-type-filters="activeTypeFilters"
                :active-status-filters="activeStatusFilters"
                :filtered-count="filteredTotalCount"
                :total-count="totalDemoCount"
                @create-new="handleNewDemo"
                @browse-all="handleNavigateSection('demos')"
                @change-view="handleViewChange"
                @change-sort="handleSortChange"
                @toggle-type-filter="handleToggleTypeFilter"
                @toggle-status-filter="handleToggleStatusFilter"
                @clear-filters="handleClearFilters"
                @remove-filter="handleRemoveFilter"
                @view-detail="handleViewDemoDetail"
                @play-demo="handlePlayDemo"
                @customize-demo="handleCustomizeDemo"
                @copy-link="handleCopyLink"
                @manage-links="handleManageLinks"
              />

              <!-- Folder Page -->
              <FolderPage
                v-else-if="currentFolder"
                v-motion
                :initial="{ opacity: 0, y: 10 }"
                :enter="{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 200, delay: 300, ease: 'easeOut' },
                }"
                :current-folder="currentFolder"
                :folder-demos="folderDemos"
                :folders-with-counts="foldersWithCounts"
                :loading="loading"
                :current-view="currentView"
                :current-sort="currentSort"
                :active-type-filters="activeTypeFilters"
                :active-status-filters="activeStatusFilters"
                :filtered-count="filteredTotalCount"
                :total-count="totalDemoCount"
                @create-new="handleNewDemo"
                @select-subfolder="handleSelectFolder"
                @change-view="handleViewChange"
                @change-sort="handleSortChange"
                @toggle-type-filter="handleToggleTypeFilter"
                @toggle-status-filter="handleToggleStatusFilter"
                @clear-filters="handleClearFilters"
                @remove-filter="handleRemoveFilter"
                @view-detail="handleViewDemoDetail"
                @play-demo="handlePlayDemo"
                @customize-demo="handleCustomizeDemo"
                @copy-link="handleCopyLink"
                @manage-links="handleManageLinks"
              />

              <!-- All Demos Page (fallback) -->
              <div
                v-else
                class="px-2 pb-2"
                v-motion
                :initial="{ opacity: 0, y: 10 }"
                :enter="{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 200, delay: 300, ease: 'easeOut' },
                }"
              >
                <h3 class="heading-secondary mb-2">All Demos</h3>
                <div class="space-y-0.5">
                  <DemoRow
                    v-for="(demo, index) in filteredDemos"
                    :key="`all-${index}`"
                    :demo="demo"
                    :folders-with-counts="foldersWithCounts"
                    :delay="50 + index * 30"
                    :show-views="true"
                    @view-detail="handleViewDemoDetail"
                    @play-demo="handlePlayDemo"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Experience View -->
        <div v-if="showAIExperience" class="flex flex-col flex-1">
          <AIExperienceOverlay
            :is-visible="showAIExperience"
            @close="handleCloseAIExperience"
            @action="handleAIAction"
            @submit="handleAISubmit"
          />
        </div>
      </div>

      <!-- Demo Detail View -->
      <DemoDetailView
        v-if="currentViewType === 'detail'"
        :demo="selectedDemo"
        :folders-with-counts="foldersWithCounts"
        @back="handleBackToMain"
        @launch-demo="handlePlayDemo"
        @preview-demo="handlePreviewDemo"
        @copy-link="handleCopyLink"
        @customize-demo="handleCustomizeDemo"
        @manage-links="handleManageLinks"
        @view-analytics="handleViewAnalytics"
      />

      <!-- Demo Customizer Flow -->
      <CustomizeFlow
        v-if="showCustomizer"
        :demo="selectedDemo"
        @close="handleCloseCustomizer"
        @generate-link="handleGenerateLink"
      />

      <!-- Link Manager View -->
      <LinkManagerView
        v-if="currentViewType === 'link-manager'"
        :demo="selectedDemo"
        @back="handleBackToMain"
        @create-link="handleCreateLink"
        @duplicate-link="handleDuplicateLink"
        @delete-link="handleDeleteLink"
        @toggle-link-status="handleToggleLinkStatus"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useDemoLibrary } from "../composables/useDemoLibrary";
import { useFolderService } from "../services/folderService";
import AIExperienceOverlay from "./AIExperienceOverlay.vue";
import GlobalNavigation from "./GlobalNavigation.vue";
import NavigationSidebar from "./NavigationSidebar.vue";
import SearchBar from "./SearchBar.vue";
import BreadcrumbNavigation from "./BreadcrumbNavigation.vue";
import DemoList from "./DemoList.vue";
import { HomePage, RecentPage, SharedPage, FolderPage } from "./demo-cards";
import DemoRow from "./demo-cards/DemoRow.vue";
import CustomizeFlow from "./CustomizeFlow.vue";
import LinkManagerView from "./LinkManagerView.vue";
import DemoDetailView from "./DemoDetailView.vue";

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

// Navigation state
type ViewType = "main" | "link-manager" | "detail" | "customizer";
const currentViewType = ref<ViewType>("main");
const selectedDemo = ref<any>(null);
const showCustomizer = ref(false);

// Navigation section state
const currentSection = ref("home");

// Filter state for new content design system
const currentView = ref<"list" | "grid">("list");
const currentSort = ref("lastModified");
const selectedDemoType = ref("");

// Scroll handling for hero parallax
const demoLibraryContainer = ref<HTMLElement | null>(null);
const scrollY = ref(0);

const handleScroll = () => {
  if (demoLibraryContainer.value) {
    scrollY.value = demoLibraryContainer.value.scrollTop;
  }
};

// Hero parallax transform
const heroTransform = computed(() => {
  const scroll = scrollY.value;
  const maxScroll = 200; // Distance to complete transition
  const progress = Math.min(scroll / maxScroll, 1);

  // Scale from 1 to 0.8
  const scale = 1 - progress * 0.2;

  // Translate up and fade out
  const translateY = -scroll * 0.5; // Parallax effect
  const opacity = 1 - progress;

  return {
    transform: `translateY(${translateY}px) scale(${scale})`,
    opacity: opacity,
    transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
  };
});

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

  // Filter by search
  if (searchQuery.value) {
    demos = demos.filter((demo) =>
      demo.title.toLowerCase().includes(searchQuery.value.toLowerCase())
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

const starredDemoCount = computed(() => {
  return allUnifiedDemos.value.filter((demo) => demo.isStarred).length;
});

// New computed properties for homepage layout
const recentDemos = computed(() => {
  // If we're in recent section, show filtered recent demos
  if (currentSection.value === "recent") {
    return filteredDemos.value;
  }

  // If we're in shared section, show filtered shared demos
  if (currentSection.value === "shared") {
    return filteredDemos.value;
  }

  // If we're in demos section, show all demos
  if (currentSection.value === "demos") {
    return filteredDemos.value;
  }

  // If we're in a folder, show folder demos
  if (currentFolder.value) {
    return filteredDemos.value;
  }

  // Otherwise show truly recent demos (for home section)
  return allUnifiedDemos.value
    .sort(
      (a, b) =>
        new Date(b.last_modified_at || b.lastModified).getTime() -
        new Date(a.last_modified_at || a.lastModified).getTime()
    )
    .slice(0, 5); // Show 5 most recent
});

const allDemosComputed = computed(() => {
  // If we're in demos section, show all filtered demos
  if (currentSection.value === "demos") {
    return filteredDemos.value;
  }

  // If we're in recent section, show filtered recent demos
  if (currentSection.value === "recent") {
    return filteredDemos.value;
  }

  // If we're in shared section, show filtered shared demos
  if (currentSection.value === "shared") {
    return filteredDemos.value;
  }

  // If we're in a folder, show folder demos
  if (currentFolder.value) {
    return filteredDemos.value;
  }

  // Otherwise show all demos after recent ones (for home section)
  return allUnifiedDemos.value
    .sort(
      (a, b) =>
        new Date(b.last_modified_at || b.lastModified).getTime() -
        new Date(a.last_modified_at || a.lastModified).getTime()
    )
    .slice(5); // Show rest after recent
});

const folderDemos = computed(() => {
  if (!currentFolder.value) return [];
  return getDemosInFolder(currentFolder.value.id);
});

const handlePlayDemo = (demo: any) => {
  console.log("Playing demo:", demo);
  // In real app, this would open the demo
  alert(`Playing demo: ${demo.title}`);
};

const handleViewDemoDetail = (demo: any) => {
  selectedDemo.value = demo;
  currentViewType.value = "detail";
};

const handleCopyLink = (demo: any) => {
  console.log("Copying link for:", demo);
  // In real app, this would copy the share link to clipboard
  const link = `https://demo.reprise.com/share/${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  navigator.clipboard.writeText(link).then(() => {
    alert(`Link copied to clipboard: ${link}`);
  });
};

const handleCustomizeDemo = (demo: any) => {
  selectedDemo.value = demo;
  showCustomizer.value = true;
};

const handleCloseCustomizer = () => {
  showCustomizer.value = false;
  selectedDemo.value = null;
};

const handleManageLinks = (demo: any) => {
  selectedDemo.value = demo;
  currentViewType.value = "link-manager";
};

const handleBackToMain = () => {
  currentViewType.value = "main";
  selectedDemo.value = null;
  showCustomizer.value = false;
};

const handleViewAnalytics = (demo: any) => {
  console.log("Viewing analytics for:", demo);
  // In real app, this would open analytics
  alert(`Analytics for: ${demo.title}`);
};

const handlePreviewDemo = (demo: any, customization?: any) => {
  console.log("Previewing demo with customization:", demo, customization);
  // In real app, this would open preview
  alert(`Previewing ${demo.title} with customization`);
};

const handleGenerateLink = (demo: any, customization: any) => {
  console.log("Generating link for:", demo, customization);
  // In real app, this would generate and return a link
  const link = `https://demo.reprise.com/custom/${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  alert(`Generated link: ${link}`);
  showCustomizer.value = false;
  selectedDemo.value = null;
};

const handleCreateLink = (demo: any) => {
  selectedDemo.value = demo;
  showCustomizer.value = true;
};

const handleDuplicateLink = (link: any) => {
  console.log("Duplicating link:", link);
  // In real app, this would duplicate the link
  alert(`Duplicating link: ${link.url}`);
};

const handleDeleteLink = (link: any) => {
  console.log("Deleting link:", link);
  // In real app, this would delete the link
  alert(`Deleting link: ${link.url}`);
};

const handleToggleLinkStatus = (link: any) => {
  console.log("Toggling link status:", link);
  // In real app, this would toggle the link status
  link.isActive = !link.isActive;
  alert(`Link ${link.isActive ? "activated" : "archived"}: ${link.url}`);
};

const handleNewDemo = () => {
  console.log("New demo button clicked");
  // In real app, this would open new demo creation
};

const handleBack = () => {
  if (currentViewType.value !== "main") {
    handleBackToMain();
  } else {
    console.log("Back button clicked - already at main view");
    // In real app, this would navigate back to parent app
  }
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

// AI Experience state
const showAIExperience = ref(false);

// AI Assistant handlers
const handleUndo = () => {
  console.log("Undo action triggered");
  // TODO: Implement undo functionality
};

const handleRedo = () => {
  console.log("Redo action triggered");
  // TODO: Implement redo functionality
};

const handleAssistClick = () => {
  showAIExperience.value = true;
};

const handleCloseAIExperience = () => {
  showAIExperience.value = false;
};

const handleAIAction = (action: string) => {
  console.log(`AI Action triggered: ${action}`);
  showAIExperience.value = false;
  // TODO: Implement specific AI actions
};

const handleAISubmit = (prompt: string) => {
  console.log(`AI Prompt submitted: ${prompt}`);
  showAIExperience.value = false;
  // TODO: Process AI prompt
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

// Helper functions
const getFolderName = (folderId: string) => {
  if (!folderId) return "Unorganized";
  const folder = foldersWithCounts.value.find((f) => f.id === folderId);
  return folder?.title || "Unknown Folder";
};

const getScreenshotUrl = (screenshotSmall: string) => {
  if (!screenshotSmall) return "";
  if (screenshotSmall.startsWith("/")) return screenshotSmall;
  if (screenshotSmall.startsWith("data:")) return screenshotSmall;
  return `data:image/png;base64,${screenshotSmall}`;
};

onMounted(async () => {
  await fetchAllDemos();
});
</script>

<style scoped>
/* Primary Typography Classes */
.heading-primary {
  @apply text-xl font-semibold text-gray-900;
}

.heading-secondary {
  @apply text-sm font-medium text-gray-900;
}

/* Unified Container Layout */
.demo-library-container {
  @apply flex overflow-x-hidden;
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
  @apply flex flex-col flex-1 min-w-0 h-full;
}

/* Content Area with Sidebar */
.content-area-with-sidebar {
  @apply flex flex-1 relative min-h-0;
  position: relative;
}

/* Main Content */
.main-content {
  @apply flex-1 min-h-0 transition-all duration-300 ease-in-out overflow-x-hidden flex flex-col;
  margin-left: 0;
}

.main-content.with-sidebar {
  margin-left: 190px;
}

/* Hero section parallax styling */
.hero-section {
  position: relative;
  z-index: 10;
  will-change: transform, opacity;
}

/* Custom scrollbar for webkit browsers */
.demo-library-container::-webkit-scrollbar {
  width: 6px;
}

.demo-library-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.demo-library-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.demo-library-container::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Welcome message with Roboto Serif - brand moment styling */
.welcome-message {
  font-family: "Roboto Serif", serif;
  font-size: 2rem;
  font-weight: 300;
  color: #1f2937;
  letter-spacing: -0.025em;
  line-height: 1.2;
}
</style>
