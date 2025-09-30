import { ref, computed } from "vue";
import { demos, folders, getDemosByFolder, getRecentDemos, getSharedDemos, getStarredDemos } from "../data/mockData";

export function useDemoLibrary() {
  // State
  const allDemos = ref<any[]>([]);
  const allFolders = ref<any[]>([]);
  const loading = ref(false);

  // Computed
  const totalDemoCount = computed(() => allDemos.value.length);
  const recentDemoCount = computed(() => getRecentDemos().length);
  const sharedDemoCount = computed(() => getSharedDemos().length);
  const starredDemoCount = computed(() => getStarredDemos().length);

  // Actions
  const fetchAllDemos = async (): Promise<void> => {
    loading.value = true;
    try {
      // Simulate API delay for realistic loading experience
      await new Promise(resolve => setTimeout(resolve, 300));

      // Use our simplified data
      allDemos.value = demos;
      allFolders.value = folders;

      console.log('Demos loaded:', {
        total: allDemos.value.length,
        recent: recentDemoCount.value,
        shared: sharedDemoCount.value,
        starred: starredDemoCount.value
      });

    } catch (error) {
      console.error("Error fetching demos:", error);
      allDemos.value = [];
      allFolders.value = [];
    } finally {
      loading.value = false;
    }
  };

  const getDemosInFolder = (folderId: string) => {
    return getDemosByFolder(folderId);
  };

  const getFolderPath = (folderId: string) => {
    const folder = allFolders.value.find(f => f.id === folderId);
    if (!folder) return [];

    const path = [folder];
    let currentFolder = folder;

    while (currentFolder.parent_id) {
      currentFolder = allFolders.value.find(f => f.id === currentFolder.parent_id);
      if (currentFolder) {
        path.unshift(currentFolder);
      } else {
        break;
      }
    }

    return path;
  };

  const selectFolder = (folderId: string) => {
    return allFolders.value.find(f => f.id === folderId);
  };

  // Folder counts with demo counts
  const foldersWithCounts = computed(() => {
    return allFolders.value.map(folder => ({
      ...folder,
      demo_count: getDemosByFolder(folder.id).length
    }));
  });

  return {
    // State
    allDemos,
    allFolders,
    loading,

    // Computed
    totalDemoCount,
    recentDemoCount,
    sharedDemoCount,
    starredDemoCount,
    foldersWithCounts,

    // Actions
    fetchAllDemos,
    getDemosInFolder,
    getFolderPath,
    selectFolder
  };
}