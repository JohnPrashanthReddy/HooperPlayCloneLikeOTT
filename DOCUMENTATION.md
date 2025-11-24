# HooperPlay OTT Clone - Complete Documentation

A Netflix-inspired OTT (Over-The-Top) streaming application built with **Angular 20** and **Ionic 8**.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & Project Structure](#2-architecture--project-structure)
3. [Components Documentation](#3-components-documentation)
4. [TypeScript Fundamentals Used](#4-typescript-fundamentals-used)
5. [SCSS Fundamentals Used](#5-scss-fundamentals-used)
6. [Application Flow](#6-application-flow)
7. [Exercises to Master](#7-exercises-to-master)

---

## 1. Project Overview

### Tech Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 20.0.0 | Frontend Framework |
| Ionic | 8.0.0 | Cross-platform UI Components |
| TypeScript | 5.9.0 | Type-safe JavaScript |
| RxJS | 7.8.0 | Reactive Programming |
| SCSS | - | Advanced CSS Styling |

### Color Scheme (Netflix-inspired)
```scss
$primary-red: #e50914;      // Netflix Red - CTAs, highlights
$primary-bg: #141414;       // Dark background
$secondary-bg: #1a1a1a;     // Slightly lighter background
$text-primary: #ffffff;     // Main text
$text-secondary: #e5e5e5;   // Secondary text
$text-muted: #b3b3b3;       // Muted text
$accent-blue: #4fc3f7;      // Accent color
```

### API Integration
- **OMDb API** (Open Movie Database)
- Base URL: `https://www.omdbapi.com/`
- Methods: `searchMovies()`, `getMovieById()`

---

## 2. Architecture & Project Structure

```
src/
├── app/
│   ├── services/
│   │   └── movie.service.ts          # API service for OMDb
│   ├── pages/
│   │   ├── movie-detail/             # Movie detail page
│   │   └── see-all/                  # See all movies grid
│   ├── tab1/                         # Home page (Dashboard)
│   ├── tab2/                         # Search page
│   ├── tab3/                         # Profile page
│   ├── tabs/                         # Tab navigation container
│   ├── explore-container/            # Shared component
│   ├── app.component.ts              # Root component
│   ├── app.module.ts                 # Root module
│   └── app-routing.module.ts         # Root routing
├── theme/
│   └── variables.scss                # Theme variables
├── assets/                           # Static assets
└── global.scss                       # Global styles
```

### Module System
The app uses a **hybrid module system**:
- **Standalone Components**: Tab1, Tab2, Tab3, MovieDetail, SeeAll
- **Traditional Modules**: TabsModule, ExploreContainerModule

### Lazy Loading Structure
```
Root (/)
├── /tabs (lazy loaded)
│   ├── /tab1 (lazy loaded) → Home
│   ├── /tab2 (lazy loaded) → Search
│   └── /tab3 (lazy loaded) → Profile
├── /movie-detail/:id (lazy loaded)
└── /see-all (lazy loaded)
```

---

## 3. Components Documentation

### 3.1 Tab1Page (Home/Dashboard)
**File:** `src/app/tab1/tab1.page.ts`

#### Purpose
The main landing page featuring a hero slider, movie categories, and video preview functionality.

#### Key Features
- Hero slider with auto-rotation (8-second interval)
- Video preview modal with "Coming Soon" overlay
- Pull-to-refresh functionality
- Multiple movie category sections

#### Component Properties
```typescript
// Loading state
isLoading = false;

// Hero slider
heroSlides: Movie[] = [];
activeSlideIndex = 0;
private sliderIntervalId: any;

// Modal state
isModalOpen = false;
currentPreviewMovie: Movie | null = null;
showComingSoon = false;

// Movie categories
trendingMovies: Movie[] = [];
popularMovies: Movie[] = [];
topRatedMovies: Movie[] = [];
nowPlayingMovies: Movie[] = [];
upcomingMovies: Movie[] = [];
```

#### Key Methods
| Method | Purpose |
|--------|---------|
| `loadData()` | Fetches all movie categories using `forkJoin` |
| `startAutoSlide()` | Starts the 8-second auto-rotation for hero slider |
| `playPreview()` | Opens video preview modal |
| `closeVideoPreview()` | Closes modal and resumes auto-slide |
| `doRefresh()` | Handles pull-to-refresh |
| `navigateToSeeAll()` | Navigates with state data |

---

### 3.2 Tab2Page (Search)
**File:** `src/app/tab2/tab2.page.ts`

#### Purpose
Search functionality with debounced input, filter chips, and recent search history.

#### Key Features
- Debounced search (500ms delay)
- Filter by type (All/Movie/Series)
- Recent searches (localStorage, max 5)
- Skeleton loading animation

#### Component Properties
```typescript
searchQuery: string = '';
movies: OmdbSearchItem[] = [];
filteredMovies: OmdbSearchItem[] = [];
recentSearches: string[] = [];
selectedFilter: 'all' | 'movie' | 'series' = 'all';

private searchSubject = new Subject<string>();
private searchSubscription?: Subscription;

// Skeleton loader
skeletonItems = Array(6).fill(0);
```

#### Key Methods
| Method | Purpose |
|--------|---------|
| `onSearchChange()` | Triggers debounced search via Subject |
| `selectFilter()` | Changes filter type and re-applies |
| `applyFilter()` | Filters movies by type |
| `saveRecentSearch()` | Saves to localStorage (max 5) |
| `clearRecentSearches()` | Clears localStorage history |
| `handleImageError()` | Fallback image on poster load error |

---

### 3.3 Tab3Page (Profile)
**File:** `src/app/tab3/tab3.page.ts`

#### Purpose
User profile management with favorites, settings, and preferences.

#### Key Features
- Editable user profile (name, email, avatar)
- Favorites list with horizontal scroll
- Interest selection (genre preferences)
- Language selection
- Settings modal with data management

#### Interfaces Used
```typescript
interface Movie {
  id: string;
  title: string;
  poster: string;
  year: string;
}

interface UserProfile {
  name: string;
  email: string;
  initials: string;
}
```

#### Key Methods
| Method | Purpose |
|--------|---------|
| `loadUserProfile()` | Loads profile from localStorage |
| `saveProfile()` | Validates and saves edited profile |
| `generateInitials()` | Creates avatar initials from name |
| `toggleInterest()` | Add/remove interest from list |
| `clearAllData()` | Clears all localStorage data |
| `removeFavorite()` | Removes movie from favorites |

---

### 3.4 MovieDetailPage
**File:** `src/app/pages/movie-detail/movie-detail.page.ts`

#### Purpose
Displays comprehensive movie details fetched from OMDb API.

#### Key Features
- Hero backdrop with gradient overlay
- Poster and title layout
- Genre tags
- Action buttons (Play, Watchlist, Share)
- Cast, director, and awards info

#### Key Methods
| Method | Purpose |
|--------|---------|
| `loadMovieDetails()` | Fetches movie by ID from OMDb |
| `goBack()` | Navigation back to tab1 |
| `playMovie()` | Play action (placeholder) |
| `addToWatchlist()` | Watchlist action (placeholder) |
| `shareMovie()` | Share action (placeholder) |

---

### 3.5 MovieService
**File:** `src/app/services/movie.service.ts`

#### Purpose
Centralized HTTP service for OMDb API communication.

#### Interfaces
```typescript
// Search result item
export interface OmdbSearchItem {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

// Search response wrapper
export interface OmdbSearchResponse {
  Search?: OmdbSearchItem[];
  totalResults?: string;
  Response: 'True' | 'False';
  Error?: string;
}

// Full movie details
export interface MovieDetail {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Poster: string;
  Ratings: Array<{ Source: string; Value: string }>;
  imdbRating: string;
  // ... more fields
}
```

#### Methods
```typescript
// Search movies by query
searchMovies(query: string, page: number = 1): Observable<OmdbSearchResponse>

// Get movie details by IMDb ID
getMovieById(imdbId: string): Observable<MovieDetail>
```

---

## 4. TypeScript Fundamentals Used

### 4.1 Interfaces
**Purpose:** Define the shape of objects for type safety.

```typescript
// Custom interface for local data
interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  overview: string;
  year: number | null;  // Union type for nullable
  rating: number;
}

// API response interface
export interface OmdbSearchResponse {
  Search?: OmdbSearchItem[];       // Optional property
  totalResults?: string;
  Response: 'True' | 'False';      // Literal type union
  Error?: string;
}
```

**Key Concepts:**
- Optional properties (`?`)
- Union types (`|`)
- Literal types (`'True' | 'False'`)
- Array types (`Array<T>` or `T[]`)

---

### 4.2 Type Annotations
```typescript
// Variable annotations
searchQuery: string = '';
isLoading: boolean = false;
selectedFilter: 'all' | 'movie' | 'series' = 'all';

// Array annotation
movies: OmdbSearchItem[] = [];
skeletonItems = Array(6).fill(0);

// Nullable type
currentPreviewMovie: Movie | null = null;

// Function parameter type
selectFilter(filter: 'all' | 'movie' | 'series') { }

// Return type annotation
generateInitials(name: string): string { }
```

---

### 4.3 Angular Lifecycle Hooks
```typescript
export class Tab1Page implements OnInit, OnDestroy {

  // Called once after component initialization
  ngOnInit() {
    this.loadData();
  }

  // Called when component is destroyed (cleanup)
  ngOnDestroy() {
    if (this.sliderIntervalId) {
      clearInterval(this.sliderIntervalId);
    }
    if (this.videoTimeout) {
      clearTimeout(this.videoTimeout);
    }
  }
}
```

**Lifecycle Hooks Used:**
| Hook | When Called | Use Case |
|------|-------------|----------|
| `ngOnInit` | After constructor, inputs initialized | Fetch data, setup |
| `ngOnDestroy` | Before component removal | Cleanup subscriptions, timers |

---

### 4.4 Dependency Injection
```typescript
constructor(
  private movieService: MovieService,  // Service injection
  private router: Router,              // Angular Router
  private route: ActivatedRoute        // Route parameters
) {}
```

**Angular DI Pattern:**
- Services decorated with `@Injectable({ providedIn: 'root' })`
- Automatically provided as singletons
- Injected via constructor

---

### 4.5 RxJS Operators
```typescript
import { forkJoin, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

// forkJoin - Execute multiple observables in parallel
const requests = {
  trending: this.movieService.searchMovies('Batman'),
  action: this.movieService.searchMovies('Action'),
};

forkJoin(requests).subscribe({
  next: (res) => { /* handle results */ },
  error: (err) => { /* handle error */ }
});

// Debounced search with pipe operators
this.searchSubscription = this.searchSubject.pipe(
  debounceTime(500),           // Wait 500ms after last emit
  distinctUntilChanged(),       // Only emit if value changed
  switchMap(query => {          // Cancel previous, use latest
    return this.movieService.searchMovies(query);
  })
).subscribe({ /* handlers */ });
```

**RxJS Operators Used:**
| Operator | Purpose |
|----------|---------|
| `forkJoin` | Wait for multiple observables to complete |
| `debounceTime` | Delay emissions by time |
| `distinctUntilChanged` | Only emit when value changes |
| `switchMap` | Map to observable, cancel previous |

---

### 4.6 Standalone Components
```typescript
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,                    // Standalone flag
  imports: [IonicModule, CommonModule, FormsModule],  // Direct imports
})
export class Tab1Page { }
```

**Benefits:**
- No need to declare in NgModule
- Self-contained with explicit imports
- Better tree-shaking

---

### 4.7 Array Methods
```typescript
// map() - Transform array elements
this.trendingMovies = trendingRaw.map(i => this.mapOmdbSearchItem(i));

// filter() - Filter array elements
this.filteredMovies = this.movies.filter(movie =>
  movie.Type.toLowerCase() === this.selectedFilter
);

// slice() - Get portion of array
this.recentSearches = this.recentSearches.slice(0, 5);

// unshift() - Add to beginning
this.recentSearches.unshift(trimmed);

// splice() - Remove/add at index
this.interests.splice(index, 1);

// includes() - Check if element exists
this.interests.includes(interest);

// indexOf() - Find index of element
const index = this.interests.indexOf(interest);

// fill() - Fill array with value
skeletonItems = Array(6).fill(0);
```

---

### 4.8 Event Handling
```typescript
// Event parameter typing
onSearchChange(event: any) {
  const query = event.target.value || '';
}

// Stop event propagation
removeFavorite(movieId: string, event: Event) {
  event.stopPropagation();
}

// Optional event parameter
playPreview(movie: Movie, event?: Event) {
  if (event) {
    event.stopPropagation();
  }
}
```

---

### 4.9 LocalStorage Persistence
```typescript
// Save to localStorage
localStorage.setItem('hooper_favorites', JSON.stringify(this.favorites));

// Load from localStorage
loadFavorites() {
  const stored = localStorage.getItem('hooper_favorites');
  if (stored) {
    try {
      this.favorites = JSON.parse(stored);
    } catch (e) {
      console.error('Error loading favorites:', e);
    }
  }
}

// Remove from localStorage
localStorage.removeItem('hooper_recent_searches');

// Clear all
localStorage.clear();
```

---

### 4.10 Timer Functions
```typescript
// setInterval - Repeat at interval
this.sliderIntervalId = setInterval(() => {
  this.activeSlideIndex = (this.activeSlideIndex + 1) % this.heroSlides.length;
}, 8000);

// setTimeout - Delay execution
setTimeout(() => {
  this.showComingSoonMessage();
}, 15000);

// clearInterval - Stop interval
if (this.sliderIntervalId) {
  clearInterval(this.sliderIntervalId);
}

// clearTimeout - Cancel timeout
if (this.videoTimeout) {
  clearTimeout(this.videoTimeout);
}
```

---

## 5. SCSS Fundamentals Used

### 5.1 Variables
```scss
// Define variables at top of file
$primary-bg: #141414;
$secondary-bg: #1a1a1a;
$primary-red: #e50914;
$text-primary: #ffffff;
$text-secondary: #e5e5e5;
$text-muted: #b3b3b3;
$border-color: #2a2a2a;

// Usage
.search-content {
  --background: #{$primary-bg};
  --color: #{$text-primary};
}
```

---

### 5.2 Nesting
```scss
// Nested selectors
.profile-header {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  ion-toolbar {
    --background: #1a1a1a;
    --border-color: rgba(255, 255, 255, 0.05);
    --padding-top: 12px;
    --padding-bottom: 12px;
  }
}

// Deep nesting with elements
.movie-card {
  cursor: pointer;

  img {
    width: 100%;
    height: 195px;
    object-fit: cover;
  }

  .movie-info {
    margin-top: 8px;

    .movie-title {
      font-size: 13px;
      font-weight: 500;
    }
  }
}
```

---

### 5.3 Parent Selector (&)
```scss
.play-btn {
  --background: #e50914;

  // Hover state - &:hover becomes .play-btn:hover
  &:hover {
    --background: #b20710;
  }

  // Active state
  &:active {
    transform: scale(0.95);
  }
}

.filter-chip {
  --background: #{$secondary-bg};

  // Modifier class - &.active becomes .filter-chip.active
  &.active {
    --background: #{$primary-red};
    font-weight: 600;
  }
}

// Adjacent sibling with parent
.favorite-card {
  &:hover .remove-btn {
    opacity: 1;
  }
}
```

---

### 5.4 CSS Custom Properties (Ionic Variables)
```scss
// Ionic component styling with CSS custom properties
ion-content {
  --background: #141414;
  --color: #fff;
}

ion-toolbar {
  --background: transparent;
  --border-style: none;
  --min-height: 60px;
}

ion-searchbar {
  --background: #{$secondary-bg};
  --color: #{$text-primary};
  --placeholder-color: #{$text-muted};
  --icon-color: #{$text-muted};
  --clear-button-color: #{$text-muted};
  --border-radius: 8px;
}

ion-button {
  --background: #e50914;
  --color: #fff;
  --border-radius: 6px;
}
```

---

### 5.5 Keyframe Animations
```scss
// Define animation
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

// Apply animation
.logo-title {
  animation: fadeInDown 0.6s ease-out;
}

.coming-soon-icon {
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-poster {
  animation: loading 1.5s infinite;
}
```

---

### 5.6 Transitions
```scss
// Single property transition
.movie-card {
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

// Multiple properties
.header-icon {
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    color: #e50914;
  }
}

// Specific properties
.hero-bg-image {
  transition: opacity 0.5s ease, transform 0.3s ease;
}
```

---

### 5.7 Gradients
```scss
// Linear gradient (vertical)
.gradient-toolbar {
  background: linear-gradient(180deg,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.7) 70%,
    rgba(0, 0, 0, 0) 100%
  );
}

// Linear gradient (diagonal)
.coming-soon-overlay {
  background: linear-gradient(
    135deg,
    rgba(229, 9, 20, 0.95) 0%,
    rgba(139, 0, 0, 0.95) 100%
  );
}

// Profile avatar gradient
.profile-avatar {
  background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
}

// Gradient overlay for images
.hero-bg-image::before {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(20, 20, 20, 0.95) 100%
  );
}
```

---

### 5.8 Flexbox
```scss
// Center content
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

// Space between
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

// Row with gap
.hero-buttons {
  display: flex;
  gap: 10px;
}

// Flex item sizing
.play-button {
  flex: 1;  // Grow to fill space
}

.movie-poster {
  flex-shrink: 0;  // Don't shrink
}
```

---

### 5.9 CSS Grid
```scss
// Auto-fill responsive grid
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

// Fixed column grid
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

// Responsive grid
@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

### 5.10 Media Queries
```scss
// Tablet and up
@media (min-width: 768px) {
  .hero-slider {
    height: 550px;
  }

  .movie-card {
    min-width: 160px;
    max-width: 160px;

    img {
      height: 240px;
    }
  }
}

// Mobile only
@media (max-width: 576px) {
  .search-container {
    padding: 12px;
  }
}

// Hover capability detection
@media (hover: hover) {
  .hero-slide:hover {
    .play-overlay {
      opacity: 1;
    }
  }
}

// Touch devices
@media (hover: none) {
  .play-overlay {
    opacity: 0.6;
  }
}
```

---

### 5.11 Pseudo Elements
```scss
// ::before for overlays
.hero-bg-image::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(...);
  z-index: 1;
}

// Decorative pattern
.profile-avatar::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.03) 10px,
    rgba(255, 255, 255, 0.03) 20px
  );
}

// ::after for gradient fade
.hero-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(to top, #141414 0%, transparent 100%);
}
```

---

### 5.12 Box Shadows & Filters
```scss
// Box shadow
.movie-card img {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7);
  }
}

