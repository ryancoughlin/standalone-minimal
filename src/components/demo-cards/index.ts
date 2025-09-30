/**
 * Demo Cards Components - Unified Content Design System
 * 
 * This module provides a comprehensive set of components for displaying demos
 * in a Google Drive/Dropbox-inspired interface. All components follow consistent
 * design patterns and interaction models.
 */

// Core Components
export { default as DemoRow } from './DemoRow.vue';
export { default as DemoFilters } from './DemoFilters.vue';
export { default as PageTemplate } from './PageTemplate.vue';

// Page Components
export { default as HomePage } from './HomePage.vue';
export { default as RecentPage } from './RecentPage.vue';
export { default as SharedPage } from './SharedPage.vue';
export { default as FolderPage } from './FolderPage.vue';

/**
 * Component Usage Guide:
 * 
 * 1. DemoRow - Use for consistent demo display across all pages
 *    - Single consistent design for all contexts
 *    - Includes hover states, actions, and metadata
 *    - Handles different demo types (replicate, replay, reveal)
 * 
 * 2. DemoFilters - Comprehensive filtering system
 *    - View toggle (list/grid)
 *    - Sort options (date, name, views, type)
 *    - Type filters (replicate, replay, reveal)
 *    - Status filters (recent, shared, starred)
 * 
 * 3. PageTemplate - Base template for all demo pages
 *    - Consistent header, filters, and content layout
 *    - Loading and empty states
 *    - List and grid view support
 * 
 * 4. Page Components - Specialized pages for different sections
 *    - HomePage: Welcome screen with stats and recent activity
 *    - RecentPage: Recently accessed demos with insights
 *    - SharedPage: Shared demos with collaboration insights
 *    - FolderPage: Folder-specific demos with subfolder support
 * 
 * Design Principles:
 * - Consistency: Same row template everywhere
 * - Progressive Disclosure: Hover reveals actions, click reveals details
 * - Familiar Patterns: Google Drive/Dropbox mental models
 * - Compact Clarity: 2-line rows with essential info, expandable for more
 */
