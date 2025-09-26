<template>
  <Transition name="content-slide">
    <div v-if="isVisible" class="ai-experience-content">
      <!-- AI Prompt Section -->
      <div class="prompt-section">
        <div class="ai-branding">
          <div class="ai-icon">
            <i class="fas fa-sparkles text-white text-lg"></i>
          </div>
          <h1 class="ai-title">AI Assistant</h1>
        </div>

        <p class="prompt-text">
          logo-section What would you like me to help you with today?
        </p>

        <!-- Prompt Starter Chips -->
        <div class="prompt-chips">
          <button
            class="prompt-chip"
            @click="handlePromptChip('translate-demo')"
          >
            Translate Demo
          </button>

          <button
            class="prompt-chip"
            @click="handlePromptChip('guide-creator')"
          >
            Create Guide
          </button>

          <button class="prompt-chip" @click="handlePromptChip('find-demo')">
            Find Demo
          </button>

          <button
            class="prompt-chip"
            @click="handlePromptChip('customize-demo')"
          >
            Customize Demo
          </button>
        </div>

        <!-- Input Section -->
        <div class="input-section">
          <div class="input-container">
            <input
              v-model="userInput"
              type="text"
              placeholder="Ask me anything..."
              class="prompt-input"
              @keyup.enter="handleSubmit"
              ref="inputRef"
            />
            <button
              class="submit-button"
              @click="handleSubmit"
              :disabled="!userInput.trim()"
            >
              <i class="fas fa-paper-plane-top"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Close Button -->
      <button
        class="close-button"
        @click="handleClose"
        title="Close AI Experience"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from "vue";

interface Props {
  isVisible: boolean;
}

interface Emits {
  (e: "close"): void;
  (e: "action", action: string): void;
  (e: "submit", prompt: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const userInput = ref("");
const inputRef = ref<HTMLInputElement>();

// Focus input when overlay becomes visible
watch(
  () => props.isVisible,
  async (isVisible) => {
    if (isVisible) {
      await nextTick();
      inputRef.value?.focus();
    }
  }
);

const handlePromptChip = (action: string) => {
  // Set the input with the chip text and focus
  const chipTexts = {
    "translate-demo": "Translate this demo to ",
    "guide-creator": "Create a guide for ",
    "find-demo": "Find demos related to ",
    "customize-demo": "Customize this demo for ",
  };

  userInput.value = chipTexts[action as keyof typeof chipTexts] || "";
  nextTick(() => {
    inputRef.value?.focus();
    inputRef.value?.setSelectionRange(
      userInput.value.length,
      userInput.value.length
    );
  });
};

const handleAction = (action: string) => {
  emit("action", action);
};

const handleSubmit = () => {
  if (userInput.value.trim()) {
    emit("submit", userInput.value.trim());
    userInput.value = "";
  }
};

const handleClose = () => {
  emit("close");
};
</script>

<style scoped>
.ai-experience-content {
  @apply flex flex-col h-full bg-white;
}

.logo-section {
  @apply flex justify-center py-6 border-b border-gray-200;
}

.logo-image {
  @apply h-8 object-contain;
}

.prompt-section {
  @apply flex-1 flex flex-col justify-center items-center px-8 py-8 space-y-6;
}

.ai-branding {
  @apply flex items-center gap-3;
}

.ai-icon {
  @apply flex items-center justify-center w-8 h-8 rounded-lg;
  background: linear-gradient(91.35deg, #7f24ec 0%, #0077d5 95.43%);
  animation: sparkle 2s ease-in-out infinite;
}

.ai-title {
  @apply text-2xl font-semibold text-gray-800;
}

.prompt-text {
  @apply text-base text-gray-600 text-center;
}

.prompt-chips {
  @apply flex flex-wrap gap-2 justify-center max-w-md;
}

.prompt-chip {
  @apply px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-full border border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 cursor-pointer;
}

.prompt-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-section {
  @apply w-full max-w-md;
}

.input-container {
  @apply flex items-center gap-2;
}

.prompt-input {
  @apply flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm;
}

.submit-button {
  @apply px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200;
}

.close-button {
  @apply absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200;
}

/* Content transition animations */
.content-slide-enter-active,
.content-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.content-slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.content-slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

@keyframes sparkle {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.1) rotate(180deg);
  }
}
</style>
