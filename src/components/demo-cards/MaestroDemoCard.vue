<template>
  <div
    class="flex flex-row bg-white rounded mb-4 cursor-default transition group pr-2 select-none"
  >
    <div
      class="relative flex-none w-[80px] h-[54px] cursor-pointer"
      @click.stop="$emit('play', replay)"
      :title="`Play ${replay.title} Demo`"
    >
      <div
        class="absolute z-10 w-full h-full flex items-center justify-center text-white text-3xl opacity-0 group-hover:opacity-100 transition"
      >
        <span>▶</span>
      </div>
      <div class="relative w-full h-full rounded-md">
        <img
          v-if="posterImage && !image_error"
          class="rounded-md border border-gray-200 object-left-top object-cover w-full h-full"
          :src="posterImage"
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
            :title="replay.title"
          >
            {{ replay.title }}
          </div>
          <div class="text-xs text-gray-500">Maestro</div>
        </div>
        <div v-if="showActions" class="flex-col ml-auto -mt-1 transition">
          <button
            v-if="hasEditPermissions && !isPlayOnly"
            title="Edit"
            @click="$emit('edit', replay)"
            class="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
          >
            Edit
          </button>
        </div>
      </div>
      <div class="flex flex-row text-xs text-gray-400 justify-between">
        <div
          class="flex-1 transition truncate mr-2"
          :title="folderTitle || 'Default'"
        >
          📁 {{ folderTitle || "Default" }}
        </div>
        <div class="flex flex-row">
          <div>
            <span>▶</span>
            <span>{{ replay.play_count || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  replay: any;
  posterImage?: string;
  folderTitle?: string;
  hasEditPermissions?: boolean;
  isPlayOnly?: boolean;
  showActions?: boolean;
}

withDefaults(defineProps<Props>(), {
  posterImage: "",
  folderTitle: "",
  showActions: true,
  hasEditPermissions: false,
  isPlayOnly: false,
});

defineEmits<{
  play: [replay: any];
  edit: [replay: any];
}>();

const image_error = ref(false);
</script>
