export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  isNewUser: boolean;
  message: string;
  roles: string[];
};

export type InitiatePasswordResetPayload = {
  email?: string;
  username?: string;
};

export type InitiatePasswordResetResponse = {
  data: {
    retrievalCode: string;
    passwordResetToken: string;
  };
  isSuccessful: boolean;
  message: string;
  code: string;
};

export type ResetPasswordPayload = {
  username: string;
  passwordResetToken: string;
  newPassword: string;
  retrievalCode: string;
  otp: string;
};

export type ChangePasswordPayload = {
  username: string;
  currentPassword: string;
  newPassword: string;
};
