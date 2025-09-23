/**
 * Demo Data - Clean primitives for demo organization
 * Organized by product types with clear naming conventions
 */

import { cleanDemos } from './mockData-clean';

// Product Type Primitives
export const PRODUCT_TYPES = {
    MAESTRO: 'maestro',    // reveal -> maestro (AI-powered demos)
    LEGACY: 'legacy',      // replay -> legacy (traditional recordings)  
    LIVE: 'live'          // replicate -> live (real-time demos)
} as const;

// Folder Primitives
export const FOLDER_IDS = {
    MARKETING: 'marketing',
    SALES: 'sales',
    TRAINING: 'training',
    PRODUCT: 'product'
} as const;

// Demo Assignment Logic
function assignDemoToFolder(demo: any): string {
    const name = demo.name.toLowerCase();
    const tags = (demo.tags || []).map((tag: string) => tag.toLowerCase());

    // Sales demos (SKO, sales-focused)
    if (name.includes('sko') || tags.includes('sko') || tags.includes('sales enablement')) {
        return FOLDER_IDS.SALES;
    }

    // Marketing demos (showcases, customer success)
    if (name.includes('showcase') || name.includes('marketing') ||
        tags.includes('marketing') || tags.includes('customer success')) {
        return FOLDER_IDS.MARKETING;
    }

    // Training demos (educational content)
    if (name.includes('training') || name.includes('onboarding') ||
        tags.includes('training') || tags.includes('education')) {
        return FOLDER_IDS.TRAINING;
    }

    // Product demos (technical, developer-focused)
    return FOLDER_IDS.PRODUCT;
}

// Transform clean demo data to our demo primitives
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
            tags: demo.tags || [],
            share_with_all: false,
            share_as_play_only: true,
            description: demo.description,
            created_by: demo.createdBy,
            views: demo.views || 0,
            starred: demo.starred || false
        }),
        created_by_id: demo.createdBy,
        created_by_username: demo.createdBy.toLowerCase().replace(' ', '.'),
        poster_image: "",
        is_playing: false,
        is_editing: false,
        play_count: demo.views || 0,
        transformations: [],
        resources: [],
        interception_rules: [],
        data_sets: []
    }));

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
            views: demo.views || 0,
            starred: demo.starred || false,
            tags: demo.tags || []
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

// Folder Primitives
export const folders = [
    {
        id: FOLDER_IDS.MARKETING,
        title: "Marketing Demos",
        parent_id: null,
        sort_index: 1,
        archived: false,
        acl: null,
        ac_replay_count: maestroDemos.filter(d => assignDemoToFolder({ name: d.title }) === FOLDER_IDS.MARKETING).length,
        sc_replay_count: legacyDemos.filter(d => assignDemoToFolder({ name: d.title }) === FOLDER_IDS.MARKETING).length,
        created_by: "user1"
    },
    {
        id: FOLDER_IDS.SALES,
        title: "Sales Demos",
        parent_id: null,
        sort_index: 2,
        archived: false,
        acl: null,
        ac_replay_count: maestroDemos.filter(d => assignDemoToFolder({ name: d.title }) === FOLDER_IDS.SALES).length,
        sc_replay_count: legacyDemos.filter(d => assignDemoToFolder({ name: d.title }) === FOLDER_IDS.SALES).length,
        created_by: "user1"
    },
    {
        id: FOLDER_IDS.TRAINING,
        title: "Training",
        parent_id: null,
        sort_index: 3,
        archived: false,
        acl: null,
        ac_replay_count: maestroDemos.filter(d => assignDemoToFolder({ name: d.title }) === FOLDER_IDS.TRAINING).length,
        sc_replay_count: legacyDemos.filter(d => assignDemoToFolder({ name: d.title }) === FOLDER_IDS.TRAINING).length,
        created_by: "user2"
    },
    {
        id: FOLDER_IDS.PRODUCT,
        title: "Product Demos",
        parent_id: null,
        sort_index: 4,
        archived: false,
        acl: null,
        ac_replay_count: maestroDemos.filter(d => assignDemoToFolder({ name: d.title }) === FOLDER_IDS.PRODUCT).length,
        sc_replay_count: legacyDemos.filter(d => assignDemoToFolder({ name: d.title }) === FOLDER_IDS.PRODUCT).length,
        created_by: "user1"
    }
];

// Helper Functions
function getFolderTitle(folderId: string): string {
    const folderTitles: Record<string, string> = {
        [FOLDER_IDS.MARKETING]: 'Marketing Demos',
        [FOLDER_IDS.SALES]: 'Sales Demos',
        [FOLDER_IDS.TRAINING]: 'Training',
        [FOLDER_IDS.PRODUCT]: 'Product Demos'
    };
    return folderTitles[folderId] || 'Product Demos';
}

// API Response Primitives
export const apiResponses = {
    getMaestroReplays: () => ({
        success: true,
        replays: maestroDemos
    }),

    getMergedReplayList: () => ({
        replays: legacyDemos,
        live_replays: liveDemos
    }),

    getFolderList: () => ({
        folders: folders,
        apps: []
    })
};
