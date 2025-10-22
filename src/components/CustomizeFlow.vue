<template>
  <!-- Modal Overlay - Teleported to body -->
  <Teleport to="body">
    <div class="modal-overlay" @click="$emit('close')">
      <div class="modal-container" @click.stop>
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="header-content">
            <h2 class="heading-primary">Customize Demo</h2>
            <button @click="$emit('close')" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="main-content-area">
          <!-- Sidebar Navigation -->
          <div class="sidebar">
            <nav class="step-navigation">
              <button
                v-for="(step, index) in steps"
                :key="step.id"
                @click="goToStep(index + 1)"
                :class="[
                  'step-button',
                  {
                    active: currentStep === index + 1,
                    completed: currentStep > index + 1,
                    disabled: currentStep < index + 1,
                  },
                ]"
              >
                <div class="step-icon">
                  <i v-if="currentStep > index + 1" class="fas fa-check"></i>
                  <i v-else :class="step.icon"></i>
                </div>
                <span class="step-title">{{ step.title }}</span>
              </button>
            </nav>
          </div>

          <!-- Content Area -->
          <div class="content-area">
            <!-- Step Content -->
            <div class="step-content-container">
              <!-- General Step -->
              <BasicInfoStep
                v-if="currentStep === 1"
                :form-data="formData"
                @update="updateFormData"
              />

              <!-- Variables Step -->
              <CustomizationStep
                v-if="currentStep === 2"
                :form-data="formData"
                @update="updateFormData"
              />

              <!-- Welcome Page Step -->
              <CustomizationStep
                v-if="currentStep === 3"
                :form-data="formData"
                @update="updateFormData"
              />

              <!-- Lead Capture Step -->
              <IntegrationStep
                v-if="currentStep === 4"
                :form-data="formData"
                @update="updateFormData"
              />

              <!-- Access Control Step -->
              <AccessControlStep
                v-if="currentStep === 5"
                :form-data="formData"
                @update="updateFormData"
              />

              <!-- Notifications Step -->
              <ReviewStep
                v-if="currentStep === 6"
                :demo="demo"
                :form-data="formData"
                @generate-link="handleGenerateLink"
              />
            </div>
          </div>
        </div>

        <!-- Navigation Footer -->
        <div class="navigation-footer">
          <div class="footer-actions">
            <button
              v-if="currentStep < totalSteps"
              @click="goToStep(currentStep + 1)"
              :disabled="!canProceed"
              class="nav-button primary"
            >
              Next
              <i class="fas fa-arrow-right"></i>
            </button>
            <button
              v-else
              @click="handleGenerateLink"
              :disabled="!isValid"
              class="nav-button primary"
            >
              <i class="fas fa-link"></i>
              Create link
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import BasicInfoStep from "./customize-steps/BasicInfoStep.vue";
import CustomizationStep from "./customize-steps/CustomizationStep.vue";
import AccessControlStep from "./customize-steps/AccessControlStep.vue";
import IntegrationStep from "./customize-steps/IntegrationStep.vue";
import ReviewStep from "./customize-steps/ReviewStep.vue";

interface Props {
  demo: any;
}

interface Emits {
  (e: "close"): void;
  (e: "generate-link", demo: any, customization: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Step management
const currentStep = ref(1);
const totalSteps = 6;

const steps = [
  {
    id: "general",
    title: "General",
    icon: "fas fa-globe",
  },
  {
    id: "variables",
    title: "Variables",
    icon: "fas fa-code",
  },
  {
    id: "welcome-page",
    title: "Welcome Page",
    icon: "fas fa-hand-wave",
  },
  {
    id: "lead-capture",
    title: "Lead Capture",
    icon: "fas fa-table",
  },
  {
    id: "access-control",
    title: "Access Control",
    icon: "fas fa-lock",
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: "fas fa-bell",
  },
];

// Form data
const formData = ref({
  // Basic Info
  name: "",
  description: "",

  // Customization
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
  ],

  // Access Control
  accessControl: "public",
  password: "",
  allowedDomains: "",

  // Integration
  crmProvider: "",
  leadSource: "",
  campaignName: "",
  enableAnalytics: true,
});

// Computed
const isValid = computed(() => {
  return formData.value.name.trim() !== "";
});

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return formData.value.name.trim() !== "";
    case 2:
      return true; // Customization is optional
    case 3:
      return true; // Access control is optional
    case 4:
      return true; // Integration is optional
    case 5:
      return isValid.value;
    default:
      return false;
  }
});

