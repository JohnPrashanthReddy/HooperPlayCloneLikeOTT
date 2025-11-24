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

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'new_release' | 'recommendation' | 'update' | 'promo';
  read: boolean;
  movieId?: string;
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

  // Notifications
  isNotificationsOpen = false;
  notifications: Notification[] = [
    {
      id: 1,
      title: 'New Release Alert!',
      message: 'The Dark Knight Returns is now available to stream. Watch the legendary Batman in action!',
      time: '2 mins ago',
      type: 'new_release',
      read: false,
      movieId: 'tt0468569'
    },
    {
      id: 2,
      title: 'Recommended for You',
      message: 'Based on your viewing history, you might enjoy "Inception" - a mind-bending thriller.',
      time: '1 hour ago',
      type: 'recommendation',
      read: false,
      movieId: 'tt1375666'
    },
    {
      id: 3,
      title: 'Weekend Special',
      message: 'Get 50% off on premium subscription this weekend only! Upgrade now.',
      time: '3 hours ago',
      type: 'promo',
      read: false
    },
    {
      id: 4,
      title: 'Continue Watching',
      message: 'You left off at 45:23 in "Fight Club". Resume watching now!',
      time: '5 hours ago',
      type: 'update',
      read: true,
      movieId: 'tt0137523'
    },
    {
      id: 5,
      title: 'New Season Available',
      message: 'Breaking Bad Season 5 is now streaming. Catch up on all the drama!',
      time: '1 day ago',
      type: 'new_release',
      read: true
    },
    {
      id: 6,
      title: 'Your Watchlist Update',
      message: '"The Matrix" from your watchlist is now available in 4K quality.',
      time: '2 days ago',
      type: 'update',
      read: true,
      movieId: 'tt0133093'
    }
  ];

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

// ==========================================
// HEADER BUTTON NAVIGATION
// ==========================================

/** Navigate to Search (Tab2) */
navigateToSearch() {
  this.router.navigate(['/tabs/tab2']);
}

/** Navigate to Profile (Tab3) */
navigateToProfile() {
  this.router.navigate(['/tabs/tab3']);
}

// ==========================================
// NOTIFICATIONS
// ==========================================

/** Get count of unread notifications */
get unreadNotifications(): number {
  return this.notifications.filter(n => !n.read).length;
}

/** Open notifications modal */
openNotifications() {
  this.isNotificationsOpen = true;
}

/** Close notifications modal */
closeNotifications() {
  this.isNotificationsOpen = false;
}

/** Mark all notifications as read */
markAllAsRead() {
  this.notifications = this.notifications.map(n => ({ ...n, read: true }));
}

/** Handle notification click */
handleNotificationClick(notification: Notification) {
  // Mark as read
  notification.read = true;

  // Navigate to movie if movieId exists
  if (notification.movieId) {
    this.closeNotifications();
    this.router.navigate(['/movie-detail', notification.movieId]);
  }
}

/** Get icon name based on notification type */
getNotificationIcon(type: string): string {
  switch (type) {
    case 'new_release':
      return 'film-outline';
    case 'recommendation':
      return 'star-outline';
    case 'update':
      return 'refresh-outline';
    case 'promo':
      return 'pricetag-outline';
    default:
      return 'notifications-outline';
  }
}
}