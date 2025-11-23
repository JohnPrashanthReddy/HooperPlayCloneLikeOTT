import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// === OMDb Search Interfaces ===
export interface OmdbSearchItem {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface OmdbSearchResponse {
  Search?: OmdbSearchItem[];
  totalResults?: string;
  Response: 'True' | 'False';
  Error?: string;
}

// === OMDb Movie Detail Interface (Complete) ===
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
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{ Source: string; Value: string }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private baseUrl = 'https://www.omdbapi.com/';
  private apiKey = '76128a88'; // Your OMDb key

  constructor(private http: HttpClient) {}

  /** Search movies by text (for lists, trending-style, etc.) */
  searchMovies(query: string, page: number = 1): Observable<OmdbSearchResponse> {
    const params = new HttpParams()
      .set('apikey', this.apiKey)
      .set('s', query)
      .set('page', page.toString());

    return this.http.get<OmdbSearchResponse>(this.baseUrl, { params });
  }

  /** Get full details for a single movie by IMDb ID */
  getMovieById(imdbId: string): Observable<MovieDetail> {
    const params = new HttpParams()
      .set('apikey', this.apiKey)
      .set('i', imdbId)
      .set('plot', 'full'); // Get full plot description

    return this.http.get<MovieDetail>(this.baseUrl, { params });
  }
}