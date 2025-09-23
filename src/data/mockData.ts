/**
 * Mock Data - Exact replica of real backend data structures
 * Extracted from Python mock services to use as static data
 */

// Maestro demos - exact structure from real backend
export const maestroDemos = [
    {
        id: "maestro1",
        title: "Product Overview Demo",
        created_at: "2024-01-15T10:00:00Z",
        last_modified_at: "2024-01-20T14:30:00Z",
        replay_folder_id: "folder1",
        properties: JSON.stringify({
            replay_id: "maestro1",
            replay_title: "Product Overview Demo",
            tags: ["marketing", "product"],
            share_with_all: false,
            share_as_play_only: true
        }),
        created_by_id: "user1",
        created_by_username: "john.doe",
        poster_image: "",
        is_playing: false,
        is_editing: false,
        play_count: 45,
        transformations: [],
        resources: [],
        interception_rules: [],
        data_sets: []
    },
    {
        id: "maestro2",
        title: "Sales Process Demo",
        created_at: "2024-01-16T09:00:00Z",
        last_modified_at: "2024-01-21T11:15:00Z",
        replay_folder_id: "folder2",
        properties: JSON.stringify({
            replay_id: "maestro2",
            replay_title: "Sales Process Demo",
            tags: ["sales", "process"],
            share_with_all: true,
            share_as_play_only: false
        }),
        created_by_id: "user2",
        created_by_username: "jane.smith",
        poster_image: "",
        is_playing: false,
        is_editing: false,
        play_count: 23,
        transformations: [],
        resources: [],
        interception_rules: [],
        data_sets: []
    }
];

// Legacy demos - exact structure from merged_replay_list endpoint
export const legacyDemos = [
    {
        id: "legacy1",
        api_version: 3,
        title: "Legacy Product Demo",
        last_modified_at: "2024-01-18T16:45:00Z",
        created_at: "2024-01-10T08:00:00Z",
        properties: JSON.stringify({ legacy: true }),
        replay_type: "LEGACY",
        acl: null,
        created_by: "user1",
        replay_folder_index: 1,
        starting_snapshot_id: "snapshot1",
        replay_folder_id: "folder1",
        folder_id: "folder1",
        folder_title: "Marketing Demos",
        owner_display_name: "john.doe",
        owner_first_name: "John",
        owner_last_name: "Doe",
        snapshot_count: 12,
        only_edit4: false,
        screenshot_small: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        custom_links: {
            link1: {
                title: "Product Overview",
                url: "https://demo.example.com/legacy1/overview",
                description: "Main product overview page",
                is_active: true
            },
            link2: {
                title: "Pricing",
                url: "https://demo.example.com/legacy1/pricing",
                description: "Pricing information",
                is_active: true
            }
        }
    },
    {
        id: "legacy2",
        api_version: 3,
        title: "Legacy Sales Demo",
        last_modified_at: "2024-01-19T10:20:00Z",
        created_at: "2024-01-12T14:00:00Z",
        properties: JSON.stringify({ legacy: true }),
        replay_type: "LEGACY",
        acl: null,
        created_by: "user2",
        replay_folder_index: 2,
        starting_snapshot_id: "snapshot2",
        replay_folder_id: "folder2",
        folder_id: "folder2",
        folder_title: "Sales Demos",
        owner_display_name: "jane.smith",
        owner_first_name: "Jane",
        owner_last_name: "Smith",
        snapshot_count: 8,
        only_edit4: false,
        screenshot_small: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        custom_links: {
            link1: {
                title: "Sales Process",
                url: "https://demo.example.com/legacy2/sales",
                description: "Sales process walkthrough",
                is_active: true
            }
        }
    }
];

// Live demos - exact structure from merged_replay_list live_replays
export const liveDemos = [
    {
        id: "live1",
        title: "Live Interactive Demo",
        created_at: "2024-01-17T11:00:00Z",
        last_modified_at: "2024-01-22T09:30:00Z",
        acl: null,
        folder_id: "folder1",
        folder_title: "Marketing Demos",
        owner_first_name: "John",
        owner_last_name: "Doe",
        default_url: "https://demo.example.com/live1",
        active_link_count: 3,
        last_session_at: "2024-01-22T08:45:00Z",
        screenshot_small: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    },
    {
        id: "live2",
        title: "Live Sales Demo",
        created_at: "2024-01-18T15:00:00Z",
        last_modified_at: "2024-01-23T12:15:00Z",
        acl: null,
        folder_id: "folder2",
        folder_title: "Sales Demos",
        owner_first_name: "Jane",
        owner_last_name: "Smith",
        default_url: "https://demo.example.com/live2",
        active_link_count: 5,
        last_session_at: "2024-01-23T11:30:00Z",
        screenshot_small: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    }
];

