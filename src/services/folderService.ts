/**
 * Folder Service - Dynamic folder management and demo counting
 * Handles folder hierarchy, demo counts, and navigation
 */

import { ref, computed } from 'vue';
import { folders } from '../data/mockData';

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

export function useFolderService(maestroDemos: any, legacyDemos: any, liveDemos: any) {
    // State
    const currentFolder = ref<Folder | null>(null);
    const expandedFolders = ref<string[]>([]);

    // Computed - Dynamic folder counts with enterprise hierarchy
    const foldersWithCounts = computed((): FolderWithCounts[] => {
        return folders.map(folder => {
            // Count demos directly in this folder
            const directMaestroCount = maestroDemos.value.filter(demo => demo.replay_folder_id === folder.id).length;
            const directLegacyCount = legacyDemos.value.filter(demo => demo.folder_id === folder.id).length;
            const directLiveCount = liveDemos.value.filter(demo => demo.folder_id === folder.id).length;

            // For root folders, also count demos in all subfolders (enterprise hierarchy)
            let totalMaestroCount = directMaestroCount;
            let totalLegacyCount = directLegacyCount;
            let totalLiveCount = directLiveCount;

            if (folder.parent_id === null) {
                // This is a root folder - count all demos in subfolders
                const subfolders = folders.filter(f => f.parent_id === folder.id);
                for (const subfolder of subfolders) {
                    totalMaestroCount += maestroDemos.value.filter(demo => demo.replay_folder_id === subfolder.id).length;
                    totalLegacyCount += legacyDemos.value.filter(demo => demo.folder_id === subfolder.id).length;
                    totalLiveCount += liveDemos.value.filter(demo => demo.folder_id === subfolder.id).length;
                }
            }

            return {
                ...folder,
                total_demo_count: totalMaestroCount + totalLegacyCount + totalLiveCount,
                maestro_count: totalMaestroCount,
                legacy_count: totalLegacyCount,
                live_count: totalLiveCount
            };
        });
    });

    const rootFolders = computed(() => {
        return foldersWithCounts.value
            .filter(folder => folder.parent_id === null)
            .sort((a, b) => a.sort_index - b.sort_index);
    });

    const totalDemoCount = computed(() => {
        return maestroDemos.value.length + legacyDemos.value.length + liveDemos.value.length;
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
                maestro: maestroDemos.value,
                legacy: legacyDemos.value,
                live: liveDemos.value,
                total: maestroDemos.value.length + legacyDemos.value.length + liveDemos.value.length
            };
        }

        // Get all subfolder IDs for this folder (including the folder itself)
        const getAllSubfolderIds = (parentId: string): string[] => {
            const subfolderIds = [parentId]; // Include the parent folder itself
            const subfolders = folders.filter(f => f.parent_id === parentId);
            for (const subfolder of subfolders) {
                subfolderIds.push(...getAllSubfolderIds(subfolder.id));
            }
            return subfolderIds;
        };

        const folderIdsToSearch = getAllSubfolderIds(folderId);

        const maestro = maestroDemos.value.filter(demo =>
            folderIdsToSearch.includes(demo.replay_folder_id)
        );
        const legacy = legacyDemos.value.filter(demo =>
            folderIdsToSearch.includes(demo.folder_id)
        );
        const live = liveDemos.value.filter(demo =>
            folderIdsToSearch.includes(demo.folder_id)
        );

        console.log(`Demos in folder ${folderId} (including subfolders):`, {
            folderIdsToSearch,
            maestro: maestro.length,
            legacy: legacy.length,
            live: live.length,
            total: maestro.length + legacy.length + live.length
        });

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