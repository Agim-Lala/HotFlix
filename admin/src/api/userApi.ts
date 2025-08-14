import axios from "axios";

export enum SortFields {
  Id = "Id",
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
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  fullName?: string;
  email: string;
  createdAt?: string;
  commentCount?: number;
  reviewCount?: number;
  status: "Banned" | "Approved";
  role: string;
  subscriptionPlanId?: number;
}

export const fetchUsers = async (
  options: UserQueryOptions = {}
): Promise<PaginatedUserResponse> => {
  const {
    sortBy = SortFields.Id,
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
  const response = await fetchUsers({
    sortBy: SortFields.CreatedAt,
    ascending: false,
  });
  return response.users;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await axios.get(`http://localhost:5219/api/auth/${id}`);
  return response.data;
};

export const updateUserProfile = async (id: number, data: Partial<User>) => {
  return axios.patch(`http://localhost:5219/api/auth/${id}`, data);
};

export const updateUserPassword = async (
  id: number,
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string
) => {
  return axios.post(`http://localhost:5219/api/auth/${id}/change-password`, {
    oldPassword,
    newPassword,
    confirmNewPassword,
  });
};

export const toggleUserStatus = async (
  id: number
): Promise<"Approved" | "Banned"> => {
  const response = await axios.patch<{ status: "Approved" | "Banned" }>(
    `http://localhost:5219/api/auth/${id}/status`
  );
  return response.data.status;
};

export const getMe = async (): Promise<User> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  const response = await axios.get("http://localhost:5219/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
