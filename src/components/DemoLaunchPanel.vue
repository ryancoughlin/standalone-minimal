<template>
  <div class="flex flex-col h-full min-h-0 w-full bg-default">
    <!-- Header: back + demo title -->
    <div class="shrink-0 border-b border-default px-4 py-2.5 flex items-center gap-2">
      <button
        @click="$emit('back')"
        class="size-7 shrink-0 flex items-center justify-center rounded text-muted hover:bg-hover hover:text-emphasis transition-colors"
        title="Back to demos"
      >
        <i class="fas fa-arrow-left text-xs"></i>
      </button>
      <div class="min-w-0 flex-1">
        <h2 class="text-sm font-semibold text-emphasis truncate m-0">
          {{ demo.title }}
        </h2>
        <p class="text-[11px] text-muted m-0">Personalize before launching</p>
      </div>
    </div>

    <!-- Scrollable variable list -->
    <div class="flex-1 min-h-0 overflow-y-auto px-4 py-3">
      <div class="space-y-3">
        <div
          v-for="(variable, index) in variables"
          :key="variable.id"
          class="group"
        >
          <!-- Variable label with type icon -->
          <label class="flex items-center gap-1.5 mb-1">
            <span
              class="size-5 shrink-0 flex items-center justify-center rounded"
              :class="typeIconBg(variable.type)"
            >
              <i :class="typeIcon(variable.type)" class="text-[10px]"></i>
            </span>
            <span
              class="text-xs font-medium truncate"
              :class="editedFields[index] ? 'text-emphasis' : 'text-default'"
            >
              {{ variable.name }}
            </span>
            <!-- Edited indicator -->
            <span
              v-if="editedFields[index]"
              class="size-1.5 rounded-full bg-reprise-blue shrink-0"
              title="Modified"
            ></span>
          </label>

          <!-- Input field -->
          <div class="relative">
            <input
              v-model="editedValues[index]"
              type="text"
              class="w-full px-2.5 py-1.5 text-xs bg-default border rounded-md transition-colors outline-none"
              :class="
                editedFields[index]
                  ? 'border-reprise-blue/40 bg-blue-50/30'
                  : 'border-default hover:border-emphasis'
              "
              :placeholder="variable.defaultValue"
              @focus="handleFocus(index)"
              @input="handleInput(index)"
            />
            <!-- Reset button (when edited) -->
            <button
              v-if="editedFields[index]"
              @click="resetField(index)"
              class="absolute right-1.5 top-1/2 -translate-y-1/2 size-5 flex items-center justify-center rounded text-muted hover:text-emphasis hover:bg-hover transition-colors"
              title="Reset to default"
            >
              <i class="fas fa-rotate-left text-[9px]"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state if no variables -->
      <div
        v-if="!variables.length"
        class="flex flex-col items-center justify-center py-8 text-center"
      >
        <i class="fal fa-sliders-h text-2xl text-muted mb-2"></i>
        <p class="text-xs text-muted">No variables to customize</p>
      </div>
    </div>

    <!-- Sticky footer: actions -->
    <div
      class="shrink-0 border-t border-default px-4 py-3 flex items-center gap-2"
    >
      <!-- Edit count badge -->
      <span v-if="editCount > 0" class="text-[11px] text-reprise-blue font-medium">
        {{ editCount }} edit{{ editCount > 1 ? 's' : '' }}
      </span>
      <div class="flex-1"></div>

      <button
        @click="handleSkipAndLaunch"
        class="px-3 py-1.5 text-xs font-medium text-default border border-default rounded-md hover:bg-hover hover:text-emphasis transition-colors"
      >
        Skip & Launch
      </button>
      <button
        @click="handleLaunch"
        class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        <i class="fas fa-play text-[9px]"></i>
        Launch
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { Demo, DemoVariable } from "../types/index";

interface Props {
  demo: Demo;
}

interface Emits {
  (e: "back"): void;
  (e: "launch", payload: { demo: Demo; variables: Record<string, string> }): void;
  (e: "skip-launch", demo: Demo): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const variables = computed<DemoVariable[]>(() => props.demo.variables || []);

// Track edited values — initialized to defaults
const editedValues = ref<string[]>([]);
const editedFields = ref<boolean[]>([]);

// Reset when demo changes
watch(
  () => props.demo.id,
  () => {
    editedValues.value = variables.value.map((v) => v.defaultValue);
    editedFields.value = variables.value.map(() => false);
  },
  { immediate: true }
);

const editCount = computed(() => editedFields.value.filter(Boolean).length);

const handleFocus = (_index: number) => {
  // Could be used for analytics or scroll-into-view
};

const handleInput = (index: number) => {
  editedFields.value[index] =
    editedValues.value[index] !== variables.value[index].defaultValue;
};

const resetField = (index: number) => {
  editedValues.value[index] = variables.value[index].defaultValue;
  editedFields.value[index] = false;
};

const getVariablePayload = (): Record<string, string> => {
  const payload: Record<string, string> = {};
  variables.value.forEach((v, i) => {
    if (editedFields.value[i]) {
      payload[v.name] = editedValues.value[i];
    }
  });
  return payload;
};

const handleLaunch = () => {
  emit("launch", { demo: props.demo, variables: getVariablePayload() });
};

const handleSkipAndLaunch = () => {
  emit("skip-launch", props.demo);
};

// Type icon helpers
const typeIcon = (type: string) => {
  const icons: Record<string, string> = {
    text: "fas fa-font",
    image: "fas fa-image",
    date: "fas fa-calendar",
  };
  return icons[type] || "fas fa-font";
};

const typeIconBg = (type: string) => {
  const bgs: Record<string, string> = {
    text: "bg-purple-50 text-purple-400",
    image: "bg-pink-50 text-pink-400",
    date: "bg-amber-50 text-amber-500",
  };
  return bgs[type] || "bg-gray-50 text-gray-400";
};
</script>
