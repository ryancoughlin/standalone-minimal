import { ref, computed } from "vue";
import {
  maestroDemos,
  legacyDemos,
  liveDemos,
  mockApiResponses
} from "../data/mockData";

export function useDemoLibrary() {
  // State
  const maestroDemosRef = ref<any[]>([]);
  const legacyDemosRef = ref<any[]>([]);
  const liveDemosRef = ref<any[]>([]);
  const loading = ref(false);

  // Computed
  const totalDemoCount = computed(
    () => maestroDemosRef.value.length + legacyDemosRef.value.length + liveDemosRef.value.length
  );

  // Actions
  const fetchAllDemos = async (): Promise<void> => {
    loading.value = true;
    try {
      // Simulate API delay for realistic loading experience
      await new Promise(resolve => setTimeout(resolve, 300));

      // Use direct exports instead of mock API responses
      maestroDemosRef.value = maestroDemos;
      legacyDemosRef.value = legacyDemos;
      liveDemosRef.value = liveDemos;

      // Ensure default URLs for legacy demos
      for (const demo of legacyDemosRef.value) {
        if (!demo.default_url) {
          demo.default_url = `https://demo.example.com/${demo.id}`;
        }
      }

      console.log('Demos loaded:', {
        maestro: maestroDemosRef.value.length,
        legacy: legacyDemosRef.value.length,
        live: liveDemosRef.value.length
      });

    } catch (error) {
      console.error("Error fetching demos:", error);
      // Fallback to empty arrays
      maestroDemosRef.value = [];
      legacyDemosRef.value = [];
      liveDemosRef.value = [];
    } finally {
      loading.value = false;
    }
  };

  return {
    // Data
    maestroDemos: maestroDemosRef,
    legacyDemos: legacyDemosRef,
    liveDemos: liveDemosRef,
    totalDemoCount,
    loading,

    // Actions
    fetchAllDemos,
  };
}
