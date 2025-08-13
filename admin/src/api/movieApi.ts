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
  addedAt?: string;
  description: string;
  releaseYear: number;
  runningTime: number;
  quality: string[];
  genres: string[];
  age: number;
  actors: string[];
  director: string;
  category: string;
  country: string;
  photos: FileList | null;
  cover: FileList | null;
  video: File | null;
  link: string;
}

export interface MovieDTO {
  movieId: number;
  title: string;
  releaseYear: number;
  description: string;
  director: { id: number; name: string };
  runningTime: number;
  genres: { id: number; name: string }[];
  age: number;
  country: string;
  categories: { id: number; name: string }[];
  qualities: { id: number; name: string }[];
  actors: { id: number; name: string }[];
  addedAt: string;
  imagePath: string;
  videoPath: string;
  averageRating: number;
  isVisible: boolean;
  views: number;
  link: string;
}

export type CreateMovieRequest = {
  title: string;
  description: string;
  releaseYear: number;
  runningTime: number;
  qualityIds: number[];
  genreIds: number[];
  age: number;
  actorIds: number[];
  directorId: number;
  categoryIds: number[];
  country: string;
  cover: FileList | null;
  video: FileList | null;
  link: string;
};

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

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

export const getMovieById = async (id: number): Promise<MovieDTO> => {
  const response = await axios.get<MovieDTO>(
    `http://localhost:5219/api/movies/${id}`
  );
  return response.data;
};

export const createMovie = async (formData: CreateMovieRequest) => {
  const response = await axios.post(
    "http://localhost:5219/api/Movies",
    formData
  );
  return response.data;
};

export const updateMovie = async (id: number, formData: CreateMovieRequest) => {
  const payload = {
    ...formData,
    coverImage: formData.cover?.[0]
      ? await fileToBase64(formData.cover[0])
      : undefined,
    videoFile: formData.video
      ? await fileToBase64(formData.video[0])
      : undefined,
  };

  delete (payload as any).cover;
  delete (payload as any).video;
  const response = await axios.put(
    `http://localhost:5219/api/Movies/${id}`,
    payload
  );
  return response.data;
};

export const deleteMovieById = async (id: number): Promise<void> => {
  await axios.delete(`http://localhost:5219/api/Movies/${id}`);
};

export const toggleMovieStatus = async (id: number): Promise<boolean> => {
  const response = await axios.put<boolean>(
    `http://localhost:5219/api/movies/${id}/toggle-visibility`
  );
  return response.data;
};

// Fetching Form data for movie creation
export type Genre = {
  id: number;
  name: string;
};

export const fetchGenres = async (): Promise<Genre[]> => {
  const res = await fetch("http://localhost:5219/api/Genres");
  if (!res.ok) throw new Error("Failed to fetch genres");
  return res.json();
};

export type Category = {
  id: number;
  name: string;
};
export const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch("http://localhost:5219/api/Category");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

export type Director = {
  id: number;
  name: string;
};
export const fetchDirectors = async (): Promise<Director[]> => {
  const res = await fetch("http://localhost:5219/api/Director");
  if (!res.ok) throw new Error("Failed to fetch directors");
  return res.json();
};

export type Actor = {
  id: number;
  name: string;
};
export const fetchActors = async (): Promise<Actor[]> => {
  const res = await fetch("http://localhost:5219/api/Actor");
  if (!res.ok) throw new Error("Failed to fetch actors");
  return res.json();
};

export type Quality = {
  id: number;
  name: string;
};
export const fetchQualities = async (): Promise<Quality[]> => {
  const res = await fetch("http://localhost:5219/api/Quality");
  if (!res.ok) throw new Error("Failed to fetch qualities");
  return res.json();
};

// Views

export const getUniqueMonthlyViews = async () => {
  const response = await axios.get<number>(
    "http://localhost:5219/api/movies/monthlyUniqueViews"
  );
  return response.data;
};
