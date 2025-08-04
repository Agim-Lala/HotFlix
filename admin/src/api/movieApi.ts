// src/api/movieApi.ts
import axios from "axios";

export enum SortFields {
  MovieId = "Id",
  Title = "Title",
  Rating = "Rating",
  Views = "Views",
  IsVisible = "Status",
  CreatedAt = "CreatedAt",
}

export interface PaginatedMovieResponse {
  movies: Movie[];
  totalCount: number;
}

interface MovieQueryOptions {
  sortBy?: SortFields;
  ascending?: boolean;
  page?: number;
  pageSize?: number;
  filters?: Record<string, string | number | boolean>;
}

export interface Movie {
  movieId: number;
  title: string;
  categories: string[];
  averageRating: number;
  views?: number;
  isVisible?: boolean;
  createdAt?: string;
}

export const fetchMovies = async (
  options: MovieQueryOptions = {}
): Promise<PaginatedMovieResponse> => {
  const {
    sortBy = SortFields.MovieId,
    ascending = false,
    page,
    pageSize,
    filters = {},
  } = options;

  const params = {
    sortBy,
    ascending,
    ...filters,
    page: page !== undefined ? page : 1,
    pageSize: pageSize !== undefined ? pageSize : 10,
  };

  const response = await axios.get<PaginatedMovieResponse>(
    "http://localhost:5219/api/movies/sorted",
    { params }
  );

  return response.data;
};

export const getMoviesSortedByRating = async () => {
  const response = await fetchMovies({
    sortBy: SortFields.Rating,
    ascending: false,
  });
  return response.movies;
};

export const getMoviesSortedByCreatedAt = async () => {
  const response = await fetchMovies({
    sortBy: SortFields.CreatedAt,
    ascending: false,
  });
  return response.movies;
};
