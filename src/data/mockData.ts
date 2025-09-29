/**
 * Mock Data - Exact replica of real backend data structures
 * Extracted from Python mock services to use as static data
 */

import { Demo } from '../types/index';

// Function to get a random poster image for demos
const getRandomPosterImage = () => {
    const posterImages = [
        "/src/images/poster1.png",
        "/src/images/poster2.png",
        "/src/images/poster3.png",
        "/src/images/poster4.png"
    ];
    return posterImages[Math.floor(Math.random() * posterImages.length)];
};

// Starred Items Configuration
export const STARRED_ITEMS = [
    { id: 'starred1', title: 'Model serving with Inferen...', demoCount: 12 },
    { id: 'starred2', title: 'AI/BI Dashboard + Genie', demoCount: 8 },
    { id: 'starred3', title: 'Carmen Demo', demoCount: 15 },
    { id: 'starred4', title: 'Q4 Product Launch', demoCount: 6 },
    { id: 'starred5', title: 'Enterprise Security Suite', demoCount: 9 }
];

// Enterprise Folder Configuration - Single Source of Truth
export const FOLDER_CONFIG = {
    // Root Folders (5 main business areas)
    ROOT_FOLDERS: {
        MARKETING: { id: 'folder1', title: 'Marketing Demos', parent_id: null, sort_index: 1 },
        SALES: { id: 'folder2', title: 'Sales Demos', parent_id: null, sort_index: 2 },
        TRAINING: { id: 'folder3', title: 'Training', parent_id: null, sort_index: 3 },
        PRODUCT: { id: 'folder4', title: 'Product Demos', parent_id: null, sort_index: 4 },
        DIGITAL_TRANSFORMATION: { id: 'folder31', title: 'Digital Transformation', parent_id: null, sort_index: 5 }
    },

    // Marketing Subfolders (4 quarterly campaigns)
    MARKETING_SUBFOLDERS: {
        Q1_CAMPAIGNS: { id: 'folder5', title: 'Q1 Campaigns', parent_id: 'folder1', sort_index: 1 },
        Q2_CAMPAIGNS: { id: 'folder6', title: 'Q2 Campaigns', parent_id: 'folder1', sort_index: 2 },
        Q3_CAMPAIGNS: { id: 'folder11', title: 'Q3 Campaigns', parent_id: 'folder1', sort_index: 3 },
        Q4_CAMPAIGNS: { id: 'folder12', title: 'Q4 Campaigns', parent_id: 'folder1', sort_index: 4 }
    },

    // Sales Subfolders (5 sales focus areas)
    SALES_SUBFOLDERS: {
        ENTERPRISE_SALES: { id: 'folder7', title: 'Enterprise Sales', parent_id: 'folder2', sort_index: 1 },
        SMB_SALES: { id: 'folder8', title: 'SMB Sales', parent_id: 'folder2', sort_index: 2 },
        CUSTOMER_SUCCESS: { id: 'folder13', title: 'Customer Success', parent_id: 'folder2', sort_index: 3 },
        PARTNER_DEMOS: { id: 'folder14', title: 'Partner Demos', parent_id: 'folder2', sort_index: 4 },
        EXECUTIVE_BRIEFINGS: { id: 'folder15', title: 'Executive Briefings', parent_id: 'folder2', sort_index: 5 }
    },

    // Training Subfolders (2 training areas)
    TRAINING_SUBFOLDERS: {
        ONBOARDING: { id: 'folder9', title: 'Onboarding', parent_id: 'folder3', sort_index: 1 },
        ADVANCED_FEATURES: { id: 'folder10', title: 'Advanced Features', parent_id: 'folder3', sort_index: 2 }
    },

    // Product Subfolders (15 technical areas)
    PRODUCT_SUBFOLDERS: {
        ENTERPRISE_ARCHITECTURE: { id: 'folder16', title: 'Enterprise Architecture', parent_id: 'folder4', sort_index: 1 },
        TECHNICAL_DEEP_DIVES: { id: 'folder17', title: 'Technical Deep Dives', parent_id: 'folder4', sort_index: 2 },
        MOBILE_DEVELOPMENT: { id: 'folder18', title: 'Mobile Development', parent_id: 'folder4', sort_index: 3 },
        WEB_DEVELOPMENT: { id: 'folder19', title: 'Web Development', parent_id: 'folder4', sort_index: 4 },
        SECURITY_COMPLIANCE: { id: 'folder20', title: 'Security & Compliance', parent_id: 'folder4', sort_index: 5 },
        DATA_GOVERNANCE: { id: 'folder21', title: 'Data Governance', parent_id: 'folder4', sort_index: 6 },
        AI_ANALYTICS: { id: 'folder22', title: 'AI & Analytics', parent_id: 'folder4', sort_index: 7 },
        BUSINESS_INTELLIGENCE: { id: 'folder23', title: 'Business Intelligence', parent_id: 'folder4', sort_index: 8 },
        CLOUD_MIGRATION: { id: 'folder24', title: 'Cloud Migration', parent_id: 'folder4', sort_index: 9 },
        CLOUD_STRATEGY: { id: 'folder25', title: 'Cloud Strategy', parent_id: 'folder4', sort_index: 10 },
        DEVOPS_AUTOMATION: { id: 'folder26', title: 'DevOps & Automation', parent_id: 'folder4', sort_index: 11 },
        INTEGRATION_HUB: { id: 'folder27', title: 'Integration Hub', parent_id: 'folder4', sort_index: 12 },
        API_MANAGEMENT: { id: 'folder28', title: 'API Management', parent_id: 'folder4', sort_index: 13 },
        PERFORMANCE_MONITORING: { id: 'folder29', title: 'Performance Monitoring', parent_id: 'folder4', sort_index: 14 },
        DATA_MANAGEMENT: { id: 'folder30', title: 'Data Management', parent_id: 'folder4', sort_index: 15 }
    },

    // Digital Transformation Subfolders (10 business value areas)
    DIGITAL_TRANSFORMATION_SUBFOLDERS: {
        WORKFLOW_ORCHESTRATION: { id: 'folder32', title: 'Workflow Orchestration', parent_id: 'folder31', sort_index: 1 },
        CUSTOMER_EXPERIENCE: { id: 'folder33', title: 'Customer Experience', parent_id: 'folder31', sort_index: 2 },
        SUPPORT_SERVICES: { id: 'folder34', title: 'Support & Services', parent_id: 'folder31', sort_index: 3 },
        PROFESSIONAL_SERVICES: { id: 'folder35', title: 'Professional Services', parent_id: 'folder31', sort_index: 4 },
        IMPLEMENTATION_GUIDES: { id: 'folder36', title: 'Implementation Guides', parent_id: 'folder31', sort_index: 5 },
        BEST_PRACTICES: { id: 'folder37', title: 'Best Practices', parent_id: 'folder31', sort_index: 6 },
        INDUSTRY_SOLUTIONS: { id: 'folder38', title: 'Industry Solutions', parent_id: 'folder31', sort_index: 7 },
        COMPETITIVE_ANALYSIS: { id: 'folder39', title: 'Competitive Analysis', parent_id: 'folder31', sort_index: 8 },
        ROI_BUSINESS_VALUE: { id: 'folder40', title: 'ROI & Business Value', parent_id: 'folder31', sort_index: 9 }
    }
};

