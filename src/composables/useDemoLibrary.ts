import { ref, computed } from "vue";
import {
  maestroDemos as mockMaestroDemos,
  legacyDemos as mockLegacyDemos,
  liveDemos as mockLiveDemos,
  mockApiResponses
} from "../data/mockData";

export function useDemoLibrary() {
  // State
  const maestroDemos = ref<any[]>([]);
  const legacyDemos = ref<any[]>([]);
  const liveDemos = ref<any[]>([]);
  const loading = ref(false);

  // Computed
  const totalDemoCount = computed(
    () => maestroDemos.value.length + legacyDemos.value.length + liveDemos.value.length
  );

  // Actions
  const fetchAllDemos = async (): Promise<void> => {
    loading.value = true;
    try {
      // Simulate API delay for realistic loading experience
      await new Promise(resolve => setTimeout(resolve, 300));

      // Use static mock data instead of API calls
      const maestroResponse = mockApiResponses.getMaestroReplays();
      if (maestroResponse.success) {
        maestroDemos.value = maestroResponse.replays;
      }

      // Fetch Legacy and Live demos from merged endpoint
      const mergedResponse = mockApiResponses.getMergedReplayList();
      legacyDemos.value = mergedResponse.replays || [];
      liveDemos.value = mergedResponse.live_replays || [];

      // Add default URLs for legacy demos (from mock data)
      for (const demo of legacyDemos.value) {
        const urlResponse = mockApiResponses.getDefaultUrl(demo.id);
        demo.default_url = urlResponse.default_url;
      }

    } catch (error) {
      console.error("Error fetching demos:", error);
      // Fallback to empty arrays
      maestroDemos.value = [];
      legacyDemos.value = [];
      liveDemos.value = [];
    } finally {
      loading.value = false;
    }
  };

  return {
    // Data
    maestroDemos,
    legacyDemos,
    liveDemos,
    totalDemoCount,
    loading,

    // Actions
    fetchAllDemos,
  };
}
