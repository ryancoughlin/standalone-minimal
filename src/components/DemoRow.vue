<template>
  <div
    class="relative w-full py-2 px-4 cursor-pointer border-b border-muted last:border-b-0 first:rounded-t-lg last:rounded-b-lg hover:bg-hover transition-colors duration-150 group"
    @click="$emit('play-demo', demo)"
  >
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
          class="absolute bottom-0 right-0 flex items-center gap-0.5 px-1 py-px bg-black/60 text-white rounded-tl-sm"
        >
          <i :class="typeIcon" class="text-[6px]"></i>
          <span class="text-[7px] font-medium leading-none tracking-wide uppercase">{{ typeBadge }}</span>
        </div>
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <!-- Row 1: Title -->
        <h3 class="text-sm font-medium text-default truncate m-0">
          {{ demo.title }}
        </h3>

        <!-- Row 2: Dataset + edit count + views -->
        <div class="flex items-center gap-2 mt-1">
          <span v-if="demo.dataset" class="flex items-center gap-0.5 text-xs text-default truncate min-w-0">
            <i class="fal fa-database icon-muted text-[10px]"></i>
            <span class="truncate">{{ demo.dataset.name }}</span>
          </span>
          <span v-if="totalEdits > 0" class="flex items-center gap-0.5 text-xs text-default shrink-0">
            <i class="fal fa-pen icon-muted text-[10px]"></i>
            {{ totalEdits }} edit{{ totalEdits > 1 ? 's' : '' }}
          </span>
          <span class="shrink-0 flex items-center gap-0.5 text-[11px] text-muted ml-auto">
            <i class="fal fa-play text-[9px]"></i>
            {{ demo.views || 0 }}
          </span>
        </div>
      </div>
    </div>

    <!-- Launch button — far right, visible on hover -->
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

const totalEdits = computed(() => {
  return (props.demo.textEditCount || 0) + (props.demo.imageEditCount || 0) + (props.demo.linkCount || 0);
});

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

const typeLabel = computed(() => {
  const labels: Record<string, string> = {
    overlay: "Overlay",
    html_environment: "HTML Environment",
    cloned_environment: "Cloned Environment",
  };
  return labels[props.demo.productType] || "Demo";
});

const typeBadge = computed(() => {
  const badges: Record<string, string> = {
    overlay: "Overlay",
    html_environment: "HTML",
    cloned_environment: "Cloned",
  };
  return badges[props.demo.productType] || "Demo";
});

const getScreenshotUrl = (screenshotSmall: string) => {
  if (!screenshotSmall) return "";
  if (screenshotSmall.startsWith("/") || screenshotSmall.startsWith("data:"))
    return screenshotSmall;
  return `data:image/png;base64,${screenshotSmall}`;
};
</script>
