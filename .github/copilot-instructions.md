# Copilot Instructions for NontonApaYa

## Project Overview
NontonApaYa is a React movie/TV show discovery and tracking application. It integrates TMDB API for content discovery, Firebase for authentication, and a custom backend (nonton-api) for user watchlist/watched list management. The app uses Context API + Reducer pattern for state management, combining local storage persistence with server synchronization.

## Architecture

### Data Flow
1. **External APIs**: TMDB API (movies/TV data) → Custom hooks fetch and paginate
2. **Global State**: `GlobalState.js` manages watchlist/watched lists via `AppReducer`
3. **Persistence**: localStorage mirrors server state; sync on mount and state changes
4. **Backend API**: `nonton-api` at `https://nonton-api.vercel.app/api` (axios instance: `nonton`)

### Key Files & Patterns
- [src/context/GlobalState.js](src/context/GlobalState.js) - Reducer dispatch + async server calls (`postMovieToWatchlist`, `deleteMovieFromWatched`, etc.)
- [src/context/AppReducer.js](src/context/AppReducer.js) - Defines ACTIONS enum and state shape
- [src/apis/tmdb.js](src/apis/tmdb.js) - TMDB axios instance with Bearer token auth (no API key param)
- [src/apis/nonton.js](src/apis/nonton.js) - Custom backend axios instance
- [src/hooks/](src/hooks/) - Data-fetching hooks (usePopularFetch, useActorMovieFetch, etc.) using axios.CancelToken for cleanup
- [src/pages/](src/pages/) - Route components; most combine hooks + GlobalContext to display and manage items
- [src/components/](src/components/) - Reusable UI (MovieCard, TVCard, Header, Modal, etc.)

## Developer Workflows

### Build & Run
```bash
npm start          # Dev server on http://localhost:3000
npm run build      # Production build
npm test           # Run tests
```

### Environment Variables
Create `.env` in project root:
```
REACT_APP_TMDB_KEY=<api_key>
REACT_APP_TMDB_ACCESS_TOKEN=<bearer_token>
```
Both are required; TMDB calls use Bearer token auth.

## Code Conventions

### Custom Hooks for Data Fetching
**Use `usePaginatedFetch` hook for all paginated TMDB API calls** to eliminate repetitive code.

```javascript
// Generic hook for any TMDB paginated endpoint
const { data, loading, error, hasMore } = usePaginatedFetch(
  'discover/movie',
  { with_genres: 28, sort_by: 'popularity.desc' },
  pageNumber
)
```

This replaces individual hooks (useGenreFetch, useKeywordFetch, etc.) with a single flexible hook:
- Returns `{ loading, error, hasMore, data }` uniformly
- Handles deduplication, cancellation, and reset automatically
- Located: [src/hooks/usePaginatedFetch.js](src/hooks/usePaginatedFetch.js)

Legacy hooks (usePopularFetch, useGenreFetch, etc.) are still available but can be gradually refactored.

### State Actions (AppReducer.js)
- Action types in ACTIONS enum (e.g., `ADD_MOVIE_TO_WATCHLIST`, `ADD_MOVIE_TO_WATCHED`)
- Async operations in GlobalState: call backend API first, then dispatch
- Use `extractMovieData()` to normalize movie fields before API calls (eliminates repetitive object construction)
- Use `getYear()` helper for date formatting instead of `.substr(0, 4)`
- Toast notifications via `react-toastify` on user actions
- localStorage persistence automatically handled by `persistState()` utility
- Located: [src/utils/dataTransformer.js](src/utils/dataTransformer.js) and [src/utils/storageHelper.js](src/utils/storageHelper.js)

### Page Structure
- Pages import from routes in [src/App.js](src/App.js)
- Use `PaginatedPage` wrapper component for list pages to eliminate boilerplate: [src/components/PaginatedPage.jsx](src/components/PaginatedPage.jsx)
- Combine `usePaginatedFetch` with `PaginatedPage` for fast page creation:
```javascript
const [pageNumber, setPageNumber] = useState(1)
const { data, loading, error, hasMore } = usePaginatedFetch('endpoint', params, pageNumber)
return <PaginatedPage 
  items={data} 
  loading={loading} 
  hasMore={hasMore}
  onLoadMore={() => setPageNumber(p => p + 1)}
  title="Page Title"
/>
```
- Link to detail pages via `<Link to={`/movie/${id}`}>` or `/tv/${id}`

### Components
- Reusable cards: `MovieCard`, `TVCard`, `CollectionCard`, `LoadingCard`
- Detail views: `MovieDetail`, `TVDetail`, `TVSeason`, `TVEpisodeDetail`
- Modal for expanded info: [src/components/Modal.jsx](src/components/Modal.jsx)
- Rating/Network display: `Rating`, `NetworkBadge`, `TVNetworkLabel`, `MovieNetworkLabel`

## API Integration

### TMDB API (tmdb.js)
- Base: `https://api.themoviedb.org/3/`
- Auth: `Authorization: Bearer ${ACCESS_TOKEN}` header
- Image base: `https://image.tmdb.org/t/p/w500` (use `BASE_IMG_URL` constant)
- Common endpoints: `movie/popular`, `tv/popular`, `person/{id}/movie_credits`, etc.

### Custom Backend (nonton.js)
- Base: `https://nonton-api.vercel.app/api`
- Methods: POST/DELETE to `/watchlist/movie`, `/watched/movie`, `/watched/episode`
- Response: `{ id, title, ... }` matching movie/episode structure
- Always dispatch action + show toast after backend call

## Testing & Debugging
- Tests: `npm test` (uses react-scripts, jest + @testing-library/react)
- No explicit debug setup documented; use console.log (visible in npm start output)
- Firebase auth: Uses `react-firebase-hooks` for `useAuthState(auth)`

## Browser & Build Support
- Target: Modern browsers (>0.2% from browserslist config)
- Built with Create React App (react-scripts 5.0.1)
- No eject; modifications via .env only

## Styling System

### Design System Variables
All styling uses a centralized design system (`src/styles/design-system.css`) with CSS variables:

**Spacing Scale** (use consistently):
```css
--space-xs: 3px, --space-sm: 5px, --space-md: 10px, --space-lg: 15px,
--space-xl: 20px, --space-2xl: 30px, --space-3xl: 50px
```

**Colors**: `--primary`, `--secondary`, `--watched`, `--watchlist`, etc.
**Typography**: `--font-size-*`, `--font-weight-*`
**Components**: `--shadow-sm`, `--border-radius-md`, `--transition-fast`, etc.

### Utility Classes
Reusable component patterns (avoid repeating CSS):
- `.pill-badge` - Status badges
- `.status-badge` - Status indicators  
- `.card` - Card components
- `.text-primary-color` - Text color helpers
- `.flex-center`, `.flex-between` - Flexbox helpers

**When adding styles**: Use design system variables instead of hardcoded values. See `STYLING_EXAMPLES.md` for before/after patterns.

## Common Patterns to Follow

1. **New paginated page**: Use `usePaginatedFetch` hook + `PaginatedPage` component wrapper (replaces ~50 lines with ~15)
2. **New watchlist action**: Use `extractMovieData()` to normalize fields, then call GlobalState function
3. **Date formatting**: Use `getYear()` instead of `.substr(0, 4)`
4. **localStorage access**: Use `loadFromStorage()` / `saveToStorage()` utilities instead of direct JSON.parse/stringify
5. **New styling**: Use `var(--space-lg)` instead of hardcoded `15px`, reference `src/styles/design-system.css` for all tokens
6. **New API endpoint**: Add to tmdb.js or nonton.js with consistent baseURL structure
