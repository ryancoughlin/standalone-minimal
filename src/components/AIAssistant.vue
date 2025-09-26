<template>
  <div class="ai-assistant">
    <!-- Assist Button -->
    <button class="assist-button" @click="handleAssistClick">
      <div class="sparkles-icon">
        <i class="fas fa-sparkles"></i>
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
  @apply flex items-center justify-center w-6 h-6 rounded-md bg-white;
  position: relative;
  border: 1.5px solid transparent;
  background-clip: padding-box;
}

.assist-button::before {
  content: "";
  position: absolute;
  top: -1.5px;
  left: -1.5px;
  right: -1.5px;
  bottom: -1.5px;
  background: conic-gradient(
    from 90deg,
    #4c49f3 0%,
    #6e47d9 6.25%,
    #9144c0 12.5%,
    #b342a6 18.75%,
    #d53f8c 25%,
    #b342a6 31.125%,
    #9144c0 37.25%,
    #6e47d9 43.375%,
    #4c49f3 49.5%,
    #416eea 55.875%,
    #3692e0 62.25%,
    #2bb7d7 68.625%,
    #20dbcd 75%,
    #2bb7d7 81.25%,
    #3692e0 87.5%,
    #416eea 93.75%,
    #4c49f3 100%
  );
  border-radius: 6px;
  z-index: -1;
}

.sparkles-icon {
  @apply flex items-center justify-center w-3 h-3 rounded-sm;
  background: conic-gradient(
    from 90deg,
    #4c49f3 0%,
    #6e47d9 6.25%,
    #9144c0 12.5%,
    #b342a6 18.75%,
    #d53f8c 25%,
    #b342a6 31.125%,
    #9144c0 37.25%,
    #6e47d9 43.375%,
    #4c49f3 49.5%,
    #416eea 55.875%,
    #3692e0 62.25%,
    #2bb7d7 68.625%,
    #20dbcd 75%,
    #2bb7d7 81.25%,
    #3692e0 87.5%,
    #416eea 93.75%,
    #4c49f3 100%
  );
}

.sparkles-icon i {
  @apply text-white text-xs;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: conic-gradient(
    from 90deg,
    #4c49f3 0%,
    #6e47d9 6.25%,
    #9144c0 12.5%,
    #b342a6 18.75%,
    #d53f8c 25%,
    #b342a6 31.125%,
    #9144c0 37.25%,
    #6e47d9 43.375%,
    #4c49f3 49.5%,
    #416eea 55.875%,
    #3692e0 62.25%,
    #2bb7d7 68.625%,
    #20dbcd 75%,
    #2bb7d7 81.25%,
    #3692e0 87.5%,
    #416eea 93.75%,
    #4c49f3 100%
  );
}
</style>
