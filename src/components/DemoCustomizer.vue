<template>
  <div class="demo-customizer">
    <!-- Simple Header -->
    <div class="customizer-header">
      <button @click="$emit('back')" class="back-btn">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h2>Customize Demo</h2>
    </div>

    <!-- Customization Form -->
    <div class="customization-form">
      <!-- General Section -->
      <div class="form-section">
        <div class="section-header" @click="toggleSection('general')">
          <div class="section-title">
            <i class="fas fa-globe"></i>
            <span>General</span>
          </div>
          <button class="toggle-btn">
            <i
              :class="
                expandedSections.general
                  ? 'fas fa-chevron-up'
                  : 'fas fa-chevron-down'
              "
            ></i>
          </button>
        </div>
        <div v-if="expandedSections.general" class="section-content">
          <div class="form-group">
            <label class="form-label">Name</label>
            <input
              v-model="formData.name"
              placeholder="e.g., Goldman Sachs - Custom MFA Flow"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea
              v-model="formData.description"
              placeholder="Brief description of the demo"
              rows="2"
              class="form-textarea"
            ></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Expiration Date</label>
              <input
                v-model="formData.expirationDate"
                type="date"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Enable Guides</label>
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

      <!-- Welcome Page Section -->
      <div class="form-section">
        <div class="section-header" @click="toggleSection('welcome')">
          <div class="section-title">
            <i class="fas fa-hand-wave"></i>
            <span>Welcome Page</span>
          </div>
          <button class="toggle-btn">
            <i
              :class="
                expandedSections.welcome
                  ? 'fas fa-chevron-up'
                  : 'fas fa-chevron-down'
              "
            ></i>
          </button>
        </div>
        <div v-if="expandedSections.welcome" class="section-content">
          <div class="form-group">
            <label class="form-label">Show Welcome Page</label>
            <label class="toggle-switch">
              <input
                v-model="formData.showWelcomePage"
                type="checkbox"
                class="peer"
              />
              <span class="slider"></span>
            </label>
          </div>
          <div v-if="formData.showWelcomePage" class="welcome-content">
            <div class="form-group">
              <label class="form-label">Welcome Title</label>
              <input
                v-model="formData.welcomeTitle"
                placeholder="e.g., Introduction to MFA Securities"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Welcome Message</label>
              <textarea
                v-model="formData.welcomeMessage"
                placeholder="Enter your welcome message..."
                rows="4"
                class="form-textarea"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Variables Section -->
      <div class="form-section">
        <div class="section-header" @click="toggleSection('variables')">
          <div class="section-title">
            <i class="fas fa-code"></i>
            <span>Variables</span>
          </div>
          <button class="toggle-btn">
            <i
              :class="
                expandedSections.variables
                  ? 'fas fa-chevron-up'
                  : 'fas fa-chevron-down'
              "
            ></i>
          </button>
        </div>
        <div v-if="expandedSections.variables" class="section-content">
          <div class="variables-grid">
            <div
              v-for="(variable, index) in formData.variables"
              :key="index"
              class="variable-card"
            >
              <div class="variable-header">
                <div class="variable-type-icon">
                  <i :class="getVariableIcon(variable.type)"></i>
                </div>
                <span class="variable-name">{{ variable.name }}</span>
              </div>
              <div class="variable-content">
                <div class="variable-default">
                  <span class="default-value">{{ variable.defaultValue }}</span>
                </div>
                <input
                  v-if="variable.type === 'text'"
                  v-model="variable.newValue"
                  :placeholder="`Override ${variable.name.toLowerCase()}`"
                  class="variable-input"
                />
                <input
                  v-else-if="variable.type === 'date'"
                  v-model="variable.newValue"
                  type="date"
                  class="variable-input"
                />
                <div
                  v-else-if="variable.type === 'image'"
                  class="variable-image-input"
                >
                  <input
                    v-model="variable.newValue"
                    placeholder="Image URL or upload"
                    class="variable-input"
                  />
                  <button class="upload-btn">
                    <i class="fas fa-upload"></i>
                  </button>
                </div>
              </div>
            </div>
            <button @click="addVariable" class="add-variable-btn">
              <i class="fas fa-plus"></i>
              Add Variable
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Section -->
    <div class="action-section">
      <div class="action-buttons">
        <button @click="previewDemo" class="preview-btn">
          <i class="fas fa-eye"></i>
          Preview
        </button>
        <button @click="generateLink" :disabled="!isValid" class="create-btn">
          <i class="fas fa-link"></i>
          Create Link
        </button>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccess" class="success-modal">
      <div class="success-content">
        <div class="success-header">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h3>Demo Link Created!</h3>
          <p>Your personalized demo is ready to share</p>
        </div>

        <div class="link-section">
          <div class="link-label">Share this link:</div>
          <div class="link-container">
            <input :value="generatedLink" readonly class="link-input" />
            <button @click="copyLink" class="copy-btn">
              <i class="fas fa-copy"></i>
            </button>
          </div>
        </div>

        <div class="demo-info">
          <div class="demo-preview">
            <div class="demo-thumbnail">
              <img
                v-if="demo?.screenshot_small"
                :src="getScreenshotUrl(demo.screenshot_small)"
              />
              <div v-else class="demo-placeholder">
                <i class="fas fa-play"></i>
              </div>
            </div>
            <div class="demo-details">
              <h4>{{ formData.name }}</h4>
              <p>{{ formData.description }}</p>
            </div>
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

    <!-- Quick Preview Panel -->
    <div v-if="showPreview" class="preview-panel">
      <div class="preview-header">
        <h3>Preview</h3>
        <button @click="showPreview = false" class="close-preview">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="preview-content">
        <div class="preview-demo">
          <div class="preview-thumbnail">
            <img
              v-if="demo?.screenshot_small"
              :src="getScreenshotUrl(demo.screenshot_small)"
            />
            <div v-else class="preview-placeholder">
              <i class="fas fa-play"></i>
            </div>
          </div>
          <div class="preview-details">
            <h4>{{ formData.name || "Demo Name" }}</h4>
            <p>{{ formData.description || "Demo Description" }}</p>
            <div class="preview-variables">
              <span
                v-for="variable in activeVariables"
                :key="variable.name"
                class="preview-var"
              >
                {{ variable.name }}:
                {{ variable.newValue || variable.defaultValue }}
              </span>
            </div>
          </div>
        </div>
        <div class="preview-actions">
          <button @click="runDemo" class="run-demo-btn">
            <i class="fas fa-play"></i>
            Run Demo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Props {
  demo: any;
}