// Folders - exact structure from real backend folders_helper.py
export const folders = [
    {
        id: "folder1",
        title: "Marketing Demos",
        parent_id: null,
        sort_index: 1,
        archived: false,
        acl: null,
        ac_replay_count: 5, // Maestro demos count
        sc_replay_count: 3, // Legacy demos count
        created_by: "user1"
    },
    {
        id: "folder2",
        title: "Sales Demos",
        parent_id: null,
        sort_index: 2,
        archived: false,
        acl: null,
        ac_replay_count: 8,
        sc_replay_count: 2,
        created_by: "user1"
    },
    {
        id: "folder3",
        title: "Training",
        parent_id: null,
        sort_index: 3,
        archived: false,
        acl: null,
        ac_replay_count: 12,
        sc_replay_count: 6,
        created_by: "user2"
    },
    {
        id: "folder4",
        title: "Product Demos",
        parent_id: null,
        sort_index: 4,
        archived: false,
        acl: null,
        ac_replay_count: 7,
        sc_replay_count: 4,
        created_by: "user1"
    },
    {
        id: "folder5",
        title: "Q1 Campaigns",
        parent_id: "folder1",
        sort_index: 1,
        archived: false,
        acl: null,
        ac_replay_count: 2,
        sc_replay_count: 1,
        created_by: "user1"
    },
    {
        id: "folder6",
        title: "Q2 Campaigns",
        parent_id: "folder1",
        sort_index: 2,
        archived: false,
        acl: null,
        ac_replay_count: 3,
        sc_replay_count: 2,
        created_by: "user1"
    },
    {
        id: "folder7",
        title: "Enterprise Sales",
        parent_id: "folder2",
        sort_index: 1,
        archived: false,
        acl: null,
        ac_replay_count: 4,
        sc_replay_count: 1,
        created_by: "user2"
    },
    {
        id: "folder8",
        title: "SMB Sales",
        parent_id: "folder2",
        sort_index: 2,
        archived: false,
        acl: null,
        ac_replay_count: 4,
        sc_replay_count: 1,
        created_by: "user2"
    },
    {
        id: "folder9",
        title: "Onboarding",
        parent_id: "folder3",
        sort_index: 1,
        archived: false,
        acl: null,
        ac_replay_count: 6,
        sc_replay_count: 3,
        created_by: "user1"
    },
    {
        id: "folder10",
        title: "Advanced Features",
        parent_id: "folder3",
        sort_index: 2,
        archived: false,
        acl: null,
        ac_replay_count: 6,
        sc_replay_count: 3,
        created_by: "user1"
    }
];

// Mock API Response Functions - Exact structure from real backend
export const mockApiResponses = {
    // GET /r/replay_list/ - Maestro demos
    getMaestroReplays: () => ({
        success: true,
        replays: maestroDemos
    }),

    // GET /r/merged_replay_list/ - Legacy + Live demos
    getMergedReplayList: () => ({
        replays: legacyDemos,
        live_replays: liveDemos
    }),

    // GET /r/published_live_demo_list/ - Published live demos
    getPublishedLiveDemoList: () => {
        const publishedLiveDemos = liveDemos.map(demo => ({
            ...demo,
            replay_id: demo.id,
            is_pending: false,
            properties: JSON.stringify({ live: true }),
            screenshot_small: demo.screenshot_small || "",
            replay_folder_index: 1,
            replay_title: demo.title,
            created_by: "user1",
            created_by_username: "john.doe",
            created_by_first_name: "John",
            created_by_last_name: "Doe",
            replay_created_by_id: "user1",
            folder_acl: null
        }));

        return {
            published_live_demos: publishedLiveDemos
        };
    },

    // GET /r/default_url/{id}/ - Demo URLs
    getDefaultUrl: (demoId: string) => {
        // Find demo and return its URL
        const allDemos = [...legacyDemos, ...liveDemos];
        const demo = allDemos.find(d => d.id === demoId);

        return {
            default_url: demo?.default_url || `https://demo.example.com/${demoId}`
        };
    },

    // GET /r/folder_list/ - Folder structure
    getFolderList: () => ({
        folders: folders,
        apps: [] // Optional field from real backend
    }),

    // GET /r/all_folders_list/ - Comprehensive folder list
    getAllFoldersList: () => {
        const allFolders = [];

        // Add Maestro folders (ReplayFolder)
        folders.forEach(folder => {
            allFolders.push({
                ...folder,
                type: 'maestro',
                demo_count: folder.ac_replay_count
            });
        });

        // Add Legacy demo folders (PublishedReplayFolder)
        folders.forEach(folder => {
            allFolders.push({
                ...folder,
                type: 'legacy',
                demo_count: folder.sc_replay_count
            });
        });

        // Add Live demo folders (PublishedReplayFolder for live demos)
        folders.forEach(folder => {
            allFolders.push({
                ...folder,
                type: 'live',
                demo_count: folder.ac_replay_count // Live demos use same count
            });
        });

        return {
            folders: allFolders,
            total_count: allFolders.length
        };
    }
};