// Colored glow shadow
.profile-avatar {
  box-shadow: 0 8px 24px rgba(229, 9, 20, 0.3);
}

// Text shadow
.logo-hooper {
  text-shadow:
    0 0 10px rgba(255, 255, 255, 0.5),
    2px 2px 4px rgba(0, 0, 0, 0.8);
}

// Filter effects
.header-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

// Backdrop filter (glassmorphism)
.gradient-toolbar {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
```

---

### 5.13 Scroll Styling
```scss
// Horizontal scroll container
.horizontal-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 0 16px 10px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  // Hide scrollbar
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}

// Scroll snap items
.movie-card {
  scroll-snap-align: start;
}

// Custom scrollbar styling
.filter-chips {
  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: $border-color;
    border-radius: 2px;
  }
}
```

---

### 5.14 Text Truncation
```scss
// Single line truncation
.movie-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// Multi-line truncation (webkit)
.movie-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

### 5.15 Ionic Part Selector
```scss
// Style Ionic shadow DOM parts
ion-modal.video-preview-modal {
  &::part(backdrop) {
    background: rgba(0, 0, 0, 0.95);
  }

  &::part(content) {
    animation: modalSlideUp 0.3s ease;
  }
}

// Searchbar native part
.custom-searchbar::part(native) {
  border: 1px solid $border-color;

  &:focus-within {
    border-color: $primary-red;
  }
}
```