// Demo-to-Folder Assignment Configuration - Single Source of Truth
export const DEMO_ASSIGNMENTS = {
    // SKO Sales Demos
    '1': FOLDER_CONFIG.SALES_SUBFOLDERS.ENTERPRISE_SALES.id, // TPSM App Engine SKO25 OLD
    '2': FOLDER_CONFIG.SALES_SUBFOLDERS.ENTERPRISE_SALES.id, // TPSM App Dev SKO2025 PROD
    '3': FOLDER_CONFIG.MARKETING_SUBFOLDERS.Q1_CAMPAIGNS.id, // SKO - NA Showcase

    // Product Demos
    '4': FOLDER_CONFIG.PRODUCT_SUBFOLDERS.AI_ANALYTICS.id, // TPSM Creator - Mixed V4
    '5': FOLDER_CONFIG.PRODUCT_SUBFOLDERS.SECURITY_COMPLIANCE.id, // Enterprise Security Demo
    '6': FOLDER_CONFIG.PRODUCT_SUBFOLDERS.MOBILE_DEVELOPMENT.id, // Mobile App Development

    // Customer Experience
    '7': FOLDER_CONFIG.DIGITAL_TRANSFORMATION_SUBFOLDERS.CUSTOMER_EXPERIENCE.id, // Customer Onboarding Flow
    '8': FOLDER_CONFIG.PRODUCT_SUBFOLDERS.API_MANAGEMENT.id, // API Integration Workshop

    // Training
    '9': FOLDER_CONFIG.TRAINING_SUBFOLDERS.ONBOARDING.id, // Sales Training Module
    '10': FOLDER_CONFIG.MARKETING_SUBFOLDERS.Q2_CAMPAIGNS.id, // Product Launch Demo

    // Analytics & Data
    '11': FOLDER_CONFIG.PRODUCT_SUBFOLDERS.AI_ANALYTICS.id, // Data Analytics Dashboard
    '12': FOLDER_CONFIG.DIGITAL_TRANSFORMATION_SUBFOLDERS.SUPPORT_SERVICES.id, // Customer Support Portal

    // Integration & E-commerce
    '13': FOLDER_CONFIG.PRODUCT_SUBFOLDERS.INTEGRATION_HUB.id, // E-commerce Integration
    '14': FOLDER_CONFIG.PRODUCT_SUBFOLDERS.DEVOPS_AUTOMATION.id, // Workflow Automation

    // Collaboration
    '15': FOLDER_CONFIG.DIGITAL_TRANSFORMATION_SUBFOLDERS.CUSTOMER_EXPERIENCE.id, // Team Collaboration Tools

    // Enterprise Architecture
    '16': FOLDER_CONFIG.PRODUCT_SUBFOLDERS.ENTERPRISE_ARCHITECTURE.id, // Enterprise Architecture Overview
    '17': FOLDER_CONFIG.PRODUCT_SUBFOLDERS.CLOUD_MIGRATION.id, // Multi-tenant SaaS Platform
    '18': FOLDER_CONFIG.PRODUCT_SUBFOLDERS.DEVOPS_AUTOMATION.id, // DevOps Pipeline Automation

    // Data Management
    '19': FOLDER_CONFIG.PRODUCT_SUBFOLDERS.DATA_MANAGEMENT.id, // Enterprise Data Migration
    '20': FOLDER_CONFIG.PRODUCT_SUBFOLDERS.SECURITY_COMPLIANCE.id, // Advanced Security Compliance

    // Integration & AI
    '21': FOLDER_CONFIG.PRODUCT_SUBFOLDERS.INTEGRATION_HUB.id, // Enterprise Integration Hub
    '22': FOLDER_CONFIG.PRODUCT_SUBFOLDERS.AI_ANALYTICS.id, // AI-Powered Business Intelligence

    // Mobile & Cloud
    '23': FOLDER_CONFIG.PRODUCT_SUBFOLDERS.MOBILE_DEVELOPMENT.id, // Enterprise Mobile Security
    '24': FOLDER_CONFIG.PRODUCT_SUBFOLDERS.CLOUD_MIGRATION.id, // Cloud Migration Strategy

    // Workflow & API
    '25': FOLDER_CONFIG.DIGITAL_TRANSFORMATION_SUBFOLDERS.WORKFLOW_ORCHESTRATION.id, // Enterprise Workflow Orchestration
    '26': FOLDER_CONFIG.PRODUCT_SUBFOLDERS.API_MANAGEMENT.id, // Advanced API Management

    // Customer Success & Strategy
    '27': FOLDER_CONFIG.SALES_SUBFOLDERS.CUSTOMER_SUCCESS.id, // Enterprise Customer Success
    '28': FOLDER_CONFIG.DIGITAL_TRANSFORMATION_SUBFOLDERS.BEST_PRACTICES.id, // Digital Transformation Roadmap

    // Performance & Sales
    '29': FOLDER_CONFIG.PRODUCT_SUBFOLDERS.PERFORMANCE_MONITORING.id, // Enterprise Performance Monitoring
    '30': FOLDER_CONFIG.SALES_SUBFOLDERS.ENTERPRISE_SALES.id // Enterprise Sales Enablement
};

