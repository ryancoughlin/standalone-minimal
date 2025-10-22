<template>
  <div class="customization-step">
    <div class="step-header">
      <h2 class="heading-secondary">Customize Variables</h2>
      <p class="step-description">
        Add a welcome page and customize variables to personalize the demo
        experience.
      </p>
    </div>

    <div class="form-content">
      <!-- Welcome Page Section -->
      <div class="form-section">
        <div class="section-header">
          <h3>Welcome Page</h3>
          <label class="toggle-switch">
            <input
              :checked="formData.showWelcomePage"
              @change="
                updateField(
                  'showWelcomePage',
                  ($event.target as HTMLInputElement).checked
                )
              "
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
              :value="formData.welcomeTitle"
              @input="
                updateField(
                  'welcomeTitle',
                  ($event.target as HTMLInputElement).value
                )
              "
              placeholder="e.g., Introduction to MFA Securities"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Welcome Message</label>
            <textarea
              :value="formData.welcomeMessage"
              @input="
                updateField(
                  'welcomeMessage',
                  ($event.target as HTMLTextAreaElement).value
                )
              "
              placeholder="Enter your welcome message..."
              rows="4"
              class="form-textarea"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Variables Section -->
      <div class="form-section">
        <div class="section-header">
          <h3>Demo Variables</h3>
          <p class="section-description">
            Customize key data points that appear throughout the demo
          </p>
        </div>

        <div class="variables-grid">
          <div
            v-for="(variable, index) in formData.variables"
            :key="index"
            class="variable-card"
          >
            <div class="variable-header">
              <div class="variable-info">
                <span class="variable-name">{{ variable.name }}</span>
                <span class="variable-type">{{ variable.type }}</span>
              </div>
              <div class="variable-default">
                Default: {{ variable.defaultValue }}
              </div>
            </div>

            <div class="variable-input-section">
              <label class="variable-label">Override Value</label>
              <input
                :value="variable.newValue"
                @input="
                  updateVariable(
                    index,
                    'newValue',
                    ($event.target as HTMLInputElement).value
                  )
                "
                :placeholder="`Enter new ${variable.name.toLowerCase()}`"
                class="variable-input"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Section -->
      <div class="preview-section">
        <h3>Customization Preview</h3>
        <div class="preview-card">
          <div class="preview-header">
            <h4>{{ formData.name || "Demo Name" }}</h4>
            <span class="preview-badge">Customized</span>
          </div>

          <div v-if="formData.showWelcomePage" class="welcome-preview">
            <h5>{{ formData.welcomeTitle || "Welcome Title" }}</h5>
            <p>
              {{
                formData.welcomeMessage || "Welcome message will appear here"
              }}
            </p>
          </div>

          <div class="variables-preview">
            <h5>Custom Variables</h5>
            <div class="variables-list">
              <div
                v-for="variable in activeVariables"
                :key="variable.name"
                class="variable-preview-item"
              >
                <span class="var-name">{{ variable.name }}:</span>
                <span class="var-value">{{
                  variable.newValue || variable.defaultValue
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

const activeVariables = computed(() => {
  return props.formData.variables.filter((v: any) => v.newValue.trim() !== "");
});

const updateField = (field: string, value: any) => {
  emit("update", { [field]: value });
};

const updateVariable = (index: number, field: string, value: string) => {
  const updatedVariables = [...props.formData.variables];
  updatedVariables[index] = { ...updatedVariables[index], [field]: value };
  emit("update", { variables: updatedVariables });
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

.customization-step {
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
  @apply flex items-center justify-between mb-4;
}

.section-header h3 {
  @apply text-lg font-medium text-gray-900;
}

.section-description {
  @apply text-sm text-gray-600 mt-1;
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
  background-color: #3a8ddb;
}

.toggle-switch input:checked + .slider::after {
  transform: translateX(1rem);
}

.welcome-content {
  @apply space-y-4 p-4 bg-reprise-sky rounded-lg border border-reprise-blue;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-reprise-blue focus:border-transparent bg-white;
}

.form-textarea {
  @apply w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-reprise-blue focus:border-transparent resize-none bg-white;
}

/* Variables Grid */
.variables-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.variable-card {
  @apply bg-white border border-gray-200 rounded-lg p-4;
}

.variable-header {
  @apply flex items-center justify-between mb-3;
}

.variable-info {
  @apply flex items-center gap-2;
}

.variable-name {
  @apply text-sm font-medium text-gray-900;
}

.variable-type {
  @apply px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded;
}

.variable-default {
  @apply text-xs text-gray-500;
}

.variable-input-section {
  @apply space-y-2;
}

.variable-label {
  @apply block text-xs font-medium text-gray-600;
}

.variable-input {
  @apply w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-reprise-blue focus:border-transparent bg-white;
}

/* Preview Section */
.preview-section {
  @apply bg-gray-50 rounded-lg p-6 border border-gray-200;
}

.preview-section h3 {
  @apply text-lg font-medium text-gray-900 mb-4;
}

.preview-card {
  @apply bg-white rounded-lg p-4 border border-gray-200;
}

.preview-header {
  @apply flex items-center justify-between mb-4;
}

.preview-header h4 {
  @apply font-medium text-gray-900;
}

.preview-badge {
  @apply px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded;
}

.welcome-preview {
  @apply mb-4 p-3 bg-blue-50 rounded border border-blue-200;
}

.welcome-preview h5 {
  @apply font-medium text-gray-900 mb-2;
}

.welcome-preview p {
  @apply text-sm text-gray-600;
}

.variables-preview h5 {
  @apply font-medium text-gray-900 mb-2;
}

.variables-list {
  @apply space-y-2;
}

.variable-preview-item {
  @apply flex items-center gap-2 text-sm;
}

.var-name {
  @apply font-medium text-gray-700;
}

.var-value {
  @apply text-gray-600 bg-gray-100 px-2 py-1 rounded;
}
</style>
