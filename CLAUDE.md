# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an ISS (International Space Station) tracker application built with React 19, TypeScript, and Vite. The app tracks the ISS position in real-time, shows the nearest city, and allows users to select a city to see if the ISS will be overhead in the next 12 hours.

## Development Commands

```bash
# Install dependencies
npm i

# Start development server
npm run start

# Build for production
npm run build

# Preview production build
npm run serve

# Start mock API server (runs on port 8000)
npm run json

# Testing
npm run test           # Run tests in watch mode
npm run test:run       # Run tests once
npm run test:ui        # Run tests with visual UI
npm run test:coverage  # Run tests with coverage report

# Quality assurance
npm run typecheck      # Run TypeScript type checking
npm audit              # Security audit
```

## Architecture Overview

### Application Structure
The application follows a modular architecture with clear separation of concerns:

```
src/
├── components/           # Reusable UI components (Loader, ValueDisplay)
├── context/             # Global React contexts (WindowState)
├── hooks/               # Custom React hooks (useAsyncData, usePolling, useIsPageFocused)
├── services/            # API service layer (CountriesService, IssService, BaseService)
├── types/               # TypeScript type definitions (country, coordinates, ISSStats)
├── utils/               # Utility functions (countries, iss, logger, numberFormatter)
├── features/            # Feature-specific code
│   └── iss-tracker/     # ISS tracking feature with map visualization
├── styles/              # Global CSS files (vars.css, grid.css)
└── apis/                # API endpoint configurations
```

### Key Components
- `App.tsx`: Root component with WindowStateProvider wrapper
- `src/features/iss-tracker/Map.tsx`: Main ISS tracker component with error boundary and focus detection
- `src/context/WindowState.tsx`: Context for managing polling suspension when page inactive
- `src/components/`: Shared UI components like Loader and ValueDisplay
- `src/services/`: API service layer with proper error handling and retry logic
- `src/lib/scrambler-element.ts`: Custom web component for animated number display

### API Integration
- **ISS Current Position**: `https://api.wheretheiss.at/v1/satellites/25544`
- **ISS Future Passes**: `https://api.g7vrd.co.uk/v1/satellite-passes/25544/%lat%/%lon%.json?hours=12`
- **Countries Data**: Local JSON file at `./api/countries.json`

### Important Notes
- React Strict Mode causes double API calls during development - abort signals are critical for preventing blocked endpoints
- Polling automatically suspends when the browser tab is inactive to conserve resources
- Application uses Leaflet maps via react-leaflet for geographic visualization
- The architecture now supports adding multiple features alongside the ISS tracker in the `features/` directory

## Development Approaches

### Adding New Features
When adding new features, follow this pattern:

1. **Create feature directory**: `src/features/your-feature-name/`
2. **Feature structure**:
   ```
   src/features/your-feature-name/
   ├── components/          # Feature-specific components
   ├── FeatureName.tsx      # Main feature component
   ├── feature-name.css     # Feature-specific styles
   └── imgs/               # Feature-specific assets (if needed)
   ```
3. **Use shared resources**: Import from `src/components/`, `src/hooks/`, `src/services/`, `src/utils/`
4. **Export from App.tsx**: Import and render your main feature component

### Working with Shared Components
- **Location**: Place reusable UI components in `src/components/`
- **Naming**: Use PascalCase for component files (e.g., `LoadingSpinner.tsx`)
- **Props**: Define clear TypeScript interfaces for component props
- **Styling**: Co-locate CSS files with components or use global styles from `src/styles/`

### Service Layer Guidelines
- **API Services**: Place in `src/services/` following the pattern of `CountriesService.ts`
- **Base Service**: Extend `BaseService.ts` for common functionality like retries and error handling
- **Abort Signals**: Always implement AbortController support for API calls to handle React Strict Mode
- **Error Handling**: Use consistent error handling patterns across all services

### Custom Hooks
- **Location**: Place in `src/hooks/`
- **Naming**: Prefix with `use` (e.g., `useAsyncData.ts`)
- **Responsibility**: Keep hooks focused on a single concern
- **Dependencies**: Import from other shared modules as needed

