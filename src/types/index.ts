/**
 * Core Types - Lean and mean for proof of concept
 * Only published demos, no status complexity
 */

export interface DemoVariable {
    id: string;
    name: string;
    type: 'text' | 'image' | 'date';
    defaultValue: string;
}

export interface DemoDataset {
    id: string;
    name: string;
    fieldCount: number;
}

export interface Demo {
    id: string;
    title: string;
    productType: 'overlay' | 'html_environment' | 'cloned_environment';
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
    dataset?: DemoDataset;
    productionUrl?: string; // Only for overlay type
    textEditCount?: number;   // Number of text customizations
    imageEditCount?: number;  // Number of image replacements
    linkCount?: number;       // Number of configured links
    variables?: DemoVariable[];
}

export interface Folder {
    id: string;
    title: string;
    parent_id: string | null;
    demo_count: number;
}
