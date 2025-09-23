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
      <div class="flex items-center gap-2">
        <button
          class="w-7 h-7 flex items-center justify-center border-none bg-transparent text-gray-500 cursor-pointer rounded transition-all duration-200 hover:bg-gray-100 hover:text-gray-700"
          @click="$emit('back')"
          title="Back"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <button
          class="w-7 h-7 flex items-center justify-center border-none bg-transparent text-gray-500 cursor-pointer rounded transition-all duration-200 hover:bg-gray-100 hover:text-gray-700"
          @click="$emit('close')"
          title="Close"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: "back"): void;
  (e: "close"): void;
}

defineEmits<Emits>();
</script>

<style scoped>
.global-navigation {
  @apply sticky top-0 bg-white z-10;
}
</style>