---

## 6. Application Flow

### 6.1 App Initialization Flow
```
main.ts
  └── bootstrapModule(AppModule)
        └── AppComponent
              └── <ion-app>
                    └── <ion-router-outlet>
                          └── Routes loaded based on URL
```

### 6.2 Tab Navigation Flow
```
User opens app
  └── Redirects to /tabs/tab1 (default)
        └── TabsPage loads
              ├── Tab bar displays at bottom
              └── Tab1Page loads in outlet
                    └── ngOnInit() → loadData()
                          └── forkJoin() fetches all categories
                                └── Data displays in template
```

### 6.3 Search Flow (Tab2)
```
User types in searchbar
  └── onSearchChange(event) triggered
        └── searchSubject.next(query)
              └── pipe operators process:
                    ├── debounceTime(500) - waits 500ms
                    ├── distinctUntilChanged() - checks if changed
                    └── switchMap() - calls API
                          └── subscribe() receives response
                                ├── Update movies array
                                ├── Apply filter
                                └── Save to recent searches
```

### 6.4 Movie Detail Flow
```
User taps movie card
  └── viewMovieDetail(movie) or openMovieDetail(movieId)
        └── router.navigate(['/movie-detail', movie.imdbID])
              └── MovieDetailPage loads
                    └── ngOnInit()
                          └── route.snapshot.paramMap.get('id')
                                └── loadMovieDetails()
                                      └── movieService.getMovieById()
                                            └── Display in template
```

