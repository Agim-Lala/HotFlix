import axios from "axios";

export enum SortFields {
  UserId = "UserId",    
  Username = "Username",
  Email = "Email",
  CreatedAt = "CreatedAt",
  CommentCount = "CommentCount",
  ReviewCount = "ReviewCount",
}

export interface PaginatedUserResponse {
  users: User[];
  totalCount: number;
}

interface UserQueryOptions {
  sortBy?: SortFields;
  ascending?: boolean;
  page?: number;
  pageSize?: number;
  filters?: Record<string, string | number | boolean>;
}

export interface User {
  Id: number;                
  FirstName: string;
  LastName: string;
  Username: string;
  FullName?: string;
  Email: string;
  CreatedAt?: string;
  CommentCount?: number;
  ReviewCount?: number;
  Status?: string;  
}

export const fetchUsers = async (
  options: UserQueryOptions = {}
): Promise<PaginatedUserResponse> => {
  const {
    sortBy = SortFields.UserId,
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

  const response = await axios.get<PaginatedUserResponse>(
    "http://localhost:5219/api/auth/sorted",
    { params }
  );

  return response.data;
};

export const getUsersSortedByCreatedAt = async () => {
  const response = await fetchUsers({ sortBy: SortFields.CreatedAt, ascending: false });
  return response.users;
};