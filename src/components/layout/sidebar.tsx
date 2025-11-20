"use client";
import { AvatarIcon } from "@/components/icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogoutMutation } from "@/query-options/authenticationQueryOption";
// AUTHENTICATION CHECKS COMMENTED OUT FOR TESTING
// import { getAuthenticatedUserQueryOptions } from "@/query-options/usersQueryOption";
// import { useQuery } from "@tanstack/react-query";
// import { useIsMobile } from "@/hooks/use-mobile";
import { sidebarLinks } from "@/utils/routes";

import { Loader2, LogOut, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  // AUTHENTICATION CHECKS COMMENTED OUT FOR TESTING
  // const { data: authenticatedUser, isLoading: isLoadingAuthenticatedUser } =
  //   useQuery(getAuthenticatedUserQueryOptions());
  const authenticatedUser = null;
  const isLoadingAuthenticatedUser = false;
  
  const { mutate: logOut, isPending: isLoggingOut } = useLogoutMutation();

  // Filter sidebar links based on user roles - SHOWING ALL LINKS FOR TESTING
  // const userRoles = authenticatedUser?.data?.roles;
  // const filteredLinks = userRoles && Array.isArray(userRoles)
  //   ? sidebarLinks.filter(link => link.roles.some(role => userRoles.includes(role)))
  //   : [];
  const filteredLinks = sidebarLinks; // Show all links for testing

  function handleLogout() {
    logOut(undefined, {
      onSuccess: () => {
        router.replace("/login");
      },
    });
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="my-[20px] px-[22px]">
          <Link href="/dashboard">
            <Image
              src="/logo-text.svg"
              className="max-w-[150px] max-h-[40px]"
              alt="Digitvant login"
              width={150}
              height={40}
            />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-[22px] border-t-1 border-b-1 border-[#EAEAEA]">
        <SidebarGroup className="py-[20px] px-0">
          <SidebarGroupLabel className="font-[family-name:var(--font-poppins)] uppercase text-[#04B2F1] font-[600]">
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3 mt-[20px]">
              {isLoadingAuthenticatedUser ? (
                // Show loading skeleton while role is being fetched
                Array.from({ length: 5 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <div className="flex items-center py-[20px] px-[14px]">
                      <Skeleton className="w-5 h-5 mr-3" />
                      <Skeleton className="w-24 h-4" />
                    </div>
                  </SidebarMenuItem>
                ))
              ) : (
                filteredLinks.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`relative flex items-center font-[family-name:var(--font-poppins)] hover:font-[family-name:var(--font-poppins)] py-[20px] px-[14px] text-[#04B2F1] rounded-none ${
                          (pathname === item.url ||
                            pathname.includes(item.url)) &&
                          "hover:font-[family-name:var(--font-poppins)] !text-[#ffffff] bg-[#0284B2] hover:!bg-[#0284B2]"
                        }`}
                      >
                        <item.icon
                          className={`${
                            pathname === item.url || pathname.includes(item.url)
                              ? "text-[#FFFFFF]"
                              : "text-[#04B2F1]"
                          }`}
                          fill={`${
                            pathname === item.url || pathname.includes(item.url)
                              ? "#FFFFFF"
                              : "#04B2F1"
                          }`}
                        />
                        <span className="text-[13px]">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="py-[30px] px-0 border-t-1 border-[#EAEAEA]">
          <SidebarGroupLabel className="font-[family-name:var(--font-poppins)] uppercase text-[#04B2F1] font-[600]">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 mt-[20px]">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/settings/profile"
                    className={`relative flex items-center font-[family-name:var(--font-poppins)] hover:font-[family-name:var(--font-poppins)] py-[20px] px-[14px] text-[#04B2F1] rounded-none ${
                      (pathname === "/settings/profile" || pathname === "/settings/security") &&
                      "hover:font-[family-name:var(--font-poppins)] !text-[#ffffff] bg-[#0284B2] hover:!bg-[#0284B2]"
                    }`}
                  >
                    <Settings
                      className={`${
                        (pathname === "/settings/profile" || pathname === "/settings/security")
                          ? "text-[#FFFFFF]"
                          : "text-[#04B2F1]"
                      }`}
                    />
                    <span className="text-[13px]">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={handleLogout}
                    type="button"
                    disabled={isLoggingOut}
                    className={`cursor-pointer relative flex items-center font-[family-name:var(--font-poppins)] hover:font-[family-name:var(--font-poppins)] py-[20px] px-[14px] text-[#04B2F1] rounded-none ${
                      pathname === "/logout" &&
                      "hover:font-[family-name:var(--font-poppins)] !text-[#ffffff] bg-[#0284B2] hover:!bg-[#0284B2]"
                    } ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isLoggingOut ? (
                      <Loader2 className="animate-spin text-[#FC5A5A]" />
                    ) : (
                      <LogOut
                        className={
                          pathname === "/settings"
                            ? "text-[#FFFFFF]"
                            : "text-[#FC5A5A]"
                        }
                      />
                    )}
                    <span className="text-[13px] text-[#FC5A5A] ml-2">Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:text-primary py-2 h-auto group-data-[collapsible=icon]:p-1! hover:bg-white!">
              <div className="flex items-center gap-x-2">
                <AvatarIcon />
                <div className="flex flex-col">
                  {isLoadingAuthenticatedUser ? (
                    <>
                      <Skeleton className="w-[120px] h-[14px] mb-1" />
                      <Skeleton className="w-[160px] h-[13px]" />
                    </>
                  ) : (
                    <>
                      <span className="text-[#262626] text-[14px]">
                        {/* {authenticatedUser?.data.firstName}{" "}
                        {authenticatedUser?.data.lastName} */}
                        Test User
                      </span>
                      <span className="text-[#BFBFBF] text-[13px]">
                        {/* {authenticatedUser?.data.email} */}
                        test@example.com
                      </span>
                    </>
                  )}
                </div>
                <div className="ml-5 cursor-pointer">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.56666 10.0582C6.56666 9.7165 6.85 9.43317 7.19166 9.43317H11.7583V2.38317C11.75 1.98317 11.4333 1.6665 11.0333 1.6665C6.125 1.6665 2.7 5.0915 2.7 9.99984C2.7 14.9082 6.125 18.3332 11.0333 18.3332C11.425 18.3332 11.75 18.0165 11.75 17.6165V10.6748H7.19166C6.84166 10.6832 6.56666 10.3998 6.56666 10.0582Z"
                      fill="#D5294D"
                    />
                    <path
                      d="M17.1167 9.6168L14.75 7.2418C14.5083 7.00013 14.1083 7.00013 13.8667 7.2418C13.625 7.48346 13.625 7.88346 13.8667 8.12513L15.1667 9.42513H11.75V10.6751H15.1583L13.8583 11.9751C13.6167 12.2168 13.6167 12.6168 13.8583 12.8585C13.9833 12.9835 14.1417 13.0418 14.3 13.0418C14.4583 13.0418 14.6167 12.9835 14.7417 12.8585L17.1083 10.4835C17.3583 10.2501 17.3583 9.85846 17.1167 9.6168Z"
                      fill="#D5294D"
                    />
                  </svg>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
