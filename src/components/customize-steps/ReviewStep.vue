<template>
  <div class="review-step">
    <div class="step-header">
      <h2 class="heading-secondary">Send Notifications</h2>
      <p class="step-description">
        Review your customization settings and create your demo link.
      </p>
    </div>

    <div class="form-content">
      <!-- Demo Preview -->
      <div class="form-section">
        <div class="section-header">
          <h3>Demo Preview</h3>
        </div>

        <div class="demo-preview-card">
          <div class="preview-header">
            <div
              class="w-20 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0"
            >
              <img
                v-if="demo?.screenshot_small"
                :src="getScreenshotUrl(demo.screenshot_small)"
                :alt="demo.title"
                class="w-full h-full object-cover"
              />
              <div v-else class="preview-placeholder">
                <i class="fas fa-play"></i>
              </div>
            </div>
            <div class="demo-info">
              <h4>{{ formData.name }}</h4>
              <p>{{ formData.description }}</p>
              <div class="demo-meta">
                <span class="demo-type">{{ getDemoType(demo) }}</span>
                <span class="customization-badge">Customized</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Customization Summary -->
      <div class="form-section">
        <div class="section-header">
          <h3>Customization Summary</h3>
        </div>

        <div class="summary-grid">
          <!-- Welcome Page -->
          <div class="summary-card">
            <div class="summary-header">
              <i class="fas fa-hand-wave"></i>
              <h4>Welcome Page</h4>
              <span
                :class="[
                  'status-badge',
                  formData.showWelcomePage ? 'enabled' : 'disabled',
                ]"
              >
                {{ formData.showWelcomePage ? "Enabled" : "Disabled" }}
              </span>
            </div>
            <div v-if="formData.showWelcomePage" class="summary-content">
              <p>
                <strong>Title:</strong> {{ formData.welcomeTitle || "Not set" }}
              </p>
              <p>
                <strong>Message:</strong>
                {{ formData.welcomeMessage || "Not set" }}
              </p>
            </div>
          </div>

          <!-- Variables -->
          <div class="summary-card">
            <div class="summary-header">
              <i class="fas fa-code"></i>
              <h4>Variables</h4>
              <span class="status-badge enabled"
                >{{ activeVariablesCount }} customized</span
              >
            </div>
            <div class="summary-content">
              <div v-if="activeVariablesCount > 0" class="variables-list">
                <div
                  v-for="variable in activeVariables"
                  :key="variable.name"
                  class="variable-item"
                >
                  <span class="var-name">{{ variable.name }}:</span>
                  <span class="var-value">{{ variable.newValue }}</span>
                </div>
              </div>
              <p v-else class="no-customizations">No variables customized</p>
            </div>
          </div>

          <!-- Access Control -->
          <div class="summary-card">
            <div class="summary-header">
              <i class="fas fa-shield-alt"></i>
              <h4>Access Control</h4>
              <span class="status-badge enabled">{{
                getAccessLevelLabel()
              }}</span>
            </div>
            <div class="summary-content">
              <p><strong>Level:</strong> {{ getAccessLevelLabel() }}</p>
              <div v-if="formData.accessControl === 'password'">
                <p>
                  <strong>Password:</strong>
                  {{ formData.password ? "Set" : "Not set" }}
                </p>
              </div>
              <div v-if="formData.accessControl === 'domain'">
                <p>
                  <strong>Domains:</strong>
                  {{ formData.allowedDomains || "Not specified" }}
                </p>
              </div>
            </div>
          </div>

          <!-- Integration -->
          <div class="summary-card">
            <div class="summary-header">
              <i class="fas fa-plug"></i>
              <h4>Integration</h4>
              <span
                :class="[
                  'status-badge',
                  formData.crmProvider ? 'enabled' : 'disabled',
                ]"
              >
                {{ formData.crmProvider ? "Connected" : "None" }}
              </span>
            </div>
            <div class="summary-content">
              <p><strong>CRM:</strong> {{ getCrmTitle() }}</p>
              <div v-if="formData.crmProvider">
                <p>
                  <strong>Lead Source:</strong>
                  {{ formData.leadSource || "Not set" }}
                </p>
                <p>
                  <strong>Campaign:</strong>
                  {{ formData.campaignName || "Not set" }}
                </p>
              </div>
              <p>
                <strong>Analytics:</strong>
                {{ formData.enableAnalytics ? "Enabled" : "Disabled" }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Section -->
      <div class="action-section">
        <div class="action-header">
          <h3>Ready to Create</h3>
          <p>Your customized demo is ready to be shared</p>
        </div>

        <div class="action-buttons">
          <button @click="previewDemo" class="action-btn secondary">
            <i class="fas fa-eye"></i>
            Preview Demo
          </button>
          <button @click="handleGenerateLink" class="action-btn primary">
            <i class="fas fa-link"></i>
            Create Share Link
          </button>
        </div>

        <div class="action-info">
          <div class="info-item">
            <i class="fas fa-info-circle"></i>
            <span>Your demo link will be ready to share immediately</span>
          </div>
          <div class="info-item">
            <i class="fas fa-shield-alt"></i>
            <span>Access control settings will be applied automatically</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  demo: any;
  formData: any;
}

