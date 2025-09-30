# 🎯 **Unified Content Design System**

## **Overview**

This document outlines the comprehensive content design and interaction system for the demo launcher, inspired by Google Drive and Dropbox patterns. The system provides consistent, familiar interfaces across all demo display contexts.

## **🎨 Design Principles**

### **1. Consistency**

- Same row template used everywhere
- Consistent metadata display patterns
- Unified action buttons and hover states
- Standardized empty states and loading patterns

### **2. Progressive Disclosure**

- Hover reveals secondary actions
- Click reveals detailed information
- Expandable metadata for detailed views
- Contextual information based on page type

### **3. Familiar Patterns**

- Google Drive/Dropbox mental models
- Standard file browser interactions
- Expected filter and sort behaviors
- Common navigation patterns

### **4. Compact Clarity**

- 2-line rows with essential information
- Expandable for additional details
- Clear visual hierarchy
- Efficient use of space

## **📋 Component Architecture**

### **Core Components**

#### **StandardDemoRow**

The foundational component for displaying demos consistently across all pages.

**Features:**

- Product type badges (Replicate, Replay, Reveal)
- Thumbnail with fallback states
- Starred indicators
- Metadata display (folder, date, views, creator)
- Hover-revealed action buttons
- Compact and detailed variants

**Usage:**

```vue
<StandardDemoRow
  :demo="demo"
  variant="compact"
  :delay="index * 30"
  :is-selected="selectedDemoId === demo.id"
  :folders-with-counts="foldersWithCounts"
  @view-detail="handleViewDetail"
  @play-demo="handlePlayDemo"
/>
```

#### **DemoFilters**

Comprehensive filtering system for all demo pages.

**Features:**

- View toggle (List/Grid)
- Sort options (Last Modified, Name, Views, Type)
- Type filters (Replicate, Replay, Reveal)
- Status filters (Recent, Shared, Starred)
- Active filter display with removal
- Results count

**Usage:**

```vue
<DemoFilters
  :current-view="currentView"
  :current-sort="currentSort"
  :active-type-filters="activeTypeFilters"
  :active-status-filters="activeStatusFilters"
  :filtered-count="filteredCount"
  :total-count="totalCount"
  @change-view="handleViewChange"
  @change-sort="handleSortChange"
/>
```

#### **PageTemplate**

Base template providing consistent layout for all demo pages.

**Features:**

- Page header with title and actions
- Integrated filter system
- Loading and empty states
- List and grid view support
- Consistent spacing and layout

**Usage:**

```vue
<PageTemplate
  page-title="Recent Demos"
  page-description="Demos you've accessed recently"
  :demos="demos"
  :loading="loading"
  :is-empty="isEmpty"
  @view-detail="handleViewDetail"
/>
```

### **Page Components**

#### **HomePage**

Welcome screen with personalized content and quick access.

**Features:**

- Personalized greeting
- Quick stats (Recent, Shared, Starred, Total)
- Recent activity feed
- Quick action buttons
- Detailed row variant for better context

#### **RecentPage**

Recently accessed demos with usage insights.

**Features:**

- Recent demos list
- Usage insights (Most Used, Last Accessed, This Week)
- Clear recent history option
- Compact row variant for efficiency

#### **SharedPage**

Demos shared by team members with collaboration insights.

**Features:**

- Shared demos list
- Top sharers ranking
- Recent shares activity
- Permission management
- Detailed row variant for context

#### **FolderPage**

Folder-specific demos with organization features.

**Features:**

- Folder demos list
- Folder statistics (Total Demos, Views, Last Updated, Collaborators)
- Subfolder display
- Folder management actions
- Compact row variant for efficiency

## **🔄 Interaction Patterns**

### **Row Interactions**

#### **Hover States**

- Subtle scale animation (1.01x)
- Background color change
- Secondary actions appear
- Smooth transitions (150ms)

#### **Click Actions**

