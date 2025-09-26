<template>
  <div class="global-navigation">
    <div
      class="flex items-center justify-between px-4 py-3 border-b border-gray-200"
    >
      <div class="flex items-center gap-2">
        <img
          src="/src/reprise-logo.png"
          alt="Reprise Logo"
          class="h-6 object-contain"
        />
      </div>

      <!-- Center Actions -->
      <div class="flex items-center gap-4">
        <!-- AI Assistant -->
        <AIAssistant @assist-click="$emit('assist-click')" />
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-2">
        <button
          class="w-7 h-7 flex items-center justify-center border-none bg-transparent text-gray-500 cursor-pointer rounded transition-all duration-200 hover:bg-gray-100 hover:text-gray-700"
          @click="$emit('reposition')"
          :title="isOnRight ? 'Move to Left' : 'Move to Right'"
        >
          <i
            class="fas fa-chevron-right text-sm"
            :class="{ 'rotate-180': isOnRight }"
          ></i>
        </button>
        <button
          class="w-7 h-7 flex items-center justify-center border-none bg-transparent text-gray-500 cursor-pointer rounded transition-all duration-200 hover:bg-gray-100 hover:text-gray-700"
          @click="$emit('close')"
          title="Close"
        >
          <i class="fas fa-times text-sm"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AIAssistant from "./AIAssistant.vue";

interface Props {
  isOnRight: boolean;
}

interface Emits {
  (e: "reposition"): void;
  (e: "back"): void;
  (e: "close"): void;
  (e: "undo"): void;
  (e: "redo"): void;
  (e: "assist-click"): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<style scoped>
.global-navigation {
  @apply sticky top-0 bg-white z-10;
}
</style>
