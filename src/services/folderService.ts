/**
 * Folder Service - Dynamic folder management and demo counting
 * Handles folder hierarchy, demo counts, and navigation
 */

import { ref, computed } from 'vue';
import { folders, maestroDemos, legacyDemos, liveDemos } from '../data/mockData';

export interface Folder {
    id: string;
    title: string;
    parent_id: string | null;
    sort_index: number;
    archived: boolean;
    acl: any;
    ac_replay_count: number;
    sc_replay_count: number;
    created_by: string;
}

export interface FolderWithCounts extends Folder {
    total_demo_count: number;
    maestro_count: number;
    legacy_count: number;
    live_count: number;
}

export function useFolderService() {
    // State
    const currentFolder = ref<Folder | null>(null);
    const expandedFolders = ref<string[]>([]);

    // Computed - Dynamic folder counts
    const foldersWithCounts = computed((): FolderWithCounts[] => {
        return folders.map(folder => {
            // Count demos in this folder
            const maestroCount = maestroDemos.filter(demo => demo.replay_folder_id === folder.id).length;
            const legacyCount = legacyDemos.filter(demo => demo.folder_id === folder.id).length;
            const liveCount = liveDemos.filter(demo => demo.folder_id === folder.id).length;

            return {
                ...folder,
                total_demo_count: maestroCount + legacyCount + liveCount,
                maestro_count: maestroCount,
                legacy_count: legacyCount,
                live_count: liveCount
            };
        });
    });

    const rootFolders = computed(() => {
        return foldersWithCounts.value
            .filter(folder => folder.parent_id === null)
            .sort((a, b) => a.sort_index - b.sort_index);
    });

    const totalDemoCount = computed(() => {
        return maestroDemos.length + legacyDemos.length + liveDemos.length;
    });

    // Actions
    const getSubfolders = (parentId: string): FolderWithCounts[] => {
        return foldersWithCounts.value
            .filter(folder => folder.parent_id === parentId)
            .sort((a, b) => a.sort_index - b.sort_index);
    };

    const toggleFolder = (folderId: string) => {
        const index = expandedFolders.value.indexOf(folderId);
        if (index > -1) {
            expandedFolders.value.splice(index, 1);
        } else {
            expandedFolders.value.push(folderId);
        }
    };

    const selectFolder = (folder: Folder | null) => {
        currentFolder.value = folder;
    };

    const getFolderById = (folderId: string): FolderWithCounts | undefined => {
        return foldersWithCounts.value.find(folder => folder.id === folderId);
    };

    const getFolderPath = (folderId: string): FolderWithCounts[] => {
        const path: FolderWithCounts[] = [];
        let current = getFolderById(folderId);

        while (current) {
            path.unshift(current);
            if (current.parent_id) {
                current = getFolderById(current.parent_id);
            } else {
                current = undefined;
            }
        }

        return path;
    };

    const getDemosInFolder = (folderId: string | null) => {
        if (!folderId) {
            return {
                maestro: maestroDemos,
                legacy: legacyDemos,
                live: liveDemos,
                total: maestroDemos.length + legacyDemos.length + liveDemos.length
            };
        }

        const maestro = maestroDemos.filter(demo => demo.replay_folder_id === folderId);
        const legacy = legacyDemos.filter(demo => demo.folder_id === folderId);
        const live = liveDemos.filter(demo => demo.folder_id === folderId);

        return {
            maestro,
            legacy,
            live,
            total: maestro.length + legacy.length + live.length
        };
    };

    return {
        // State
        currentFolder,
        expandedFolders,

        // Computed
        foldersWithCounts,
        rootFolders,
        totalDemoCount,

        // Actions
        getSubfolders,
        toggleFolder,
        selectFolder,
        getFolderById,
        getFolderPath,
        getDemosInFolder
    };
}