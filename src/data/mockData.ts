/**
 * Mock Data - Exact replica of real backend data structures
 * Extracted from Python mock services to use as static data
 */

// Clean demo data from mockData-clean.ts
import { cleanDemos } from './mockData-clean';

// Helper functions for demo assignment
function assignDemoToFolder(demo: any): string {
    const name = demo.name.toLowerCase();
    const tags = (demo.tags || []).map((tag: string) => tag.toLowerCase());

    // Sales demos (SKO, sales-focused)
    if (name.includes('sko') || tags.includes('sko') || tags.includes('sales enablement') || tags.includes('sales')) {
        return 'folder2'; // Sales Demos
    }

    // Marketing demos (showcases, customer success)
    if (name.includes('showcase') || name.includes('marketing') ||
        tags.includes('marketing') || tags.includes('customer success') || tags.includes('product launch')) {
        return 'folder1'; // Marketing Demos
    }

    // Training demos (educational content)
    if (name.includes('training') || name.includes('onboarding') || name.includes('workshop') ||
        tags.includes('training') || tags.includes('education') || tags.includes('onboarding')) {
        return 'folder3'; // Training
    }

    // Product demos (technical, developer-focused)
    return 'folder4'; // Product Demos
}

function getFolderTitle(folderId: string): string {
    const folderTitles: Record<string, string> = {
        'folder1': 'Marketing Demos',
        'folder2': 'Sales Demos',
        'folder3': 'Training',
        'folder4': 'Product Demos',
        'folder5': 'Q1 Campaigns',
        'folder6': 'Q2 Campaigns',
        'folder7': 'Enterprise Sales',
        'folder8': 'SMB Sales',
        'folder9': 'Onboarding',
        'folder10': 'Advanced Features'
    };
    return folderTitles[folderId] || 'Product Demos';
}

// Transform clean demos to maestro format (reveal product type)
export const maestroDemos = cleanDemos
    .filter(demo => demo.productType === 'reveal')
    .map(demo => ({
        id: demo.id,
        title: demo.name,
        created_at: new Date(demo.lastModified).toISOString(),
        last_modified_at: new Date(demo.lastModified).toISOString(),
        replay_folder_id: assignDemoToFolder(demo),
        properties: JSON.stringify({
            replay_id: demo.id,
            replay_title: demo.name,
            tags: demo.tags,
            share_with_all: false,
            share_as_play_only: true,
            description: demo.description,
            created_by: demo.createdBy,
            views: demo.views,
            starred: demo.starred
        }),
        created_by_id: demo.createdBy,
        created_by_username: demo.createdBy.toLowerCase().replace(' ', '.'),
        poster_image: "",
        is_playing: false,
        is_editing: false,
        play_count: demo.views,
        transformations: [],
        resources: [],
        interception_rules: [],
        data_sets: []
    }));

// Transform clean demos to legacy format (replay product type)
export const legacyDemos = cleanDemos
    .filter(demo => demo.productType === 'replay')
    .map(demo => ({
        id: demo.id,
        api_version: 3,
        title: demo.name,
        last_modified_at: new Date(demo.lastModified).toISOString(),
        created_at: new Date(demo.lastModified).toISOString(),
        properties: JSON.stringify({
            legacy: true,
            description: demo.description,
            created_by: demo.createdBy,
            views: demo.views,
            starred: demo.starred,
            tags: demo.tags
        }),
        replay_type: "LEGACY",
        acl: null,
        created_by: demo.createdBy,
        replay_folder_index: 1,
        starting_snapshot_id: `snapshot_${demo.id}`,
        replay_folder_id: assignDemoToFolder(demo),
        folder_id: assignDemoToFolder(demo),
        folder_title: getFolderTitle(assignDemoToFolder(demo)),
        owner_display_name: demo.createdBy,
        owner_first_name: demo.createdBy.split(' ')[0],
        owner_last_name: demo.createdBy.split(' ')[1] || '',
        snapshot_count: Math.floor(Math.random() * 20) + 5,
        only_edit4: false,
        screenshot_small: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        custom_links: {
            link1: {
                title: "Demo Overview",
                url: `https://demo.example.com/${demo.id}/overview`,
                description: "Main demo overview page",
                is_active: true
            }
        }
    }));

// Transform clean demos to live format (replicate product type)
export const liveDemos = cleanDemos
    .filter(demo => demo.productType === 'replicate')
    .map(demo => ({
        id: demo.id,
        title: demo.name,
        created_at: new Date(demo.lastModified).toISOString(),
        last_modified_at: new Date(demo.lastModified).toISOString(),
        acl: null,
        folder_id: assignDemoToFolder(demo),
        folder_title: getFolderTitle(assignDemoToFolder(demo)),
        owner_first_name: demo.createdBy.split(' ')[0],
        owner_last_name: demo.createdBy.split(' ')[1] || '',
        default_url: `https://demo.example.com/${demo.id}`,
        active_link_count: Math.floor(Math.random() * 10) + 1,
        last_session_at: new Date(demo.lastModified).toISOString(),
        screenshot_small: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    }));

// Calculate dynamic demo counts for folders
function calculateFolderCounts() {
    const counts: Record<string, { maestro: number; legacy: number; live: number }> = {};

    // Initialize counts
    ['folder1', 'folder2', 'folder3', 'folder4', 'folder5', 'folder6', 'folder7', 'folder8', 'folder9', 'folder10'].forEach(id => {
        counts[id] = { maestro: 0, legacy: 0, live: 0 };
    });

    // Count maestro demos
    maestroDemos.forEach(demo => {
        if (counts[demo.replay_folder_id]) {
            counts[demo.replay_folder_id].maestro++;
        }
    });

    // Count legacy demos
    legacyDemos.forEach(demo => {
        if (counts[demo.folder_id]) {
            counts[demo.folder_id].legacy++;
        }
    });

    // Count live demos
    liveDemos.forEach(demo => {
        if (counts[demo.folder_id]) {
            counts[demo.folder_id].live++;
        }
    });

    return counts;
}

// Folders with dynamic counts based on actual demo assignments
export const folders = [
    {
        id: "folder1",
        title: "Marketing Demos",
        parent_id: null,
        sort_index: 1,
        archived: false,
        acl: null,
        ac_replay_count: 0, // Will be calculated dynamically
        sc_replay_count: 0, // Will be calculated dynamically
        created_by: "user1"
    },
    {
        id: "folder2",
        title: "Sales Demos",
        parent_id: null,
        sort_index: 2,
        archived: false,
        acl: null,
        ac_replay_count: 0,
        sc_replay_count: 0,
        created_by: "user1"
    },
    {
        id: "folder3",
        title: "Training",
        parent_id: null,
        sort_index: 3,
        archived: false,
        acl: null,
        ac_replay_count: 0,
        sc_replay_count: 0,
        created_by: "user2"
    },
    {
        id: "folder4",
        title: "Product Demos",
        parent_id: null,
        sort_index: 4,
        archived: false,
        acl: null,
        ac_replay_count: 0,
        sc_replay_count: 0,
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
