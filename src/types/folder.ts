/**
 * Folder and Demo Organization Types
 * Unified types for folder-based demo launcher
 */

export interface Folder {
    id: string;
    title: string;
    parent_id: string | null;
    sort_index: number;
    archived: boolean;
    acl: FolderACL | null;
    ac_replay_count: number; // Maestro demos count
    sc_replay_count: number; // Legacy demos count
    live_replay_count: number; // Live demos count
    created_by: string;
    created_at: string;
    last_modified_at: string;
    description?: string;
    color?: string; // Folder color for visual organization
    icon?: string; // Custom folder icon
    is_starred?: boolean; // Starred folders for quick access
    is_shared?: boolean; // Shared folders
    permissions?: FolderPermissions;
}

export interface FolderACL {
    read: string[];
    write: string[];
    admin: string[];
}

export interface FolderPermissions {
    can_read: boolean;
    can_write: boolean;
    can_admin: boolean;
    can_share: boolean;
}

export interface FolderPath {
    id: string;
    title: string;
    level: number;
}

export interface FolderView {
    id: string;
    title: string;
    type: 'grid' | 'list';
    sort_by: 'name' | 'date_created' | 'date_modified' | 'size';
    sort_order: 'asc' | 'desc';
    filter_by_type?: DemoType[];
    filter_by_status?: DemoStatus[];
}

export interface DemoType {
    type: 'maestro' | 'legacy' | 'live';
    label: string;
    color: string;
    icon: string;
}

export interface DemoStatus {
    status: 'active' | 'archived' | 'draft' | 'published';
    label: string;
    color: string;
}

export interface FolderAction {
    id: string;
    label: string;
    icon: string;
    action: string;
    requires_selection?: boolean;
    requires_permission?: keyof FolderPermissions;
}

export interface FolderContext {
    current_folder: Folder | null;
    breadcrumbs: FolderPath[];
    view_mode: 'grid' | 'list';
    sort_by: string;
    sort_order: 'asc' | 'desc';
    selected_items: string[];
    search_query: string;
    filters: {
        demo_types: DemoType[];
        statuses: DemoStatus[];
        date_range?: {
            start: string;
            end: string;
        };
    };
}

export interface FolderStats {
    total_folders: number;
    total_demos: number;
    demos_by_type: {
        maestro: number;
        legacy: number;
        live: number;
    };
    recent_activity: {
        folder_id: string;
        folder_title: string;
        action: string;
        timestamp: string;
    }[];
}

export interface FolderTemplate {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    default_structure: {
        folders: Partial<Folder>[];
        demos: Partial<any>[];
    };
    use_cases: string[];
}
