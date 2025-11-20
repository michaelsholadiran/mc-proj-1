"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { SelectGroup } from "@radix-ui/react-select";
import {
  KYCRequestTable,
  KYCRequestDetails,
} from "@/components/layout/tables/KYCRequestTable";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KYCInitiatorDashboardProps {
  kycRequestData?: KYCRequestDetails[];
  dashboardMetrics?: Array<{
    id: string;
    leftIcon: string;
    ellipse: string;
    title: string;
    value: string;
    subText?: string;
    trend?: {
      imageSrc: string;
      imageAlt: string;
      percentage: string;
      textColor: string;
    };
    time?: Array<{
      label: string;
      value: string;
    }>;
    iconList?: {
      count: number;
      imageSrc: string;
      imageAlt: string;
      subText: string;
      textColor: string;
    };
    type: "trend" | "icons";
  }>;
  title?: string;
  subtitle?: string;
  showBreadcrumb?: boolean;
  breadcrumbText?: string;
}

const defaultKycRequestData: KYCRequestDetails[] = [
  {
    id: "REQ001",
    customerId: "CUST001",
    customerName: "Adebisi Adeola",
    submissionDate: "2024-04-02",
    slaCountdown: "01:22:56",
  },
  {
    id: "REQ002",
    customerId: "CUST002",
    customerName: "John Doe",
    submissionDate: "2024-04-01",
    slaCountdown: "04:22:56",
  },
  {
    id: "REQ003",
    customerId: "CUST003",
    customerName: "Jane Smith",
    submissionDate: "2024-04-03",
    slaCountdown: "00:00:00",
  },
  {
    id: "REQ004",
    customerId: "CUST004",
    customerName: "Mike Johnson",
    submissionDate: "2024-03-30",
    slaCountdown: "04:22:56",
  },
  {
    id: "REQ005",
    customerId: "CUST005",
    customerName: "Sarah Wilson",
    submissionDate: "2024-03-29",
    slaCountdown: "01:22:56",
  },
  {
    id: "REQ006",
    customerId: "CUST006",
    customerName: "David Brown",
    submissionDate: "2024-03-28",
    slaCountdown: "04:22:56",
  },
  {
    id: "REQ007",
    customerId: "CUST007",
    customerName: "Emily Davis",
    submissionDate: "2024-03-27",
    slaCountdown: "04:22:56",
  },
  {
    id: "REQ008",
    customerId: "CUST008",
    customerName: "Michael Wilson",
    submissionDate: "2024-03-26",
    slaCountdown: "01:22:56",
  },
];

const defaultDashboardMetrics = [
  {
    id: "1",
    leftIcon: "/illustrations/kyc-initiator/sand-watch.svg",
    ellipse: "/illustrations/kyc-initiator/ellipse-01.svg",
    title: "Total Number of Pending Requests",
    value: "1,182",
    subText: "(1,000 lost year)",
    trend: {
      imageSrc: "/illustrations/customer-management/trending-up.svg",
      imageAlt: "up arrow",
      percentage: "18.2%",
      textColor: "text-[#0284B2]",
    },
    type: "trend" as const,
  },
  {
    id: "2",
    leftIcon: "/illustrations/kyc-initiator/clock.svg",
    ellipse: "/illustrations/kyc-initiator/ellipse-02.svg",
    title: "Total Number of Requests Reviewed Today",
    value: "72%",
    subText: "(87.25% last year)",
    trend: {
      imageSrc: "/illustrations/customer-management/trending-down.svg",
      imageAlt: "down arrow",
      percentage: "25%",
      textColor: "text-[#FC5A5A]",
    },
    type: "trend" as const,
  },
  {
    id: "3",
    leftIcon: "/illustrations/kyc-initiator/data.svg",
    ellipse: "/illustrations/kyc-initiator/ellipse-03.svg",
    title: "Total Number of Requests Processed",
    value: "72%",
    subText: "(87.25% last year)",
    trend: {
      imageSrc: "/illustrations/customer-management/trending-down.svg",
      imageAlt: "down arrow",
      percentage: "25%",
      textColor: "text-[#FC5A5A]",
    },
    type: "trend" as const,
  },
  {
    id: "4",
    leftIcon: "/illustrations/kyc-initiator/data.svg",
    ellipse: "/illustrations/kyc-initiator/ellipse-04.svg",
    title: "AVERAGE TURNAROUND TIME",
    value: "125",
    time: [
      {
        label: "HRS",
        value: String(new Date("2024-07-08").getHours()).padStart(2, "0"),
      },
      {
        label: "MINS",
        value: String(new Date("2024-07-08").getMinutes()).padStart(2, "0"),
      },
      {
        label: "SECS",
        value: String(new Date("2024-07-08").getSeconds()).padStart(2, "0"),
      },
    ],
    iconList: {
      count: 4,
      imageSrc: "/illustrations/customer-management/user.svg",
      imageAlt: "user",
      subText: "+121",
      textColor: "text-[#A9A9A9]",
    },
    type: "icons" as const,
  },
];

