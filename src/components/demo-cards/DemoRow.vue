<template>
  <div
    class="flex items-center gap-2 w-full py-2 px-2 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-150 group relative"
    @click="$emit('play-demo', demo)"
  >
    <!-- Thumbnail -->
    <div class="w-20 h-14 flex-shrink-0 rounded border border-gray-200 overflow-hidden bg-gray-100 relative">
      <img
        v-if="demo.screenshot_small && !imageError"
        :src="getScreenshotUrl(demo.screenshot_small)"
        @error="imageError = true"
        alt=""
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <i class="fal fa-play text-gray-400 text-sm"></i>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-1.5 mb-0.5">
        <h3 class="text-xs font-medium text-gray-900 truncate flex-1 m-0">{{ demo.title }}</h3>
        <div
          class="w-4 h-4 flex-shrink-0 rounded-full flex items-center justify-center"
          :class="typeBadgeClass"
          :title="typeLabel"
        >
          <i :class="typeIcon" class="text-[8px]"></i>
        </div>
      </div>
      <div class="flex items-center text-xs text-gray-500">
        <template v-if="demo.dataset">
          <i class="fal fa-database text-gray-400 text-[10px] mr-0.5"></i>
          <span class="truncate max-w-[120px]">{{ demo.dataset.name }}</span>
          <span class="mx-1 text-gray-300">&middot;</span>
        </template>
        <span>{{ showViews ? `${demo.views || 0} views` : formatDate(demo.lastModified) }}</span>
      </div>
    </div>

    <!-- Actions -->
    <button
      @click.stop="$emit('customize-demo', demo)"
      class="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
      title="Customize"
    >
      <i class="fal fa-cog text-sm"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Props {
  demo: any;
  delay?: number;
  showViews?: boolean;
}

interface Emits {
  (e: "play-demo", demo: any): void;
  (e: "customize-demo", demo: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  showViews: false,
});

defineEmits<Emits>();

const imageError = ref(false);

const typeIcon = computed(() => {
  const icons: Record<string, string> = {
    overlay: "fas fa-layer-group",
    html_environment: "fas fa-code",
    cloned_environment: "fas fa-clone",
  };
  return icons[props.demo.productType] || "fas fa-play";
});

const typeBadgeClass = computed(() => {
  const classes: Record<string, string> = {
    overlay: "bg-violet-500/50 text-violet-900",
    html_environment: "bg-sky-500/50 text-sky-900",
    cloned_environment: "bg-emerald-500/50 text-emerald-900",
  };
  return classes[props.demo.productType] || "";
});

const typeLabel = computed(() => {
  const labels: Record<string, string> = {
    overlay: "Overlay",
    html_environment: "HTML Environment",
    cloned_environment: "Cloned Environment",
  };
  return labels[props.demo.productType] || "Demo";
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.ceil(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 1) return "Today";
  if (diffDays === 2) return "Yesterday";
  if (diffDays <= 7) return `${diffDays - 1} days ago`;
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};

const getScreenshotUrl = (screenshotSmall: string) => {
  if (!screenshotSmall) return "";
  if (screenshotSmall.startsWith("/") || screenshotSmall.startsWith("data:")) return screenshotSmall;
  return `data:image/png;base64,${screenshotSmall}`;
};
</script>
