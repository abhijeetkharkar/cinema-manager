export interface Cinema {
  id: number;
  path: string;
  imdbId: string;
  tmdbId: number;
  type: string;
  title: string;
  year: number;
  releaseDate: Date;
  rated: string;
  runtime: number;
  genres: string[];
  plot: string;
  imdbRating: number;
  imdbVotes: number;
  metascore: number;
  awards?: string;
  language: string[];
  director: string[];
  actors: string[];
  revenue: number;
  poster: string;
  quality: string;
}
