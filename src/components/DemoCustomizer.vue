<template>
  <div class="demo-customizer">
    <!-- Simple Header -->
    <div class="customizer-header">
      <button @click="$emit('back')" class="back-btn">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h2>Customize Demo</h2>
    </div>

    <!-- Widget Container -->
    <div class="widget-container">
      <!-- General Widget (Always Present) -->
      <div class="widget">
        <div class="widget-header">
          <div class="widget-title">
            <i class="fas fa-globe"></i>
            <span>General</span>
          </div>
        </div>
        <div class="widget-content">
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

      <!-- Dynamic Widgets -->
      <div v-for="widget in activeWidgets" :key="widget.id" class="widget">
        <div class="widget-header">
          <div class="widget-title">
            <i :class="widget.icon"></i>
            <span>{{ widget.title }}</span>
          </div>
          <button @click="removeWidget(widget.id)" class="remove-widget-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="widget-content">
          <!-- Welcome Page Widget -->
          <div v-if="widget.type === 'welcome'" class="welcome-widget">
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

          <!-- Variables Widget -->
          <div v-else-if="widget.type === 'variables'" class="variables-widget">
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
                    <span class="default-value">{{
                      variable.defaultValue
                    }}</span>
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

          <!-- Access Control Widget -->
          <div
            v-else-if="widget.type === 'access-control'"
            class="access-control-widget"
          >
            <div class="form-group">
              <label class="form-label">Access Control</label>
              <select v-model="formData.accessControl" class="form-select">
                <option value="public">Public - Anyone with link</option>
                <option value="email">Email Required</option>
                <option value="password">Password Protected</option>
                <option value="domain">Domain Restricted</option>
              </select>
            </div>
            <div
              v-if="formData.accessControl === 'password'"
              class="form-group"
            >
              <label class="form-label">Password</label>
              <input
                v-model="formData.password"
                type="password"
                placeholder="Enter password"
                class="form-input"
              />
            </div>
            <div v-if="formData.accessControl === 'domain'" class="form-group">
              <label class="form-label">Allowed Domains</label>
              <input
                v-model="formData.allowedDomains"
                placeholder="e.g., company.com, partner.com"
                class="form-input"
              />
            </div>
          </div>

          <!-- CRM Integration Widget -->
          <div v-else-if="widget.type === 'crm-integration'" class="crm-widget">
            <div class="form-group">
              <label class="form-label">CRM Integration</label>
              <select v-model="formData.crmProvider" class="form-select">
                <option value="">No Integration</option>
                <option value="hubspot">HubSpot</option>
                <option value="salesforce">Salesforce</option>
                <option value="pipedrive">Pipedrive</option>
                <option value="email">Email Only</option>
              </select>
            </div>
            <div v-if="formData.crmProvider" class="crm-config">
              <div class="form-group">
                <label class="form-label">Lead Source</label>
                <input
                  v-model="formData.leadSource"
                  placeholder="e.g., Demo Customization"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Campaign Name</label>
                <input
                  v-model="formData.campaignName"
                  placeholder="e.g., Q4 Demo Campaign"
                  class="form-input"
                />
              </div>
            </div>
          </div>

          <!-- Conversion Form Widget -->
          <div
            v-else-if="widget.type === 'conversion-form'"
            class="conversion-form-widget"
          >
            <div class="form-group">
              <label class="form-label">Form Fields</label>
              <div class="form-fields">
                <label class="checkbox-label">
                  <input v-model="formData.formFields.name" type="checkbox" />
                  <span>Name</span>
                </label>
                <label class="checkbox-label">
                  <input v-model="formData.formFields.email" type="checkbox" />
                  <span>Email</span>
                </label>
                <label class="checkbox-label">
                  <input
                    v-model="formData.formFields.company"
                    type="checkbox"
                  />
                  <span>Company</span>
                </label>
                <label class="checkbox-label">
                  <input v-model="formData.formFields.phone" type="checkbox" />
                  <span>Phone</span>
                </label>
                <label class="checkbox-label">
                  <input v-model="formData.formFields.title" type="checkbox" />
                  <span>Job Title</span>
                </label>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Form Title</label>
              <input
                v-model="formData.formTitle"
                placeholder="e.g., Get Started Today"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Form Description</label>
              <textarea
                v-model="formData.formDescription"
                placeholder="Brief description of what happens next..."
                rows="2"
                class="form-textarea"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Widget Dropdown -->
      <div class="add-widget-section">
        <div class="dropdown-container">
          <button
            @click="showAddWidgetDropdown = !showAddWidgetDropdown"
            class="add-widget-btn"
          >
            <i class="fas fa-plus"></i>
            Add Customization
            <i
              :class="
                showAddWidgetDropdown
                  ? 'fas fa-chevron-up'
                  : 'fas fa-chevron-down'
              "
              class="dropdown-arrow"
            ></i>
          </button>

          <div v-if="showAddWidgetDropdown" class="widget-dropdown">
            <div class="dropdown-options">
              <button
                v-for="option in availableWidgets"
                :key="option.type"
                @click="addWidget(option.type)"
                :disabled="isWidgetActive(option.type)"
                class="dropdown-option"
              >
                <div class="option-icon">
                  <i :class="option.icon"></i>
                </div>
                <div class="option-content">
                  <h4>{{ option.title }}</h4>
                  <p>{{ option.description }}</p>
                </div>
                <div v-if="isWidgetActive(option.type)" class="option-status">
                  <i class="fas fa-check"></i>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="showConfirmation" class="confirmation-dialog">
      <div class="dialog-overlay" @click="showConfirmation = false"></div>
      <div class="dialog-content">
        <div class="dialog-header">
          <div class="dialog-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <h3>Remove Customization</h3>
        </div>
        <div class="dialog-body">
          <p>
            Are you sure you want to remove the
            <strong>{{ confirmationWidget?.title }}</strong> customization?
          </p>
          <p class="dialog-warning">This action cannot be undone.</p>
        </div>
        <div class="dialog-actions">
          <button @click="showConfirmation = false" class="cancel-btn">
            Cancel
          </button>
          <button @click="confirmRemoveWidget" class="confirm-btn">
            Remove
          </button>
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
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

