<template>
  <div class="ai-assistant">
    <!-- Assist Button -->
    <button class="assist-button" @click="handleAssistClick">
      <div class="button-content">
        <div class="sparkles-icon">
          <i class="fas fa-sparkles text-white text-sm"></i>
        </div>
        <span class="button-text">Assist</span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: "assist-click"): void;
}

const emit = defineEmits<Emits>();

const handleAssistClick = () => {
  emit("assist-click");
};
</script>

<style scoped>
.ai-assistant {
  @apply relative;
}

.assist-button {
  @apply flex items-center gap-2 h-10 px-4 py-2 rounded-md border-2 border-blue-600 bg-white hover:bg-blue-50 transition-all duration-200;
  position: relative;
  overflow: hidden;
}

.assist-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.assist-button:hover::before {
  left: 100%;
}

.button-content {
  @apply flex items-center gap-2;
}

.sparkles-icon {
  @apply flex items-center justify-center w-3.5 h-3.5 rounded-sm;
  background: linear-gradient(91.35deg, #7f24ec 0%, #0077d5 95.43%);
  animation: sparkle 2s ease-in-out infinite;
}

.button-text {
  @apply text-sm font-medium text-gray-800;
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
