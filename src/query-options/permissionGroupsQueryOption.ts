import { queryOptions, useMutation } from "@tanstack/react-query";

import {
  APIError,
  ApiResponse,
  CreatePermissionGroupPayload,
  PermissionGroupResponse,
  PermissionGroupWithPermissionsResponse,
} from "@/types";
import { BASE_URL } from "@/constants/api";

const getPermissionGroups = async () => {
  const response = await fetch(`${BASE_URL}/administration/permission-groups`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const getPermissionGroupsWithPermissions = async (): Promise<PermissionGroupWithPermissionsResponse> => {
  const response = await fetch(`${BASE_URL}/administration/permission-groups/with-permissions`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const createPermissionGroup = async (
  formData: CreatePermissionGroupPayload
) => {
  const res = await fetch(`${BASE_URL}/administration/permission-group`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.isSuccessful === false) {
    throw Object.assign(
      new Error(data?.message || "Failed to create permission group"),
      {
        status: res.status,
        response: data,
      }
    );
  }

  return data;
};

const deletePermissionGroup = async (groupId: string) => {
  const res = await fetch(
    `${BASE_URL}/administration/permission-group/${groupId}`,
    {
      method: "DELETE",
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.isSuccessful === false) {
    throw Object.assign(
      new Error(data?.message || "Failed to delete permission group"),
      {
        status: res.status,
        response: data,
      }
    );
  }

  return data;
};

function getPermissionGroupsQueryOptions() {
  return queryOptions({
    queryKey: ["getPermissionGroups"],
    queryFn: getPermissionGroups,
  });
}

function getPermissionGroupsWithPermissionsQueryOptions() {
  return queryOptions({
    queryKey: ["getPermissionGroupsWithPermissions"],
    queryFn: getPermissionGroupsWithPermissions,
  });
}

function useCreatePermissionGroupMutation() {
  return useMutation<
    PermissionGroupResponse,
    APIError,
    CreatePermissionGroupPayload
  >({
    mutationFn: createPermissionGroup,
  });
}

function useDeletePermissionGroupMutation() {
  return useMutation<ApiResponse, APIError, string>({
    mutationFn: deletePermissionGroup,
  });
}

export {
  getPermissionGroupsQueryOptions,
  getPermissionGroupsWithPermissionsQueryOptions,
  useCreatePermissionGroupMutation,
  useDeletePermissionGroupMutation,
};
