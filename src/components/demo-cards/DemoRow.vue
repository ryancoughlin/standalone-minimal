<template>
  <div
    class="relative w-full py-2 px-4 cursor-pointer border-b border-muted last:border-b-0 hover:bg-hover transition-colors duration-150 group"
    @click="$emit('play-demo', demo)"
  >
    <!-- Row content — full width -->
    <div class="flex items-start gap-2">
      <!-- Thumbnail -->
      <div
        class="relative w-24 h-[67px] flex-shrink-0 rounded border border-default overflow-hidden bg-emphasis"
      >
        <img
          v-if="demo.screenshot_small && !imageError"
          :src="getScreenshotUrl(demo.screenshot_small)"
          @error="imageError = true"
          alt=""
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <i class="fal fa-play icon-muted text-sm"></i>
        </div>
        <!-- Type badge -->
        <div
          class="absolute bottom-0 right-0 px-0.5 py-px bg-black/50 text-white/80 rounded-tl-sm"
          :title="typeLabel"
        >
          <i :class="typeIcon" class="text-[6px]"></i>
        </div>
      </div>

      <!-- Text -->
      <div class="flex-1 min-w-0">
        <h3 class="text-sm font-medium text-default truncate m-0 mb-0.5">
          {{ demo.title }}
        </h3>
        <div class="flex items-center text-xs text-default">
          <template v-if="demo.dataset">
            <i class="fal fa-database icon-muted text-[10px] mr-0.5"></i>
            <span class="truncate max-w-[120px]">{{ demo.dataset.name }}</span>
            <span class="mx-1 text-default">&middot;</span>
          </template>
          <i class="fal fa-play icon-muted text-[10px] mr-0.5"></i>
          <span class="text-default">{{ demo.views || 0 }} views</span>
        </div>
        <!-- Overlay metadata -->
        <div
          v-if="demo.productType === 'overlay'"
          class="flex items-center gap-3 text-xs text-default mt-0.5"
        >
          <span class="flex items-center gap-0.5">
            <i class="fal fa-pen icon-muted text-[10px]"></i>
            {{ demo.textEditCount || 0 }}
          </span>
          <span class="flex items-center gap-0.5">
            <i class="fal fa-image icon-muted text-[10px]"></i>
            {{ demo.imageEditCount || 0 }}
          </span>
          <span class="flex items-center gap-0.5">
            <i class="fal fa-link icon-default text-[10px]"></i>
            {{ demo.linkCount || 0 }}
          </span>
        </div>
      </div>
    </div>

    <!-- Launch button — overlays on far right, visible on hover -->
    <div
      class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-150"
      :class="{ '!opacity-100': showDropdown }"
      @click.stop
    >
      <button
        class="flex items-center gap-1 px-2.5 py-1 bg-primary text-white text-[11px] font-medium rounded-l-md hover:bg-blue-700 transition-colors"
        @click="$emit('play-demo', demo)"
      >
        <i class="fas fa-play text-[9px]"></i>
        Launch
      </button>
      <button
        class="flex items-center justify-center w-6 py-1 bg-primary text-white border-l border-white/25 rounded-r-md hover:bg-blue-700 transition-colors"
        @click="toggleDropdown"
      >
        <i class="fas fa-chevron-down text-[8px]"></i>
      </button>
    </div>

    <!-- Dropdown -->
    <div
      v-if="showDropdown"
      ref="dropdownRef"
      class="absolute right-4 top-full mt-0.5 w-52 bg-default border border-default rounded-lg shadow-lg z-30 py-1"
      @click.stop
    >
      <button
        class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-emphasis hover:bg-hover transition-colors text-left"
        @click="handleLaunchWithNotes"
      >
        <i
          class="fal fa-sticky-note text-muted text-[11px] w-4 text-center"
        ></i>
        Launch with Presenter Notes
      </button>
      <div class="border-t border-default my-1"></div>
      <button
        class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-emphasis hover:bg-hover transition-colors text-left"
        @click="showDropdown = false"
      >
        <i class="fal fa-ellipsis text-muted text-[11px] w-4 text-center"></i>
        More options
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

interface Props {
  demo: any;
  delay?: number;
  showViews?: boolean;
}

interface Emits {
  (e: "play-demo", demo: any): void;
  (e: "play-demo-with-notes", demo: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  showViews: false,
});

const emit = defineEmits<Emits>();

const imageError = ref(false);
const showDropdown = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const handleLaunchWithNotes = () => {
  showDropdown.value = false;
  emit("play-demo-with-notes", props.demo);
};

const onClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", onClickOutside, true);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onClickOutside, true);
});

const typeIcon = computed(() => {
  const icons: Record<string, string> = {
    overlay: "fas fa-layer-group",
    html_environment: "fas fa-code",
    cloned_environment: "fas fa-clone",
  };
  return icons[props.demo.productType] || "fas fa-play";
});

const typeShort = computed(() => {
  const labels: Record<string, string> = {
    overlay: "OVR",
    html_environment: "HTML",
    cloned_environment: "CLN",
  };
  return labels[props.demo.productType] || "";
});

const typeLabel = computed(() => {
  const labels: Record<string, string> = {
    overlay: "Overlay",
    html_environment: "HTML Environment",
    cloned_environment: "Cloned Environment",
  };
  return labels[props.demo.productType] || "Demo";
});

const getScreenshotUrl = (screenshotSmall: string) => {
  if (!screenshotSmall) return "";
  if (screenshotSmall.startsWith("/") || screenshotSmall.startsWith("data:"))
    return screenshotSmall;
  return `data:image/png;base64,${screenshotSmall}`;
};
</script>
