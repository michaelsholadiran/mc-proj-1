import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // AUTHENTICATION GUARD COMMENTED OUT FOR TESTING
  // const cookieStore = await cookies();
  // const encryptedToken = cookieStore.get("cred-crm-ticket-tok")?.value;

  // if (encryptedToken) {
  //   redirect("/dashboard");
  // }

  return <>{children}</>;
}
