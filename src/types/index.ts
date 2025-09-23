/**
 * Core Types - Lean and mean for proof of concept
 * Only published demos, no status complexity
 */

export interface Demo {
    id: string;
    name: string;
    productType: 'replicate' | 'replay' | 'reveal';
    description: string;
    lastModified: string;
    createdBy: string;
    views: number;
    starred: boolean;
    tags: string[];
}

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