### 6.5 Profile Edit Flow
```
User taps settings → Edit Profile
  └── openEditProfile()
        ├── Pre-fill form with current values
        └── Open modal
              └── User edits and taps Save
                    └── saveProfile()
                          ├── Validate inputs
                          ├── Generate initials
                          ├── Update local state
                          └── Save to localStorage
```

---

## 7. Exercises to Master

### TypeScript Exercises

#### Exercise 1: Create a New Interface
Create an interface for a "TVShow" with properties: id, title, seasons, episodes, network, and status.
```typescript
// Your code here
interface TVShow {
  // Add properties
}
```

**Expected Solution:**
```typescript
interface TVShow {
  id: string;
  title: string;
  seasons: number;
  episodes: number;
  network: string;
  status: 'running' | 'ended' | 'cancelled';
}
```

---

#### Exercise 2: Implement a Toggle Function
Create a function that toggles an item in an array (add if not present, remove if present).
```typescript
// Implement this function
toggleItem<T>(array: T[], item: T): T[] {
  // Your code here
}
```

**Expected Solution:**
```typescript
toggleItem<T>(array: T[], item: T): T[] {
  const index = array.indexOf(item);
  if (index > -1) {
    return array.filter((_, i) => i !== index);
  } else {
    return [...array, item];
  }
}
```