// Clean demo data - Enterprise focused with 30+ demos
const cleanDemos: Demo[] = [
    {
        id: '1',
        name: 'TPSM App Engine SKO25 OLD',
        productType: 'replicate',
        description: 'Complete walkthrough of the App Engine platform features and capabilities for SKO 2025',
        lastModified: '2024-03-20',
        createdBy: 'Ryan Howard',
        views: 150,
        starred: false,
        tags: ["Enterprise", "Cloud", "API Integration"]
    },
    {
        id: '2',
        name: 'TPSM App Dev SKO2025 PROD',
        productType: 'replay',
        description: 'Developer-focused demonstration showcasing rapid application development workflows',
        lastModified: '2024-03-20',
        createdBy: 'Jim Halpert',
        views: 120,
        starred: true,
        tags: ["Developer", "SKO", "Technical"]
    },
    {
        id: '3',
        name: 'SKO - NA Showcase',
        productType: 'reveal',
        description: 'North America regional showcase highlighting key customer success stories',
        lastModified: '2024-03-19',
        createdBy: 'Dwight Schrute',
        views: 200,
        starred: true,
        tags: ["Marketing", "Customer Success", "Sales Enablement"]
    },
    {
        id: '4',
        name: 'TPSM Creator - Mixed V4',
        productType: 'replay',
        description: 'Latest version of the Creator Studio demo with enhanced AI capabilities',
        lastModified: '2024-03-19',
        createdBy: 'Pam Beesly',
        views: 180,
        starred: false,
        tags: ["Creator", "AI", "Mixed Media"]
    },
    {
        id: '5',
        name: 'Enterprise Security Demo',
        productType: 'replicate',
        description: 'Comprehensive security features demonstration for enterprise customers',
        lastModified: '2024-03-18',
        createdBy: 'Michael Scott',
        views: 95,
        starred: true,
        tags: ["Security", "Enterprise", "Compliance"]
    },
    {
        id: '6',
        name: 'Mobile App Development',
        productType: 'replay',
        description: 'End-to-end mobile application development workflow demonstration',
        lastModified: '2024-03-17',
        createdBy: 'Angela Martin',
        views: 110,
        starred: false,
        tags: ["Mobile", "Development", "iOS", "Android"]
    },
    {
        id: '7',
        name: 'Customer Onboarding Flow',
        productType: 'reveal',
        description: 'Interactive customer onboarding experience with guided tours',
        lastModified: '2024-03-16',
        createdBy: 'Kevin Malone',
        views: 75,
        starred: false,
        tags: ["Onboarding", "Customer Experience", "Interactive"]
    },
    {
        id: '8',
        name: 'API Integration Workshop',
        productType: 'replay',
        description: 'Hands-on workshop covering API integration best practices',
        lastModified: '2024-03-15',
        createdBy: 'Oscar Martinez',
        views: 85,
        starred: true,
        tags: ["API", "Integration", "Workshop", "Technical"]
    },
    {
        id: '9',
        name: 'Sales Training Module',
        productType: 'reveal',
        description: 'Interactive sales training with role-playing scenarios',
        lastModified: '2024-03-14',
        createdBy: 'Stanley Hudson',
        views: 65,
        starred: false,
        tags: ["Sales", "Training", "Role Play", "Interactive"]
    },
    {
        id: '10',
        name: 'Product Launch Demo',
        productType: 'replicate',
        description: 'Exciting product launch demonstration for new feature releases',
        lastModified: '2024-03-13',
        createdBy: 'Phyllis Vance',
        views: 140,
        starred: true,
        tags: ["Product Launch", "New Features", "Marketing"]
    },
    {
        id: '11',
        name: 'Data Analytics Dashboard',
        productType: 'replay',
        description: 'Real-time data analytics and reporting dashboard demonstration',
        lastModified: '2024-03-12',
        createdBy: 'Toby Flenderson',
        views: 90,
        starred: false,
        tags: ["Analytics", "Dashboard", "Data Visualization"]
    },
    {
        id: '12',
        name: 'Customer Support Portal',
        productType: 'reveal',
        description: 'Self-service customer support portal with AI-powered assistance',
        lastModified: '2024-03-11',
        createdBy: 'Creed Bratton',
        views: 55,
        starred: false,
        tags: ["Support", "Self-Service", "AI", "Portal"]
    },
    {
        id: '13',
        name: 'E-commerce Integration',
        productType: 'replicate',
        description: 'Seamless e-commerce platform integration demonstration',
        lastModified: '2024-03-10',
        createdBy: 'Meredith Palmer',
        views: 120,
        starred: true,
        tags: ["E-commerce", "Integration", "Platform"]
    },
    {
        id: '14',
        name: 'Workflow Automation',
        productType: 'replay',
        description: 'Business process automation and workflow optimization',
        lastModified: '2024-03-09',
        createdBy: 'Kelly Kapoor',
        views: 80,
        starred: false,
        tags: ["Automation", "Workflow", "Business Process"]
    },
    {
        id: '15',
        name: 'Team Collaboration Tools',
        productType: 'reveal',
        description: 'Collaborative workspace and team communication features',
        lastModified: '2024-03-08',
        createdBy: 'Ryan Howard',
        views: 100,
        starred: true,
        tags: ["Collaboration", "Team", "Communication"]
    },
    // Additional Enterprise Demos (16-30)
    {
        id: '16',
        name: 'Enterprise Architecture Overview',
        productType: 'reveal',
        description: 'Comprehensive enterprise architecture and scalability demonstration',
        lastModified: '2024-03-07',
        createdBy: 'David Wallace',
        views: 180,
        starred: true,
        tags: ["Enterprise", "Architecture", "Scalability", "Technical"]
    },
    {
        id: '17',
        name: 'Multi-tenant SaaS Platform',
        productType: 'replicate',
        description: 'Multi-tenant software-as-a-service platform demonstration',
        lastModified: '2024-03-06',
        createdBy: 'Jan Levinson',
        views: 160,
        starred: false,
        tags: ["SaaS", "Multi-tenant", "Platform", "Enterprise"]
    },
    {
        id: '18',
        name: 'DevOps Pipeline Automation',
        productType: 'replay',
        description: 'Complete DevOps pipeline setup and automation workflows',
        lastModified: '2024-03-05',
        createdBy: 'Robert California',
        views: 95,
        starred: true,
        tags: ["DevOps", "CI/CD", "Automation", "Technical"]
    },
    {
        id: '19',
        name: 'Enterprise Data Migration',
        productType: 'replicate',
        description: 'Large-scale enterprise data migration and transformation processes',
        lastModified: '2024-03-04',
        createdBy: 'Nellie Bertram',
        views: 75,
        starred: false,
        tags: ["Data Migration", "Enterprise", "Transformation"]
    },
    {
        id: '20',
        name: 'Advanced Security Compliance',
        productType: 'reveal',
        description: 'SOC 2, GDPR, and HIPAA compliance demonstration for enterprise',
        lastModified: '2024-03-03',
        createdBy: 'Holly Flax',
        views: 120,
        starred: true,
        tags: ["Security", "Compliance", "GDPR", "SOC2", "HIPAA"]
    },
    {
        id: '21',
        name: 'Enterprise Integration Hub',
        productType: 'replay',
        description: 'Centralized integration platform for enterprise systems',
        lastModified: '2024-03-02',
        createdBy: 'Charles Miner',
        views: 110,
        starred: false,
        tags: ["Integration", "Enterprise", "Systems", "Hub"]
    },
    {
        id: '22',
        name: 'AI-Powered Business Intelligence',
        productType: 'replicate',
        description: 'Advanced AI-driven business intelligence and predictive analytics',
        lastModified: '2024-03-01',
        createdBy: 'Jo Bennett',
        views: 140,
        starred: true,
        tags: ["AI", "Business Intelligence", "Analytics", "Predictive"]
    },
    {
        id: '23',
        name: 'Enterprise Mobile Security',
        productType: 'replay',
        description: 'Comprehensive mobile device management and security for enterprises',
        lastModified: '2024-02-28',
        createdBy: 'Gabe Lewis',
        views: 85,
        starred: false,
        tags: ["Mobile", "Security", "MDM", "Enterprise"]
    },
    {
        id: '24',
        name: 'Cloud Migration Strategy',
        productType: 'reveal',
        description: 'Complete cloud migration planning and execution demonstration',
        lastModified: '2024-02-27',
        createdBy: 'Deangelo Vickers',
        views: 130,
        starred: true,
        tags: ["Cloud", "Migration", "Strategy", "Enterprise"]
    },
    {
        id: '25',
        name: 'Enterprise Workflow Orchestration',
        productType: 'replicate',
        description: 'Complex enterprise workflow orchestration and management',
        lastModified: '2024-02-26',
        createdBy: 'Val Johnson',
        views: 90,
        starred: false,
        tags: ["Workflow", "Orchestration", "Enterprise", "Management"]
    },
    {
        id: '26',
        name: 'Advanced API Management',
        productType: 'replay',
        description: 'Enterprise-grade API management and governance platform',
        lastModified: '2024-02-25',
        createdBy: 'Pete Miller',
        views: 105,
        starred: true,
        tags: ["API", "Management", "Governance", "Enterprise"]
    },
    {
        id: '27',
        name: 'Enterprise Customer Success',
        productType: 'reveal',
        description: 'Customer success management and retention strategies for enterprise',
        lastModified: '2024-02-24',
        createdBy: 'Clark Green',
        views: 70,
        starred: false,
        tags: ["Customer Success", "Retention", "Enterprise", "Strategy"]
    },
    {
        id: '28',
        name: 'Digital Transformation Roadmap',
        productType: 'replicate',
        description: 'Comprehensive digital transformation planning and execution',
        lastModified: '2024-02-23',
        createdBy: 'Mose Schrute',
        views: 115,
        starred: true,
        tags: ["Digital Transformation", "Strategy", "Enterprise", "Planning"]
    },
    {
        id: '29',
        name: 'Enterprise Performance Monitoring',
        productType: 'replay',
        description: 'Advanced performance monitoring and optimization for enterprise systems',
        lastModified: '2024-02-22',
        createdBy: 'Erin Hannon',
        views: 80,
        starred: false,
        tags: ["Performance", "Monitoring", "Optimization", "Enterprise"]
    },
    {
        id: '30',
        name: 'Enterprise Sales Enablement',
        productType: 'reveal',
        description: 'Comprehensive sales enablement platform for enterprise sales teams',
        lastModified: '2024-02-21',
        createdBy: 'Andy Bernard',
        views: 125,
        starred: true,
        tags: ["Sales Enablement", "Enterprise", "Sales", "Platform"]
    }
];