interface Props {
  demo: any;
}

interface Emits {
  (e: "back"): void;
  (e: "preview", demo: any, customization: any): void;
  (e: "generate-link", demo: any, customization: any): void;
}

interface Widget {
  id: string;
  type: string;
  title: string;
  icon: string;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showPreview = ref(false);
const showSuccess = ref(false);
const showAddWidgetDropdown = ref(false);
const showConfirmation = ref(false);
const generatedLink = ref("");
const confirmationWidget = ref<Widget | null>(null);

// Widget system
const activeWidgets = ref<Widget[]>([]);
let widgetIdCounter = 0;

// Available widget types
const availableWidgets = [
  {
    type: "welcome",
    title: "Welcome Page",
    icon: "fas fa-hand-wave",
    description: "Add a custom welcome page with title and message",
  },
  {
    type: "variables",
    title: "Variables",
    icon: "fas fa-code",
    description: "Customize demo variables like company names and data",
  },
  {
    type: "access-control",
    title: "Access Control",
    icon: "fas fa-shield-alt",
    description:
      "Control who can access your demo with passwords or domain restrictions",
  },
  {
    type: "crm-integration",
    title: "CRM Integration",
    icon: "fas fa-plug",
    description:
      "Connect to HubSpot, Salesforce, or other CRMs for lead capture",
  },
  {
    type: "conversion-form",
    title: "Conversion Form",
    icon: "fas fa-clipboard-list",
    description: "Add a lead capture form before or after the demo",
  },
];

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
  // New fields for additional widgets
  accessControl: "public",
  password: "",
  allowedDomains: "",
  crmProvider: "",
  leadSource: "",
  campaignName: "",
  formFields: {
    name: true,
    email: true,
    company: false,
    phone: false,
    title: false,
  },
  formTitle: "",
  formDescription: "",
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

// Widget management methods
const addWidget = (type: string) => {
  const widgetConfig = availableWidgets.find((w) => w.type === type);
  if (widgetConfig && !isWidgetActive(type)) {
    const newWidget: Widget = {
      id: `widget-${++widgetIdCounter}`,
      type: widgetConfig.type,
      title: widgetConfig.title,
      icon: widgetConfig.icon,
    };
    activeWidgets.value.push(newWidget);
    showAddWidgetDropdown.value = false;
  }
};

const removeWidget = (widgetId: string) => {
  const widget = activeWidgets.value.find((w) => w.id === widgetId);
  if (widget) {
    confirmationWidget.value = widget;
    showConfirmation.value = true;
  }
};

const confirmRemoveWidget = () => {
  if (confirmationWidget.value) {
    activeWidgets.value = activeWidgets.value.filter(
      (w) => w.id !== confirmationWidget.value!.id
    );
    showConfirmation.value = false;
    confirmationWidget.value = null;
  }
};

const isWidgetActive = (type: string) => {
  return activeWidgets.value.some((w) => w.type === type);
};

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".dropdown-container")) {
    showAddWidgetDropdown.value = false;
  }
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
        // Initialize new fields
        accessControl: "public",
        password: "",
        allowedDomains: "",
        crmProvider: "",
        leadSource: "",
        campaignName: "",
        formFields: {
          name: true,
          email: true,
          company: false,
          phone: false,
          title: false,
        },
        formTitle: "",
        formDescription: "",
      };
    }
  },
  { immediate: true }
);

