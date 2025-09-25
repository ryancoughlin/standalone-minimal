<template>
  <div class="customization-view">
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
          <h2 class="text-lg font-semibold text-gray-900">Customize Demo</h2>
          <p class="text-sm text-gray-500">{{ demo?.title }}</p>
        </div>
      </div>
    </div>

    <!-- Demo Preview -->
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

    <!-- Customization Form -->
    <div class="flex-1 overflow-y-auto p-4">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Prospect Information -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 mb-3">
            Prospect Information
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Prospect Name
              </label>
              <input
                v-model="formData.prospectName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter prospect name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                v-model="formData.companyName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter company name"
              />
            </div>
          </div>
        </div>

        <!-- Branding -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 mb-3">Branding</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Company Logo
              </label>
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-8 border-2 border-dashed border-gray-300 rounded flex items-center justify-center"
                >
                  <img
                    v-if="formData.companyLogo"
                    :src="formData.companyLogo"
                    alt="logo preview"
                    class="w-full h-full object-contain"
                  />
                  <i v-else class="fas fa-image text-gray-400"></i>
                </div>
                <input
                  ref="logoInput"
                  type="file"
                  accept="image/*"
                  @change="handleLogoUpload"
                  class="hidden"
                />
                <button
                  type="button"
                  @click="$refs.logoInput.click()"
                  class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  Upload
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>
        </div>

        <!-- Demo Configuration -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 mb-3">
            Demo Configuration
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <select
                v-model="formData.region"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select region</option>
                <option value="us-east">US East</option>
                <option value="us-west">US West</option>
                <option value="eu-west">EU West</option>
                <option value="asia-pacific">Asia Pacific</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Dataset
              </label>
              <select
                v-model="formData.dataset"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select dataset</option>
                <option value="sample-retail">Sample Retail Data</option>
                <option value="sample-finance">Sample Finance Data</option>
                <option value="sample-healthcare">
                  Sample Healthcare Data
                </option>
                <option value="custom">Custom Dataset</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Demo Type Specific Configuration -->
        <div v-if="demoType === 'Legacy'">
          <h3 class="text-sm font-medium text-gray-900 mb-3">
            Legacy Demo Settings
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Snapshot Count
              </label>
              <input
                v-model.number="formData.snapshotCount"
                type="number"
                min="1"
                max="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Number of screenshots to include"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Playback Speed
              </label>
              <select
                v-model="formData.playbackSpeed"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="normal">Normal Speed</option>
                <option value="slow">Slow (0.5x)</option>
                <option value="fast">Fast (1.5x)</option>
              </select>
            </div>
          </div>
        </div>

        <div v-else-if="demoType === 'Live'">
          <h3 class="text-sm font-medium text-gray-900 mb-3">
            Live Demo Settings
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Session Duration (minutes)
              </label>
              <input
                v-model.number="formData.sessionDuration"
                type="number"
                min="5"
                max="120"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="How long should the session last?"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Interactive Mode
              </label>
              <select
                v-model="formData.interactiveMode"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="guided">Guided (step-by-step)</option>
                <option value="freeform">Freeform (user-driven)</option>
                <option value="hybrid">Hybrid (guided + freeform)</option>
              </select>
            </div>
          </div>
        </div>

        <div v-else-if="demoType === 'Maestro'">
          <h3 class="text-sm font-medium text-gray-900 mb-3">
            Maestro Demo Settings
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Replay Quality
              </label>
              <select
                v-model="formData.replayQuality"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="standard">Standard (720p)</option>
                <option value="high">High (1080p)</option>
                <option value="ultra">Ultra (4K)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Auto-play
              </label>
              <div class="flex items-center">
                <input
                  v-model="formData.autoPlay"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">
                  Start demo automatically when link is opened
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Assist Section -->
        <div v-if="showAiAssist" class="bg-blue-50 p-4 rounded-lg">
          <div class="flex items-start gap-3">
            <i class="fas fa-magic text-blue-600 mt-0.5"></i>
            <div>
              <h4 class="text-sm font-medium text-blue-900">AI Suggestions</h4>
              <p class="text-xs text-blue-700 mt-1">
                We found potential matches in your CRM. Click to auto-fill:
              </p>
              <div class="mt-2 space-y-1">
                <button
                  v-for="suggestion in aiSuggestions"
                  :key="suggestion.id"
                  @click="applySuggestion(suggestion)"
                  class="block text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  {{ suggestion.company }} - {{ suggestion.contact }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Footer Actions -->
    <div class="p-4 border-t border-gray-200 bg-gray-50">
      <div class="flex gap-3">
        <button
          @click="previewDemo"
          class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Preview
        </button>
        <button
          @click="generateLink"
          :disabled="!isFormValid"
          class="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Generate Link
        </button>
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

// Form data
const formData = ref({
  prospectName: "",
  companyName: "",
  companyLogo: "",
  region: "",
  dataset: "",
  // Legacy-specific
  snapshotCount: 10,
  playbackSpeed: "normal",
  // Live-specific
  sessionDuration: 30,
  interactiveMode: "guided",
  // Maestro-specific
  replayQuality: "standard",
  autoPlay: false,
});

// AI suggestions (mock data)
const aiSuggestions = ref([
  { id: 1, company: "Acme Corp", contact: "John Smith" },
  { id: 2, company: "TechStart Inc", contact: "Sarah Johnson" },
  { id: 3, company: "Global Solutions", contact: "Mike Chen" },
]);

const showAiAssist = computed(() => {
  return props.demo?.ai_assist_enabled || false;
});

const demoType = computed(() => {
  if (props.demo?.replay_type === "LEGACY") return "Legacy";
  if (props.demo?.replay_folder_id) return "Maestro";
  if (props.demo?.folder_id && !props.demo?.replay_type) return "Live";
  return "Demo";
});

const isFormValid = computed(() => {
  return (
    formData.value.prospectName.trim() !== "" &&
    formData.value.companyName.trim() !== ""
  );
});

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

const handleLogoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.value.companyLogo = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const applySuggestion = (suggestion: any) => {
  formData.value.prospectName = suggestion.contact;
  formData.value.companyName = suggestion.company;
};

const previewDemo = () => {
  emit("preview", props.demo, formData.value);
};

const generateLink = () => {
  if (isFormValid.value) {
    emit("generate-link", props.demo, formData.value);
  }
};

// Reset form when component mounts
watch(
  () => props.demo,
  () => {
    if (props.demo) {
      formData.value = {
        prospectName: "",
        companyName: "",
        companyLogo: "",
        region: "",
        dataset: "",
        // Legacy-specific
        snapshotCount: 10,
        playbackSpeed: "normal",
        // Live-specific
        sessionDuration: 30,
        interactiveMode: "guided",
        // Maestro-specific
        replayQuality: "standard",
        autoPlay: false,
      };
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.customization-view {
  @apply flex flex-col h-full;
}
</style>