interface Emits {
  (e: "generate-link"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const activeVariables = computed(() => {
  return props.formData.variables.filter((v: any) => v.newValue.trim() !== "");
});

const activeVariablesCount = computed(() => {
  return activeVariables.value.length;
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

const getAccessLevelLabel = () => {
  const levels = {
    public: "Public",
    email: "Email Required",
    password: "Password Protected",
    domain: "Domain Restricted",
  };
  return (
    levels[props.formData.accessControl as keyof typeof levels] || "Unknown"
  );
};

const getCrmTitle = () => {
  const crms = {
    hubspot: "HubSpot",
    salesforce: "Salesforce",
    pipedrive: "Pipedrive",
  };
  return crms[props.formData.crmProvider as keyof typeof crms] || "None";
};

const previewDemo = () => {
  console.log("Previewing demo with customization:", props.formData);
  alert(`Previewing ${props.formData.name}`);
};

const handleGenerateLink = () => {
  emit("generate-link");
};
</script>

<style scoped>
.review-step {
  @apply max-w-4xl mx-auto;
}

.step-header {
  @apply mb-8;
}

.step-header h2 {
  @apply text-2xl font-semibold text-gray-900 mb-2;
}

.step-description {
  @apply text-gray-600;
}

.form-content {
  @apply space-y-8;
}

.form-section {
  @apply space-y-6;
}

.section-header h3 {
  @apply text-lg font-medium text-gray-900 mb-4;
}

/* Demo Preview Card */
.demo-preview-card {
  @apply bg-white border border-gray-200 rounded-lg p-6;
}

.preview-header {
  @apply flex items-center gap-4;
}

.preview-placeholder {
  @apply w-full h-full flex items-center justify-center text-gray-400;
}

.demo-info {
  @apply flex-1 min-w-0;
}

.demo-info h4 {
  @apply text-lg font-medium text-gray-900 mb-1;
}

.demo-info p {
  @apply text-sm text-gray-600 mb-2;
}

.demo-meta {
  @apply flex items-center gap-2;
}

.demo-type {
  @apply px-2 py-1 text-xs font-medium bg-reprise-sky text-reprise-blue rounded;
}

.customization-badge {
  @apply px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded;
}

/* Summary Grid */
.summary-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.summary-card {
  @apply bg-white border border-gray-200 rounded-lg p-4;
}

.summary-header {
  @apply flex items-center gap-3 mb-3;
}

.summary-header i {
  @apply text-gray-500;
}

.summary-header h4 {
  @apply text-sm font-medium text-gray-900 flex-1;
}

.status-badge {
  @apply px-2 py-1 text-xs font-medium rounded;
}

.status-badge.enabled {
  @apply bg-green-100 text-green-700;
}

.status-badge.disabled {
  @apply bg-gray-100 text-gray-600;
}

.summary-content {
  @apply space-y-2;
}

.summary-content p {
  @apply text-xs text-gray-600;
}

.variables-list {
  @apply space-y-1;
}

.variable-item {
  @apply flex items-center gap-2 text-xs;
}

.var-name {
  @apply font-medium text-gray-700;
}

.var-value {
  @apply text-gray-600 bg-gray-100 px-2 py-1 rounded;
}

.no-customizations {
  @apply text-xs text-gray-500 italic;
}

/* Action Section */
.action-section {
  @apply bg-gray-50 rounded-lg p-6 border border-gray-200;
}

.action-header {
  @apply text-center mb-6;
}

.action-header h3 {
  @apply text-lg font-medium text-gray-900 mb-2;
}

.action-header p {
  @apply text-sm text-gray-600;
}

.action-buttons {
  @apply flex gap-4 justify-center mb-6;
}

.action-btn {
  @apply flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition-colors;
}

.action-btn.secondary {
  @apply text-gray-700 bg-white border border-gray-300 hover:bg-gray-50;
}

.action-btn.primary {
  @apply text-white bg-reprise-blue hover:bg-reprise-deep-blue;
}

.action-info {
  @apply space-y-2;
}

.info-item {
  @apply flex items-center gap-2 text-xs text-gray-600;
}

.info-item i {
  @apply text-reprise-blue;
}
</style>
