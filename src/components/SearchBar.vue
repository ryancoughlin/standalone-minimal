<template>
  <div class="px-4 py-3 border-b border-gray-200">
    <div class="flex items-center gap-3">
      <div class="flex-1 relative flex items-center">
        <i class="fas fa-search absolute left-3 text-gray-400 z-10"></i>
        <input
          type="text"
          placeholder="Search Demos"
          class="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-md text-sm bg-reprise-off-white transition-all duration-200 focus:outline-none focus:border-reprise-blue focus:ring-1 focus:ring-reprise-blue"
          :value="searchQuery"
          @input="
            $emit(
              'update:searchQuery',
              ($event.target as HTMLInputElement).value
            )
          "
        />
        <button
          class="absolute right-3 w-5 h-5 flex items-center justify-center border-none bg-transparent text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
        >
          <i class="fas fa-filter text-sm"></i>
        </button>
      </div>
      <button
        class="px-4 py-2.5 bg-reprise-blue text-white border-none rounded-md text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-reprise-deep-blue"
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