export default function KYCInitiatorDashboard({
  kycRequestData = defaultKycRequestData,
  dashboardMetrics = defaultDashboardMetrics,
  title = "Performance Evaluation",
  subtitle = "Overall performance of all activities",
  showBreadcrumb = true,
  breadcrumbText = "Dashboard",
}: KYCInitiatorDashboardProps) {
  return (
    <div className="px-[1rem] md:px-[2rem]">
      {showBreadcrumb && (
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList className="font-[family-name:var(--font-poppins)] font-[500]">
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[16px]">{breadcrumbText}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}

      <div className="mt-[20px]">
        <div className="flex gap-3 justify-between items-center my-[26px]">
          <div>
            <h3>
              {title} <br />
              {subtitle}
            </h3>
          </div>

          <div className="col-span-1 grid items-center gap-2">
            <div className="col-span-1 grid items-center gap-2">
              <Select>
                <SelectTrigger
                  className="w-[236px] font-poppins text-gray-700 !h-[56px]
                focus-visible:ring-offset-0
                focus-visible:ring-0
                focus-visible:outline-none
                focus-visible:ring-transparent
                border-[#CCCCCC80]
                focus-visible:border-[#CCCCCC80]
               "
                >
                  <SelectValue placeholder="Select Date Range" />
                </SelectTrigger>
                <SelectContent className="font-poppins text-[14px] w-[190px]">
                  <SelectGroup>
                    {[
                      { value: "today", label: "Today" },
                      { value: "yesterday", label: "Yesterday" },
                      { value: "last-7-days", label: "Last 7 Days" },
                      { value: "last-30-days", label: "Last 30 Days" },
                      { value: "this-month", label: "This Month" },
                      { value: "last-month", label: "Last Month" },
                      { value: "this-year", label: "This Year" },
                      { value: "last-year", label: "Last Year" },
                      { value: "all-time", label: "All Time" },
                    ].map((range) => (
                      <SelectItem
                        key={range.value}
                        value={range.value}
                        className="h-[36px]"
                      >
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1  lg:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
          {dashboardMetrics.map((card) => {
            return card.type !== "icons" && !card.iconList ? (
              <div
                key={card.id}
                className="shadow relative flex p-6 rounded-[20px] items-center h-[183px] gap-2 py-[40px]"
              >
                <Image
                  src={card.leftIcon}
                  alt="leftIcon"
                  width={48}
                  height={48}
                />
                <Image
                  className="absolute bottom-0 right-0"
                  src={card.ellipse}
                  alt="ellipse"
                  width={100}
                  height={100}
                />
                <div>
                  <p className="text-[#464646] mb-4 font-medium text-[24px] leading-[100%] tracking-[0%] font-poppins mt-2">
                    {card.value}
                  </p>
                  <p className="font-medium text-[14px] leading-[100%] tracking-[%] font-dm-sans text-[#464646]">
                    {card.title}
                  </p>
                </div>
              </div>
            ) : (
              <div
                key={card.id}
                className="shadow p-6 rounded-[20px] flex-col items-center gap-2 py-[40px]"
              >
                <div className="flex justify-between">
                  <p className="font-medium text-[14px] leading-[100%] tracking-[%] font-dm-sans text-[#464646]">
                    {card.title}
                  </p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Image
                        src="/illustrations/kyc-initiator/info.svg"
                        alt="icon"
                        width={16}
                        height={16}
                        className="cursor-pointer"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Average time taken to complete KYC process</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex justify-center items-center mt-4">
                  <div className="grid grid-cols-3 gap-6 md:gap-8">
                    {card.time?.map((component) => (
                      <div key={component.label} className="">
                        <p className="text-[24px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                          {component.value}
                        </p>
                        <p className="text-[11px] font-extrabold text-gray-900">
                          {component.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className=" flex-col grid lg:grid-cols-12  2xl:grid-cols-12 gap-3 items-center py-4 mb-[20px] mt-[40px]">
          <div className="w-full lg:col-span-3 mb-4 lg:mb-0">
            <h3 className="text-[18px] font-medium">Pending KYC Requests</h3>
          </div>

          <div className="w-full lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className=" lg:flex items-center justify-end pr-2 text-gray-400">
              Filter By :
            </div>
            <div className="w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-[50px] w-full sm:justify-between focus-visible:ring-1 font-[family-name:var(--font-poppins)] text-[#3D4F5C]"
                  >
                    Active <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[200px] text-[12px] font-[family-name:var(--font-poppins)] text-[#3D4F5C]"
                >
                  <DropdownMenuCheckboxItem>Active</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Inactive</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-[50px] w-full sm:justify-between focus-visible:ring-1 font-[family-name:var(--font-poppins)] text-[#3D4F5C]"
                  >
                    Active <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[200px] text-[12px] font-[family-name:var(--font-poppins)] text-[#3D4F5C]"
                >
                  <DropdownMenuCheckboxItem>Active</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Inactive</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-[50px] w-full sm:justify-between focus-visible:ring-1 font-[family-name:var(--font-poppins)] text-[#3D4F5C]"
                  >
                    Active <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[200px] text-[12px] font-[family-name:var(--font-poppins)] text-[#3D4F5C]"
                >
                  <DropdownMenuCheckboxItem>Active</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Inactive</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="w-full lg:col-span-3 flex flex-col sm:flex-row items-center gap-4 justify-end">
            <div className="text-right mb-2 sm:mb-0 text-gray-400">
              Sort By:
            </div>
            <div className="w-full sm:w-auto">
              <Select>
                <SelectTrigger
                  className="w-full font-poppins text-gray-700 !h-[56px]
                focus-visible:ring-offset-0
                focus-visible:ring-0
                focus-visible:outline-none
                focus-visible:ring-transparent
                border-[#CCCCCC80]
                focus-visible:border-[#CCCCCC80]
               "
                >
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="font-poppins text-[14px]">
                  <SelectGroup>
                    {[
                      { value: "newest", label: "Newest" },
                      { value: "oldest", label: "Oldest" },
                    ].map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="h-[36px]"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <KYCRequestTable data={kycRequestData} />
        
        {/* View All Button */}
        <div className="flex items-center justify-center py-4">
          <Link href="/dashboard/kyc-requests">
            <Button
              className="cursor-pointer bg-[#0284B2] rounded-[5px] h-[48px] px-[20px] hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-[14px] text-white"
            >
              View All
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
