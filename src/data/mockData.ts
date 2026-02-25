/**
 * Simplified Mock Data - Single Source of Truth
 * Clean, simple demo data for the prototype
 */

import { Demo } from '../types/index';

// Single unified demo array - our source of truth
export const demos: Demo[] = [
    {
        id: '1',
        title: 'Enterprise Cloud Integration',
        description: 'Complete walkthrough of enterprise cloud integration features',
        lastModified: '2024-03-20',
        createdBy: 'Ryan Howard',
        views: 150,
        starred: false,
        tags: ["Enterprise", "Cloud", "API Integration"],
        folder_id: 'folder1',
        folder_title: 'Marketing Demos',
        productType: 'overlay',
        isRecent: true,
        isShared: false,
        screenshot_small: '/src/images/poster1.png',
        dataset: { id: 'ds1', name: 'Acme Corp Q4', fieldCount: 12 },
        productionUrl: 'app.acmecorp.com/dashboard',
        textEditCount: 4,
        imageEditCount: 2,
        linkCount: 3
    },
    {
        id: '2',
        title: 'TPSM App Dev SKO2025',
        description: 'Developer-focused demonstration showcasing rapid application development',
        lastModified: '2024-03-19',
        createdBy: 'Jim Halpert',
        views: 120,
        starred: true,
        tags: ["Developer", "SKO", "Technical"],
        folder_id: 'folder2',
        folder_title: 'Sales Demos',
        productType: 'html_environment',
        isRecent: true,
        isShared: true,
        screenshot_small: '/src/images/poster2.png',
        dataset: { id: 'ds2', name: 'TechStart Series B', fieldCount: 8 }
    },
    {
        id: '3',
        title: 'AI/BI Dashboard Demo',
        description: 'Comprehensive AI and business intelligence dashboard walkthrough',
        lastModified: '2024-03-18',
        createdBy: 'Pam Beesly',
        views: 95,
        starred: false,
        tags: ["AI", "BI", "Dashboard"],
        folder_id: 'folder3',
        folder_title: 'Training',
        productType: 'cloned_environment',
        isRecent: true,
        isShared: true,
        screenshot_small: '/src/images/poster3.png',
        dataset: { id: 'ds3', name: 'DataViz Enterprise', fieldCount: 15 }
    },
    {
        id: '4',
        title: 'Q4 Product Launch',
        description: 'Product launch demonstration for Q4 initiatives',
        lastModified: '2024-03-17',
        createdBy: 'Michael Scott',
        views: 200,
        starred: true,
        tags: ["Product", "Launch", "Q4"],
        folder_id: 'folder4',
        folder_title: 'Product Demos',
        productType: 'overlay',
        isRecent: false,
        isShared: true,
        screenshot_small: '/src/images/poster4.png',
        dataset: { id: 'ds4', name: 'Global Launch Kit', fieldCount: 20 },
        productionUrl: 'app.globalcorp.io/products',
        textEditCount: 6,
        imageEditCount: 3,
        linkCount: 5
    },
    {
        id: '5',
        title: 'Enterprise Security Suite',
        description: 'Enterprise-grade security features and compliance demonstration',
        lastModified: '2024-03-16',
        createdBy: 'Dwight Schrute',
        views: 85,
        starred: false,
        tags: ["Security", "Enterprise", "Compliance"],
        folder_id: 'folder5',
        folder_title: 'Q1 Campaigns',
        productType: 'html_environment',
        isRecent: false,
        isShared: true,
        screenshot_small: '/src/images/poster1.png',
        dataset: { id: 'ds5', name: 'SecureNet Demo', fieldCount: 6 }
    },
    {
        id: '6',
        title: 'Customer Onboarding Flow',
        description: 'Complete customer onboarding process demonstration',
        lastModified: '2024-03-15',
        createdBy: 'Angela Martin',
        views: 110,
        starred: true,
        tags: ["Onboarding", "Customer", "Process"],
        folder_id: 'folder6',
        folder_title: 'Q2 Campaigns',
        productType: 'cloned_environment',
        isRecent: true,
        isShared: false,
        screenshot_small: '/src/images/poster2.png'
        // Intentionally no dataset — tests optional state
    },
    {
        id: '7',
        title: 'Data Analytics Platform',
        description: 'Advanced data analytics and reporting platform demo',
        lastModified: '2024-03-14',
        createdBy: 'Kevin Malone',
        views: 75,
        starred: false,
        tags: ["Analytics", "Data", "Reporting"],
        folder_id: 'folder7',
        folder_title: 'Enterprise Sales',
        productType: 'overlay',
        isRecent: false,
        isShared: false,
        screenshot_small: '/src/images/poster3.png',
        dataset: { id: 'ds7', name: 'AnalyticsPro Suite', fieldCount: 18 },
        productionUrl: 'analytics.bigdata.com/reports',
        textEditCount: 3,
        imageEditCount: 1,
        linkCount: 2
    },
    {
        id: '8',
        title: 'Mobile App Integration',
        description: 'Mobile application integration and API demonstration',
        lastModified: '2024-03-13',
        createdBy: 'Oscar Martinez',
        views: 90,
        starred: true,
        tags: ["Mobile", "API", "Integration"],
        folder_id: 'folder8',
        folder_title: 'SMB Sales',
        productType: 'html_environment',
        isRecent: true,
        isShared: true,
        screenshot_small: '/src/images/poster4.png',
        dataset: { id: 'ds8', name: 'MobileFirst Pack', fieldCount: 10 }
    },
    {
        id: '9',
        title: 'Workflow Automation',
        description: 'Business process workflow automation demonstration',
        lastModified: '2024-03-12',
        createdBy: 'Stanley Hudson',
        views: 65,
        starred: false,
        tags: ["Workflow", "Automation", "Process"],
        folder_id: 'folder9',
        folder_title: 'Technical Training',
        productType: 'cloned_environment',
        isRecent: false,
        isShared: false,
        screenshot_small: '/src/images/poster1.png',
        dataset: { id: 'ds9', name: 'AutoFlow Demo', fieldCount: 9 }
    },
    {
        id: '10',
        title: 'API Management Suite',
        description: 'Comprehensive API management and monitoring platform',
        lastModified: '2024-03-11',
        createdBy: 'Phyllis Vance',
        views: 130,
        starred: true,
        tags: ["API", "Management", "Monitoring"],
        folder_id: 'folder10',
        folder_title: 'Product Demos',
        productType: 'overlay',
        isRecent: true,
        isShared: false,
        screenshot_small: '/src/images/poster2.png',
        dataset: { id: 'ds10', name: 'API Gateway Pack', fieldCount: 14 },
        productionUrl: 'manage.apihub.dev/gateway',
        textEditCount: 5,
        imageEditCount: 4,
        linkCount: 3
    },
    {
        id: '11',
        title: 'Revenue Dashboard Walkthrough',
        description: 'Interactive revenue dashboard with drill-down analytics',
        lastModified: '2024-03-10',
        createdBy: 'Ryan Howard',
        views: 175,
        starred: false,
        tags: ["Revenue", "Dashboard", "Finance"],
        folder_id: 'folder1',
        folder_title: 'Marketing Demos',
        productType: 'overlay',
        isRecent: true,
        isShared: true,
        screenshot_small: '/src/images/poster3.png',
        dataset: { id: 'ds11', name: 'RevOps Metrics', fieldCount: 22 },
        productionUrl: 'app.revcorp.com/dashboard',
        textEditCount: 7,
        imageEditCount: 1,
        linkCount: 4
    },
    {
        id: '12',
        title: 'CRM Pipeline Overview',
        description: 'Full CRM pipeline demo with live deal tracking',
        lastModified: '2024-03-09',
        createdBy: 'Jim Halpert',
        views: 210,
        starred: true,
        tags: ["CRM", "Pipeline", "Sales"],
        folder_id: 'folder2',
        folder_title: 'Sales Demos',
        productType: 'html_environment',
        isRecent: true,
        isShared: false,
        screenshot_small: '/src/images/poster4.png',
        dataset: { id: 'ds12', name: 'SalesForce Clone', fieldCount: 16 }
    },
    {
        id: '13',
        title: 'SSO Configuration Guide',
        description: 'Step-by-step single sign-on setup and testing',
        lastModified: '2024-03-08',
        createdBy: 'Dwight Schrute',
        views: 45,
        starred: false,
        tags: ["SSO", "Security", "Admin"],
        folder_id: 'folder9',
        folder_title: 'Technical Training',
        productType: 'cloned_environment',
        isRecent: false,
        isShared: true,
        screenshot_small: '/src/images/poster1.png',
        dataset: { id: 'ds13', name: 'IdentityPro Config', fieldCount: 5 }
    },
    {
        id: '14',
        title: 'Pricing Page Personalization',
        description: 'Dynamic pricing page overlay with persona-based content swaps',
        lastModified: '2024-03-07',
        createdBy: 'Pam Beesly',
        views: 160,
        starred: false,
        tags: ["Pricing", "Personalization", "Marketing"],
        folder_id: 'folder1',
        folder_title: 'Marketing Demos',
        productType: 'overlay',
        isRecent: false,
        isShared: true,
        screenshot_small: '/src/images/poster2.png',
        dataset: { id: 'ds14', name: 'PriceTier Pack', fieldCount: 8 },
        productionUrl: 'www.saasco.com/pricing',
        textEditCount: 9,
        imageEditCount: 2,
        linkCount: 1
    },
    {
        id: '15',
        title: 'Support Ticket Triage',
        description: 'Live support portal environment with ticket routing',
        lastModified: '2024-03-06',
        createdBy: 'Angela Martin',
        views: 70,
        starred: false,
        tags: ["Support", "Helpdesk", "Triage"],
        folder_id: 'folder3',
        folder_title: 'Training',
        productType: 'html_environment',
        isRecent: true,
        isShared: false,
        screenshot_small: '/src/images/poster3.png',
        dataset: { id: 'ds15', name: 'HelpDesk Sandbox', fieldCount: 11 }
    },
    {
        id: '16',
        title: 'Compliance Audit Trail',
        description: 'Full audit-trail environment for SOC2 compliance demo',
        lastModified: '2024-03-05',
        createdBy: 'Oscar Martinez',
        views: 55,
        starred: true,
        tags: ["Compliance", "Audit", "SOC2"],
        folder_id: 'folder5',
        folder_title: 'Q1 Campaigns',
        productType: 'cloned_environment',
        isRecent: false,
        isShared: true,
        screenshot_small: '/src/images/poster4.png',
        dataset: { id: 'ds16', name: 'AuditTrail Corp', fieldCount: 7 }
    },
    {
        id: '17',
        title: 'Homepage Hero Swap',
        description: 'Quick homepage overlay swapping hero image and CTA for prospect',
        lastModified: '2024-03-04',
        createdBy: 'Michael Scott',
        views: 320,
        starred: true,
        tags: ["Homepage", "Hero", "Quick Edit"],
        folder_id: 'folder4',
        folder_title: 'Product Demos',
        productType: 'overlay',
        isRecent: true,
        isShared: true,
        screenshot_small: '/src/images/poster1.png',
        dataset: { id: 'ds17', name: 'DunderMifflin Site', fieldCount: 4 },
        productionUrl: 'www.dundermifflin.com',
        textEditCount: 2,
        imageEditCount: 1,
        linkCount: 1
    },
    {
        id: '18',
        title: 'Multi-tenant Admin Console',
        description: 'Cloned admin console showing multi-tenant configuration',
        lastModified: '2024-03-03',
        createdBy: 'Kevin Malone',
        views: 40,
        starred: false,
        tags: ["Admin", "Multi-tenant", "Config"],
        folder_id: 'folder7',
        folder_title: 'Enterprise Sales',
        productType: 'cloned_environment',
        isRecent: false,
        isShared: false,
        screenshot_small: '/src/images/poster2.png',
        dataset: { id: 'ds18', name: 'TenantOS Admin', fieldCount: 19 }
    },
    {
        id: '19',
        title: 'E-commerce Checkout Flow',
        description: 'End-to-end checkout environment with payment simulation',
        lastModified: '2024-03-02',
        createdBy: 'Stanley Hudson',
        views: 98,
        starred: false,
        tags: ["E-commerce", "Checkout", "Payments"],
        folder_id: 'folder8',
        folder_title: 'SMB Sales',
        productType: 'html_environment',
        isRecent: true,
        isShared: true,
        screenshot_small: '/src/images/poster3.png',
        dataset: { id: 'ds19', name: 'ShopifyClone Kit', fieldCount: 13 }
    },
    {
        id: '20',
        title: 'Feature Comparison Overlay',
        description: 'Side-by-side feature comparison overlay for competitive deals',
        lastModified: '2024-03-01',
        createdBy: 'Phyllis Vance',
        views: 185,
        starred: false,
        tags: ["Comparison", "Competitive", "Features"],
        folder_id: 'folder4',
        folder_title: 'Product Demos',
        productType: 'overlay',
        isRecent: false,
        isShared: false,
        screenshot_small: '/src/images/poster4.png',
        dataset: { id: 'ds20', name: 'CompeteIQ Data', fieldCount: 10 },
        productionUrl: 'www.ourproduct.io/compare',
        textEditCount: 12,
        imageEditCount: 0,
        linkCount: 6
    }
];

