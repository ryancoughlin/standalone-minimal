<template>
  <!-- Shell -->
  <div
    class="extension-chrome fixed top-5 right-5 flex overflow-hidden bg-default border border-default rounded-xl z-[10000] max-h-[calc(100vh-40px)]"
    :class="[
      iteration >= 4 && showNavigationSidebar ? 'w-[580px]' : 'w-[420px]',
      iteration >= 2 ? 'h-[600px]' : 'h-[360px]',
    ]"
  >
    <div class="flex flex-col flex-1 min-w-0">

      <!-- Global bar: logo · search · close -->
      <GlobalNavigation
        v-model:search-query="searchQuery"
        @close="handleClose"
      />

      <!-- Login screen (iteration 1) -->
      <LoginScreen v-if="iteration === 1" />

      <!-- Body: sidebar + main content (iteration 2+) -->
      <div v-if="iteration >= 2" class="flex flex-1 relative min-h-0 overflow-hidden">

        <!-- Launch panel (slides in from right) -->
        <Transition name="panel-push">
          <DemoLaunchPanel
            v-if="showLaunchPanel"
            :demo="launchPanelDemo"
            class="absolute inset-0 z-20"
            @back="handleLaunchPanelBack"
            @launch="handleLaunch"
            @skip-launch="handleSkipLaunch"
          />
        </Transition>

        <!-- Sidebar (iteration 4) -->
        <NavigationSidebar
          v-if="iteration >= 4"
          :show-navigation-sidebar="showNavigationSidebar"
          :current-folder="currentFolder"
          :all-folders="foldersWithCounts"
          :total-demo-count="tabDemoCount"
          :recent-demo-count="recentDemoCount"
          :shared-demo-count="sharedDemoCount"
          :current-section="currentSection"
          @select-folder="handleSelectFolder"
          @navigate-section="handleNavigateSection"
          @create-folder="handleCreateFolder"
        />

        <!-- Main content (shifts right when sidebar open) -->
        <div
          class="flex-1 min-h-0 overflow-hidden flex flex-col transition-[margin] duration-300"
          :class="iteration >= 4 && showNavigationSidebar ? 'ml-[190px]' : 'ml-0'"
        >
          <DemoListView
            :page-type="pageType"
            :demos="demos"
            :loading="loading"
            :title="pageTitle"
            :show-breadcrumbs="!!currentFolder && !isSearching"
            :current-folder="currentFolder"
            :breadcrumbs="breadcrumbs"
            :current-sort="currentSort"
            :empty-title="emptyState.title"
            :empty-description="emptyState.description"
            :empty-icon="emptyState.icon"
            :empty-action-text="emptyState.action"
            :active-tab="activeTab"
            :env-filter="envFilter"
            :show-navigation-sidebar="showNavigationSidebar"
            @change-tab="activeTab = $event"
            @change-env-filter="envFilter = $event"
            @toggle-sidebar="showNavigationSidebar = !showNavigationSidebar"
            @change-sort="currentSort = $event"
            @empty-action="handleEmptyAction"
            @play-demo="handlePlayDemo"
            @play-demo-with-notes="handlePlayDemoWithNotes"
            @navigate-breadcrumb="navigateToBreadcrumb"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useIteration } from "../composables/useIteration";
import { useDemoLibrary } from "../composables/useDemoLibrary";
import { useFolderService } from "../services/folderService";
import GlobalNavigation from "./GlobalNavigation.vue";
import LoginScreen from "./LoginScreen.vue";
import NavigationSidebar from "./NavigationSidebar.vue";
import DemoListView from "./DemoListView.vue";
import DemoLaunchPanel from "./DemoLaunchPanel.vue";

const iteration = useIteration();

// ─── Data sources ────────────────────────────────────────────

const { allDemos, loading, fetchAllDemos } = useDemoLibrary();
const {
  currentFolder,
  selectFolder,
  getFolderPath,
  getDemosInFolder,
  foldersWithCounts,
} = useFolderService(allDemos);

// ─── UI state ────────────────────────────────────────────────

const searchQuery = ref("");
const showNavigationSidebar = ref(false);
const breadcrumbs = ref<any[]>([]);
const currentSection = ref("demos");
const activeTab = ref<"overlays" | "environments">("overlays");
const envFilter = ref<"all" | "html" | "cloned">("all");
const currentSort = ref("lastModified");

// ─── Demo pipeline (search ? all : tab → section/folder) ────

const isSearching = computed(() => !!searchQuery.value);

const tabDemos = computed(() => {
  if (activeTab.value === "overlays") {
    return allDemos.value.filter((d) => d.productType === "overlay");
  }
  const envTypes: Record<string, string[]> = {
    all:    ["html_environment", "cloned_environment"],
    html:   ["html_environment"],
    cloned: ["cloned_environment"],
  };
  const types = new Set(envTypes[envFilter.value]);
  return allDemos.value.filter((d) => types.has(d.productType));
});

