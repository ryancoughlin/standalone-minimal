<template>
  <div class="flex flex-col h-full min-h-0 w-full bg-default">
    <!-- Sticky header zone: tabs + page header -->
    <div
      class="shrink-0 bg-default z-10 transition-shadow duration-150"
      :class="isScrolled ? 'shadow-sm' : ''"
    >
      <!-- Content Nav: Sidebar toggle + Tabs (iteration 3+) -->
      <div v-if="iteration >= 3" class="border-b border-default px-4 flex items-center gap-1">
        <!-- Sidebar Toggle (iteration 4) -->
        <button
          v-if="iteration >= 4"
          @click="$emit('toggle-sidebar')"
          class="size-7 shrink-0 flex items-center justify-center rounded text-default transition-colors hover:bg-hover hover:text-emphasis"
          :class="{ 'text-reprise-blue': showNavigationSidebar }"
          :title="showNavigationSidebar ? 'Close sidebar' : 'Open sidebar'"
        >
          <i class="fas fa-bars text-sm"></i>
        </button>

        <!-- Tab Buttons -->
        <div class="flex gap-4">
          <button
            @click="$emit('change-tab', 'overlays')"
            class="relative py-2 text-xs font-medium transition-colors"
            :class="activeTab === 'overlays' ? 'text-reprise-deep-blue' : 'text-muted hover:text-emphasis'"
          >
            Overlays
            <span
              v-if="activeTab === 'overlays'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-reprise-blue rounded-full"
            ></span>
          </button>
          <button
            @click="$emit('change-tab', 'environments')"
            class="relative py-2 text-xs font-medium transition-colors"
            :class="activeTab === 'environments' ? 'text-reprise-deep-blue' : 'text-muted hover:text-emphasis'"
          >
            Environments
            <span
              v-if="activeTab === 'environments'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-reprise-blue rounded-full"
            ></span>
          </button>
        </div>
      </div>

      <!-- Page Header (includes sort dropdown) -->
      <DemoListHeader
        :title="title"
        :show-breadcrumbs="showBreadcrumbs"
        :current-folder="currentFolder"
        :breadcrumbs="breadcrumbs"
        :active-tab="activeTab"
        :env-filter="envFilter"
        :current-sort="currentSort"
        @navigate-breadcrumb="$emit('navigate-breadcrumb', $event)"
        @change-env-filter="$emit('change-env-filter', $event)"
        @change-sort="$emit('change-sort', $event)"
      />
    </div>

    <!-- Scrollable content -->
    <div ref="scrollContainer" class="flex-1 min-h-0 overflow-y-auto" @scroll="onScroll">
      <!-- Loading -->
      <div v-if="loading" class="p-4 space-y-2">
        <div v-for="i in 8" :key="i" class="flex items-center gap-2 py-1">
          <div class="w-24 h-[67px] bg-gray-200 rounded animate-pulse"></div>
          <div class="flex-1 space-y-1">
            <div class="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div class="h-2 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="isEmpty" class="flex flex-col items-center justify-center py-8 px-4 text-center">
        <i :class="emptyIcon" class="text-4xl text-muted mb-2"></i>
        <h3 class="text-sm font-medium text-emphasis mb-1">{{ emptyTitle }}</h3>
        <p class="text-xs text-muted mb-2">{{ emptyDescription }}</p>
        <button
          v-if="emptyActionText"
          @click="$emit('empty-action')"
          class="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          {{ emptyActionText }}
        </button>
      </div>

      <!-- Demo List -->
      <div v-else>
        <DemoRow
          v-for="demo in paginatedDemos"
          :key="demo.id"
          :demo="demo"
          :show-views="true"
          @play-demo="$emit('play-demo', $event)"
          @play-demo-with-notes="$emit('play-demo-with-notes', $event)"
        />
      </div>
    </div>

    <!-- Pagination footer -->
    <div
      v-if="totalPages > 1"
      class="shrink-0 border-t border-default px-4 py-2 flex items-center justify-between text-xs text-muted"
    >
      <span>Showing {{ showingStart }}–{{ showingEnd }} of {{ demos.length }}</span>
      <div class="flex items-center gap-1">
        <button
          @click="currentPage--"
          :disabled="currentPage <= 1"
          class="size-6 flex items-center justify-center rounded transition-colors"
          :class="currentPage <= 1 ? 'text-muted/40 cursor-not-allowed' : 'text-muted hover:bg-hover hover:text-emphasis'"
        >
          <i class="fas fa-chevron-left text-[10px]"></i>
        </button>
        <button
          @click="currentPage++"
          :disabled="currentPage >= totalPages"
          class="size-6 flex items-center justify-center rounded transition-colors"
          :class="currentPage >= totalPages ? 'text-muted/40 cursor-not-allowed' : 'text-muted hover:bg-hover hover:text-emphasis'"
        >
          <i class="fas fa-chevron-right text-[10px]"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useIteration } from "../composables/useIteration";
import DemoListHeader from "./DemoListHeader.vue";
import DemoRow from "./DemoRow.vue";

const iteration = useIteration();

interface Props {
  pageType: "library" | "recent" | "shared" | "folder";
  demos: any[];
  activeTab: "overlays" | "environments";
  envFilter?: "all" | "html" | "cloned";
  showNavigationSidebar: boolean;
  loading?: boolean;
  title?: string;
  showBreadcrumbs?: boolean;
  currentFolder?: any;
  breadcrumbs?: any[];
  currentSort?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: string;
  emptyActionText?: string;
}

interface Emits {
  (e: "change-tab", tab: "overlays" | "environments"): void;
  (e: "change-env-filter", filter: "all" | "html" | "cloned"): void;
  (e: "toggle-sidebar"): void;
  (e: "change-sort", sort: string): void;
  (e: "empty-action"): void;
  (e: "play-demo", demo: any): void;
  (e: "play-demo-with-notes", demo: any): void;
  (e: "navigate-breadcrumb", crumb: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  envFilter: "all",
  showBreadcrumbs: false,
  currentFolder: null,
  breadcrumbs: () => [],
  currentSort: "lastModified",
  emptyTitle: "No demos found",
  emptyDescription: "Create your first demo to get started.",
  emptyIcon: "fal fa-folder",
  emptyActionText: "",
});

defineEmits<Emits>();

// Shadow-on-scroll
const scrollContainer = ref<HTMLElement | null>(null);
const isScrolled = ref(false);

const onScroll = () => {
  isScrolled.value = (scrollContainer.value?.scrollTop ?? 0) > 0;
};

const showBreadcrumbs = computed(() => {
  return props.showBreadcrumbs || props.pageType === "folder";
});

const isEmpty = computed(() => props.demos.length === 0);

// Pagination
const PAGE_SIZE = 10;
const currentPage = ref(1);

const totalPages = computed(() => Math.ceil(props.demos.length / PAGE_SIZE));

const paginatedDemos = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return props.demos.slice(start, start + PAGE_SIZE);
});

const showingStart = computed(() => (currentPage.value - 1) * PAGE_SIZE + 1);
const showingEnd = computed(() => Math.min(currentPage.value * PAGE_SIZE, props.demos.length));

watch(
  () => props.demos,
  () => {
    currentPage.value = 1;
  },
);
</script>
