<template>
  <div class="fixed top-5 left-5 z-[10001] bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-[260px]">
    <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Sprint</h3>
    <div class="space-y-2">
      <label
        v-for="option in options"
        :key="option.value"
        class="flex items-start gap-2.5 cursor-pointer group"
      >
        <input
          type="radio"
          :value="option.value"
          :checked="modelValue === option.value"
          @change="$emit('update:modelValue', option.value)"
          class="mt-0.5 accent-blue-600"
        />
        <div class="flex-1 min-w-0">
          <div
            class="text-xs font-medium transition-colors"
            :class="modelValue === option.value ? 'text-blue-600' : 'text-gray-700 group-hover:text-gray-900'"
          >
            Sprint {{ option.value }}
          </div>
          <div class="text-[11px] text-gray-400 leading-tight">{{ option.label }}</div>
          <div class="text-[11px] text-gray-500 leading-snug italic mt-0.5">{{ option.story }}</div>
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
  { value: 2, label: "Demo list + pagination", story: "As a rep, I can browse my reveal demos and page through them." },
  { value: 3, label: "Overlays / Environments tabs", story: "As a rep, I can access all demo types in one unified view." },
  { value: 4, label: "Search, sort, sidebar, folders", story: "As a rep, I can find, filter, and organize demos quickly." },
];
</script>