// Simple folder structure
export const folders = [
    { id: 'folder1', title: 'Marketing Demos', parent_id: null, demo_count: 1 },
    { id: 'folder2', title: 'Sales Demos', parent_id: null, demo_count: 1 },
    { id: 'folder3', title: 'Training', parent_id: null, demo_count: 1 },
    { id: 'folder4', title: 'Product Demos', parent_id: null, demo_count: 2 },
    { id: 'folder5', title: 'Q1 Campaigns', parent_id: 'folder1', demo_count: 1 },
    { id: 'folder6', title: 'Q2 Campaigns', parent_id: 'folder1', demo_count: 1 },
    { id: 'folder7', title: 'Enterprise Sales', parent_id: 'folder2', demo_count: 1 },
    { id: 'folder8', title: 'SMB Sales', parent_id: 'folder2', demo_count: 1 },
    { id: 'folder9', title: 'Technical Training', parent_id: 'folder3', demo_count: 1 },
    { id: 'folder10', title: 'API Demos', parent_id: 'folder4', demo_count: 1 }
];

// Helper functions
export const getDemosByFolder = (folderId: string) => {
    return demos.filter(demo => demo.folder_id === folderId);
};

export const getRecentDemos = () => {
    return demos.filter(demo => demo.isRecent);
};

export const getSharedDemos = () => {
    return demos.filter(demo => demo.isShared);
};

export const getStarredDemos = () => {
    return demos.filter(demo => demo.starred);
};

export const getTotalDemoCount = () => {
    return demos.length;
};

export const getRecentDemoCount = () => {
    return getRecentDemos().length;
};

export const getSharedDemoCount = () => {
    return getSharedDemos().length;
};

export const getStarredDemoCount = () => {
    return getStarredDemos().length;
};

export const getDemosByType = (type: string) => {
    return demos.filter(demo => demo.productType === type);
};
