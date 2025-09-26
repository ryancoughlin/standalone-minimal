<template>
  <!-- Modal Overlay -->
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-container" @click.stop>
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="header-content">
          <div class="demo-preview">
            <div class="demo-thumbnail">
              <img
                v-if="demo?.screenshot_small"
                :src="getScreenshotUrl(demo.screenshot_small)"
                :alt="demo.title"
              />
              <div v-else class="demo-placeholder">
                <i class="fas fa-play"></i>
              </div>
            </div>
            <div class="demo-info">
              <h2>{{ demo?.title || "Demo" }}</h2>
              <div class="demo-meta">
                <span class="demo-type">{{ getDemoType(demo) }}</span>
                <span class="demo-status">Ready to customize</span>
              </div>
            </div>
          </div>
          <button @click="$emit('close')" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Quick Actions Bar -->
      <div class="quick-actions">
        <button @click="previewDemo" class="action-btn preview-btn">
          <i class="fas fa-eye"></i>
          Preview
        </button>
        <button
          @click="generateLink"
          :disabled="!isValid"
          class="action-btn primary-btn"
        >
          <i class="fas fa-link"></i>
          Create Share Link
        </button>
      </div>

      <!-- Customization Content -->
      <div class="customization-content">
        <!-- Essential Settings -->
        <div class="essential-settings">
          <div class="setting-group">
            <label class="setting-label">Demo Name</label>
            <input
              v-model="formData.name"
              placeholder="e.g., Goldman Sachs - Custom MFA Flow"
              class="setting-input"
            />
          </div>
          <div class="setting-group">
            <label class="setting-label">Description</label>
            <input
              v-model="formData.description"
              placeholder="Brief description for the customer"
              class="setting-input"
            />
          </div>
        </div>

        <!-- Advanced Options (Collapsible) -->
        <div class="advanced-section">
          <button @click="showAdvanced = !showAdvanced" class="advanced-toggle">
            <i
              :class="
                showAdvanced ? 'fas fa-chevron-up' : 'fas fa-chevron-down'
              "
            ></i>
            <span>Advanced Options</span>
          </button>

          <div v-if="showAdvanced" class="advanced-content">
            <div class="setting-row">
              <div class="setting-group">
                <label class="setting-label">Expiration Date</label>
                <input
                  v-model="formData.expirationDate"
                  type="date"
                  class="setting-input"
                />
              </div>
              <div class="setting-group">
                <label class="setting-label">Enable Guides</label>
                <label class="toggle-switch">
                  <input
                    v-model="formData.enableGuides"
                    type="checkbox"
                    class="peer"
                  />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Customizations -->
        <div class="quick-customizations">
          <h3>Quick Customizations</h3>
          <div class="customization-grid">
            <button
              @click="toggleCustomization('welcome')"
              :class="[
                'customization-btn',
                { active: isCustomizationActive('welcome') },
              ]"
            >
              <i class="fas fa-hand-wave"></i>
              <span>Welcome Page</span>
            </button>
            <button
              @click="toggleCustomization('variables')"
              :class="[
                'customization-btn',
                { active: isCustomizationActive('variables') },
              ]"
            >
              <i class="fas fa-code"></i>
              <span>Variables</span>
            </button>
            <button
              @click="toggleCustomization('access')"
              :class="[
                'customization-btn',
                { active: isCustomizationActive('access') },
              ]"
            >
              <i class="fas fa-shield-alt"></i>
              <span>Access Control</span>
            </button>
            <button
              @click="toggleCustomization('crm')"
              :class="[
                'customization-btn',
                { active: isCustomizationActive('crm') },
              ]"
            >
              <i class="fas fa-plug"></i>
              <span>CRM Integration</span>
            </button>
          </div>
        </div>

        <!-- Active Customizations -->
        <div
          v-if="activeCustomizations.length > 0"
          class="active-customizations"
        >
          <h3>Active Customizations</h3>

          <!-- Welcome Page -->
          <div
            v-if="isCustomizationActive('welcome')"
            class="customization-panel"
          >
            <div class="panel-header">
              <i class="fas fa-hand-wave"></i>
              <span>Welcome Page</span>
              <button
                @click="toggleCustomization('welcome')"
                class="remove-btn"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="panel-content">
              <div class="setting-group">
                <label class="setting-label">Welcome Title</label>
                <input
                  v-model="formData.welcomeTitle"
                  placeholder="e.g., Introduction to MFA Securities"
                  class="setting-input"
                />
              </div>
              <div class="setting-group">
                <label class="setting-label">Welcome Message</label>
                <textarea
                  v-model="formData.welcomeMessage"
                  placeholder="Enter your welcome message..."
                  rows="3"
                  class="setting-textarea"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Variables -->
          <div
            v-if="isCustomizationActive('variables')"
            class="customization-panel"
          >
            <div class="panel-header">
              <i class="fas fa-code"></i>
              <span>Variables</span>
              <button
                @click="toggleCustomization('variables')"
                class="remove-btn"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="panel-content">
              <div class="variables-list">
                <div
                  v-for="(variable, index) in formData.variables.slice(0, 3)"
                  :key="index"
                  class="variable-item"
                >
                  <div class="variable-info">
                    <span class="variable-name">{{ variable.name }}</span>
                    <span class="variable-default">{{
                      variable.defaultValue
                    }}</span>
                  </div>
                  <input
                    v-model="variable.newValue"
                    :placeholder="`Override ${variable.name.toLowerCase()}`"
                    class="variable-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Access Control -->
          <div
            v-if="isCustomizationActive('access')"
            class="customization-panel"
          >
            <div class="panel-header">
              <i class="fas fa-shield-alt"></i>
              <span>Access Control</span>
              <button @click="toggleCustomization('access')" class="remove-btn">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="panel-content">
              <div class="setting-group">
                <label class="setting-label">Access Level</label>
                <select v-model="formData.accessControl" class="setting-select">
                  <option value="public">Public - Anyone with link</option>
                  <option value="email">Email Required</option>
                  <option value="password">Password Protected</option>
                </select>
              </div>
              <div
                v-if="formData.accessControl === 'password'"
                class="setting-group"
              >
                <label class="setting-label">Password</label>
                <input
                  v-model="formData.password"
                  type="password"
                  placeholder="Enter password"
                  class="setting-input"
                />
              </div>
            </div>
          </div>

          <!-- CRM Integration -->
          <div v-if="isCustomizationActive('crm')" class="customization-panel">
            <div class="panel-header">
              <i class="fas fa-plug"></i>
              <span>CRM Integration</span>
              <button @click="toggleCustomization('crm')" class="remove-btn">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="panel-content">
              <div class="setting-group">
                <label class="setting-label">CRM Provider</label>
                <select v-model="formData.crmProvider" class="setting-select">
                  <option value="">No Integration</option>
                  <option value="hubspot">HubSpot</option>
                  <option value="salesforce">Salesforce</option>
                  <option value="pipedrive">Pipedrive</option>
                </select>
              </div>
              <div v-if="formData.crmProvider" class="setting-group">
                <label class="setting-label">Lead Source</label>
                <input
                  v-model="formData.leadSource"
                  placeholder="e.g., Demo Customization"
                  class="setting-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccess" class="success-modal">
      <div class="success-overlay" @click="closeSuccess"></div>
      <div class="success-content">
        <div class="success-header">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h3>Demo Link Created!</h3>
          <p>Ready to share with your customer</p>
        </div>

        <div class="link-section">
          <div class="link-container">
            <input :value="generatedLink" readonly class="link-input" />
            <button @click="copyLink" class="copy-btn">
              <i class="fas fa-copy"></i>
            </button>
          </div>
        </div>

        <div class="success-actions">
          <button @click="openLink" class="open-btn">
            <i class="fas fa-external-link-alt"></i>
            Open Demo
          </button>
          <button @click="closeSuccess" class="close-btn">Done</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

