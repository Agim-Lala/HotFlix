import axios from "axios";

export enum SortFields {
  commentId = "Id",
  Title = "Title",
  Author = "Author",
  Text = "Text",
  CreatedAt = "CreatedAt",
}

export interface PaginatedCommentResponse {
  comments: Comment[];
  totalCount: number;
}

interface CommentQueryOptions {
  sortBy?: SortFields;
  ascending?: boolean;
  page?: number;
  pageSize?: number;
  filters?: Record<string, string | number | boolean>;
}

export interface Comment {
  commentId: number;
  movieTitle: string;
  author: string;
  text: string;
  createdAt?: string;
  likeDislike?: string;
}

export const fetchComments = async (
  options: CommentQueryOptions = {}
): Promise<PaginatedCommentResponse> => {
  const {
    sortBy = SortFields.commentId,
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

  const response = await axios.get<PaginatedCommentResponse>(
    "http://localhost:5219/api/Comments/sorted",
    { params }
  );

  return response.data;
};

export const getCommentsSortedById = async () => {
  const response = await fetchComments({
    sortBy: SortFields.CreatedAt,
    ascending: false,
  });
  return response.comments;
};