---

#### Exercise 3: Create a Debounced Search
Implement a search with 300ms debounce using RxJS.
```typescript
// Setup debounced search
private searchSubject = new Subject<string>();

setupSearch() {
  // Your code here using pipe operators
}
```

**Expected Solution:**
```typescript
private searchSubject = new Subject<string>();
private searchSub?: Subscription;

setupSearch() {
  this.searchSub = this.searchSubject.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(query => this.movieService.searchMovies(query))
  ).subscribe({
    next: (results) => this.handleResults(results),
    error: (err) => console.error(err)
  });
}
```

---

#### Exercise 4: LocalStorage Service
Create a generic service for localStorage operations.
```typescript
@Injectable({ providedIn: 'root' })
export class StorageService {
  // Implement: get, set, remove methods
}
```

**Expected Solution:**
```typescript
@Injectable({ providedIn: 'root' })
export class StorageService {
  get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
```

---

#### Exercise 5: Implement Auto-Slide
Create an auto-sliding carousel that cycles every 5 seconds.
```typescript
// Implement auto-slide functionality
currentIndex = 0;
items: string[] = ['A', 'B', 'C', 'D'];
private intervalId: any;

startAutoSlide() {
  // Your code here
}

stopAutoSlide() {
  // Your code here
}
```

**Expected Solution:**
```typescript
currentIndex = 0;
items: string[] = ['A', 'B', 'C', 'D'];
private intervalId: any;

startAutoSlide() {
  this.stopAutoSlide(); // Clear existing
  this.intervalId = setInterval(() => {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
  }, 5000);
}

stopAutoSlide() {
  if (this.intervalId) {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}

ngOnDestroy() {
  this.stopAutoSlide();
}
```

