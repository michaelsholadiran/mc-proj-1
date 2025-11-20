"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Play, Key, Shield, Lock, Eye } from "lucide-react";
import Link from "next/link";

export default function SecuritySettingsPage() {
  const securityOptions = [
    {
      id: 'password-reset',
      title: 'Password Reset',
      description: 'Reset your password here.',
      icon: Key
    },
    {
      id: 'two-factor-auth',
      title: 'Two-Factor Auth',
      description: 'Enable 2FA for extra security.',
      icon: Shield
    },
    {
      id: 'account-lock',
      title: 'Account Lock',
      description: 'Lock your account temporarily.',
      icon: Lock
    },
    {
      id: 'privacy-settings',
      title: 'Privacy Settings',
      description: 'Manage your privacy preferences.',
      icon: Eye
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Section */}
      <div className="mb-4 sm:mb-6 lg:mb-8 w-full bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumb */}
        <div className="mb-3 sm:mb-4 lg:mb-6">
          <Breadcrumb>
            <BreadcrumbList className="font-[family-name:var(--font-poppins)] font-[500] text-xs sm:text-sm lg:text-base">
              <BreadcrumbItem className="text-[#A9A9A9]">
                <BreadcrumbLink href="/dashboard" className="hover:text-gray-700">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Play className="text-[#CCCCCC] h-2 w-2 sm:h-3 sm:w-3 lg:h-4 lg:w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem className="text-[#A9A9A9]">
                <BreadcrumbLink href="/settings" className="hover:text-gray-700">Settings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Play className="text-[#CCCCCC] h-2 w-2 sm:h-3 sm:w-3 lg:h-4 lg:w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem className="text-[#464646]">
                <BreadcrumbPage>Security</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-[#464646] font-[family-name:var(--font-poppins)]">
            Settings
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-row gap-2 sm:gap-4 lg:gap-8">
          <Link 
            href="/settings/profile"
            className="font-[family-name:var(--font-poppins)] px-3 sm:px-4 py-2 rounded-none border-b-2 border-transparent text-gray-500 hover:text-gray-700 transition-colors text-xs sm:text-sm whitespace-nowrap"
          >
            Profile
          </Link>
          <Link 
            href="/settings/security"
            className="font-[family-name:var(--font-poppins)] px-3 sm:px-4 py-2 rounded-none border-b-2 border-[#04B2F1] text-[#04B2F1] transition-colors text-xs sm:text-sm whitespace-nowrap"
          >
            Security
          </Link>
        </div>
      </div>

      {/* Security Content */}
      <div className="space-y-4 sm:space-y-6 bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {securityOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Card key={option.id} className="shadow-sm border border-[#04B2F1] rounded-xl hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-4 mb-3">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-[#04B2F1] to-[#0284B2] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-[14px] font-semibold text-[#464646] font-[family-name:var(--font-poppins)]">
                        {option.title}
                      </h3>
                     
                    </div>
                    
                  </div>
                  <p className="text-[12px] text-[#464646] font-[family-name:var(--font-poppins)] leading-relaxed">
                        {option.description}
                      </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
