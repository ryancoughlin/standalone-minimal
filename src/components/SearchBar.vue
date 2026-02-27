<template>
  <div class="px-3 py-2 border-b border-default overflow-x-hidden">
    <div class="flex items-center gap-2.5 min-w-0">
      <!-- Sidebar Toggle Button -->
      <button
        @click="$emit('toggle-sidebar')"
        class="flex-shrink-0 px-2 py-2 text-default hover:text-emphasis hover:bg-hover rounded transition-colors"
        :class="{ 'text-blue-600': showNavigationSidebar }"
        :title="
          showNavigationSidebar
            ? 'Close navigation sidebar'
            : 'Open navigation sidebar'
        "
      >
        <i class="fas fa-bars text-sm"></i>
      </button>

      <div class="flex-1 relative flex items-center min-w-0">
        <i
          class="fas fa-search absolute left-2.5 icon-muted z-10 text-sm"
        ></i>
        <input
          type="text"
          placeholder="Search Demos"
          class="w-full pl-8 pr-8 py-2 border border-default rounded-md text-sm bg-reprise-off-white transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          :value="searchQuery"
          @input="
            $emit(
              'update:searchQuery',
              ($event.target as HTMLInputElement).value
            )
          "
        />
        <button
          class="absolute right-2.5 w-4 h-4 flex items-center justify-center border-none bg-transparent icon-muted cursor-pointer hover:text-default transition-colors"
        >
          <i class="fas fa-filter text-xs"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  searchQuery: string;
  showNavigationSidebar: boolean;
}

interface Emits {
  (e: "update:searchQuery", value: string): void;
  (e: "toggle-sidebar"): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>
