<template>
  <div class="px-3 py-2 border-b border-gray-200 overflow-x-hidden">
    <div class="flex items-center gap-2.5 min-w-0">
      <div class="flex-1 relative flex items-center min-w-0">
        <i
          class="fas fa-search absolute left-2.5 text-gray-400 z-10 text-sm"
        ></i>
        <input
          type="text"
          placeholder="Search Demos"
          class="w-full pl-8 pr-8 py-2 border border-gray-200 rounded-md text-sm bg-reprise-off-white transition-all duration-200 focus:outline-none focus:border-reprise-blue focus:ring-1 focus:ring-reprise-blue"
          :value="searchQuery"
          @input="
            $emit(
              'update:searchQuery',
              ($event.target as HTMLInputElement).value
            )
          "
        />
        <button
          class="absolute right-2.5 w-4 h-4 flex items-center justify-center border-none bg-transparent text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
        >
          <i class="fas fa-filter text-xs"></i>
        </button>
      </div>
      <button
        class="px-3 py-2 bg-reprise-blue text-white border-none rounded-md text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-reprise-deep-blue"
        @click="$emit('new-demo')"
      >
        New Demo
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  searchQuery: string;
}

interface Emits {
  (e: "update:searchQuery", value: string): void;
  (e: "new-demo"): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>
