<template>
  <div v-if="showBreadcrumbs && breadcrumbs?.length" class="px-4 pt-2">
    <BreadcrumbNavigation
      :current-folder="currentFolder"
      :breadcrumbs="breadcrumbs"
      @navigate-breadcrumb="$emit('navigate-breadcrumb', $event)"
    />
  </div>

  <div class="px-4 pt-3 pb-1">
    <h2 class="text-sm font-semibold text-emphasis">{{ title }}</h2>
    <p v-if="description" class="text-xs text-muted mt-0.5">{{ description }}</p>
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