- Primary: View demo details
- Secondary: Play/Launch demo
- Tertiary: Customize, Copy Link, Manage Links

#### **Selection States**

- Visual selection indicator
- Contextual actions
- Multi-select support (future)

### **Filter Interactions**

#### **View Toggle**

- List view: Compact rows with essential info
- Grid view: Card layout with thumbnails
- Smooth transitions between views

#### **Sort Options**

- Last Modified (default)
- Name A-Z
- Most Viewed
- Date Created
- Demo Type

#### **Filter Types**

- **Type Filters**: Replicate, Replay, Reveal
- **Status Filters**: Recent, Shared, Starred
- **Active Filter Display**: Tags with removal buttons

## **📱 Responsive Design**

### **Breakpoints**

- **Mobile**: Single column, compact rows
- **Tablet**: Two-column grid, standard rows
- **Desktop**: Multi-column grid, detailed rows

### **Adaptive Layout**

- Filters collapse on smaller screens
- Actions move to overflow menus
- Metadata adjusts based on available space

## **🎭 Empty States**

### **Empty State Types**

#### **No Demos**

- Icon: Rocket (encouraging)
- Title: "Welcome to your demo library"
- Description: "Create your first demo to get started with Reprise."
- Action: "Create Demo"

#### **No Recent Demos**

- Icon: Clock
- Title: "No recent demos"
- Description: "Demos you access will appear here for quick reference."
- Action: "Browse All Demos"

#### **No Shared Demos**

- Icon: Users
- Title: "No shared demos"
- Description: "Demos shared with you by teammates will appear here."
- Action: "Browse All Demos"

#### **Empty Folder**

- Icon: Folder Open
- Title: "This folder is empty"
- Description: "Add demos to this folder to organize your content."
- Action: "Add Demo to Folder"

## **⚡ Performance Considerations**

### **Optimization Strategies**

- Lazy loading for large lists
- Virtual scrolling for performance
- Image optimization and fallbacks
- Efficient re-rendering with proper keys

### **Loading States**

- Skeleton screens for content
- Progressive loading
- Smooth transitions
- Error boundaries

## **🔧 Implementation Guide**

### **Getting Started**

1. **Import Components**

```typescript
import {
  StandardDemoRow,
  DemoFilters,
  PageTemplate,
  HomePage,
  RecentPage,
  SharedPage,
  FolderPage,
} from "@/components/demo-cards";
```

2. **Set Up State Management**

```typescript
const currentView = ref<"list" | "grid">("list");
const currentSort = ref("lastModified");
const activeTypeFilters = ref<string[]>([]);
const activeStatusFilters = ref<string[]>([]);
```

3. **Implement Event Handlers**

```typescript
const handleViewChange = (view: "list" | "grid") => {
  currentView.value = view;
};

const handleSortChange = (sort: string) => {
  currentSort.value = sort;
};
```

### **Customization**

#### **Row Variants**

- `compact`: Essential info only
- `detailed`: Full metadata and tags

#### **Page Types**

- `home`: Welcome screen with stats
- `recent`: Recent demos with insights
- `shared`: Shared demos with collaboration
- `folder`: Folder-specific with organization

#### **Filter Options**

- Customize available sort options
- Add new filter types
- Modify filter UI layout

## **🚀 Future Enhancements**

### **Planned Features**

- Multi-select operations
- Bulk actions (move, delete, share)
- Advanced search with filters
- Custom view preferences
- Drag and drop organization
- Keyboard shortcuts
- Accessibility improvements

### **Integration Points**

- Demo creation workflow
- Sharing and collaboration
- Analytics and insights
- Customization engine
- Link management system

## **📊 Success Metrics**

### **User Experience**

- Time to find demos
- Click-through rates
- User satisfaction scores
- Task completion rates

### **Performance**

- Page load times
- Interaction responsiveness
- Memory usage
- Error rates

---

This content design system provides a solid foundation for building intuitive, efficient demo management interfaces that users will find familiar and powerful.
