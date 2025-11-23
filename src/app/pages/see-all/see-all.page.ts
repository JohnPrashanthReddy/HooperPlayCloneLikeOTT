import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

interface Movie {
  id: string;
  title: string;
  poster: string;
  year: number | null;
}

@Component({
  selector: 'app-see-all',
  templateUrl: './see-all.page.html',
  styleUrls: ['./see-all.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SeeAllPage implements OnInit {
  categoryTitle: string = '';
  movies: Movie[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Get data from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.categoryTitle = navigation.extras.state['title'];
      this.movies = navigation.extras.state['movies'];
    }
  }

  goBack() {
    this.router.navigate(['/tabs/tab1']);
  }

  openMovieDetail(movieId: string) {
    this.router.navigate(['/movie-detail', movieId]);
  }
}