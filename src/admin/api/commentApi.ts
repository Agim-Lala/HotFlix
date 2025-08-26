import axios from "axios";

export enum SortFields {
  id = "Id",
  createdAt = "CreatedAt",
  username = "Username",
  movieTitle = "MovieTitle",
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
  likesCount?: number;
  dislikesCount?: number;
}
export interface CommentDetail {
  commentId: number;
  text: string;
  createdAt: string;
  updatedAt?: string | null;
  likesCount: number;
  dislikesCount: number;
  userId: number;
  username: string;
  author: string;
  movieId: number;
  movieTitle: string;
  parentCommentId?: number | null;
  quotedCommentId?: number | null;
  quotedText?: string | null;
  quotedComment?: CommentDetail | null;
  replies: CommentDetail[];
  parentComment?: {
    commentId: number;
    text: string;
    author: string;
  } | null;
  isDeleted: boolean;
}

export const fetchComments = async (
  options: CommentQueryOptions = {}
): Promise<PaginatedCommentResponse> => {
  const {
    sortBy = SortFields.id,
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
    sortBy: SortFields.createdAt,
    ascending: false,
  });
  return response.comments;
};

export const adminDeleteComment = async (commentId: number): Promise<void> => {
  await axios.delete(
    `http://localhost:5219/api/Comments/admin/comments/${commentId}`
  );
};

export const getCommentById = async (commentId: number) => {
  const res = await axios.get<CommentDetail>(
    `http://localhost:5219/api/Comments/${commentId}`
  );
  return res.data;
};

export const newCommentCount = async () => {
  const response = await axios.get<{ count: number }>(
    "http://localhost:5219/api/Comments/new-comments-count"
  );
  return response.data;
};
