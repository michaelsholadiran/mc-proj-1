"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Ensure this utility correctly merges Tailwind classes

export const KYCApprovalKYCRequestTab = ({ id }: { id: string }) => {
  const pathname = usePathname();

  const tabs = [
    {
      name: "Personal Details",
      href: `/kyc-approval-supervisor/kyc-request-details/${id}/personal-details`,
    },
    {
      name: "Address Verification",
      href: `/kyc-approval-supervisor/kyc-request-details/${id}/address-verification`,
    },
    {
      name: "KYC Details",
      href: `/kyc-approval-supervisor/kyc-request-details/${id}/kyc-details`,
    },

    {
      name: "Supervisor’s Assessment",
      href: `/kyc-approval-supervisor/kyc-request-details/${id}/supervisor-assessment`,
    },
  ];

  const getActiveTab = () => {
    return (
      tabs.find(
        (tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`)
      )?.href || ""
    );
  };

  const activeTab = getActiveTab();

  return (
    <div className={cn(" border-gray-200 mb-8")}>
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const isCurrent = activeTab === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "whitespace-nowrap px-1 py-4 text-sm font-medium transition-colors duration-200 relative", // Add 'relative' for pseudo-element positioning
                // Base pseudo-element styling for the underline
                "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-[#0284B2] after:transition-all after:duration-300 after:ease-in-out",
                // Active state styling
                isCurrent
                  ? "text-[#0284B2] after:content-[''] after:w-[60px]" // Active: desired text color, pseudo-element becomes visible and has width
                  : "text-gray-500 hover:text-gray-700 after:w-0" // Inactive: default text color, pseudo-element has 0 width (invisible)
              )}
              aria-current={isCurrent ? "page" : undefined}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