---

### SCSS Exercises

#### Exercise 6: Create a Card Component
Style a movie card with hover effects, shadow, and transition.
```scss
.movie-card {
  // Add styles for:
  // - Border radius
  // - Box shadow
  // - Hover scale effect
  // - Transition
}
```

**Expected Solution:**
```scss
.movie-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(229, 9, 20, 0.4);
  }

  &:active {
    transform: scale(0.98);
  }

  img {
    width: 100%;
    height: auto;
    display: block;
  }
}
```

---

#### Exercise 7: Create a Skeleton Loader
Implement a skeleton loading animation.
```scss
.skeleton {
  // Add shimmer animation
}
```

**Expected Solution:**
```scss
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #1a1a1a 25%,
    #2a2a2a 50%,
    #1a1a1a 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-poster {
  @extend .skeleton;
  width: 100%;
  padding-bottom: 150%; // 2:3 aspect ratio
}

.skeleton-title {
  @extend .skeleton;
  height: 16px;
  width: 80%;
  margin-top: 8px;
}
```

---

#### Exercise 8: Create a Gradient Overlay
Add a gradient overlay to an image that darkens from bottom.
```scss
.image-container {
  position: relative;

  // Add ::after pseudo-element with gradient
}
```

**Expected Solution:**
```scss
.image-container {
  position: relative;

  img {
    width: 100%;
    display: block;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(
      to top,
      rgba(20, 20, 20, 1) 0%,
      rgba(20, 20, 20, 0.8) 30%,
      transparent 100%
    );
    pointer-events: none;
  }
}
```