interface Props {
  demo: any;
}

interface Emits {
  (e: "close"): void;
  (e: "preview", demo: any, customization: any): void;
  (e: "generate-link", demo: any, customization: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showSuccess = ref(false);
const showAdvanced = ref(false);
const generatedLink = ref("");

// Customization state
const activeCustomizations = ref<string[]>([]);

// Form data
const formData = ref({
  name: "",
  description: "",
  expirationDate: "",
  enableGuides: true,
  welcomeTitle: "",
  welcomeMessage: "",
  variables: [
    {
      name: "companyName",
      type: "text",
      defaultValue: "Salesforce",
      newValue: "",
    },
    {
      name: "yearOverYearGrowth",
      type: "text",
      defaultValue: "127%",
      newValue: "",
    },
    {
      name: "pipelineVolume",
      type: "text",
      defaultValue: "$2.4M",
      newValue: "",
    },
  ],
  accessControl: "public",
  password: "",
  crmProvider: "",
  leadSource: "",
});

// Computed
const isValid = computed(() => {
  return formData.value.name.trim() !== "";
});

const getDemoType = (demo: any) => {
  if (demo?.replay_folder_id) return "Maestro";
  if (demo?.folder_id && !demo?.replay_type) return "Live";
  return "Demo";
};

const getScreenshotUrl = (screenshotSmall: string) => {
  if (!screenshotSmall) return "";
  if (screenshotSmall.startsWith("data:")) return screenshotSmall;
  return `data:image/png;base64,${screenshotSmall}`;
};

// Customization methods
const toggleCustomization = (type: string) => {
  const index = activeCustomizations.value.indexOf(type);
  if (index > -1) {
    activeCustomizations.value.splice(index, 1);
  } else {
    activeCustomizations.value.push(type);
  }
};

const isCustomizationActive = (type: string) => {
  return activeCustomizations.value.includes(type);
};

const previewDemo = () => {
  emit("preview", props.demo, formData.value);
};

const generateLink = () => {
  if (isValid.value) {
    // Generate a mock link
    generatedLink.value = `https://demo.reprise.com/share/${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    showSuccess.value = true;
    emit("generate-link", props.demo, formData.value);
  }
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(generatedLink.value);
    console.log("Link copied to clipboard");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

const openLink = () => {
  window.open(generatedLink.value, "_blank");
};

const closeSuccess = () => {
  showSuccess.value = false;
  generatedLink.value = "";
};

// Initialize
watch(
  () => props.demo,
  () => {
    if (props.demo) {
      formData.value = {
        name: `${props.demo.title} - Custom Demo`,
        description: `Personalized demo for ${props.demo.title}`,
        expirationDate: "",
        enableGuides: true,
        welcomeTitle: "Introduction to MFA Securities",
        welcomeMessage:
          "Thank you for your interest in exploring our analytics platform. This interactive demo will show you how our solution helps organizations transform raw data into actionable insights.",
        variables: [
          {
            name: "companyName",
            type: "text",
            defaultValue: "Salesforce",
            newValue: "",
          },
          {
            name: "yearOverYearGrowth",
            type: "text",
            defaultValue: "127%",
            newValue: "",
          },
          {
            name: "pipelineVolume",
            type: "text",
            defaultValue: "$2.4M",
            newValue: "",
          },
        ],
        accessControl: "public",
        password: "",
        crmProvider: "",
        leadSource: "",
      };
    }
  },
  { immediate: true }
);
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.modal-container {
  @apply bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden;
}

/* Modal Header */
.modal-header {
  @apply p-4 border-b border-gray-200;
}

.header-content {
  @apply flex items-center justify-between;
}

.demo-preview {
  @apply flex items-center gap-3;
}

.demo-thumbnail {
  @apply w-12 h-9 bg-gray-100 rounded overflow-hidden flex-shrink-0;
}

.demo-thumbnail img {
  @apply w-full h-full object-cover;
}

.demo-placeholder {
  @apply w-full h-full flex items-center justify-center text-gray-400;
}

.demo-info h2 {
  @apply text-lg font-semibold text-gray-900;
}

.demo-meta {
  @apply flex items-center gap-2 mt-1;
}

.demo-type {
  @apply px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded;
}

.demo-status {
  @apply text-xs text-gray-500;
}

.close-btn {
  @apply p-2 text-gray-400 hover:text-gray-600 transition-colors rounded;
}

/* Quick Actions Bar */
.quick-actions {
  @apply flex gap-3 p-4 bg-gray-50 border-b border-gray-200;
}

.action-btn {
  @apply flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors;
}

.preview-btn {
  @apply text-gray-700 bg-white border border-gray-300 hover:bg-gray-50;
}

.primary-btn {
  @apply text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed;
}

/* Customization Content */
.customization-content {
  @apply p-4 space-y-4 max-h-96 overflow-y-auto;
}

/* Essential Settings */
.essential-settings {
  @apply space-y-3;
}

.setting-group {
  @apply space-y-1;
}

.setting-label {
  @apply block text-sm font-medium text-gray-700;
}

.setting-input {
  @apply w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.setting-textarea {
  @apply w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none;
}

.setting-select {
  @apply w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.setting-row {
  @apply grid grid-cols-2 gap-3;
}

/* Advanced Section */
.advanced-section {
  @apply border-t border-gray-200 pt-4;
}

.advanced-toggle {
  @apply flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors;
}

.advanced-content {
  @apply mt-3 space-y-3;
}

/* Toggle Switch */
.toggle-switch {
  @apply relative inline-flex items-center cursor-pointer;
}

.toggle-switch input {
  @apply sr-only;
}

.slider {
  width: 2.25rem;
  height: 1.25rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  position: relative;
  transition: all 0.3s ease;
}

.slider::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 50%;
  height: 1rem;
  width: 1rem;
  transition: all 0.3s ease;
}

.toggle-switch input:checked + .slider {
  background-color: #2563eb;
}

.toggle-switch input:checked + .slider::after {
  transform: translateX(1rem);
}

/* Quick Customizations */
.quick-customizations h3 {
  @apply text-sm font-semibold text-gray-900 mb-3;
}

.customization-grid {
  @apply grid grid-cols-2 gap-2;
}

.customization-btn {
  @apply flex items-center gap-2 p-3 text-sm border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors;
}

.customization-btn.active {
  @apply border-blue-500 bg-blue-50 text-blue-700;
}

.customization-btn i {
  @apply text-gray-500;
}

.customization-btn.active i {
  @apply text-blue-600;
}

/* Active Customizations */
.active-customizations h3 {
  @apply text-sm font-semibold text-gray-900 mb-3;
}

.customization-panel {
  @apply border border-gray-200 rounded-lg;
}

.panel-header {
  @apply flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200;
}

.panel-header i {
  @apply text-gray-500 mr-2;
}

.panel-header span {
  @apply text-sm font-medium text-gray-700 flex-1;
}

.remove-btn {
  @apply p-1 text-gray-400 hover:text-red-600 transition-colors rounded;
}

.panel-content {
  @apply p-3 space-y-3;
}

/* Variables */
.variables-list {
  @apply space-y-2;
}

.variable-item {
  @apply flex items-center gap-3;
}

.variable-info {
  @apply flex items-center gap-2 min-w-0 flex-1;
}

.variable-name {
  @apply text-sm font-medium text-gray-700;
}

.variable-default {
  @apply text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded;
}

.variable-input {
  @apply flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500;
}

/* Success Modal */
.success-modal {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.success-overlay {
  @apply absolute inset-0;
}

.success-content {
  @apply bg-white rounded-lg p-6 max-w-md w-full mx-4;
}

.success-header {
  @apply text-center mb-6;
}

.success-icon {
  @apply w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4;
}

.success-icon i {
  @apply text-green-600 text-2xl;
}

.success-header h3 {
  @apply text-xl font-semibold text-gray-900 mb-2;
}

.success-header p {
  @apply text-sm text-gray-600;
}

.link-section {
  @apply mb-6;
}

.link-container {
  @apply flex gap-2;
}

.link-input {
  @apply flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded font-mono;
}

.copy-btn {
  @apply px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors;
}

.success-actions {
  @apply flex gap-3;
}

.open-btn {
  @apply flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors;
}

.close-btn {
  @apply flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors;
}
</style>
