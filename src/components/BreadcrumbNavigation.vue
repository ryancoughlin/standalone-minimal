<template>
  <nav v-if="currentFolder" class="flex items-center gap-1 min-w-0" aria-label="Folder navigation">
    <template v-for="(crumb, index) in breadcrumbs" :key="crumb.id">
      <span v-if="index > 0" class="text-muted text-xs flex-shrink-0">/</span>
      <button
        @click="$emit('navigate-breadcrumb', crumb)"
        class="flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors whitespace-nowrap hover:bg-hover"
        :class="index === breadcrumbs.length - 1
          ? 'text-blue-1000 font-semibold'
          : 'text-default hover:text-emphasis'"
      >
        <svg class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 4a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293L9.414 4H13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4z" />
        </svg>
        <span class="truncate">{{ crumb.title }}</span>
      </button>
    </template>
  </nav>
</template>

<script setup lang="ts">
interface Props {
  currentFolder: any;
  breadcrumbs: any[];
}

interface Emits {
  (e: "navigate-breadcrumb", crumb: any): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>
