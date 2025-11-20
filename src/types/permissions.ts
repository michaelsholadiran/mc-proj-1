//Permission Group

export type PermissionGroup = {
  groupId: string;
  name: string;
};

export type PermissionGroupResponse = {
  data: PermissionGroup[];
  isSuccessful: boolean;
  message: string;
  code: string;
};

export type PermissionGroupWithPermissions = {
  groupId: string;
  name: string;
  permissions: Permission[];
};

export type PermissionGroupWithPermissionsResponse = {
  data: PermissionGroupWithPermissions[];
  isSuccessful: boolean;
  message: string;
  code: string;
};

export type CreatePermissionGroupPayload = {
  name: string;
};

//Permission

export type Permission = {
  permissionId: string;
  groupId: string;
  name: string;
  description: string;
  status: boolean;
};

export type CreatePermissionPayload = {
  name: string;
  description?: string;
};

export type UpdatePermissionPayload = {
  name?: string;
  description?: string;
  status?: boolean;
};

export type PermissionResponse = {
  data: Permission[];
  isSuccessful: boolean;
  message: string;
  code: string;
};

//Role

export type Role = {
  id: string;
  name: string;
  description: string;
  normalizedName: string;
  concurrencyStamp: string | null;
  userCount: number;
  status: boolean;
};

export type CreateRolePayload = {
  name: string;
  description?: string;
  permissionNames?: string[];
};


export type RoleResponse = {
  data: Role[];
  isSuccessful: boolean;
  message: string;
  code: string;
};

export interface GetUserRoleResponse {
  roleName: string;
  userId: string;
}
