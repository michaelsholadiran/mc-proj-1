import { queryOptions, useMutation } from "@tanstack/react-query";

import {
  APIError,
  ApiResponse,
  Department,
  CreateDepartmentPayload,
  User, // Assuming User type exists
} from "@/types";
import { BASE_URL } from "@/constants/api";

const createDepartment = async (formData: CreateDepartmentPayload) => {
  const res = await fetch(`${BASE_URL}/administration/department`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.isSuccessful === false) {
    throw Object.assign(
      new Error(data?.message || "Failed to create department"),
      {
        status: res.status,
        response: data,
      }
    );
  }

  return data;
};

const getDepartments = async (): Promise<{ data: Department[] }> => {
  const response = await fetch(`${BASE_URL}/administration/department`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const getUsersByDepartment = async (departmentId: string): Promise<User[]> => {
  const response = await fetch(
    `${BASE_URL}/administration/users/${departmentId}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const addUserToDepartment = async (payload: {
  departmentId: string;
  userId: string;
}) => {
  const res = await fetch(
    `${BASE_URL}/administration/${payload.departmentId}/user/${payload.userId}`,
    {
      method: "POST",
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.isSuccessful === false) {
    throw Object.assign(
      new Error(data?.message || "Failed to add user to department"),
      {
        status: res.status,
        response: data,
      }
    );
  }

  return data;
};

export function useCreateDepartmentMutation() {
  return useMutation<ApiResponse, APIError, CreateDepartmentPayload>({
    mutationFn: createDepartment,
  });
}

export function getDepartmentsQueryOptions() {
  return queryOptions({
    queryKey: ["getDepartments"],
    queryFn: getDepartments,
  });
}

export function getUsersByDepartmentQueryOptions(departmentId: string) {
  return queryOptions({
    queryKey: ["getUsersByDepartment", departmentId],
    queryFn: () => getUsersByDepartment(departmentId),
  });
}

export function useAddUserToDepartmentMutation() {
  return useMutation<
    ApiResponse,
    APIError,
    { departmentId: string; userId: string }
  >({
    mutationFn: addUserToDepartment,
  });
}