## Testing

### Test Framework
- **Framework**: Vitest with React Testing Library
- **Environment**: jsdom for DOM simulation
- **Coverage**: V8 provider with text, HTML, and JSON reports
- **UI**: Vitest UI available via `npm run test:ui`

### Test Scripts
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once (used in build pipeline)
- `npm run test:coverage` - Generate coverage reports
- `npm run test:ui` - Open Vitest web UI

### Test Organization
```
src/
├── components/          # Component tests (.test.tsx)
├── hooks/              # Hook tests (.test.ts)
├── services/           # Service tests (.test.ts)
├── utils/              # Utility tests (.test.ts)
├── lib/               # Web component tests (.test.ts)
└── test/
    ├── setup.ts        # Test environment setup
    └── utils.tsx       # Shared test utilities
```

### Build Integration
- Tests run automatically before every build (`prebuild` script)
- CI pipeline runs tests and typecheck before deployment
- Build fails if tests fail, preventing broken deployments
- Use `npm run build:ci` to skip tests in CI (after explicit test step)

### Import Conventions
Follow these import path patterns:

```typescript
// Shared utilities from project root
import { someUtil } from '../../utils/countries/someUtil';
import { SomeComponent } from '../../components/SomeComponent';
import { useCustomHook } from '../../hooks/useCustomHook';
import { ApiService } from '../../services/ApiService';

// Within the same feature
import { FeatureComponent } from './components/FeatureComponent';
import './feature-name.css';

// External libraries first
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
```

### Type Definitions
- **Location**: Place all TypeScript types in `src/types/`
- **Organization**: Types are organized by domain (components, coordinates, country, ISSStats, etc.)
- **Central Export**: Use `src/types/index.ts` for convenient imports across the application
- **Documentation**: All types include JSDoc comments explaining their purpose and properties
- **Best Practices**: Use `interface` for object shapes, `type` for unions/aliases, prefer `unknown` over `any`
- **Import Style**: Use `import type { ... }` for type-only imports to improve build performance

### CSS and Styling
- **Global styles**: Place in `src/styles/` (vars.css, grid.css)
- **Feature styles**: Co-locate with feature components
- **CSS imports**: Use relative paths and always import CSS files in component files
- **Variables**: Use CSS custom properties defined in `vars.css`

## Performance Optimization

### React.memo Usage
Use `React.memo` to prevent unnecessary re-renders of components:

```typescript
// Use for components that receive stable props
const ExpensiveComponent = React.memo(({ data, onAction }: Props) => {
  return <div>{/* expensive rendering logic */}</div>;
});

// Use with custom comparison for complex props
const OptimizedComponent = React.memo(({ items, config }: Props) => {
  return <div>{/* component logic */}</div>;
}, (prevProps, nextProps) => {
  // Custom comparison logic
  return prevProps.items.length === nextProps.items.length &&
         prevProps.config.id === nextProps.config.id;
});
```

### useCallback for Event Handlers
Wrap event handlers in `useCallback` to prevent child re-renders:

```typescript
const ParentComponent = ({ items }: Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Memoize callbacks to prevent child re-renders
  const handleItemClick = useCallback((id: string) => {
    setSelectedId(id);
  }, []); // Empty dependency array if no external dependencies

  const handleItemDelete = useCallback((id: string) => {
    // Delete logic with external dependencies
    deleteItem(id);
  }, [deleteItem]); // Include dependencies that change

  return (
    <div>
      {items.map(item => (
        <MemoizedItemComponent
          key={item.id}
          item={item}
          onSelect={handleItemClick}
          onDelete={handleItemDelete}
        />
      ))}
    </div>
  );
};
```

### useMemo for Expensive Calculations
Use `useMemo` to cache expensive computations:

```typescript
const DataVisualization = ({ rawData, filters }: Props) => {
  // Memoize expensive data processing
  const processedData = useMemo(() => {
    return rawData
      .filter(item => filters.categories.includes(item.category))
      .map(item => computeExpensiveTransformation(item))
      .sort((a, b) => a.priority - b.priority);
  }, [rawData, filters.categories]); // Re-compute only when dependencies change

  // Memoize complex calculations
  const chartConfig = useMemo(() => {
    return generateChartConfiguration(processedData, {
      theme: 'dark',
      animations: true
    });
  }, [processedData]);

  return <Chart data={processedData} config={chartConfig} />;
};
```

