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
        v-if="currentView === 'main' && !showAIExperience"
        class="flex flex-col flex-1 h-full"
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
          @new-demo="handleNewDemo"
        />

        <!-- Content Area with Sidebar -->
        <div class="content-area-with-sidebar">
          <!-- Folder Sidebar - Slides out from content area -->
          <FolderSidebar
            :show-folder-sidebar="showFolderSidebar"
            :current-folder="currentFolder"
            :all-folders="foldersWithCounts"
            :total-demo-count="totalDemoCount"
            :recent-demo-count="recentDemoCount"
            :shared-demo-count="sharedDemoCount"
            :starred-demo-count="starredDemoCount"
            :starred-items="STARRED_ITEMS"
            :current-section="currentSection"
            :current-starred-item="currentStarredItem"
            @select-folder="handleSelectFolder"
            @navigate-section="handleNavigateSection"
            @select-starred-item="handleSelectStarredItem"
            @create-folder="handleCreateFolder"
          />

          <!-- Main Content -->
          <div
            class="main-content"
            :class="{ 'with-sidebar': showFolderSidebar }"
          >
            <!-- Welcome Message -->
            <div
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
              :show-folder-sidebar="showFolderSidebar"
              :current-folder="currentFolder"
              :breadcrumbs="breadcrumbs"
              @toggle-sidebar="showFolderSidebar = !showFolderSidebar"
              @select-folder="handleSelectFolder"
              @navigate-breadcrumb="navigateToBreadcrumb"
            />

            <!-- Loading State -->
            <div
              v-if="loading"
              class="space-y-4"
              v-motion
              :initial="{ opacity: 0 }"
              :enter="{ opacity: 1, transition: { duration: 200, delay: 300 } }"
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

            <!-- Demo List -->
            <DemoList
              v-else
              v-motion
              :initial="{ opacity: 0, y: 10 }"
              :enter="{
                opacity: 1,
                y: 0,
                transition: { duration: 200, delay: 300, ease: 'easeOut' },
              }"
              :current-folder="currentFolder"
              :recent-demos="recentDemos"
              :all-demos="allDemos"
              :folder-demos="folderDemos"
              :total-demo-count="totalDemoCount"
              :filtered-total-count="filteredTotalCount"
              :search-query="searchQuery"
              :root-folders="
                foldersWithCounts.filter((f) => f.parent_id === null)
              "
              :folders-with-counts="foldersWithCounts"
              @play-demo="handlePlayDemo"
              @view-detail="handleViewDemoDetail"
              @customize-demo="handleCustomizeDemo"
              @manage-links="handleManageLinks"
              @view-analytics="handleViewAnalytics"
            />
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

        <!-- Demo Detail View -->
        <DemoDetailView
          v-else-if="currentView === 'detail'"
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
          v-else-if="currentView === 'link-manager'"
          :demo="selectedDemo"
          @back="handleBackToMain"
          @create-link="handleCreateLink"
          @duplicate-link="handleDuplicateLink"
          @delete-link="handleDeleteLink"
          @toggle-link-status="handleToggleLinkStatus"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useDemoLibrary } from "../composables/useDemoLibrary";
import { useFolderService } from "../services/folderService";
import { STARRED_ITEMS } from "../data/mockData";
import AIExperienceOverlay from "./AIExperienceOverlay.vue";
import GlobalNavigation from "./GlobalNavigation.vue";
import FolderSidebar from "./FolderSidebar.vue";
import SearchBar from "./SearchBar.vue";
import BreadcrumbNavigation from "./BreadcrumbNavigation.vue";
import DemoList from "./DemoList.vue";
import CustomizeFlow from "./CustomizeFlow.vue";
import LinkManagerView from "./LinkManagerView.vue";
import DemoDetailView from "./DemoDetailView.vue";

const { maestroDemos, legacyDemos, liveDemos, loading, fetchAllDemos } =
  useDemoLibrary();

const {
  currentFolder,
  totalDemoCount,
  selectFolder,
  getFolderPath,
  getDemosInFolder,
  foldersWithCounts,
} = useFolderService(maestroDemos, legacyDemos, liveDemos);

// Search functionality
const searchQuery = ref("");

// Folder sidebar functionality
const showFolderSidebar = ref(false);
const breadcrumbs = ref<any[]>([]);

// Extension positioning
const isOnRight = ref(true); // Start on right side

// Navigation state
type ViewType = "main" | "link-manager" | "detail" | "customizer";
const currentView = ref<ViewType>("main");
const selectedDemo = ref<any>(null);
const showCustomizer = ref(false);

// Navigation section state
const currentSection = ref("demos");
const currentStarredItem = ref<any>(null);

// Computed properties for navigation counts
const recentDemoCount = computed(() => recentDemos.value.length);
const sharedDemoCount = computed(() => 5); // Mock count for shared demos
const starredDemoCount = computed(() =>
  STARRED_ITEMS.reduce((sum, item) => sum + item.demoCount, 0)
);

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

const handleViewDemoDetail = (demo: any) => {
  selectedDemo.value = demo;
  currentView.value = "detail";
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
  currentView.value = "link-manager";
};

const handleBackToMain = () => {
  currentView.value = "main";
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
  if (currentView.value !== "main") {
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
  currentStarredItem.value = null;

  // Update breadcrumbs based on section
  switch (section) {
    case "demos":
      breadcrumbs.value = [{ name: "Demo Library", id: null }];
      break;
    case "recent":
      breadcrumbs.value = [{ name: "Recent Demos", id: null }];
      break;
    case "shared":
      breadcrumbs.value = [{ name: "Shared with me", id: null }];
      break;
    case "starred":
      breadcrumbs.value = [{ name: "Starred", id: null }];
      break;
  }

  showFolderSidebar.value = false;
};

const handleSelectStarredItem = (item: any) => {
  currentStarredItem.value = item;
  currentFolder.value = null;

  breadcrumbs.value = [
    { name: "Starred", id: null },
    { name: item.title, id: item.id },
  ];

  showFolderSidebar.value = false;
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
  @apply text-base font-medium text-gray-900;
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
  @apply flex flex-1 relative;
}

/* Main Content */
.main-content {
  @apply flex-1 min-h-0 transition-all duration-300 ease-in-out overflow-x-hidden;
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
