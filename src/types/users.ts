export type InviteUserPayload = {
  email: string;
  phoneNumber: string;
  lastName: string;
  firstName: string;
  otherName: string;
  departmentId: string;
  role: string;
};

export type UpdateUserPayload = {
  email: string;
  phoneNumber: string;
  lastName: string;
  firstName: string;
  otherName: string;
  departmentId: string;
  role: string;
};

export type User = {
  id: string;
  lastName: string;
  firstName: string;
  otherName?: string;
  phoneNumber: string;
  email: string;
  username: string;
  defaultRole: string | null;
  userType: string;
  status: string;
  departmentId: string;
  role?: string;
  roles?: string[];
  createdDate?: string;
};

// Export User as UserProfile
export type UserProfile = User;

// New interface for users query parameters
export interface UsersQueryParams {
  startDate?: string;
  endDate?: string;
  status?: string;
  role?: string;
  pageNumber?: number;
  pageSize?: number;
  searchKeyword?: string;
}
