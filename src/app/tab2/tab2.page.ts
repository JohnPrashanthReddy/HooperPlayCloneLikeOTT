import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieService, OmdbSearchItem } from '../services/movie.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab2Page implements OnInit, OnDestroy {
  searchQuery: string = '';
  movies: OmdbSearchItem[] = [];
  filteredMovies: OmdbSearchItem[] = [];
  recentSearches: string[] = [];
  
  isLoading: boolean = false;
  hasSearched: boolean = false;
  showNoResults: boolean = false;
  
  selectedFilter: 'all' | 'movie' | 'series' = 'all';
  
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  
  // Skeleton loader array (for loading state)
  skeletonItems = Array(6).fill(0);

  constructor(
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit() {
    // Load recent searches from localStorage
    this.loadRecentSearches();
    
    // Setup debounced search
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(500), // Wait 500ms after user stops typing
      distinctUntilChanged(), // Only emit if value changed
      switchMap(query => {
        if (query.trim().length < 2) {
          this.movies = [];
          this.filteredMovies = [];
          this.hasSearched = false;
          this.showNoResults = false;
          return [];
        }
        
        this.isLoading = true;
        this.hasSearched = true;
        return this.movieService.searchMovies(query);
      })
    ).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        
        if (response.Response === 'True' && response.Search) {
          this.movies = response.Search;
          this.applyFilter();
          this.showNoResults = this.filteredMovies.length === 0;
          
          // Save to recent searches
          this.saveRecentSearch(this.searchQuery);
        } else {
          this.movies = [];
          this.filteredMovies = [];
          this.showNoResults = true;
        }
      },
      error: (error) => {
        console.error('Search error:', error);
        this.isLoading = false;
        this.showNoResults = true;
        this.movies = [];
        this.filteredMovies = [];
      }
    });
  }

  ngOnDestroy() {
    // Clean up subscription to prevent memory leaks
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  // Triggered when user types in search box
  onSearchChange(event: any) {
    const query = event.target.value || '';
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  // Clear search input and results
  clearSearch() {
    this.searchQuery = '';
    this.movies = [];
    this.filteredMovies = [];
    this.hasSearched = false;
    this.showNoResults = false;
    this.isLoading = false;
  }

  // Apply type filter (All, Movies, Series)
  selectFilter(filter: 'all' | 'movie' | 'series') {
    this.selectedFilter = filter;
    this.applyFilter();
  }

  // Filter movies based on selected type
  applyFilter() {
    if (this.selectedFilter === 'all') {
      this.filteredMovies = this.movies;
    } else {
      this.filteredMovies = this.movies.filter(movie => 
        movie.Type.toLowerCase() === this.selectedFilter
      );
    }
    
    // Update no results flag
    this.showNoResults = this.hasSearched && this.filteredMovies.length === 0;
  }

  // Navigate to movie detail page
  viewMovieDetail(movie: OmdbSearchItem) {
    this.router.navigate(['/movie-detail', movie.imdbID]);
  }

  // Click on recent search to search again
  searchRecent(query: string) {
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  // Load recent searches from localStorage
  loadRecentSearches() {
    const saved = localStorage.getItem('hooper_recent_searches');
    if (saved) {
      try {
        this.recentSearches = JSON.parse(saved);
      } catch (e) {
        this.recentSearches = [];
      }
    }
  }

  // Save search query to recent searches (max 5)
  saveRecentSearch(query: string) {
    if (!query || query.trim().length < 2) return;
    
    const trimmed = query.trim();
    
    // Remove if already exists
    this.recentSearches = this.recentSearches.filter(s => s !== trimmed);
    
    // Add to beginning
    this.recentSearches.unshift(trimmed);
    
    // Keep only last 5
    this.recentSearches = this.recentSearches.slice(0, 5);
    
    // Save to localStorage
    localStorage.setItem('hooper_recent_searches', JSON.stringify(this.recentSearches));
  }

  // Clear all recent searches
  clearRecentSearches() {
    this.recentSearches = [];
    localStorage.removeItem('hooper_recent_searches');
  }

  // Handle poster error (fallback image)
  handleImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/300x450/1a1a1a/e50914?text=No+Image';
  }
}