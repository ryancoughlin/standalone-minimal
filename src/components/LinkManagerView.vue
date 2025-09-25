<template>
  <div class="link-manager-view">
    <!-- Header -->
    <div
      class="flex items-center justify-between p-4 border-b border-gray-200 bg-white"
    >
      <div class="flex items-center gap-3">
        <button
          @click="$emit('back')"
          class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i class="fas fa-arrow-left"></i>
        </button>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Manage Links</h2>
          <p class="text-sm text-gray-500">{{ demo?.title }}</p>
        </div>
      </div>
    </div>

    <!-- Demo Info -->
    <div class="p-4 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center gap-3">
        <div
          class="w-16 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-100"
        >
          <img
            v-if="demo?.screenshot_small"
            :src="getScreenshotUrl(demo.screenshot_small)"
            alt="demo preview"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <i class="fas fa-play text-gray-400"></i>
          </div>
        </div>
        <div>
          <div class="text-sm font-medium text-gray-900">
            {{ demo?.title }}
          </div>
          <div class="text-xs text-gray-500">{{ getDemoType(demo) }}</div>
        </div>
      </div>
    </div>

    <!-- Links List -->
    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="customLinks.length === 0" class="text-center py-8">
        <div class="text-gray-400 mb-3">
          <i class="fas fa-link text-3xl"></i>
        </div>
        <h3 class="text-base font-medium text-gray-900 mb-1">
          No custom links yet
        </h3>
        <p class="text-sm text-gray-500">
          Create your first customized link to get started.
        </p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="link in customLinks"
          :key="link.id"
          class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
        >
          <!-- Link Header -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-gray-900 truncate">
                {{ link.prospectName }} - {{ link.companyName }}
              </h4>
              <p class="text-xs text-gray-500 mt-1">
                Created {{ formatDate(link.createdAt) }} by
                {{ link.createdBy }}
              </p>
            </div>
            <div class="flex items-center gap-1 ml-2">
              <span
                :class="[
                  'px-2 py-1 text-xs rounded-full',
                  link.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ link.isActive ? "Active" : "Archived" }}
              </span>
            </div>
          </div>

          <!-- Link Details -->
          <div class="space-y-2 mb-3">
            <div class="flex items-center gap-2 text-xs text-gray-600">
              <i class="fas fa-eye w-3"></i>
              <span>{{ link.viewCount || 0 }} views</span>
              <span class="mx-1">•</span>
              <i class="fas fa-clock w-3"></i>
              <span>Last viewed {{ formatDate(link.lastViewed) }}</span>
            </div>
            <div
              v-if="link.region || link.dataset"
              class="flex items-center gap-2 text-xs text-gray-600"
            >
              <i class="fas fa-cog w-3"></i>
              <span v-if="link.region">{{ link.region }}</span>
              <span v-if="link.region && link.dataset">•</span>
              <span v-if="link.dataset">{{ link.dataset }}</span>
            </div>
          </div>

          <!-- Link URL -->
          <div class="flex items-center gap-2 mb-3">
            <input
              :value="link.url"
              readonly
              class="flex-1 px-2 py-1 text-xs bg-gray-50 border border-gray-200 rounded font-mono"
            />
            <button
              @click="copyToClipboard(link.url)"
              class="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              title="Copy link"
            >
              <i class="fas fa-copy"></i>
            </button>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
              @click="openLink(link.url)"
              class="px-3 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
            >
              <i class="fas fa-external-link-alt mr-1"></i>
              Open
            </button>
            <button
              @click="duplicateLink(link)"
              class="px-3 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition-colors"
            >
              <i class="fas fa-copy mr-1"></i>
              Duplicate
            </button>
            <button
              @click="toggleLinkStatus(link)"
              :class="[
                'px-3 py-1 text-xs rounded transition-colors',
                link.isActive
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200',
              ]"
            >
              <i
                :class="link.isActive ? 'fas fa-archive' : 'fas fa-check'"
                class="mr-1"
              ></i>
              {{ link.isActive ? "Archive" : "Activate" }}
            </button>
            <button
              @click="deleteLink(link)"
              class="px-3 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors"
            >
              <i class="fas fa-trash mr-1"></i>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="p-4 border-t border-gray-200 bg-gray-50">
      <div class="flex gap-3">
        <button
          @click="createNewLink"
          class="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          <i class="fas fa-plus mr-2"></i>
          Create New Link
        </button>
        <button
          @click="exportLinks"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <i class="fas fa-download mr-2"></i>
          Export
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  demo: any;
}

interface Emits {
  (e: "back"): void;
  (e: "create-link", demo: any): void;
  (e: "duplicate-link", link: any): void;
  (e: "delete-link", link: any): void;
  (e: "toggle-link-status", link: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Mock custom links data
const customLinks = ref([
  {
    id: "1",
    prospectName: "John Smith",
    companyName: "Acme Corp",
    url: "https://demo.reprise.com/custom/abc123",
    isActive: true,
    viewCount: 15,
    createdAt: new Date("2024-01-15"),
    lastViewed: new Date("2024-01-20"),
    createdBy: "Sarah Johnson",
    region: "US East",
    dataset: "Sample Retail Data",
  },
  {
    id: "2",
    prospectName: "Mike Chen",
    companyName: "TechStart Inc",
    url: "https://demo.reprise.com/custom/def456",
    isActive: false,
    viewCount: 8,
    createdAt: new Date("2024-01-10"),
    lastViewed: new Date("2024-01-18"),
    createdBy: "Sarah Johnson",
    region: "US West",
    dataset: "Sample Finance Data",
  },
  {
    id: "3",
    prospectName: "Emily Davis",
    companyName: "Global Solutions",
    url: "https://demo.reprise.com/custom/ghi789",
    isActive: true,
    viewCount: 23,
    createdAt: new Date("2024-01-12"),
    lastViewed: new Date("2024-01-21"),
    createdBy: "Tom Wilson",
    region: "EU West",
    dataset: "Sample Healthcare Data",
  },
]);

const getScreenshotUrl = (screenshotSmall: string) => {
  if (!screenshotSmall) return "";
  if (screenshotSmall.startsWith("data:")) {
    return screenshotSmall;
  }
  return `data:image/png;base64,${screenshotSmall}`;
};

const getDemoType = (demo: any) => {
  if (demo?.replay_type === "LEGACY") return "Legacy";
  if (demo?.replay_folder_id) return "Maestro";
  if (demo?.folder_id && !demo?.replay_type) return "Live";
  return "Demo";
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    // You could add a toast notification here
    console.log("Link copied to clipboard");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

const openLink = (url: string) => {
  window.open(url, "_blank");
};

const duplicateLink = (link: any) => {
  emit("duplicate-link", link);
};

const deleteLink = (link: any) => {
  if (confirm("Are you sure you want to delete this link?")) {
    emit("delete-link", link);
  }
};

const toggleLinkStatus = (link: any) => {
  emit("toggle-link-status", link);
};

const createNewLink = () => {
  emit("create-link", props.demo);
};

const exportLinks = () => {
  // Export functionality would go here
  console.log("Exporting links...");
};
</script>

<style scoped>
.link-manager-view {
  @apply flex flex-col h-full;
}
</style>
