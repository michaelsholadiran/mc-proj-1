import { useMutation } from "@tanstack/react-query";
import jwt from "jsonwebtoken";

import {
  APIError,
  ApiResponse,
  LoginPayload,
  LoginResponse,
  InitiatePasswordResetPayload,
  InitiatePasswordResetResponse,
  ResetPasswordPayload,
  ChangePasswordPayload,
} from "@/types";
import { BASE_URL } from "@/constants/api";
import { setAuthCookie, removeAuthCookie, setAuthUserCookie } from "@/lib/actions/cookies";

const login = async (formData: LoginPayload): Promise<LoginResponse> => {
  const res = await fetch(`${BASE_URL}/authentication/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw Object.assign(new Error(data?.message || "Login failed"), {
      status: res.status,
      response: data,
    });
  }

  const accessToken = data.data.tokenDetails.access_token;

  const decoded = jwt.decode(accessToken) as { TokenType?: string; roles?: string[] } | null;
  const tokenType = decoded?.TokenType || null;
  const isNewUser = tokenType?.toLowerCase() === "temporary";
  const roles = decoded?.roles || [];

  if (!isNewUser && accessToken) {
    await setAuthCookie(accessToken);
    await setAuthUserCookie(data.data?.profile);
  }

  return {
    isNewUser,
    message: "User successfully logged in",
    roles
  };
};

const logout = async () => {
  try {
    await fetch(`${BASE_URL}/authentication/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Logout API error:", error);
  }

  await removeAuthCookie();
};

const initiatePasswordReset = async (
  formData: InitiatePasswordResetPayload
) => {
  const res = await fetch(
    `${BASE_URL}/authentication/initiate-password-reset`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.isSuccessful === false) {
    throw Object.assign(
      new Error(data?.message || "Failed to initiate password reset"),
      {
        status: res.status,
        response: data,
      }
    );
  }

  return data;
};

const resetPassword = async (formData: ResetPasswordPayload) => {
  const resetPasswordUrl = BASE_URL.replace('/api/v1', '/api/v2');
  const res = await fetch(`${resetPasswordUrl}/authentication/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.isSuccessful === false) {
    throw Object.assign(
      new Error(data?.message || "Failed to reset password"),
      {
        status: res.status,
        response: data,
      }
    );
  }

  return data;
};

const changePassword = async (formData: ChangePasswordPayload) => {
  const res = await fetch(`${BASE_URL}/authentication/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.isSuccessful === false) {
    throw Object.assign(
      new Error(data?.message || "Failed to change password"),
      {
        status: res.status,
        response: data,
      }
    );
  }

  return data;
};

export function useLoginMutation() {
  return useMutation<LoginResponse, APIError, LoginPayload>({
    mutationFn: login,
  });
}

export function useLogoutMutation() {
  return useMutation<void, APIError>({
    mutationFn: logout,
  });
}

export function useInitiatePasswordResetMutation() {
  return useMutation<
    InitiatePasswordResetResponse,
    APIError,
    InitiatePasswordResetPayload
  >({
    mutationFn: initiatePasswordReset,
  });
}

export function useResetPasswordMutation() {
  return useMutation<ApiResponse, APIError, ResetPasswordPayload>({
    mutationFn: resetPassword,
  });
}

export function useChangePasswordMutation() {
  return useMutation<ApiResponse, APIError, ChangePasswordPayload>({
    mutationFn: changePassword,
  });
}

const verifyOtp = async (formData: { retrievalCode: string; otpCode: string }) => {
  const res = await fetch(`${BASE_URL}/otp/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw Object.assign(new Error(data?.message || "Failed to verify OTP"), {
      status: res.status,
      response: data,
    });
  }

  return data;
};

export function useVerifyOtpMutation() {
  return useMutation<ApiResponse, APIError, { retrievalCode: string; otpCode: string }>({
    mutationFn: verifyOtp,
  });
}