interface Emits {
  (e: "back"): void;
  (e: "preview", demo: any, customization: any): void;
  (e: "generate-link", demo: any, customization: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showPreview = ref(false);
const showSuccess = ref(false);
const generatedLink = ref("");

// Section state
const expandedSections = ref({
  general: true,
  welcome: false,
  variables: false,
});

// Form data
const formData = ref({
  name: "",
  description: "",
  expirationDate: "",
  enableGuides: true,
  showWelcomePage: true,
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
    {
      name: "companyLogo",
      type: "image",
      defaultValue: "Acme, Inc.",
      newValue: "",
    },
    {
      name: "boardReviewDate",
      type: "date",
      defaultValue: "3/12/2025",
      newValue: "",
    },
  ],
});

// Computed
const isValid = computed(() => {
  return formData.value.name.trim() !== "";
});

const activeVariables = computed(() => {
  return formData.value.variables.filter((v) => v.newValue.trim() !== "");
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

const getVariableIcon = (type: string) => {
  switch (type) {
    case "text":
      return "fas fa-font";
    case "date":
      return "fas fa-calendar";
    case "image":
      return "fas fa-image";
    default:
      return "fas fa-code";
  }
};

// Methods
const toggleSection = (section: string) => {
  expandedSections.value[section] = !expandedSections.value[section];
};

const addVariable = () => {
  formData.value.variables.push({
    name: "",
    type: "text",
    defaultValue: "",
    newValue: "",
  });
};

const previewDemo = () => {
  showPreview.value = true;
  emit("preview", props.demo, formData.value);
};

const runDemo = () => {
  console.log("Running demo with customization:", formData.value);
  alert(`Running demo: ${formData.value.name}`);
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
    // You could add a toast notification here
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
        showWelcomePage: true,
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
          {
            name: "companyLogo",
            type: "image",
            defaultValue: "Acme, Inc.",
            newValue: "",
          },
          {
            name: "boardReviewDate",
            type: "date",
            defaultValue: "3/12/2025",
            newValue: "",
          },
        ],
      };
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.demo-customizer {
  @apply flex flex-col h-full bg-gray-50;
}

.customizer-header {
  @apply flex items-center gap-3 p-3 bg-white border-b border-gray-200;
}

.back-btn {
  @apply p-2 text-gray-400 hover:text-gray-600 transition-colors rounded;
}

.customizer-header h2 {
  @apply text-base font-semibold text-gray-900;
}

.action-section {
  @apply p-3 bg-white border-t border-gray-200;
}

.action-buttons {
  @apply flex gap-3;
}

.preview-btn {
  @apply flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors;
}

.create-btn {
  @apply flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors;
}

.customization-form {
  @apply flex-1 overflow-y-auto p-3 space-y-3;
}

.form-section {
  @apply bg-white rounded-lg border border-gray-200;
}

.section-header {
  @apply flex items-center justify-between p-3 border-b border-gray-100 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors;
}

.section-title {
  @apply flex items-center gap-2;
}

.section-title i {
  @apply text-gray-500;
}

.toggle-btn {
  @apply p-1 text-gray-400 hover:text-gray-600 transition-colors;
}

.section-content {
  @apply p-3 space-y-3;
}

.form-group {
  @apply space-y-1;
}

.form-row {
  @apply grid grid-cols-2 gap-3;
}

.form-label {
  @apply block text-xs font-medium text-gray-700;
}

.form-input {
  @apply w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.form-textarea {
  @apply w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none;
}

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

.welcome-content {
  @apply space-y-3;
}

.variables-grid {
  @apply space-y-3;
}

.variable-card {
  @apply p-3 bg-gray-50 rounded border;
}

.variable-header {
  @apply flex items-center gap-2 mb-2;
}

.variable-type-icon {
  @apply w-5 h-5 bg-blue-100 rounded flex items-center justify-center;
}

.variable-type-icon i {
  @apply text-blue-600 text-xs;
}

.variable-name {
  @apply text-sm font-medium text-gray-700 flex-1;
}

.variable-content {
  @apply space-y-2;
}

.variable-default {
  @apply text-xs text-gray-500;
}

.default-value {
  @apply bg-gray-200 px-2 py-1 rounded text-xs;
}

.variable-input {
  @apply w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500;
}

.variable-image-input {
  @apply flex gap-2;
}

.upload-btn {
  @apply px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors;
}

.add-variable-btn {
  @apply w-full p-3 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors;
}

.preview-panel {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.preview-content {
  @apply bg-white rounded-lg p-4 max-w-sm w-full mx-4;
}

.preview-header {
  @apply flex items-center justify-between mb-3;
}

.close-preview {
  @apply p-1 text-gray-400 hover:text-gray-600 transition-colors;
}

.preview-demo {
  @apply flex items-center gap-3 mb-3;
}

.preview-thumbnail {
  @apply w-16 h-12 bg-gray-100 rounded overflow-hidden;
}

.preview-placeholder {
  @apply w-full h-full flex items-center justify-center text-gray-400;
}

.preview-details h4 {
  @apply font-medium text-gray-900 text-sm;
}

.preview-details p {
  @apply text-xs text-gray-500;
}

.preview-variables {
  @apply mt-1 space-y-1;
}

.preview-var {
  @apply text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded;
}

.run-demo-btn {
  @apply w-full px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded transition-colors;
}

/* Success Modal */
.success-modal {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
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

.link-label {
  @apply text-sm font-medium text-gray-700 mb-2;
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

.demo-info {
  @apply mb-6;
}

.demo-preview {
  @apply flex items-center gap-3 p-3 bg-gray-50 rounded;
}

.demo-thumbnail {
  @apply w-12 h-9 bg-gray-200 rounded overflow-hidden;
}

.demo-placeholder {
  @apply w-full h-full flex items-center justify-center text-gray-400;
}

.demo-details h4 {
  @apply text-sm font-medium text-gray-900;
}

.demo-details p {
  @apply text-xs text-gray-600;
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
