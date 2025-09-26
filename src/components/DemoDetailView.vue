<template>
  <div class="demo-detail-view">
    <!-- Header -->
    <div class="detail-header">
      <button @click="$emit('back')" class="back-btn" title="Back to demo list">
        <i class="fas fa-arrow-left"></i>
      </button>
      <div class="header-content">
        <h2 class="demo-title">{{ demo.title }}</h2>
        <div class="demo-meta">
          <span class="demo-type">{{ getDemoType(demo) }}</span>
          <span class="demo-separator">•</span>
          <span class="demo-status">{{ getDemoStatus(demo) }}</span>
          <span class="demo-separator">•</span>
          <span class="demo-updated">{{ formatLastUpdated(demo) }}</span>
        </div>
      </div>
    </div>

    <!-- Demo Preview -->
    <div class="demo-preview">
      <div class="preview-container">
        <img
          v-if="demo.screenshot_large && !imageError"
          :src="getScreenshotUrl(demo.screenshot_large)"
          @error="imageError = true"
          alt="demo preview"
          class="preview-image"
        />
        <div v-else class="preview-placeholder">
          <i class="fas fa-play-circle text-4xl text-gray-400"></i>
          <p class="text-sm text-gray-500 mt-2">Preview not available</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <button
        @click="$emit('launch-demo', demo)"
        class="action-btn primary"
        title="Launch demo"
      >
        <i class="fas fa-play"></i>
        Launch Demo
      </button>
      <button
        @click="$emit('preview-demo', demo)"
        class="action-btn secondary"
        title="Preview demo"
      >
        <i class="fas fa-eye"></i>
        Preview
      </button>
      <button
        @click="$emit('copy-link', demo)"
        class="action-btn secondary"
        title="Copy share link"
      >
        <i class="fas fa-link"></i>
        Copy Link
      </button>
    </div>

    <!-- Demo Information -->
    <div class="demo-info-section">
      <div class="info-grid">
        <!-- Usage Stats -->
        <div class="info-card">
          <div class="info-header">
            <i class="fas fa-chart-bar text-gray-500"></i>
            <h3>Usage Stats</h3>
          </div>
          <div class="info-content">
            <div class="stat-item">
              <span class="stat-label">Views</span>
              <span class="stat-value">{{ demo.views || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Active Links</span>
              <span class="stat-value">{{ demo.active_links || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Last Viewed</span>
              <span class="stat-value">{{ formatLastViewed(demo) }}</span>
            </div>
          </div>
        </div>

        <!-- Demo Details -->
        <div class="info-card">
          <div class="info-header">
            <i class="fas fa-info-circle text-gray-500"></i>
            <h3>Details</h3>
          </div>
          <div class="info-content">
            <div class="detail-item">
              <span class="detail-label">Folder</span>
              <span class="detail-value">{{
                getFolderName(demo.folder_id || demo.replay_folder_id)
              }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Created</span>
              <span class="detail-value">{{ formatCreatedDate(demo) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Duration</span>
              <span class="detail-value">{{ demo.duration || "N/A" }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Advanced Actions -->
    <div class="advanced-actions">
      <button
        @click="$emit('customize-demo', demo)"
        class="advanced-btn"
        title="Customize demo"
      >
        <i class="fas fa-edit"></i>
        Customize
      </button>
      <button
        @click="$emit('manage-links', demo)"
        class="advanced-btn"
        title="Manage links"
      >
        <i class="fas fa-link"></i>
        Manage Links
      </button>
      <button
        @click="$emit('view-analytics', demo)"
        class="advanced-btn"
        title="View analytics"
      >
        <i class="fas fa-chart-line"></i>
        Analytics
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  demo: any;
  foldersWithCounts: any[];
}

interface Emits {
  (e: "back"): void;
  (e: "launch-demo", demo: any): void;
  (e: "preview-demo", demo: any): void;
  (e: "copy-link", demo: any): void;
  (e: "customize-demo", demo: any): void;
  (e: "manage-links", demo: any): void;
  (e: "view-analytics", demo: any): void;
}

const props = defineProps<Props>();
defineEmits<Emits>();

const imageError = ref(false);

const getDemoType = (demo: any) => {
  if (demo.replay_type === "LEGACY") return "Legacy";
  if (demo.replay_folder_id) return "Maestro";
  if (demo.folder_id && !demo.replay_type) return "Live";
  return "Demo";
};

const getDemoStatus = (demo: any) => {
  if (demo.is_draft) return "Draft";
  if (demo.is_published) return "Published";
  return "Active";
};

const getFolderName = (folderId: string) => {
  const folder = props.foldersWithCounts.find((f) => f.id === folderId);
  return folder?.title || "Unknown Folder";
};

const getScreenshotUrl = (screenshotLarge: string) => {
  if (!screenshotLarge) return "";
  if (screenshotLarge.startsWith("data:")) {
    return screenshotLarge;
  }
  return `data:image/png;base64,${screenshotLarge}`;
};

const formatLastUpdated = (demo: any) => {
  const date = new Date(demo.last_modified_at || demo.lastModified);
  return date.toLocaleDateString();
};

const formatLastViewed = (demo: any) => {
  if (!demo.last_viewed_at) return "Never";
  const date = new Date(demo.last_viewed_at);
  return date.toLocaleDateString();
};

const formatCreatedDate = (demo: any) => {
  const date = new Date(demo.created_at || demo.createdAt);
  return date.toLocaleDateString();
};
</script>

<style scoped>
.demo-detail-view {
  @apply flex flex-col h-full bg-white;
}

/* Header */
.detail-header {
  @apply flex items-center gap-3 p-4 border-b border-gray-200 bg-white;
}

.back-btn {
  @apply p-2 text-gray-400 hover:text-gray-600 transition-colors rounded;
}

.header-content {
  @apply flex-1 min-w-0;
}

.demo-title {
  @apply text-lg font-semibold text-gray-900 truncate;
}

.demo-meta {
  @apply text-sm text-gray-500 mt-1;
}

.demo-type {
  @apply font-medium text-blue-600;
}

.demo-separator {
  @apply mx-1;
}

.demo-status {
  @apply text-gray-600;
}

.demo-updated {
  @apply text-gray-500;
}

/* Demo Preview */
.demo-preview {
  @apply p-4 bg-gray-50;
}

.preview-container {
  @apply w-full h-48 bg-white rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center;
}

.preview-image {
  @apply w-full h-full object-cover;
}

.preview-placeholder {
  @apply flex flex-col items-center justify-center text-center;
}

/* Quick Actions */
.quick-actions {
  @apply flex gap-3 p-4 border-b border-gray-200;
}

.action-btn {
  @apply flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200;
}

.action-btn.primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 flex-1;
}

.action-btn.secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200 flex-1;
}

/* Demo Information */
.demo-info-section {
  @apply flex-1 p-4 overflow-y-auto;
}

.info-grid {
  @apply grid grid-cols-1 gap-4;
}

.info-card {
  @apply bg-gray-50 rounded-lg border border-gray-200;
}

.info-header {
  @apply flex items-center gap-2 p-3 border-b border-gray-200;
}

.info-header h3 {
  @apply text-sm font-medium text-gray-700;
}

.info-content {
  @apply p-3 space-y-2;
}

.stat-item,
.detail-item {
  @apply flex justify-between items-center;
}

.stat-label,
.detail-label {
  @apply text-sm text-gray-600;
}

.stat-value,
.detail-value {
  @apply text-sm font-medium text-gray-900;
}

/* Advanced Actions */
.advanced-actions {
  @apply flex gap-2 p-4 border-t border-gray-200 bg-gray-50;
}

.advanced-btn {
  @apply flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded-md transition-all duration-200 flex-1;
}

/* Custom scrollbar */
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
