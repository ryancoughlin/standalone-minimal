<template>
  <div class="access-control-step">
    <div class="step-header">
      <h2 class="heading-secondary">Control Access</h2>
      <p class="step-description">
        Control who can access your demo and how they authenticate.
      </p>
    </div>

    <div class="form-content">
      <!-- Access Level Selection -->
      <div class="form-section">
        <div class="section-header">
          <h3>Access Level</h3>
          <p class="section-description">
            Choose how people will access your demo
          </p>
        </div>

        <div class="access-options">
          <div
            v-for="option in accessOptions"
            :key="option.value"
            @click="updateField('accessControl', option.value)"
            :class="[
              'access-option',
              { selected: formData.accessControl === option.value },
            ]"
          >
            <div class="option-icon">
              <i :class="option.icon"></i>
            </div>
            <div class="option-content">
              <h4>{{ option.title }}</h4>
              <p>{{ option.description }}</p>
            </div>
            <div class="option-indicator">
              <div
                :class="[
                  'radio-button',
                  { checked: formData.accessControl === option.value },
                ]"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Conditional Settings -->
      <div v-if="formData.accessControl === 'password'" class="form-section">
        <div class="section-header">
          <h3>Password Protection</h3>
        </div>

        <div class="password-settings">
          <div class="form-group">
            <label class="form-label">Password</label>
            <input
              :value="formData.password"
              @input="
                updateField(
                  'password',
                  ($event.target as HTMLInputElement).value
                )
              "
              type="password"
              placeholder="Enter a secure password"
              class="form-input"
            />
            <p class="form-hint">
              Users will need this password to access the demo
            </p>
          </div>
        </div>
      </div>

      <div v-if="formData.accessControl === 'domain'" class="form-section">
        <div class="section-header">
          <h3>Domain Restrictions</h3>
        </div>

        <div class="domain-settings">
          <div class="form-group">
            <label class="form-label">Allowed Domains</label>
            <input
              :value="formData.allowedDomains"
              @input="
                updateField(
                  'allowedDomains',
                  ($event.target as HTMLInputElement).value
                )
              "
              placeholder="e.g., company.com, partner.com"
              class="form-input"
            />
            <p class="form-hint">Separate multiple domains with commas</p>
          </div>
        </div>
      </div>

      <!-- Security Preview -->
      <div class="preview-section">
        <h3>Security Preview</h3>
        <div class="security-preview-card">
          <div class="preview-header">
            <div class="security-icon">
              <i :class="getSecurityIcon()"></i>
            </div>
            <div class="security-info">
              <h4>{{ getSecurityTitle() }}</h4>
              <p>{{ getSecurityDescription() }}</p>
            </div>
          </div>

          <div class="security-details">
            <div class="detail-item">
              <span class="detail-label">Access Level:</span>
              <span class="detail-value">{{ getAccessLevelLabel() }}</span>
            </div>
            <div
              v-if="formData.accessControl === 'password'"
              class="detail-item"
            >
              <span class="detail-label">Password:</span>
              <span class="detail-value">{{
                formData.password ? "••••••••" : "Not set"
              }}</span>
            </div>
            <div v-if="formData.accessControl === 'domain'" class="detail-item">
              <span class="detail-label">Domains:</span>
              <span class="detail-value">{{
                formData.allowedDomains || "Not specified"
              }}</span>
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

const accessOptions = [
  {
    value: "public",
    title: "Public Access",
    description: "Anyone with the link can view the demo",
    icon: "fas fa-globe",
  },
  {
    value: "email",
    title: "Email Required",
    description: "Users must provide their email address",
    icon: "fas fa-envelope",
  },
  {
    value: "password",
    title: "Password Protected",
    description: "Users must enter a password to access",
    icon: "fas fa-lock",
  },
  {
    value: "domain",
    title: "Domain Restricted",
    description: "Only users from specific domains can access",
    icon: "fas fa-building",
  },
];

const updateField = (field: string, value: any) => {
  emit("update", { [field]: value });
};

const getSecurityIcon = () => {
  const option = accessOptions.find(
    (opt) => opt.value === props.formData.accessControl
  );
  return option?.icon || "fas fa-shield-alt";
};

const getSecurityTitle = () => {
  const option = accessOptions.find(
    (opt) => opt.value === props.formData.accessControl
  );
  return option?.title || "Access Control";
};

const getSecurityDescription = () => {
  const option = accessOptions.find(
    (opt) => opt.value === props.formData.accessControl
  );
  return option?.description || "Access control settings";
};

const getAccessLevelLabel = () => {
  const option = accessOptions.find(
    (opt) => opt.value === props.formData.accessControl
  );
  return option?.title || "Unknown";
};
</script>

<style scoped>
.access-control-step {
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

.section-header {
  @apply mb-4;
}

.section-header h3 {
  @apply text-lg font-medium text-gray-900 mb-2;
}

.section-description {
  @apply text-sm text-gray-600;
}

/* Access Options */
.access-options {
  @apply space-y-3;
}

.access-option {
  @apply flex items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:border-blue-300 hover:bg-blue-50;
}

.access-option.selected {
  @apply border-blue-500 bg-blue-50;
}

.option-icon {
  @apply w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0;
}

.access-option.selected .option-icon {
  @apply bg-blue-100 text-blue-600;
}

.option-icon i {
  @apply text-gray-500 text-lg;
}

.access-option.selected .option-icon i {
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

/* Form Elements */
.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.form-hint {
  @apply text-xs text-gray-500;
}

.password-settings,
.domain-settings {
  @apply p-4 bg-gray-50 rounded-lg border border-gray-200;
}

/* Preview Section */
.preview-section {
  @apply bg-gray-50 rounded-lg p-6 border border-gray-200;
}

.preview-section h3 {
  @apply text-lg font-medium text-gray-900 mb-4;
}

.security-preview-card {
  @apply bg-white rounded-lg p-4 border border-gray-200;
}

.preview-header {
  @apply flex items-center gap-4 mb-4;
}

.security-icon {
  @apply w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0;
}

.security-icon i {
  @apply text-blue-600 text-lg;
}

.security-info {
  @apply flex-1 min-w-0;
}

.security-info h4 {
  @apply font-medium text-gray-900 mb-1;
}

.security-info p {
  @apply text-sm text-gray-600;
}

.security-details {
  @apply space-y-2;
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
