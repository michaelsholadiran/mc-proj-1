import type { Metadata } from "next";
import { DM_Sans, Poppins } from "next/font/google";
import "./globals.css";
import QueryProvider from "./providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Credlanche Back Office",
  description: "Manage Credlanche Operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${poppins.variable} antialiased vsc-initialized`}
      >
        <QueryProvider>{children}</QueryProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