---

#### Exercise 9: Create Responsive Grid
Build a responsive grid that shows 2 columns on mobile, 4 on tablet, 6 on desktop.
```scss
.movie-grid {
  // Implement responsive grid
}
```

**Expected Solution:**
```scss
.movie-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px;

  @media (min-width: 576px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  @media (min-width: 992px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(6, 1fr);
    gap: 20px;
  }
}
```

---

#### Exercise 10: Create Glassmorphism Effect
Style a component with glassmorphism (frosted glass effect).
```scss
.glass-card {
  // Add glassmorphism styles
}
```

**Expected Solution:**
```scss
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  padding: 24px;

  // For dark theme
  &.dark {
    background: rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.1);
  }
}
```

---

### Advanced Exercises

#### Exercise 11: Implement Infinite Scroll
Add infinite scroll pagination to the search results.
```typescript
// Implement in Tab2Page
currentPage = 1;
hasMore = true;

loadMore(event: any) {
  // Your code here
}
```

---

#### Exercise 12: Create a Rating Component
Build a star rating component that displays 5 stars based on a rating value (0-10).
```typescript
// Input: rating = 7.5
// Output: ★★★★☆ (3.75 stars filled)
```

---

#### Exercise 13: Add Pull-to-Refresh
Implement pull-to-refresh that reloads all data.
```typescript
doRefresh(event: any) {
  // Your code here
}
```

---

#### Exercise 14: Create Theme Switcher
Implement a light/dark theme toggle using CSS variables.
```scss
// Define theme variables and switching logic
```

---

#### Exercise 15: Add Favorites Functionality
Implement complete favorites system:
1. Toggle favorite status
2. Persist to localStorage
3. Show toast notification
4. Sync across tabs

---

## Summary

### Key TypeScript Concepts to Master
1. Interfaces and Type Annotations
2. Angular Lifecycle Hooks (OnInit, OnDestroy)
3. Dependency Injection
4. RxJS Operators (forkJoin, debounceTime, switchMap)
5. Standalone Components
6. Array Methods (map, filter, slice, splice)
7. Event Handling
8. LocalStorage API
9. Timer Functions (setInterval, setTimeout)

### Key SCSS Concepts to Master
1. Variables and Nesting
2. Parent Selector (&)
3. CSS Custom Properties
4. Keyframe Animations
5. Transitions
6. Gradients (linear, radial)
7. Flexbox Layout
8. CSS Grid
9. Media Queries
10. Pseudo Elements (::before, ::after)
11. Box Shadows and Filters
12. Scroll Styling

### Best Practices
1. Always clean up subscriptions and timers in `ngOnDestroy`
2. Use TypeScript interfaces for type safety
3. Leverage RxJS operators for reactive patterns
4. Use CSS custom properties for theming
5. Implement responsive design with mobile-first approach
6. Use semantic class names
7. Comment complex SCSS sections
8. Use `forkJoin` for parallel HTTP requests
9. Implement error handling in all async operations
10. Use localStorage for client-side persistence

---

*Documentation created for HooperPlayCloneLikeOTT - A Netflix-inspired OTT Application*
