"use client";

import { AvatarIcon } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
// AUTHENTICATION CHECKS COMMENTED OUT FOR TESTING
// import { getAuthenticatedUserQueryOptions } from "@/query-options/usersQueryOption";
// import { useQuery } from "@tanstack/react-query";
import { sidebarLinks } from "@/utils/routes";

import { Bell, X, ChevronRight } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function HeaderDropdown() {
  const pathName = usePathname();
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  // AUTHENTICATION CHECKS COMMENTED OUT FOR TESTING
  // const { data: authenticatedUser, isLoading: isLoadingAuthenticatedUser } =
  //   useQuery(getAuthenticatedUserQueryOptions());
  const authenticatedUser = { data: { firstName: "Test" } };
  const isLoadingAuthenticatedUser = false;
  const app_name =
  sidebarLinks.find((items) => items.url === pathName)?.title ||
    decodeURIComponent(id?.toString() as string);

  const notifications = [
    {
      id: 1,
      message: "Super Admin assigned you a task",
      date: "Monday 6th June, 2025",
      time: "3:45PM",
      isRead: false,
      avatar: "default",
    },
    {
      id: 2,
      message: "Super Admin assigned you a task",
      date: "Monday 6th June, 2025",
      time: "3:45PM",
      isRead: false,
      avatar: "default",
    },
    {
      id: 3,
      message: "Super Admin assigned you a task",
      date: "Monday 6th June, 2025",
      time: "3:45PM",
      isRead: false,
      avatar: "badge",
    },
    {
      id: 4,
      message: "Your password has been successfully changed",
      date: "Monday 6th June, 2025",
      time: "3:45PM",
      isRead: false,
      avatar: "default",
    },
    {
      id: 5,
      message: "Super Admin assigned you a task",
      date: "Monday 6th June, 2025",
      time: "3:45PM",
      isRead: false,
      avatar: "default",
    },
    {
      id: 6,
      message: "Your password has been successfully changed",
      date: "Monday 6th June, 2025",
      time: "3:45PM",
      isRead: false,
      avatar: "badge",
    },
    {
      id: 7,
      message: "Super Admin assigned you a task",
      date: "Monday 6th June, 2025",
      time: "3:45PM",
      isRead: false,
      avatar: "default",
    },
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex w-full justify-between items-center">
      <h4 className="text-[#464646] font-[family-name:var(--font-dm)] font-[600] capitalize">
        {app_name}
      </h4>
      <div className="flex justify-end items-center gap-[16px]">
        <DropdownMenu open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
          <DropdownMenuTrigger asChild>
            <div className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96 p-0 shadow-lg border-0 rounded-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="font-semibold text-gray-900 text-base">Notifications</span>
              <button 
                onClick={() => setIsNotificationOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            
            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div className="flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {notification.avatar === "badge" ? (
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">B</span>
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-br from-[#04B2F1] to-[#0284B2] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold font-[family-name:var(--font-poppins)]">
                              SA
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 font-medium leading-5">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {notification.date}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                      
                      {/* Status and Action */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    {index < notifications.length - 1 && (
                      <div className="border-b border-gray-100 mx-4"></div>
                    )}
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="cursor-pointer hover:bg-white focus-visible:ring-0"
          >
            <SidebarMenuButton className="">
              <div className="flex justify-center items-center h-[24px] w-[24px] bg-[#F5FAFF] rounded-full">
                {/* <UserRound className="text-[#04B2F1] w-[12px] h-[12px]" /> */}
                <AvatarIcon />
              </div>
              {isLoadingAuthenticatedUser ? (
                <Skeleton className="h-6 w-24 rounded" />
              ) : (
                <span className="font-[family-name:var(--font-poppins)] text-[#3A3A3A]">
                  {authenticatedUser?.data.firstName}
                </span>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem 
              onClick={() => router.push('/settings/profile')}
              className="cursor-pointer font-[family-name:var(--font-poppins)]"
            >
              Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
