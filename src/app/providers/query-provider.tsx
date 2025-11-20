"use client";

import { useState } from "react";
import type { ReactNode } from "react"; // ✅ correct way to import ReactNode
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} client={client} />
      )}
    </QueryClientProvider>
  );
}
