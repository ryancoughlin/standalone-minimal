<template>
  <div class="integration-step">
    <div class="step-header">
      <h2 class="heading-secondary">Capture Leads</h2>
      <p class="step-description">
        Connect to your CRM and enable analytics to track demo performance.
      </p>
    </div>

    <div class="form-content">
      <!-- CRM Integration Section -->
      <div class="form-section">
        <div class="section-header">
          <h3>CRM Integration</h3>
          <p class="section-description">
            Automatically capture leads when users interact with your demo
          </p>
        </div>

        <div class="crm-options">
          <div
            v-for="option in crmOptions"
            :key="option.value"
            @click="updateField('crmProvider', option.value)"
            :class="[
              'crm-option',
              { selected: formData.crmProvider === option.value },
            ]"
          >
            <div class="option-icon">
              <img
                v-if="option.logo"
                :src="option.logo"
                :alt="option.title"
                class="crm-logo"
              />
              <i v-else :class="option.icon"></i>
            </div>
            <div class="option-content">
              <h4>{{ option.title }}</h4>
              <p>{{ option.description }}</p>
            </div>
            <div class="option-indicator">
              <div
                :class="[
                  'radio-button',
                  { checked: formData.crmProvider === option.value },
                ]"
              ></div>
            </div>
          </div>
        </div>

        <!-- CRM Configuration -->
        <div v-if="formData.crmProvider" class="crm-config">
          <div class="config-header">
            <h4>{{ getCrmTitle() }} Configuration</h4>
          </div>

          <div class="config-fields">
            <div class="form-group">
              <label class="form-label">Lead Source</label>
              <input
                :value="formData.leadSource"
                @input="
                  updateField(
                    'leadSource',
                    ($event.target as HTMLInputElement).value
                  )
                "
                placeholder="e.g., Demo Customization"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Campaign Name</label>
              <input
                :value="formData.campaignName"
                @input="
                  updateField(
                    'campaignName',
                    ($event.target as HTMLInputElement).value
                  )
                "
                placeholder="e.g., Q4 Demo Campaign"
                class="form-input"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Analytics Section -->
      <div class="form-section">
        <div class="section-header">
          <h3>Analytics & Tracking</h3>
          <p class="section-description">
            Monitor how users interact with your demo
          </p>
        </div>

        <div class="analytics-settings">
          <div class="setting-item">
            <div class="setting-content">
              <h4>Enable Analytics</h4>
              <p>Track page views, interactions, and completion rates</p>
            </div>
            <label class="toggle-switch">
              <input
                :checked="formData.enableAnalytics"
                @change="
                  updateField(
                    'enableAnalytics',
                    ($event.target as HTMLInputElement).checked
                  )
                "
                type="checkbox"
                class="peer"
              />
              <span class="slider"></span>
            </label>
          </div>

          <div v-if="formData.enableAnalytics" class="analytics-details">
            <div class="analytics-features">
              <div class="feature-item">
                <i class="fas fa-chart-line"></i>
                <span>Page view tracking</span>
              </div>
              <div class="feature-item">
                <i class="fas fa-mouse-pointer"></i>
                <span>Click tracking</span>
              </div>
              <div class="feature-item">
                <i class="fas fa-clock"></i>
                <span>Time spent analysis</span>
              </div>
              <div class="feature-item">
                <i class="fas fa-flag-checkered"></i>
                <span>Completion tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Integration Preview -->
      <div class="preview-section">
        <h3>Integration Preview</h3>
        <div class="integration-preview-card">
          <div class="preview-header">
            <div class="integration-icon">
              <i class="fas fa-plug"></i>
            </div>
            <div class="integration-info">
              <h4>Integration Status</h4>
              <p>Your demo will be connected to the following services</p>
            </div>
          </div>

          <div class="integration-details">
            <div class="detail-section">
              <h5>CRM Integration</h5>
              <div class="detail-item">
                <span class="detail-label">Provider:</span>
                <span class="detail-value">{{ getCrmTitle() || "None" }}</span>
              </div>
              <div v-if="formData.crmProvider" class="detail-item">
                <span class="detail-label">Lead Source:</span>
                <span class="detail-value">{{
                  formData.leadSource || "Not specified"
                }}</span>
              </div>
              <div v-if="formData.crmProvider" class="detail-item">
                <span class="detail-label">Campaign:</span>
                <span class="detail-value">{{
                  formData.campaignName || "Not specified"
                }}</span>
              </div>
            </div>

            <div class="detail-section">
              <h5>Analytics</h5>
              <div class="detail-item">
                <span class="detail-label">Status:</span>
                <span class="detail-value">{{
                  formData.enableAnalytics ? "Enabled" : "Disabled"
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  formData: any;
}

interface Emits {
  (e: "update", updates: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const crmOptions = [
  {
    value: "",
    title: "No Integration",
    description: "Don't connect to any CRM",
    icon: "fas fa-times",
  },
  {
    value: "hubspot",
    title: "HubSpot",
    description: "Sync leads directly to HubSpot",
    icon: "fas fa-hubspot",
  },
  {
    value: "salesforce",
    title: "Salesforce",
    description: "Create leads in Salesforce",
    icon: "fas fa-salesforce",
  },
  {
    value: "pipedrive",
    title: "Pipedrive",
    description: "Add contacts to Pipedrive",
    icon: "fas fa-pipedrive",
  },
];

const updateField = (field: string, value: any) => {
  emit("update", { [field]: value });
};

const getCrmTitle = () => {
  const option = crmOptions.find(
    (opt) => opt.value === props.formData.crmProvider
  );
  return option?.title || "None";
};
</script>

<style scoped>
/* Primary Typography Classes */
.heading-primary {
  @apply text-xl font-semibold text-gray-900;
}

.heading-secondary {
  @apply text-base font-medium text-gray-900;
}

.integration-step {
  @apply max-w-4xl mx-auto;
}

.step-header {
  @apply mb-8;
}

.step-header h2 {
  @apply mb-1.5;
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

.section-header {
  @apply mb-4;
}

.section-header h3 {
  @apply text-lg font-medium text-gray-900 mb-2;
}

.section-description {
  @apply text-sm text-gray-600;
}

/* CRM Options */
.crm-options {
  @apply space-y-3;
}

.crm-option {
  @apply flex items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:border-blue-300 hover:bg-blue-50;
}

.crm-option.selected {
  @apply border-blue-500 bg-blue-50;
}

.option-icon {
  @apply w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0;
}

.crm-option.selected .option-icon {
  @apply bg-blue-100;
}

.crm-logo {
  @apply w-8 h-8 object-contain;
}

.option-icon i {
  @apply text-gray-500 text-lg;
}

.crm-option.selected .option-icon i {
  @apply text-blue-600;
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

.option-indicator {
  @apply flex-shrink-0;
}

.radio-button {
  @apply w-5 h-5 border-2 border-gray-300 rounded-full transition-all duration-200;
}

.radio-button.checked {
  @apply border-blue-500 bg-blue-500;
}

.radio-button.checked::after {
  content: "";
  @apply block w-2 h-2 bg-white rounded-full mx-auto mt-0.5;
}

/* CRM Configuration */
.crm-config {
  @apply p-4 bg-gray-50 rounded-lg border border-gray-200;
}

.config-header h4 {
  @apply text-sm font-medium text-gray-900 mb-3;
}

.config-fields {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

/* Analytics Settings */
.analytics-settings {
  @apply space-y-4;
}

.setting-item {
  @apply flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg;
}

.setting-content h4 {
  @apply text-sm font-medium text-gray-900 mb-1;
}

.setting-content p {
  @apply text-xs text-gray-600;
}

/* Toggle Switch */
.toggle-switch {
  @apply relative inline-flex items-center cursor-pointer;
}

.toggle-switch input {
  @apply sr-only;
}

.slider {
  width: 2.5rem;
  height: 1.5rem;
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
  height: 1.25rem;
  width: 1.25rem;
  transition: all 0.3s ease;
}

.toggle-switch input:checked + .slider {
  background-color: #2563eb;
}

.toggle-switch input:checked + .slider::after {
  transform: translateX(1rem);
}

.analytics-details {
  @apply p-4 bg-blue-50 rounded-lg border border-blue-200;
}

.analytics-features {
  @apply grid grid-cols-2 gap-3;
}

.feature-item {
  @apply flex items-center gap-2 text-sm text-gray-700;
}

.feature-item i {
  @apply text-blue-600;
}

/* Preview Section */
.preview-section {
  @apply bg-gray-50 rounded-lg p-6 border border-gray-200;
}

.preview-section h3 {
  @apply text-lg font-medium text-gray-900 mb-4;
}

.integration-preview-card {
  @apply bg-white rounded-lg p-4 border border-gray-200;
}

.preview-header {
  @apply flex items-center gap-4 mb-4;
}

.integration-icon {
  @apply w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0;
}

.integration-icon i {
  @apply text-blue-600 text-lg;
}

.integration-info {
  @apply flex-1 min-w-0;
}

.integration-info h4 {
  @apply font-medium text-gray-900 mb-1;
}

.integration-info p {
  @apply text-sm text-gray-600;
}

.integration-details {
  @apply space-y-4;
}

.detail-section h5 {
  @apply text-sm font-medium text-gray-900 mb-2;
}

.detail-item {
  @apply flex items-center justify-between text-sm;
}

.detail-label {
  @apply font-medium text-gray-700;
}

.detail-value {
  @apply text-gray-600;
}
</style>
