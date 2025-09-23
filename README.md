# Maestro Minimal Demo Library

A minimal, self-contained version of the Maestro demo library with only essential components.

## What's Included

- **3 Demo Card Components**: MaestroDemoCard, LegacyDemoCard, LiveDemoCard
- **1 Unified View**: DemoLibrary component that displays all demo types
- **1 Composable**: useDemoLibrary for state management
- **Static Mock Data**: TypeScript objects with exact backend data structures
- **Real API Response Format**: All data matches the real backend exactly
- **Minimal Dependencies**: Only Vue 3, Pinia, Tailwind CSS

## No External Dependencies

This version removes all the heavy dependencies:

- ❌ No edit4-sub components
- ❌ No reprise-plugin-api
- ❌ No reprise-common types
- ❌ No snap utilities
- ❌ No complex build system

## Quick Start

1. **Install dependencies**:

   ```bash
   yarn install
   ```

2. **Start development server**:

   ```bash
   yarn dev
   ```

   This serves the app on `http://localhost:5173` with static mock data

3. **Build for production**:
   ```bash
   yarn build
   ```

## Features

- **Unified Demo Display**: Shows Maestro, Legacy, and Live demos in one view
- **Recent Demos**: Highlights demos from the last 7 days
- **Folder Support**: Displays folder names for demos
- **Custom Links**: Shows custom links for Legacy demos
- **Responsive Design**: Clean, modern UI with Tailwind CSS
- **Loading States**: Smooth loading animations

## Mock Data Structure

The static mock data provides the same response format as the real backend:

- **Maestro Demos**: Product Overview, Sales Process (with edit permissions)
- **Legacy Demos**: Legacy Product, Legacy Sales (with custom links)
- **Live Demos**: Live Interactive, Live Sales (with active link counts)
- **Folders**: Marketing Demos, Sales Demos, Training (with demo counts)

All data structures match the real backend exactly, including field names, types, and nested objects.

## File Structure

```
standalone-minimal/
├── src/
│   ├── components/
│   │   ├── demo-cards/          # 3 demo card components
│   │   └── DemoLibrary.vue      # Main unified view
│   ├── composables/
│   │   └── useDemoLibrary.ts    # State management
│   ├── data/
│   │   ├── mockData.ts          # Static mock data
│   │   └── index.ts             # Data exports
│   ├── main.ts                  # App entry point
│   └── style.css               # Tailwind styles
├── package.json                 # Minimal dependencies
├── vite.config.ts              # Simple Vite config
└── README.md                   # This file
```

## Customization

To modify the demo data, edit `src/data/mockData.ts`:

- Change demo titles, dates, folder assignments
- Add/remove demos
- Modify custom links for Legacy demos
- Update folder structures and counts

## Benefits

- **Lightweight**: Only essential dependencies
- **Fast**: No complex build system overhead
- **Portable**: Easy to move to any project
- **Maintainable**: Simple, clean code structure
- **Extensible**: Easy to add new features

This gives you a working demo library that you can iterate on quickly without the complexity of the full Maestro system!