// Lifecycle hooks
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
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

/* Widget System Styles */
.widget-container {
  @apply flex-1 overflow-y-auto p-3 space-y-3;
}

.widget {
  @apply bg-white rounded-lg border border-gray-200 shadow-sm;
}

.widget-header {
  @apply flex items-center justify-between p-3 border-b border-gray-100;
}

.widget-title {
  @apply flex items-center gap-2 text-sm font-medium text-gray-700;
}

.widget-title i {
  @apply text-gray-500;
}

.remove-widget-btn {
  @apply p-1 text-gray-400 hover:text-red-600 transition-colors rounded;
}

.widget-content {
  @apply p-3 space-y-3;
}

.add-widget-section {
  @apply flex justify-center py-4;
}

.dropdown-container {
  @apply relative;
}

.add-widget-btn {
  @apply px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2;
}

.dropdown-arrow {
  @apply text-xs transition-transform;
}

/* Widget Dropdown */
.widget-dropdown {
  @apply absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10;
}

.dropdown-options {
  @apply p-2 space-y-1;
}

.dropdown-option {
  @apply w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white flex items-center gap-3;
}

.dropdown-option:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.option-icon {
  @apply w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0;
}

.option-icon i {
  @apply text-blue-600 text-sm;
}

.option-content {
  @apply flex-1 min-w-0;
}

.option-content h4 {
  @apply text-sm font-medium text-gray-900 mb-1;
}

.option-content p {
  @apply text-xs text-gray-600;
}

.option-status {
  @apply text-green-600 flex-shrink-0;
}

/* Confirmation Dialog */
.confirmation-dialog {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.dialog-overlay {
  @apply absolute inset-0;
}

.dialog-content {
  @apply bg-white rounded-lg p-6 max-w-sm w-full mx-4;
}

.dialog-header {
  @apply text-center mb-4;
}

.dialog-icon {
  @apply w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3;
}

.dialog-icon i {
  @apply text-yellow-600 text-xl;
}

.dialog-header h3 {
  @apply text-lg font-semibold text-gray-900;
}

.dialog-body {
  @apply mb-6;
}

.dialog-body p {
  @apply text-sm text-gray-600 mb-2;
}

.dialog-warning {
  @apply text-xs text-red-600 font-medium;
}

.dialog-actions {
  @apply flex gap-3;
}

.cancel-btn {
  @apply flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors;
}

.confirm-btn {
  @apply flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors;
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

.form-select {
  @apply w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
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

/* Widget-specific styles */
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

/* CRM Integration styles */
.crm-config {
  @apply space-y-3 mt-3 p-3 bg-gray-50 rounded;
}

/* Conversion Form styles */
.form-fields {
  @apply space-y-2;
}

.checkbox-label {
  @apply flex items-center gap-2 text-sm text-gray-700 cursor-pointer;
}

.checkbox-label input {
  @apply rounded border-gray-300 text-blue-600 focus:ring-blue-500;
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

/* Quick Preview Panel */
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