// Simple demo-to-folder assignment using single source of truth
function assignDemoToFolder(demo: any): string {
    return DEMO_ASSIGNMENTS[demo.id] || FOLDER_CONFIG.ROOT_FOLDERS.PRODUCT.id;
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
        'folder10': 'Advanced Features',
        'folder11': 'Q3 Campaigns',
        'folder12': 'Q4 Campaigns',
        'folder13': 'Customer Success',
        'folder14': 'Partner Demos',
        'folder15': 'Executive Briefings',
        'folder16': 'Enterprise Architecture',
        'folder17': 'Technical Deep Dives',
        'folder18': 'Mobile Development',
        'folder19': 'Web Development',
        'folder20': 'Security & Compliance',
        'folder21': 'Data Governance',
        'folder22': 'AI & Analytics',
        'folder23': 'Business Intelligence',
        'folder24': 'Cloud Migration',
        'folder25': 'Cloud Strategy',
        'folder26': 'DevOps & Automation',
        'folder27': 'Integration Hub',
        'folder28': 'API Management',
        'folder29': 'Performance Monitoring',
        'folder30': 'Data Management',
        'folder31': 'Digital Transformation',
        'folder32': 'Workflow Orchestration',
        'folder33': 'Customer Experience',
        'folder34': 'Support & Services',
        'folder35': 'Professional Services',
        'folder36': 'Implementation Guides',
        'folder37': 'Best Practices',
        'folder38': 'Industry Solutions',
        'folder39': 'Competitive Analysis',
        'folder40': 'ROI & Business Value'
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
        screenshot_small: getRandomPosterImage(),
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

    // Initialize counts for all 40 folders
    Array.from({ length: 40 }, (_, i) => `folder${i + 1}`).forEach(id => {
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

// Generate folders array from single source of truth configuration
export const folders = [
    // Root Folders
    ...Object.values(FOLDER_CONFIG.ROOT_FOLDERS).map(folder => ({
        ...folder,
        archived: false,
        acl: null,
        ac_replay_count: 0, // Will be calculated dynamically
        sc_replay_count: 0, // Will be calculated dynamically
        created_by: "user1"
    })),

    // Marketing Subfolders
    ...Object.values(FOLDER_CONFIG.MARKETING_SUBFOLDERS).map(folder => ({
        ...folder,
        archived: false,
        acl: null,
        ac_replay_count: 0, // Will be calculated dynamically
        sc_replay_count: 0, // Will be calculated dynamically
        created_by: "user1"
    })),

    // Sales Subfolders
    ...Object.values(FOLDER_CONFIG.SALES_SUBFOLDERS).map(folder => ({
        ...folder,
        archived: false,
        acl: null,
        ac_replay_count: 0, // Will be calculated dynamically
        sc_replay_count: 0, // Will be calculated dynamically
        created_by: "user2"
    })),

    // Training Subfolders
    ...Object.values(FOLDER_CONFIG.TRAINING_SUBFOLDERS).map(folder => ({
        ...folder,
        archived: false,
        acl: null,
        ac_replay_count: 0, // Will be calculated dynamically
        sc_replay_count: 0, // Will be calculated dynamically
        created_by: "user1"
    })),

    // Product Subfolders
    ...Object.values(FOLDER_CONFIG.PRODUCT_SUBFOLDERS).map(folder => ({
        ...folder,
        archived: false,
        acl: null,
        ac_replay_count: 0, // Will be calculated dynamically
        sc_replay_count: 0, // Will be calculated dynamically
        created_by: "user3"
    })),

    // Digital Transformation Subfolders
    ...Object.values(FOLDER_CONFIG.DIGITAL_TRANSFORMATION_SUBFOLDERS).map(folder => ({
        ...folder,
        archived: false,
        acl: null,
        ac_replay_count: 0, // Will be calculated dynamically
        sc_replay_count: 0, // Will be calculated dynamically
        created_by: "user4"
    }))
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
        const liveDemo = liveDemos.find(d => d.id === demoId);
        const legacyDemo = legacyDemos.find(d => d.id === demoId);

        return {
            default_url: liveDemo?.default_url || legacyDemo?.custom_links?.link1?.url || `https://demo.example.com/${demoId}`
        };
    },

    // GET /r/folder_list/ - Folder structure
    getFolderList: () => ({
        folders: folders,
        apps: [] // Optional field from real backend
    }),

    // GET /r/all_folders_list/ - Comprehensive folder list
    getAllFoldersList: () => {
        const allFolders: any[] = [];

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