// Methods
const goToStep = (step: number) => {
  if (step >= 1 && step <= totalSteps) {
    currentStep.value = step;
  }
};

const updateFormData = (updates: any) => {
  formData.value = { ...formData.value, ...updates };
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

const handleGenerateLink = () => {
  if (isValid.value) {
    emit("generate-link", props.demo, formData.value);
  }
};

// Initialize
watch(
  () => props.demo,
  () => {
    if (props.demo) {
      formData.value = {
        name: `${props.demo.title} - Custom Demo`,
        description: `Personalized demo for ${props.demo.title}`,
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
        ],
        accessControl: "public",
        password: "",
        allowedDomains: "",
        crmProvider: "",
        leadSource: "",
        campaignName: "",
        enableAnalytics: true,
      };
    }
  },
  { immediate: true }
);
</script>

<style scoped>
/* Primary Typography Classes */
.heading-primary {
  @apply text-xl font-semibold text-gray-900;
}

.heading-secondary {
  @apply text-base font-medium text-gray-900;
}

/* Modal Overlay */
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10001];
}

.modal-container {
  @apply bg-reprise-light-tan rounded-xl shadow-xl w-[750px] h-[540px] overflow-hidden flex flex-col;
}

/* Modal Header */
.modal-header {
  @apply bg-white px-5 py-3 border-b border-gray-200;
}

.header-content {
  @apply flex items-center justify-between;
}

.header-content h2 {
  @apply text-xl font-semibold text-gray-900;
}

.close-btn {
  @apply w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors rounded-md;
}

.close-btn i {
  @apply text-sm;
}

/* Main Content Area */
.main-content-area {
  @apply flex flex-1 min-h-0 overflow-hidden;
}

/* Sidebar */
.sidebar {
  @apply w-[220px] bg-white border-r border-gray-200 flex flex-col;
}

.step-navigation {
  @apply p-2 space-y-0;
}

.step-button {
  @apply w-full flex items-center gap-2 p-2 text-left rounded-lg transition-all duration-200 mb-0;
}

.step-button.active {
  @apply bg-reprise-sky text-reprise-blue;
}

.step-button.completed {
  @apply bg-green-50 text-green-600;
}

.step-button.disabled {
  @apply text-gray-400 cursor-not-allowed;
}

.step-button:not(.disabled):not(.active):not(.completed) {
  @apply hover:bg-gray-50 text-gray-700;
}

.step-icon {
  @apply w-3.5 h-3.5 flex items-center justify-center flex-shrink-0;
}

.step-icon i {
  @apply text-xs;
}

.step-title {
  @apply text-xs font-medium;
}

/* Content Area */
.content-area {
  @apply flex-1 flex flex-col min-h-0 overflow-hidden;
}

.step-content-container {
  @apply flex-1 p-5 overflow-y-auto bg-reprise-light-tan;
}

/* Navigation Footer */
.navigation-footer {
  @apply bg-white px-5 py-3 border-t border-gray-200;
}

.footer-actions {
  @apply flex justify-end;
}

.nav-button {
  @apply flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors;
}

.nav-button.primary {
  @apply text-white bg-reprise-blue hover:bg-reprise-deep-blue disabled:bg-gray-300 disabled:cursor-not-allowed;
}

.nav-button.secondary {
  @apply text-gray-700 bg-white border border-gray-300 hover:bg-gray-50;
}
</style>
