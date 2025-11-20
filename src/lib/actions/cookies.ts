"use server";

import { cookies } from "next/headers";
import { UserProfile } from "@/types"; // Ensure UserProfile is correctly defined in types

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "cred-crm-ticket-tok",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("cred-crm-ticket-tok");
}

export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("cred-crm-ticket-tok")?.value || null;
}

export async function setAuthUserCookie(user: UserProfile) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "cred-crm-ticket-auth-user",
    value: JSON.stringify(user),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}
