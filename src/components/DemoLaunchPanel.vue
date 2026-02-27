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
    <div class="flex-1 min-h-0 overflow-y-auto">
      <!-- Column headers -->
      <div
        v-if="variables.length"
        class="sticky top-0 z-10 bg-default border-b border-default px-4 py-1.5 grid grid-cols-[1fr_1fr] gap-2 ml-[26px]"
      >
        <span class="text-[10px] font-medium text-muted uppercase tracking-wider">Default</span>
        <span class="text-[10px] font-medium text-muted uppercase tracking-wider">New</span>
      </div>

      <div class="px-4 py-2 space-y-1">
        <div
          v-for="(variable, index) in variables"
          :key="variable.id"
          class="group rounded-lg py-1.5 transition-colors"
        >
          <!-- Variable name row: icon + label -->
          <div class="flex items-center gap-1.5 mb-1.5">
            <span class="size-[18px] shrink-0 flex items-center justify-center rounded bg-purple-50">
              <i class="fas fa-font text-[8px] text-purple-400"></i>
            </span>
            <span
              class="text-[11px] font-medium truncate"
              :class="editedFields[index] ? 'text-blue-600' : 'text-muted'"
            >
              {{ variable.name }}
            </span>
            <span
              v-if="editedFields[index]"
              class="size-1.5 rounded-full bg-blue-600 shrink-0"
            ></span>
          </div>

          <!-- Two-column: Default (read-only) + New (editable) -->
          <div class="grid grid-cols-[1fr_1fr] gap-2 ml-[26px]">
            <!-- Default value (read-only) -->
            <div
              class="px-2.5 py-1.5 text-xs text-muted bg-gray-50 border border-gray-100 rounded-md truncate select-none"
            >
              {{ variable.defaultValue }}
            </div>

            <!-- New value (editable) -->
            <div class="relative">
              <input
                v-model="editedValues[index]"
                type="text"
                class="w-full px-2.5 py-1.5 text-xs bg-default border rounded-md transition-all duration-150 outline-none"
                :class="
                  editedFields[index]
                    ? 'border-blue-600/50 ring-1 ring-blue-600/20 text-emphasis'
                    : 'border-default text-default hover:border-emphasis focus:border-blue-600/50 focus:ring-1 focus:ring-blue-600/20'
                "
                @input="handleInput(index)"
              />
              <!-- Reset button -->
              <button
                v-if="editedFields[index]"
                @click="resetField(index)"
                class="absolute right-1 top-1/2 -translate-y-1/2 size-5 flex items-center justify-center rounded-sm text-muted hover:text-emphasis hover:bg-gray-100 transition-colors"
                title="Reset to default"
              >
                <i class="fas fa-rotate-left text-[8px]"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="!variables.length"
        class="flex flex-col items-center justify-center py-12 text-center"
      >
        <i class="fal fa-sliders-h text-2xl text-muted mb-2"></i>
        <p class="text-xs text-muted">No variables to customize</p>
      </div>
    </div>

    <!-- Sticky footer: actions -->
    <div class="shrink-0 border-t border-default px-4 py-3 flex items-center gap-2">
      <span v-if="editCount > 0" class="text-[11px] text-blue-600 font-medium">
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

const editedValues = ref<string[]>([]);
const editedFields = ref<boolean[]>([]);

watch(
  () => props.demo.id,
  () => {
    editedValues.value = variables.value.map((v) => v.defaultValue);
    editedFields.value = variables.value.map(() => false);
  },
  { immediate: true }
);

const editCount = computed(() => editedFields.value.filter(Boolean).length);

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
</script>