### Component Optimization Strategies

#### 1. Avoid Inline Objects and Functions
```typescript
// ❌ Bad - creates new objects on every render
const BadComponent = () => {
  return (
    <ChildComponent
      style={{ marginTop: 10 }} // New object every render
      onClick={() => doSomething()} // New function every render
    />
  );
};

// ✅ Good - stable references
const styles = { marginTop: 10 };
const GoodComponent = () => {
  const handleClick = useCallback(() => doSomething(), []);

  return (
    <ChildComponent
      style={styles}
      onClick={handleClick}
    />
  );
};
```

#### 2. Split Components Appropriately
```typescript
// ❌ Bad - large component that re-renders everything
const MonolithicComponent = ({ user, posts, comments }) => {
  const [filter, setFilter] = useState('');

  return (
    <div>
      <UserProfile user={user} /> {/* Re-renders when filter changes */}
      <PostList posts={posts} filter={filter} />
      <CommentSection comments={comments} /> {/* Re-renders when filter changes */}
    </div>
  );
};

// ✅ Good - split into focused components
const OptimizedLayout = ({ user, posts, comments }) => {
  return (
    <div>
      <MemoizedUserProfile user={user} />
      <PostListWithFilter posts={posts} />
      <MemoizedCommentSection comments={comments} />
    </div>
  );
};
```

#### 3. Use Proper Key Props for Lists
```typescript
// ❌ Bad - using array index as key
items.map((item, index) => (
  <ItemComponent key={index} item={item} />
))

// ✅ Good - using stable unique identifier
items.map(item => (
  <ItemComponent key={item.id} item={item} />
))
```

### Performance Anti-Patterns to Avoid

#### 1. Overusing useCallback/useMemo
```typescript
// ❌ Bad - unnecessary memoization for simple values
const Component = ({ count }: Props) => {
  const doubled = useMemo(() => count * 2, [count]); // Overkill for simple math
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []); // Unnecessary if not passed to memoized children
};

// ✅ Good - use only when beneficial
const Component = ({ count }: Props) => {
  const doubled = count * 2; // Simple calculation, no memoization needed
  const handleClick = () => console.log('clicked'); // No memoization needed
};
```

#### 2. Missing Dependencies in Hooks
```typescript
// ❌ Bad - missing dependencies can cause stale closures
const Component = ({ userId }: Props) => {
  const [user, setUser] = useState(null);

  const fetchUser = useCallback(() => {
    apiService.getUser(userId).then(setUser);
  }, []); // Missing userId dependency!
};

// ✅ Good - include all dependencies
const Component = ({ userId }: Props) => {
  const [user, setUser] = useState(null);

  const fetchUser = useCallback(() => {
    apiService.getUser(userId).then(setUser);
  }, [userId]); // Correct dependencies
};
```

### ISS Tracker Specific Optimizations
Given this app's real-time polling nature:

1. **Memoize Position Components**: Use `React.memo` for position display components since coordinates change frequently
2. **Optimize Map Re-renders**: Ensure map components only re-render when position actually changes
3. **Cache Country Calculations**: Use `useMemo` for expensive geographic calculations like `getClosestCapital`
4. **Debounce User Interactions**: Use `useCallback` with proper dependencies for city selection handlers

## Known Issues

1. **Broken Test**: `App.test.js` expects "learn react" text that doesn't exist
2. **Missing ESLint Config**: TypeScript ESLint is installed but not configured
3. **Console Logging**: Remove console.log statements (noted in README todo)
4. **Security Vulnerabilities**: Run `npm audit fix` to address 9 known vulnerabilities
5. **Mixed File Extensions**: Some files are `.js` instead of `.ts`/`.tsx`

## Deployment

The application builds to the `build/` directory and is configured for GitHub Pages deployment with base path `/iss-track-react/`.