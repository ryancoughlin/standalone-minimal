/**
 * Core Types - Lean and mean for proof of concept
 * Only published demos, no status complexity
 */

export interface Demo {
    id: string;
    title: string;
    productType: 'replicate' | 'replay' | 'reveal';
    description: string;
    lastModified: string;
    createdBy: string;
    views: number;
    starred: boolean;
    tags: string[];
    folder_id: string;
    folder_title: string;
    isRecent: boolean;
    isShared: boolean;
    screenshot_small: string;
}

export interface Folder {
    id: string;
    title: string;
    parent_id: string | null;
    demo_count: number;
}
