<template>
  <div class="general-step">
    <div class="step-header">
      <h2 class="heading-secondary">Define Your Link</h2>
      <p class="step-description">
        Name your link and set basic configurations for sharing
      </p>
    </div>

    <div class="form-content">
      <div class="form-section">
        <div class="form-group">
          <label class="form-label">Name</label>
          <input
            :value="formData.name"
            @input="
              updateField('name', ($event.target as HTMLInputElement).value)
            "
            placeholder="Goldman Sachs - Custom MFA Flow"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea
            :value="formData.description"
            @input="
              updateField(
                'description',
                ($event.target as HTMLTextAreaElement).value
              )
            "
            placeholder="Investment banking security requirements"
            rows="3"
            class="form-textarea"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Expiration Date</label>
          <div class="date-input-container">
            <input
              :value="formData.expirationDate"
              @input="
                updateField(
                  'expirationDate',
                  ($event.target as HTMLInputElement).value
                )
              "
              type="date"
              class="form-input date-input"
            />
            <i class="fas fa-calendar date-icon"></i>
          </div>
        </div>

        <div class="toggle-group">
          <label class="toggle-switch">
            <input
              :checked="formData.enableGuides"
              @change="
                updateField(
                  'enableGuides',
                  ($event.target as HTMLInputElement).checked
                )
              "
              type="checkbox"
              class="peer"
            />
            <span class="slider"></span>
          </label>
          <span class="toggle-label">Enable Guides</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  formData: any;
  demo?: any;
}

interface Emits {
  (e: "update", updates: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const updateField = (field: string, value: string) => {
  emit("update", { [field]: value });
};

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
</script>

<style scoped>
/* Primary Typography Classes */
.heading-primary {
  @apply text-xl font-semibold text-gray-900;
}

.heading-secondary {
  @apply text-base font-medium text-gray-900;
}

.general-step {
  @apply max-w-2xl;
}

.step-header {
  @apply mb-4;
}

.step-header h2 {
  @apply mb-1.5;
}

.step-description {
  @apply text-xs text-gray-600;
}

.form-content {
  @apply space-y-4;
}

.form-section {
  @apply space-y-3;
}

.form-group {
  @apply space-y-1.5;
}

.form-label {
  @apply block text-xs font-medium text-gray-700;
}

.form-input {
  @apply w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.form-textarea {
  @apply w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none;
}

.date-input-container {
  @apply relative;
}

.date-input {
  @apply pr-8;
}

.date-icon {
  @apply absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs;
}

.toggle-group {
  @apply flex items-center gap-3;
}

.toggle-switch {
  @apply relative inline-flex items-center cursor-pointer;
}

.toggle-switch input {
  @apply sr-only;
}

.slider {
  width: 2rem;
  height: 1.125rem;
  background-color: #4c49f3;
  border-radius: 0.375rem;
  position: relative;
  transition: all 0.3s ease;
}

.slider::after {
  content: "";
  position: absolute;
  top: 0.0625rem;
  right: 0.0625rem;
  background-color: white;
  border-radius: 0.25rem;
  height: 1rem;
  width: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.25);
}

.toggle-switch input:not(:checked) + .slider {
  background-color: #e5e7eb;
}

.toggle-switch input:not(:checked) + .slider::after {
  transform: translateX(-1rem);
}

.toggle-label {
  @apply text-xs font-medium text-gray-700;
}
</style>
