import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService, MovieDetail } from '../../services/movie.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class MovieDetailPage implements OnInit {
  movie: MovieDetail | null = null;
  isLoading = true;
  movieId: string = '';
  genres: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.movieId = this.route.snapshot.paramMap.get('id') || '';
    if (this.movieId) {
      this.loadMovieDetails();
    }
  }

  loadMovieDetails() {
    this.isLoading = true;
    this.movieService.getMovieById(this.movieId).subscribe({
      next: (data) => {
        this.movie = data;
        this.genres = data.Genre ? data.Genre.split(', ') : [];
        this.isLoading = false;
        console.log('Movie details loaded:', data);
      },
      error: (error) => {
        console.error('Error loading movie details:', error);
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/tabs/tab1']);
  }

  playMovie() {
    console.log('Play movie:', this.movie?.Title);
    alert('Play functionality coming soon!');
  }

  addToWatchlist() {
    console.log('Add to watchlist:', this.movie?.Title);
    alert('Added to watchlist!');
  }

  shareMovie() {
    console.log('Share movie:', this.movie?.Title);
    alert('Share functionality coming soon!');
  }
}