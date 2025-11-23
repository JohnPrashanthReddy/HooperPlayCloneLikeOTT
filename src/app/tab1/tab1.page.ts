import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MovieService, OmdbSearchItem } from '../services/movie.service';

interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  overview: string;
  year: number | null;
  rating: number;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class Tab1Page implements OnInit, OnDestroy {
  
  isLoading = false;
  heroSlides: Movie[] = [];
  activeSlideIndex = 0;
  private sliderIntervalId: any;
  private videoTimeout: any;
  private comingSoonTimeout: any;

  // Modal state
  isModalOpen = false;
  currentPreviewMovie: Movie | null = null;
  showComingSoon = false;

  trendingMovies: Movie[] = [];
  popularMovies: Movie[] = [];
  topRatedMovies: Movie[] = [];
  nowPlayingMovies: Movie[] = [];
  upcomingMovies: Movie[] = [];

  constructor(
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    if (this.sliderIntervalId) {
      clearInterval(this.sliderIntervalId);
    }
    if (this.videoTimeout) {
      clearTimeout(this.videoTimeout);
    }
    if (this.comingSoonTimeout) {
      clearTimeout(this.comingSoonTimeout);
    }
  }

  loadData() {
    this.isLoading = true;

    const requests = {
      trending: this.movieService.searchMovies('Batman'),
      action:   this.movieService.searchMovies('Action'),
      comedy:   this.movieService.searchMovies('Comedy'),
      latest:   this.movieService.searchMovies('2023'),
      vintage:  this.movieService.searchMovies('Classic'),
    };

    forkJoin(requests).subscribe({
      next: (res) => {
        const trendingRaw = res.trending.Search || [];
        this.trendingMovies = trendingRaw.map(i => this.mapOmdbSearchItem(i));
        this.heroSlides = this.trendingMovies.slice(0, 3);
        this.activeSlideIndex = 0;
        this.startAutoSlide();

        const actionRaw = res.action.Search || [];
        this.popularMovies = actionRaw.map(i => this.mapOmdbSearchItem(i));

        const comedyRaw = res.comedy.Search || [];
        this.topRatedMovies = comedyRaw.map(i => this.mapOmdbSearchItem(i));

        const latestRaw = res.latest.Search || [];
        this.nowPlayingMovies = latestRaw.map(i => this.mapOmdbSearchItem(i));

        const vintageRaw = res.vintage.Search || [];
        this.upcomingMovies = vintageRaw.map(i => this.mapOmdbSearchItem(i));

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching OMDb movies:', err);
        this.isLoading = false;
      }
    });
  }

  private mapOmdbSearchItem(item: OmdbSearchItem): Movie {
    const yearNum = parseInt(item.Year, 10);
    const poster = item.Poster && item.Poster !== 'N/A'
      ? item.Poster
      : 'https://via.placeholder.com/300x450?text=No+Image';

    return {
      id: item.imdbID,
      title: item.Title,
      poster,
      backdrop: poster,
      overview: '',
      year: isNaN(yearNum) ? null : yearNum,
      rating: 0
    };
  }

  private startAutoSlide() {
    if (this.sliderIntervalId) {
      clearInterval(this.sliderIntervalId);
    }

    if (!this.heroSlides.length) return;

    this.sliderIntervalId = setInterval(() => {
      if (this.heroSlides.length > 0) {
        this.activeSlideIndex = (this.activeSlideIndex + 1) % this.heroSlides.length;
      }
    }, 8000);
  }

  setActiveSlide(index: number) {
    this.activeSlideIndex = index;
  }

  /** Open video preview when clicking Watch Now */
  playPreview(movie: Movie, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    // Pause auto-slide
    if (this.sliderIntervalId) {
      clearInterval(this.sliderIntervalId);
    }

    this.currentPreviewMovie = movie;
    this.isModalOpen = true;
    this.showComingSoon = false;

    // Play video after modal opens
    setTimeout(() => {
      const videoElement = document.getElementById('preview-video') as HTMLVideoElement;
      if (videoElement) {
        videoElement.muted = true;
        videoElement.currentTime = 0;
        videoElement.play().catch(err => console.log('Video play error:', err));

        // After 7 seconds, show "Coming Soon" message
        this.videoTimeout = setTimeout(() => {
          this.showComingSoonMessage();
        }, 15000);
      }
    }, 300);
  }

  /** Show "Coming Soon" message after video ends */
  showComingSoonMessage() {
    const videoElement = document.getElementById('preview-video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.pause();
    }

    this.showComingSoon = true;

    // Close modal and return after 3 seconds
    this.comingSoonTimeout = setTimeout(() => {
      this.closeVideoPreview();
    }, 3000);
  }

  /** Close video preview modal */
  closeVideoPreview() {
    this.isModalOpen = false;
    this.showComingSoon = false;

    // Stop and reset video
    const videoElement = document.getElementById('preview-video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }

    if (this.videoTimeout) {
      clearTimeout(this.videoTimeout);
    }

    if (this.comingSoonTimeout) {
      clearTimeout(this.comingSoonTimeout);
    }

    // Resume auto-slide
    this.startAutoSlide();

    this.currentPreviewMovie = null;
  }

  /** Navigate to movie detail from More Info */
  openMovieDetail(movieId: string) {
    this.closeVideoPreview();
    this.router.navigate(['/movie-detail', movieId]);
  }

  /** Pull to refresh */
  doRefresh(event: any) {
    this.loadData();
    setTimeout(() => {
      event.target.complete();
    }, 800);
  }

/** Navigate to See All page */
navigateToSeeAll(title: string, movies: Movie[]) {
  this.router.navigate(['/see-all'], {
    state: {
      title: title,
      movies: movies
    }
  });
}
}