const demos = computed(() => {
  if (isSearching.value) {
    const q = searchQuery.value.toLowerCase();
    return allDemos.value.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        (d.dataset?.name && d.dataset.name.toLowerCase().includes(q))
    );
  }

  let result = tabDemos.value;

  if (currentSection.value === "recent") {
    result = result.filter((d) => d.isRecent);
  } else if (currentSection.value === "shared") {
    result = result.filter((d) => d.isShared);
  } else if (currentFolder.value) {
    const ids = new Set(getDemosInFolder(currentFolder.value.id).map((d) => d.id));
    result = result.filter((d) => ids.has(d.id));
  }

  return result;
});

// ─── Sidebar counts (scoped to active tab) ───────────────────

const tabDemoCount = computed(() => tabDemos.value.length);
const recentDemoCount = computed(() => tabDemos.value.filter((d) => d.isRecent).length);
const sharedDemoCount = computed(() => tabDemos.value.filter((d) => d.isShared).length);

// ─── Page chrome (titles, empty states) ──────────────────────

const SECTIONS: Record<string, { type: string; title: string }> = {
  demos:  { type: "library", title: "All Demos" },
  recent: { type: "recent",  title: "Recent Demos" },
  shared: { type: "shared",  title: "Shared with me" },
};

const EMPTY: Record<string, { title: string; description: string; icon: string }> = {
  recent: { title: "No recent demos",  description: "Demos you access will appear here for quick reference.", icon: "fal fa-clock" },
  shared: { title: "No shared demos",  description: "Demos shared with you by teammates will appear here.", icon: "fal fa-users" },
};

const EMPTY_DEFAULT = { title: "No demos found", description: "Create your first demo to get started.", icon: "fal fa-folder" };

const pageType = computed(() =>
  currentFolder.value ? "folder" : (SECTIONS[currentSection.value]?.type ?? "library")
);

const pageTitle = computed(() => {
  if (isSearching.value) return `Results for "${searchQuery.value}"`;
  return currentFolder.value ? currentFolder.value.title : (SECTIONS[currentSection.value]?.title ?? "All Demos");
});

const emptyState = computed(() => {
  if (isSearching.value) {
    return {
      title: `No demos matching "${searchQuery.value}"`,
      description: "Try a different search term.",
      icon: "fal fa-search",
      action: "",
    };
  }
  if (currentFolder.value) {
    return {
      title: `${currentFolder.value.title} is empty`,
      description: "Add demos to this folder to organize your content.",
      icon: "fal fa-folder-open",
      action: "Add Demo to Folder",
    };
  }
  return { ...(EMPTY[currentSection.value] ?? EMPTY_DEFAULT), action: "Browse All Demos" };
});

// ─── Navigation handlers ─────────────────────────────────────

const handleNavigateSection = (section: string) => {
  currentSection.value = section;
  currentFolder.value = null;
  breadcrumbs.value = [];
};

const handleSelectFolder = (folder: any) => {
  selectFolder(folder);
  breadcrumbs.value = folder
    ? getFolderPath(folder.id).map((f) => ({ id: f.id, title: f.title }))
    : [];
};

const navigateToBreadcrumb = (crumb: any) => {
  handleSelectFolder(foldersWithCounts.value.find((f) => f.id === crumb.id) || null);
};

const handleEmptyAction = () => {
  currentFolder.value ? console.log("Add demo to folder") : handleNavigateSection("demos");
};

// ─── Launch panel state ──────────────────────────────────────

const launchPanelDemo = ref<any>(null);
const showLaunchPanel = computed(() => !!launchPanelDemo.value);

// ─── Demo actions ────────────────────────────────────────────

const handleClose = () => console.log("Close");

const handlePlayDemo = (demo: any) => {
  if (iteration.value >= 5) {
    launchPanelDemo.value = demo;
  } else {
    console.log("Play:", demo.title);
  }
};

const handlePlayDemoWithNotes = (demo: any) => console.log("Play with notes:", demo.title);
const handleCreateFolder = () => console.log("Create folder");

const handleLaunchPanelBack = () => {
  launchPanelDemo.value = null;
};

const handleLaunch = (payload: { demo: any; variables: Record<string, string> }) => {
  console.log("Launching with edits:", payload.demo.title, payload.variables);
  launchPanelDemo.value = null;
  // In production: build URL with variable params and window.open()
};

const handleSkipLaunch = (demo: any) => {
  console.log("Skip & Launch:", demo.title);
  launchPanelDemo.value = null;
  // In production: window.open(demo.productionUrl)
};

// ─── Iteration state reset ───────────────────────────────

watch(iteration, (i) => {
  if (i < 5) {
    launchPanelDemo.value = null;
  }
  if (i < 4) {
    showNavigationSidebar.value = false;
    currentSection.value = "demos";
    searchQuery.value = "";
  }
  if (i < 3) {
    activeTab.value = "overlays";
  }
});

// ─── Init ────────────────────────────────────────────────────

onMounted(() => fetchAllDemos());
</script>

<style scoped>
.extension-chrome {
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.08),
    0 12px 40px -8px rgba(0, 0, 0, 0.18);
}

/* Panel push transition — slides in from right */
.panel-push-enter-active,
.panel-push-leave-active {
  transition: transform 0.25s ease-out, opacity 0.2s ease-out;
}
.panel-push-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.panel-push-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
