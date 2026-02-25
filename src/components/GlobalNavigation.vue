<template>
  <div class="sticky top-0 bg-default z-10">
    <div class="flex items-center gap-2 px-3 py-1.5 border-b border-default">
      <!-- Sidebar Toggle -->
      <button
        @click="$emit('toggle-sidebar')"
        class="w-7 h-7 flex-shrink-0 flex items-center justify-center border-none bg-transparent text-default cursor-pointer rounded transition-all duration-200 hover:bg-hover hover:text-emphasis"
        :class="{ 'text-reprise-blue': showNavigationSidebar }"
        :title="showNavigationSidebar ? 'Close navigation sidebar' : 'Open navigation sidebar'"
      >
        <i class="fas fa-bars text-sm"></i>
      </button>

      <!-- Logo -->
      <img
        src="/src/reprise-logo.png"
        alt="Reprise Logo"
        class="h-5 flex-shrink-0 object-contain"
      />

      <!-- Search Input -->
      <div class="flex-1 relative flex items-center min-w-0">
        <i class="fas fa-search absolute left-2 icon-muted z-10 text-xs"></i>
        <input
          type="text"
          placeholder="Search demos..."
          class="w-full pl-7 pr-3 py-1.5 border border-default rounded-md text-xs bg-reprise-off-white transition-all duration-200 focus:outline-none focus:border-reprise-blue focus:ring-1 focus:ring-reprise-blue"
          :value="searchQuery"
          @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <!-- Right Actions -->
      <button
        class="w-7 h-7 flex-shrink-0 flex items-center justify-center border-none bg-transparent text-muted cursor-pointer rounded transition-all duration-200 hover:bg-hover hover:text-default"
        @click="$emit('close')"
        title="Close"
      >
        <i class="fas fa-times text-xs"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  searchQuery: string;
  showNavigationSidebar: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "close"): void;
  (e: "toggle-sidebar"): void;
  (e: "update:searchQuery", value: string): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>
