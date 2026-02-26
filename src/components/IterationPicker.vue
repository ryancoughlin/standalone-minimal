<template>
  <div class="fixed top-5 left-5 z-[10001] bg-white border border-gray-200 rounded-xl shadow-lg w-[280px]">
    <!-- Header -->
    <div class="px-4 pt-3.5 pb-2 border-b border-gray-100">
      <div class="flex items-center gap-2">
        <div class="size-6 rounded-md bg-reprise-deep-blue flex items-center justify-center">
          <i class="fas fa-layer-group text-white text-[10px]"></i>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-gray-900 m-0 leading-tight">Iteration</h3>
          <p class="text-[10px] text-gray-400 m-0">Prototype progression</p>
        </div>
      </div>
    </div>

    <!-- Options -->
    <div class="p-2 space-y-0.5">
      <label
        v-for="option in options"
        :key="option.value"
        class="flex items-start gap-2.5 cursor-pointer group rounded-lg px-2.5 py-2 transition-colors"
        :class="modelValue === option.value ? 'bg-blue-50' : 'hover:bg-gray-50'"
      >
        <div class="mt-0.5 shrink-0">
          <div
            class="size-4 rounded-full border-2 flex items-center justify-center transition-colors"
            :class="modelValue === option.value ? 'border-reprise-blue bg-reprise-blue' : 'border-gray-300 group-hover:border-gray-400'"
          >
            <div v-if="modelValue === option.value" class="size-1.5 rounded-full bg-white"></div>
          </div>
        </div>
        <input
          type="radio"
          :value="option.value"
          :checked="modelValue === option.value"
          @change="$emit('update:modelValue', option.value)"
          class="sr-only"
        />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5">
            <span
              class="text-xs font-semibold transition-colors"
              :class="modelValue === option.value ? 'text-reprise-blue' : 'text-gray-700 group-hover:text-gray-900'"
            >
              {{ option.value }}
            </span>
            <span class="text-[11px] text-gray-500 font-medium">{{ option.label }}</span>
          </div>
          <div class="text-[11px] text-gray-400 leading-snug mt-0.5">{{ option.story }}</div>
        </div>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: number;
}

interface Emits {
  (e: "update:modelValue", value: number): void;
}

defineProps<Props>();
defineEmits<Emits>();

const options = [
  { value: 1, label: "Shell + logo bar + close", story: "As a rep, I can see the extension is present and dismiss it." },
  { value: 2, label: "Demo list + pagination", story: "As a rep, I can browse my demos and page through them." },
  { value: 3, label: "Overlays / Environments tabs", story: "As a rep, I can access all demo types in one unified view." },
  { value: 4, label: "Search, sort, sidebar, folders", story: "As a rep, I can find, filter, and organize demos quickly." },
  { value: 5, label: "Personalize & launch", story: "As a rep, I can customize variables and launch a demo in one click." },
];
</script>
