<template>
  <div
    class="flex flex-row bg-white rounded mb-4 cursor-default transition group pr-2 select-none"
  >
    <div
      class="relative flex-none w-[80px] h-[54px] cursor-pointer"
      @click.stop="$emit('play', demo)"
      :title="`Launch ${demo.title} Demo`"
    >
      <div
        class="absolute z-10 w-full h-full flex items-center justify-center text-white text-3xl opacity-0 group-hover:opacity-100 transition"
      >
        <span>▶</span>
      </div>
      <div class="relative w-full h-full rounded-md">
        <img
          v-if="screenshot_url && !image_error"
          class="rounded-md border border-gray-200 object-left-top object-cover w-full h-full"
          :src="screenshot_url"
          @error="image_error = true"
          alt="screenshot"
        />
        <div
          v-else
          class="rounded bg-gray-100 flex justify-center items-center w-full h-full"
        >
          <span class="text-gray-200 text-3xl">📷</span>
        </div>
        <div
          class="group-hover:opacity-40 opacity-0 transition absolute rounded-md top-0 left-0 bg-gray-900 w-full h-full"
        />
      </div>
    </div>
    <div class="flex flex-col w-full justify-center pl-2 pt-0.5 pb-0.5 gap-1">
      <div class="flex flex-row">
        <div class="relative flex flex-col transition flex-1">
          <div
            class="font-semibold leading-snug text-sm transition truncate"
            :title="demo.title"
          >
            {{ demo.title }}
          </div>
          <div class="text-xs text-green-600">Live Demo</div>
        </div>
      </div>
      <div class="flex flex-row text-xs text-gray-400 justify-between">
        <div class="flex-1 transition truncate mr-2">
          🔗 {{ demo.active_link_count || 0 }} active links
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Props {
  demo: any;
}

const props = defineProps<Props>();

defineEmits<{
  play: [demo: any];
}>();

const image_error = ref(false);

const screenshot_url = computed(() => {
  if (!props.demo.screenshot_small) return "";
  if (props.demo.screenshot_small.startsWith("data:")) {
    return props.demo.screenshot_small;
  }
  return `data:image/png;base64,${props.demo.screenshot_small}`;
});
</script>
