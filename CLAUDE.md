# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 20 SSR (Server-Side Rendering) help/documentation microsite called "Ayuda de Redif". It provides categorized articles for different user roles (students, professors, administrators) with features like search, markdown rendering, theming, and a PWA service worker.

## Essential Commands

### Development
```bash
npm start                                    # Start dev server on http://localhost:4200
ng serve                                     # Alternative to npm start
```

### Building
```bash
npm run build                                # Production build with SSR (outputs to dist/)
ng build --configuration development         # Development build
ng build --watch --configuration development # Watch mode for development
```

### Testing
```bash
npm test      # Run unit tests with Karma
ng test       # Alternative to npm test
```

### SSR Server
```bash
npm run serve:ssr:micrositeHelpFront         # Run SSR server (after build)
# Server runs on port 4000 by default (configurable via PORT env variable)
```

## Architecture

### SSR & Hydration Strategy
- **Angular Universal (SSR)**: Server-side rendering configured via `src/server.ts` using Express
- **TransferState**: Used in resolvers to prevent duplicate API calls between server and client
- **Client Hydration**: Configured with event replay (`provideClientHydration(withEventReplay())`)
- **Important**: All resolvers (`post.resolver.ts`, `categories.resolver.ts`) use TransferState pattern with `makeStateKey()` to cache data during SSR

### Routing & Data Resolution
- **Role-based routing**: Categories route (`/categories/:role`) maps URL roles to API titles:
  - `alumnos` → "Alumnos"
  - `profesores` → "Profesores"
  - `administracion` → "Administración"
- **Resolvers**: All major routes use resolvers to pre-fetch data before navigation
  - `postResolver`: Fetches individual post data by ID
  - `categoriesResolver`: Fetches parent category, then uses taxonomy to get children, then fetches all child categories in parallel using `forkJoin`

### Data Flow Pattern
1. Resolver checks TransferState cache (client-side after SSR)
2. If cache hit, return cached data and remove from TransferState
3. If cache miss, make API call via ApiService
4. Store result in TransferState for client hydration
5. Handle errors gracefully with redirects to `/home`

### Environment Configuration
- Three environment files in `src/environments/`:
  - `environment.ts` - Base/default config
  - `environment.development.ts` - Development (localhost:3000 API, localhost:4200 app)
  - `environment.production.ts` - Production config
- File replacements configured in `angular.json` for each configuration
- All environments include: `production`, `apiUrl`, `appUrl`, `appName`

### Theme System
- **ThemeService**: Signal-based dark/light mode management
- Reads from localStorage (`theme` key) or falls back to system preference (`prefers-color-scheme`)
- Applies body classes: `dark-theme` / `light-theme`
- Platform-aware: Only runs in browser context using `isPlatformBrowser()`

### API Service
- Single centralized service (`src/app/services/api-service.ts`)
- All endpoints prefixed with `environment.apiUrl`
- Key endpoints:
  - Categories: `GET /categories`, `GET /categories/category/:title`, `GET /categories/:id`
  - Posts: `GET /posts/:postId`
  - Taxonomy: `GET /taxonomy` (defines parent-child category relationships)
  - Search: `GET /search?q={query}&count={count}`
  - Likes: `POST /likes` with `{post: number, value: boolean}`

### Component Structure
- **Pages** (`src/app/pages/`): Route-level components (home, posts, categories, search-results)
- **Components** (`src/app/components/`): Reusable UI components (navbar, footer, search-bar, support-box, back-button)
- All components use standalone architecture (no NgModule)

### Markdown Handling
- Uses `ngx-markdown` library (configured in `app.config.ts`)
- Custom `PipeMarkdownPipe`: Strips markdown syntax for previews/excerpts
  - Removes headers, bold/italic, links, lists
  - Trims to max length (default 150 chars) with ellipsis

### Custom Icons
- Material Icon Registry configured in `app.config.ts`
- Custom SVG icons: `redif` and `redif-dark` loaded from `/images/`

### PWA Configuration
- Service Worker enabled in production builds via `ngsw-config.json`
- Asset groups:
  - **app**: Prefetch strategy for core files (index.html, CSS, JS)
  - **assets**: Lazy load strategy for images and fonts
- Registration strategy: `registerWhenStable:30000` (registers 30s after app stable)

## Important Patterns

### Adding New Resolvers
When creating resolvers:
1. Use `TransferState` with unique keys via `makeStateKey()`
2. Check cache first with `transferState.get()`
3. Remove cache after use with `transferState.remove()`
4. Store API response with `transferState.set()` in tap operator
5. Handle errors with `catchError()` and return `of(null)`
6. Validate route params and redirect to `/home` on invalid input

### Working with Environments
- Always access config via `environment` import, never hardcode URLs
- When adding new config, add to all three environment files
- Test both development and production configurations before deploying

### Styling
- Global styles in `src/styles.scss`
- SCSS preprocessor configured
- Component styles have size budget: max 4kB warning, 8kB error

## Build Configuration Notes
- Output mode: `server` (SSR enabled)
- Bundle size budgets: 1MB warning, 2MB error for initial bundle
- Production builds use output hashing for cache busting
- Service Worker only enabled in production builds (`!isDevMode()`)
- comunicate conmigo en español a partir de ahora