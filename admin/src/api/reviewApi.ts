import axios from "axios";

export enum SortFields {
  ReviewId = "Id",
  Title = "Title",
  Author = "Author",
  Text = "Text",
  Rating = "Rating",
  CreatedAt = "CreatedAt",
}

export interface PaginatedReviewResponse {
  reviews: Review[];
  totalCount: number;
}

interface ReviewQueryOptions {
  sortBy?: SortFields;
  ascending?: boolean;
  page?: number;
  pageSize?: number;
  filters?: Record<string, string | number | boolean>;
}

export interface Review {
  reviewId: number;
  movieTitle: string;
  Author: string;
  text: string;
  Rating: number;
  createdAt?: string;
  likeDislike?: string;
}

export const fetchReviews = async (
  options: ReviewQueryOptions = {}
): Promise<PaginatedReviewResponse> => {
  const {
    sortBy = SortFields.ReviewId,
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

  const response = await axios.get<PaginatedReviewResponse>(
    "http://localhost:5219/api/reviews/sorted",
    { params }
  );

  return response.data;
};

export const getReviewsSortedById = async () => {
  const response = await fetchReviews({
    sortBy: SortFields.CreatedAt,
    ascending: false,
  });
  return response.reviews;
};

export const DeleteReview = async (reviewId: number): Promise<void> => {
  await axios.delete(`http://localhost:5219/api/reviews/${reviewId}`);
};
