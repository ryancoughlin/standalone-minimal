<template>
  <div class="flex flex-col w-full">
    <!-- Breadcrumbs -->
    <div v-if="showBreadcrumbs && breadcrumbs?.length" class="px-3 py-1">
      <BreadcrumbNavigation
        :current-folder="currentFolder"
        :breadcrumbs="breadcrumbs"
        @navigate-breadcrumb="$emit('navigate-breadcrumb', $event)"
      />
    </div>

    <!-- Title -->
    <div class="px-2 py-2">
      <h2 class="text-sm font-semibold text-emphasis m-0">{{ title }}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadcrumbNavigation from "./BreadcrumbNavigation.vue";

interface Props {
  title: string;
  description?: string;
  showBreadcrumbs?: boolean;
  currentFolder?: any;
  breadcrumbs?: any[];
}

interface Emits {
  (e: "navigate-breadcrumb", crumb: any): void;
}

withDefaults(defineProps<Props>(), {
  description: "",
  showBreadcrumbs: false,
  currentFolder: null,
  breadcrumbs: () => [],
});

defineEmits<Emits>();
</script>
