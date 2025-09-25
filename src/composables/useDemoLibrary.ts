import { ref, computed } from "vue";
import {
  maestroDemos,
  legacyDemos,
  liveDemos,
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

      // Use consolidated mock data
      const maestroResponse = mockApiResponses.getMaestroReplays();
      if (maestroResponse.success) {
        maestroDemos.value = maestroResponse.replays;
      }

      // Fetch Legacy and Live demos from consolidated data
      const mergedResponse = mockApiResponses.getMergedReplayList();
      legacyDemos.value = mergedResponse.replays || [];
      liveDemos.value = mergedResponse.live_replays || [];

      // Ensure default URLs for legacy demos
      for (const demo of legacyDemos.value) {
        if (!demo.default_url) {
          demo.default_url = `https://demo.example.com/${demo.id}`;
        }
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
