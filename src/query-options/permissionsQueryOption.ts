import { queryOptions, useMutation } from "@tanstack/react-query";

import {
  APIError,
  ApiResponse,
  CreatePermissionGroupPayload,
  PermissionGroupResponse,
} from "@/types";
import { BASE_URL } from "@/constants/api";

const getPermissions = async (groupId: string) => {
  const response = await fetch(
    `${BASE_URL}/administration/permission-by-groupId/${groupId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch permissions");
  }
  return response.json();
};

const createPermission = async (formData: CreatePermissionGroupPayload) => {
  const res = await fetch(`${BASE_URL}/administration/permission`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.isSuccessful === false) {
    throw Object.assign(
      new Error(data?.message || "Failed to create permission"),
      {
        status: res.status,
        response: data,
      }
    );
  }
  return data;
};

const updatePermission = async (
  permissionId: string,
  formData: CreatePermissionGroupPayload
) => {
  const res = await fetch(
    `${BASE_URL}/administration/update-permission/${permissionId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.isSuccessful === false) {
    throw Object.assign(
      new Error(data?.message || "Failed to update permission"),
      {
        status: res.status,
        response: data,
      }
    );
  }
  return data;
};

const deletePermission = async (permissionId: string) => {
  const res = await fetch(
    `${BASE_URL}/administration/permission/${permissionId}`,
    {
      method: "DELETE",
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.isSuccessful === false) {
    throw Object.assign(
      new Error(data?.message || "Failed to delete permission"),
      {
        status: res.status,
        response: data,
      }
    );
  }
  return data;
};

function getPermissionsQueryOptions(groupId: string) {
  return queryOptions({
    queryKey: ["permissions", groupId],
    queryFn: () => getPermissions(groupId),
  });
}

function useCreatePermissionMutation() {
  return useMutation<
    PermissionGroupResponse,
    APIError,
    CreatePermissionGroupPayload
  >({
    mutationFn: createPermission,
  });
}

function useUpdatePermissionMutation() {
  return useMutation<
    PermissionGroupResponse,
    APIError,
    { permissionId: string; formData: CreatePermissionGroupPayload }
  >({
    mutationFn: ({ permissionId, formData }) =>
      updatePermission(permissionId, formData),
  });
}

function useDeletePermissionMutation() {
  return useMutation<ApiResponse, APIError, string>({
    mutationFn: deletePermission,
  });
}

export {
  getPermissionsQueryOptions,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
};
