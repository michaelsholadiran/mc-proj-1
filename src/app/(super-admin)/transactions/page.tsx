"use client";

import { Suspense } from "react";
/* eslint-disable  @typescript-eslint/no-unused-vars */
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Download,
  Play,
  Search,
  XIcon,
} from "lucide-react";


import { Label } from "@/components/ui/label";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_PAGE_SIZE } from "@/constants/api";
import { getTransactionsQueryOptions } from "@/query-options/transactionsQueryOption";
import { TransactionQueryParams } from "@/types/transactions";

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
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { TranascationsTable } from "@/components/layout/tables/tranascationsTable";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";

function TransactionsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  
  // Filter states - initialize from URL params
  const [searchKeyword, setSearchKeyword] = useState<string>(
    searchParams.get("accountNumber") || ""
  );
  const [channelFilter, setChannelFilter] = useState<string>(
    searchParams.get("channel") || "all"
  );
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get("status") || "all"
  );
  const [dateRangeFilter, setDateRangeFilter] = useState<{from: Date, to?: Date} | undefined>(
    (() => {
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");
      if (startDate && endDate) {
        return {
          from: new Date(startDate),
          to: new Date(endDate)
        };
      }
      return undefined;
    })()
  );
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get("page") || "1")
  );

  // Build query parameters for API
  const buildQueryParams = useCallback((): TransactionQueryParams => {
    const params: TransactionQueryParams = {
      pageNumber: currentPage,
      pageSize: DEFAULT_PAGE_SIZE,
    };

    // Add search filters
    if (searchKeyword) {
      params.accountNumber = searchKeyword;
    }

    // Add channel filter (map to appropriate field)
    if (channelFilter !== "all") {
      params.direction = channelFilter;
    }

    // Add status filter (map to appropriate field)
    if (statusFilter !== "all") {
      params.entryCode = statusFilter;
    }

    // Add date range filter
    if (dateRangeFilter && dateRangeFilter.from && dateRangeFilter.to) {
      params.startDate = dateRangeFilter.from.toISOString();
      params.endDate = dateRangeFilter.to.toISOString();
    }

    return params;
  }, [searchKeyword, channelFilter, statusFilter, dateRangeFilter, currentPage]);

  // Update URL when filters change
  const updateURL = useCallback((params: Partial<TransactionQueryParams>) => {
    const newSearchParams = new URLSearchParams();
    
    // Only add parameters that differ from defaults
    if (params.pageNumber !== undefined && params.pageNumber !== 1) {
      newSearchParams.set("page", params.pageNumber.toString());
    }
    if (searchKeyword !== "") {
      newSearchParams.set("accountNumber", searchKeyword);
    }
    if (channelFilter !== "all") {
      newSearchParams.set("channel", channelFilter);
    }
    if (statusFilter !== "all") {
      newSearchParams.set("status", statusFilter);
    }
    if (dateRangeFilter && dateRangeFilter.from && dateRangeFilter.to) {
      newSearchParams.set("startDate", dateRangeFilter.from.toISOString());
      newSearchParams.set("endDate", dateRangeFilter.to.toISOString());
    }
    
    // Only update URL if there are parameters to add
    const queryString = newSearchParams.toString();
    if (queryString) {
      router.push(`?${queryString}`);
    } else {
      // If no parameters, just go to the base route
      router.push("/transactions");
    }
  }, [router, searchKeyword, channelFilter, statusFilter, dateRangeFilter]);

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case "channel":
        setChannelFilter(value);
        break;
      case "status":
        setStatusFilter(value);
        break;
    }
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle date range change
  const handleDateRangeChange = (dateRange: {from: Date, to?: Date} | undefined) => {
    setDateRangeFilter(dateRange);
    setCurrentPage(1); // Reset to first page when date range changes
  };

  // Handle search
  const handleSearchChange = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  // Update URL when any filter changes
  useEffect(() => {
    const params = buildQueryParams();
    updateURL(params);
  }, [searchKeyword, channelFilter, statusFilter, dateRangeFilter, currentPage, buildQueryParams, updateURL]);

  const queryParams = buildQueryParams();

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery(
    getTransactionsQueryOptions(queryParams)
  );


  return (
    <div className="px-[1rem] md:px-[2rem]">
      <div>
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList className="font-[family-name:var(--font-poppins)] font-[500]">
              <BreadcrumbItem className="text-[#A9A9A9]">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Play className="text-[#CCCCCC]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem className="text-[#464646]">
                <BreadcrumbPage>Transactions</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="cursor-pointer bg-[#04B2F1] rounded-[5px] h-[48px] px-[20px] hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-[14px] flex items-center gap-2">
                  <Download size={16} />
                  Export Transactions
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 font-[family-name:var(--font-poppins)]">
                <DropdownMenuItem
                  onSelect={() => confirm("Exporting to CSV...")}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => confirm("Exporting to Excel...")}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => confirm("Exporting to PDF...")}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-[8px]">
          <h6 className="font-[family-name:var(--font-dm)] font-[600] text-[16px]">
            Transactions
          </h6>
        </div>
      </div>

      {/* Content */}
      <div className="mt-[20px]">
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-3 items-center py-4 mb-[20px]">
          <div className="w-full lg:col-span-1 grid items-center gap-2">
            <Label htmlFor="accountNumber" className="text-left block">
              Account Number
            </Label>
            <div className="relative w-full">
              <Search
                className="text-[#A9A9A9] absolute top-4 left-2"
                size={20}
              />
              <Input
                id="accountNumber"
                placeholder="Enter account number"
                value={searchKeyword}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full h-[50px] focus-visible:ring-0 rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)] pl-[35px] pr-[40px] font-[500] border-[#CCCCCC80] focus-visible:border-[#CCCCCC80]"
              />
              {searchKeyword && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute top-4 right-2 text-white bg-[#6B7280] hover:bg-[#4B5563] rounded-full p-1 transition-colors"
                  type="button"
                >
                  <XIcon size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Channel filter */}
          <div className="w-full lg:col-span-1 grid items-center gap-2">
            <Label htmlFor="channel" className="text-left block">
              Channel
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-[50px] w-full sm:justify-between focus-visible:ring-1 font-[family-name:var(--font-poppins)] text-[#3D4F5C] border-[#CCCCCC80] focus-visible:border-[#CCCCCC80] rounded-[8px]"
                >
                  {channelFilter === "all" ? "All Channels" : channelFilter} <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="font-[family-name:var(--font-poppins)] text-[12px] w-[200px]"
              >
                <DropdownMenuCheckboxItem onClick={() => handleFilterChange("channel", "all")}>
                  All Channels
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem onClick={() => handleFilterChange("channel", "Mobile")}>
                  Mobile
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem onClick={() => handleFilterChange("channel", "iBank")}>
                  iBank
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem onClick={() => handleFilterChange("channel", "ATM")}>
                  ATM
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status filter */}
          <div className="w-full lg:col-span-1 grid items-center gap-2">
            <Label htmlFor="status" className="text-left block">
              Status
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-[50px] w-full sm:justify-between focus-visible:ring-1 font-[family-name:var(--font-poppins)] text-[#3D4F5C] border-[#CCCCCC80] focus-visible:border-[#CCCCCC80] rounded-[8px]"
                >
                  {statusFilter === "all" ? "All Status" : statusFilter} <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-full text-[12px] font-[family-name:var(--font-poppins)] w-[200px] text-[#3D4F5C]"
              >
                <DropdownMenuCheckboxItem onClick={() => handleFilterChange("status", "all")}>
                  All Status
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem onClick={() => handleFilterChange("status", "Successful")}>
                  Successful
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem onClick={() => handleFilterChange("status", "Failed")}>
                  Failed
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem onClick={() => handleFilterChange("status", "Pending")}>
                  Pending
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Date Range filter */}
          <div className="w-full lg:col-span-2 grid items-center gap-2">
            <Label htmlFor="dateRange" className="text-left block">
              Date Range
            </Label>
            <DatePickerWithRange
              value={dateRangeFilter}
              onChange={handleDateRangeChange}
              placeholder="Select date range"
              className="h-[50px] font-[family-name:var(--font-poppins)] text-[#3D4F5C] flex items-center"
            />
          </div>
        </div>
        <TranascationsTable
          data={transactions}
          isLoading={isLoadingTransactions}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      </div>

    </div>
  );
}

export default function SuperAdminRoleManagement() {
  return (
    <Suspense fallback={
      <div className="px-[1rem] md:px-[2rem]">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-64 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    }>
      <TransactionsPageContent />
    </Suspense>
  );
}
