import { queryOptions, useMutation } from "@tanstack/react-query";

import {
  APIError,
  ApiResponse,
  CreateRolePayload,
  GetUserRoleResponse,
  Role,
} from "@/types";
import { BASE_URL } from "@/constants/api";

const getRoles = async (): Promise<{ data: Role[] }> => {
  const response = await fetch(`${BASE_URL}/administration/roles`);
  if (!response.ok) {
    throw new Error("Failed to fetch roles");
  }
  return response.json();
};

const createRole = async (formData: CreateRolePayload): Promise<Role> => {
  const payload = {
    roleName: formData.name,
    description: formData.description,
    permissionNames: formData.permissionNames || []
  };

  console.log("Creating role with payload:", payload);
  console.log("API URL:", `${BASE_URL}/administration/role-with-permission/create`);

  const res = await fetch(
    `${BASE_URL}/administration/role-with-permission/create`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  console.log("Response status:", res.status);
  console.log("Response headers:", res.headers);

  const data = await res.json().catch(() => null);
  console.log("Response data:", data);

  if (!res.ok || data?.isSuccessful === false) {
    console.error("API Error:", data);
    throw Object.assign(new Error(data?.message || "Failed to create role"), {
      status: res.status,
      response: data,
    });
  }
  return data;
};

const updateRole = async ({
  roleId,
  formData,
}: {
  roleId: string;
  formData: CreateRolePayload;
}): Promise<Role> => {
  const res = await fetch(`${BASE_URL}/administration/roles/${roleId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.isSuccessful === false) {
    throw Object.assign(new Error(data?.message || "Failed to update role"), {
      status: res.status,
      response: data,
    });
  }
  return data;
};

const deleteRole = async (roleName: string): Promise<{ success: boolean }> => {
  const res = await fetch(
    `${BASE_URL}/administration/${roleName}/role/delete`,
    {
      method: "DELETE",
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.isSuccessful === false) {
    throw Object.assign(new Error(data?.message || "Failed to delete role"), {
      status: res.status,
      response: data,
    });
  }
  return data;
};

const getUserRole = async (username: string): Promise<GetUserRoleResponse> => {
  const response = await fetch(
    `${BASE_URL}/administration/user-role/get/${username}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user role");
  }
  return response.json();
};

const assignRoleToUser = async ({
  roleName,
  userId,
}: {
  roleName: string;
  userId: string;
}): Promise<ApiResponse> => {
  const res = await fetch(
    `${BASE_URL}/administration/${roleName}/assign/${userId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.isSuccessful === false) {
    throw Object.assign(
      new Error(data?.message || "Failed to assign role to user"),
      {
        status: res.status,
        response: data,
      }
    );
  }
  return data;
};

export function getRolesQueryOptions() {
  return queryOptions({
    queryKey: ["roles"],
    queryFn: getRoles,
  });
}

export function getUserRoleQueryOptions(username: string) {
  return queryOptions<GetUserRoleResponse, APIError>({
    queryKey: ["userRole", username],
    queryFn: () => getUserRole(username),
    enabled: !!username,
  });
}

export function useCreateRoleMutation() {
  return useMutation<Role, APIError, CreateRolePayload>({
    mutationFn: createRole,
  });
}

export function useUpdateRoleMutation() {
  return useMutation<
    Role,
    APIError,
    { roleId: string; formData: CreateRolePayload }
  >({
    mutationFn: updateRole,
  });
}

export function useDeleteRoleMutation() {
  return useMutation<{ success: boolean }, APIError, string>({
    mutationFn: deleteRole,
  });
}

export function useAssignRoleToUserMutation() {
  return useMutation<
    ApiResponse,
    APIError,
    { roleName: string; userId: string }
  >({
    mutationFn: assignRoleToUser,
  });
}

export {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getUserRole,
  assignRoleToUser,
};
