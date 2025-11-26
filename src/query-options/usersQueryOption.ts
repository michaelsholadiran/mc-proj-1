import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import jwt from "jsonwebtoken";

import { APIError, ApiResponse, InviteUserPayload, UpdateUserPayload, Role, User, PaginatedResponse, UsersQueryParams } from "@/types";
import { BASE_URL, DEFAULT_PAGE_SIZE } from "@/constants/api";
import { getAuthCookie } from "@/lib/actions/cookies";

const inviteUser = async (
  formData: InviteUserPayload
): Promise<ApiResponse> => {
  const res = await fetch(`${BASE_URL}/administration/invite-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.isSuccessful === false) {
    throw Object.assign(new Error(data?.message || "Failed to invite user"), {
      status: res.status,
      response: data,
    });
  }

  return data;
};

const getUserRole = async (username: string): Promise<Role> => {
  const response = await fetch(
    `${BASE_URL}/administration/user-role/get/${username}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const getUsers = async (params: UsersQueryParams = {}): Promise<PaginatedResponse<User>> => {
  const {
    startDate,
    endDate,
    status,
    role,
    pageNumber = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    searchKeyword,
  } = params;

  const queryParams = new URLSearchParams();
  
  if (startDate) queryParams.append('StartDate', startDate);
  if (endDate) queryParams.append('EndDate', endDate);
  if (status && status !== 'all') queryParams.append('Status', status);
  if (role && role !== 'all') queryParams.append('Role', role);
  if (pageNumber) queryParams.append('PageNumber', pageNumber.toString());
  queryParams.append('PageSize', pageSize.toString());
  if (searchKeyword) queryParams.append('Username', searchKeyword);

  const queryString = queryParams.toString();
  const url = `${BASE_URL}/administration/users${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

const getUserById = async (userId: string): Promise<{ data: User }> => {
  const response = await fetch(`${BASE_URL}/administration/user/${userId}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const getAuthenticatedUser = async (): Promise<{ data: User }> => {
  const token = await getAuthCookie();
  if (!token) {
    throw new Error("Unauthorized - No token found");
  }

  let userId: string | null = null;
  try {
    const decoded = jwt.decode(token) as { SourceId?: string } | null;
    userId = decoded?.SourceId || null;
  } catch {
    throw new Error("Invalid Token");
  }

  if (!userId) {
    throw new Error("User ID not found in token");
  }

  const response = await fetch(`${BASE_URL}/administration/user/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  return response.json();
};

const exportUsers = async (params: UsersQueryParams = {}, format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> => {
  const {
    startDate,
    endDate,
    status,
    role,
    searchKeyword,
  } = params;

  const queryParams = new URLSearchParams();
  
  if (startDate) queryParams.append('StartDate', startDate);
  if (endDate) queryParams.append('EndDate', endDate);
  if (status && status !== 'all') queryParams.append('Status', status);
  if (role && role !== 'all') queryParams.append('Role', role);
  if (searchKeyword) queryParams.append('Username', searchKeyword);
  const apiFormat = format === 'csv' ? 'CSV' : 'Excel';
  queryParams.append('Format', apiFormat);

  const queryString = queryParams.toString();
  const url = `${BASE_URL}/administration/user/export${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to export users");
  }

  return response.blob();
};

const updateUser = async (userId: string, formData: UpdateUserPayload): Promise<ApiResponse> => {
  const token = await getAuthCookie();
  if (!token) {
    throw new Error("Unauthorized - No token found");
  }

  const res = await fetch(`${BASE_URL}/administration/user/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.isSuccessful === false) {
    throw Object.assign(new Error(data?.message || "Failed to update user"), {
      status: res.status,
      response: data,
    });
  }

  return data;
};

export function useInviteUserMutation() {
  return useMutation<ApiResponse, APIError, InviteUserPayload>({
    mutationFn: inviteUser,
  });
}

export function useGetUserRoleQuery(username: string) {
  return useQuery<Role, APIError>({
    queryKey: ["getUserRole", username],
    queryFn: () => getUserRole(username),
    enabled: !!username,
  });
}

export function useGetUserByIdQuery(userId: string) {
  return useQuery<{ data: User }, APIError>({
    queryKey: ["getUserById", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
}

export function getAuthenticatedUserQueryOptions() {
  return queryOptions({
    queryKey: ["getAuthenticatedUser"],
    queryFn: getAuthenticatedUser,
  });
}

export function getUsersQueryOptions(params: UsersQueryParams = {}) {
  return queryOptions({
    queryKey: ["getUsers", params],
    queryFn: () => getUsers(params),
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
  });
}

export function useExportUsersMutation() {
  return useMutation<Blob, APIError, { params: UsersQueryParams; format: 'csv' | 'xlsx' }>({
    mutationFn: ({ params, format }) => exportUsers(params, format),
  });
}

export function useUpdateUserMutation() {
  return useMutation<ApiResponse, APIError, { userId: string; data: UpdateUserPayload }>({
    mutationFn: ({ userId, data }) => updateUser(userId, data),
  });
}

