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
      transition: 'all 0.3s ease-in-out',
    }"
  >
    <!-- Folder Sidebar -->
    <FolderSidebar
      :show-folder-sidebar="showFolderSidebar"
      :current-folder="currentFolder"
      :all-folders="foldersWithCounts"
      :total-demo-count="totalDemoCount"
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
          v-model:search-query="searchQuery"
          @new-demo="handleNewDemo"
        />

        <!-- Content Area -->
        <div
          class="flex-1 overflow-y-auto min-h-0"
          ref="scrollContainer"
          @scroll="handleScroll"
        >
          <!-- Welcome Message -->
          <div class="px-4 py-8 hero-section" :style="heroTransform">
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
            :root-folders="
              foldersWithCounts.filter((f) => f.parent_id === null)
            "
            :folders-with-counts="foldersWithCounts"
            @play-demo="handlePlayDemo"
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

      <!-- Demo Customizer -->
      <DemoCustomizer
        v-else-if="currentView === 'customizer'"
        :demo="selectedDemo"
        @back="handleBackToMain"
        @preview="handlePreviewDemo"
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
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useDemoLibrary } from "../composables/useDemoLibrary";
import { useFolderService } from "../services/folderService";
import AIExperienceOverlay from "./AIExperienceOverlay.vue";
import GlobalNavigation from "./GlobalNavigation.vue";
import FolderSidebar from "./FolderSidebar.vue";
import SearchBar from "./SearchBar.vue";
import BreadcrumbNavigation from "./BreadcrumbNavigation.vue";
import DemoList from "./DemoList.vue";
import DemoCustomizer from "./DemoCustomizer.vue";
import LinkManagerView from "./LinkManagerView.vue";

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
type ViewType = "main" | "customizer" | "link-manager";
const currentView = ref<ViewType>("main");
const selectedDemo = ref<any>(null);

// Scroll handling for hero parallax
const scrollContainer = ref<HTMLElement | null>(null);
const scrollY = ref(0);

const handleScroll = () => {
  if (scrollContainer.value) {
    scrollY.value = scrollContainer.value.scrollTop;
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

const handleCustomizeDemo = (demo: any) => {
  selectedDemo.value = demo;
  currentView.value = "customizer";
};

const handleManageLinks = (demo: any) => {
  selectedDemo.value = demo;
  currentView.value = "link-manager";
};

const handleBackToMain = () => {
  currentView.value = "main";
  selectedDemo.value = null;
};

const handleViewAnalytics = (demo: any) => {
  console.log("Viewing analytics for:", demo);
  // In real app, this would open analytics
  alert(`Analytics for: ${demo.title}`);
};

const handlePreviewDemo = (demo: any, customization: any) => {
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
  handleBackToMain();
};

const handleCreateLink = (demo: any) => {
  selectedDemo.value = demo;
  currentView.value = "customizer";
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
  @apply flex flex-col flex-1 min-w-0 h-full;
}

/* Hero section parallax styling */
.hero-section {
  position: relative;
  z-index: 10;
  will-change: transform, opacity;
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
