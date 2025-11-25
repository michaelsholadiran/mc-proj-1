"use client";

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
import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import { Input } from "@/components/ui/input";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { PaymentLogsTable } from "@/components/layout/tables/paymentLogsTable";
import { useGetPaymentsMappedQuery, useGetPaymentWithHistoryQuery, useGetPaymentsQuery } from "@/query-options/paymentsQueryOption";
import { PaymentQueryParams } from "@/types/payments";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";

function PaymentSummaryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state from URL params
  const [studentNameSearch, setStudentNameSearch] = useState(
    searchParams.get("studentName") || ""
  );
  const [registrationIdSearch, setRegistrationIdSearch] = useState(
    searchParams.get("registrationId") || ""
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all"
  );
  const [paymentTypeFilter, setPaymentTypeFilter] = useState(
    searchParams.get("paymentType") || "all"
  );
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null
  );
  const [dateRangeFilter, setDateRangeFilter] = useState<{from: Date, to?: Date} | undefined>(
    (() => {
      const from = searchParams.get("from");
      const to = searchParams.get("to");
      if (from && to) {
        return {
          from: new Date(from),
          to: new Date(to)
        };
      }
      return undefined;
    })()
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );
  
  // API filter states - initialize from URL params
  const [paymentIdFilter, setPaymentIdFilter] = useState(
    searchParams.get("paymentId") || ""
  );

  // Build API query parameters
  const queryParams: PaymentQueryParams = useMemo(() => {
    const params: PaymentQueryParams = {};
    
    if (paymentIdFilter.trim()) params.PaymentId = paymentIdFilter.trim();
    // Map Registration ID/Matric Number to SchoolId
    if (registrationIdSearch.trim()) params.SchoolId = registrationIdSearch.trim();
    if (dateRangeFilter?.from) {
      params.From = dateRangeFilter.from.toISOString().split('T')[0];
    }
    if (dateRangeFilter?.to) {
      params.To = dateRangeFilter.to.toISOString().split('T')[0];
    }
    
    return params;
  }, [paymentIdFilter, registrationIdSearch, dateRangeFilter]);

  // Fetch all payments to get payment types for dropdown (use original API response)
  const { data: allPaymentsResponse } = useGetPaymentsQuery({});
  
  // Get unique payment types from API
  const paymentTypes = useMemo(() => {
    if (!allPaymentsResponse?.data?.items) return [];
    const uniqueTypes = new Set<string>();
    allPaymentsResponse.data.items.forEach((payment) => {
      if (payment.description) {
        uniqueTypes.add(payment.description);
      }
    });
    return Array.from(uniqueTypes).sort();
  }, [allPaymentsResponse?.data?.items]);

  // Find payment ID when payment type is selected
  useEffect(() => {
    if (paymentTypeFilter !== "all" && allPaymentsResponse?.data?.items) {
      // Find the first payment with matching description
      const payment = allPaymentsResponse.data.items.find(
        (p) => p.description === paymentTypeFilter
      );
      if (payment) {
        setSelectedPaymentId(payment.id);
      } else {
        setSelectedPaymentId(null);
      }
    } else {
      setSelectedPaymentId(null);
    }
  }, [paymentTypeFilter, allPaymentsResponse?.data?.items]);

  // Fetch payment with history when payment type is selected
  const { data: paymentHistoryData, isLoading: isLoadingHistory, error: historyError } = useGetPaymentWithHistoryQuery(
    selectedPaymentId || ""
  );

  // Get payment logs
  const paymentLogs = paymentHistoryData?.data?.paymentLogs || [];
  
  // Client-side filtering for payment logs
  const filteredLogs = useMemo(() => {
    return paymentLogs.filter((log) => {
      if (studentNameSearch && !log.fullName.toLowerCase().includes(studentNameSearch.toLowerCase())) {
        return false;
      }
      if (statusFilter !== "all") {
        const logStatus = log.status.toLowerCase();
        const filterStatus = statusFilter.toLowerCase();
        if (logStatus !== filterStatus) {
          return false;
        }
      }
      return true;
    });
  }, [paymentLogs, studentNameSearch, statusFilter]);

  // Paginate payment logs
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Calculate totals from payment history
  const totalAmount = paymentHistoryData?.data?.totalAmount || 0;
  const totalCommission = paymentHistoryData?.data?.totalCommission || 0;

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "status") {
      setStatusFilter(value);
    } else if (filterType === "paymentType") {
      setPaymentTypeFilter(value);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Update URL when filters change
  const updateURL = useCallback(() => {
    const newSearchParams = new URLSearchParams();
    
    // API filters
    if (paymentIdFilter.trim()) newSearchParams.set("paymentId", paymentIdFilter.trim());
    if (registrationIdSearch.trim()) newSearchParams.set("registrationId", registrationIdSearch.trim());
    
    // Client-side filters
    if (studentNameSearch.trim()) newSearchParams.set("studentName", studentNameSearch.trim());
    if (statusFilter !== "all") newSearchParams.set("status", statusFilter);
    if (paymentTypeFilter !== "all") newSearchParams.set("paymentType", paymentTypeFilter);
    
    // Date range
    if (dateRangeFilter?.from) {
      newSearchParams.set("from", dateRangeFilter.from.toISOString().split('T')[0]);
    }
    if (dateRangeFilter?.to) {
      newSearchParams.set("to", dateRangeFilter.to.toISOString().split('T')[0]);
    }
    
    // Page
    if (currentPage > 1) newSearchParams.set("page", currentPage.toString());
    
    const queryString = newSearchParams.toString();
    const newUrl = queryString ? `?${queryString}` : "";
    router.replace(`/payment-summary${newUrl}`, { scroll: false });
  }, [
    router,
    paymentIdFilter,
    registrationIdSearch,
    studentNameSearch,
    statusFilter,
    paymentTypeFilter,
    dateRangeFilter,
    currentPage
  ]);

  // Update URL when any filter changes
  useEffect(() => {
    updateURL();
  }, [updateURL]);

  // Handle errors
  if (historyError) {
    console.error("Error fetching payment history:", historyError);
  }

  // Format amount
  const formatAmount = (amount: number) => {
    return `₦${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

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
                <BreadcrumbPage>Payment Summary</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="cursor-pointer bg-[#04B2F1] rounded-[5px] h-[48px] px-[20px] hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-[14px] flex items-center gap-2">
                  <Download size={16} />
                  Export Payments
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 font-[family-name:var(--font-poppins)]">
                <DropdownMenuItem
                  onSelect={() => toast.success("Exporting to CSV...")}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => toast.success("Exporting to Excel...")}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => toast.success("Exporting to PDF...")}
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
            Payment Summary
          </h6>
        </div>
      </div>

      {/* Content */}
      <div className="mt-[20px]">
        {/* Total Amount and Commission Cards */}
        {selectedPaymentId && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="border border-[#CCCCCC80] shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-[family-name:var(--font-poppins)] text-[#A9A9A9] font-medium">
                    Total Amount
                  </p>
                  <p className="text-2xl font-bold font-[family-name:var(--font-dm)] text-[#464646]">
                    {formatAmount(totalAmount)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-[#CCCCCC80] shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-[family-name:var(--font-poppins)] text-[#A9A9A9] font-medium">
                    Total Commission
                  </p>
                  <p className="text-2xl font-bold font-[family-name:var(--font-dm)] text-[#464646]">
                    {formatAmount(totalCommission)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* API Filters Row 1 */}
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-3 items-center py-4 mb-[20px]">
          <div className="w-full lg:col-span-1 grid items-center gap-2">
            <Label htmlFor="paymentId" className="text-left block">
              Payment ID
            </Label>
            <div className="relative w-full">
              <Search
                className="text-[#A9A9A9] absolute top-4 left-2"
                size={20}
              />
              <Input
                id="paymentId"
                placeholder="Enter payment ID"
                value={paymentIdFilter}
                onChange={(e) => {
                  setPaymentIdFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-[50px] focus-visible:ring-0 rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)] pl-[35px] pr-[40px] font-[500] border-[#CCCCCC80] focus-visible:border-[#CCCCCC80]"
              />
              {paymentIdFilter && (
                <button
                  onClick={() => {
                    setPaymentIdFilter("");
                    setCurrentPage(1);
                  }}
                  className="absolute top-4 right-2 text-white bg-[#6B7280] hover:bg-[#4B5563] rounded-full p-1 transition-colors"
                  type="button"
                >
                  <XIcon size={12} />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Client-side Filters Row 2 */}
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-3 items-center py-4 mb-[20px]">
          <div className="w-full lg:col-span-1 grid items-center gap-2">
            <Label htmlFor="studentName" className="text-left block">
              Student Name
            </Label>
            <div className="relative w-full">
              <Search
                className="text-[#A9A9A9] absolute top-4 left-2"
                size={20}
              />
              <Input
                id="studentName"
                placeholder="Enter student name"
                value={studentNameSearch}
                onChange={(e) => {
                  setStudentNameSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-[50px] focus-visible:ring-0 rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)] pl-[35px] pr-[40px] font-[500] border-[#CCCCCC80] focus-visible:border-[#CCCCCC80]"
              />
              {studentNameSearch && (
                <button
                  onClick={() => {
                    setStudentNameSearch("");
                    setCurrentPage(1);
                  }}
                  className="absolute top-4 right-2 text-white bg-[#6B7280] hover:bg-[#4B5563] rounded-full p-1 transition-colors"
                  type="button"
                >
                  <XIcon size={12} />
                </button>
              )}
            </div>
          </div>

          <div className="w-full lg:col-span-1 grid items-center gap-2">
            <Label htmlFor="registrationId" className="text-left block">
              Registration ID/ Matric Number
            </Label>
            <div className="relative w-full">
              <Search
                className="text-[#A9A9A9] absolute top-4 left-2"
                size={20}
              />
              <Input
                id="registrationId"
                placeholder="Enter registration ID/ matric number"
                value={registrationIdSearch}
                onChange={(e) => {
                  setRegistrationIdSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-[50px] focus-visible:ring-0 rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)] pl-[35px] pr-[40px] font-[500] border-[#CCCCCC80] focus-visible:border-[#CCCCCC80]"
              />
              {registrationIdSearch && (
                <button
                  onClick={() => {
                    setRegistrationIdSearch("");
                    setCurrentPage(1);
                  }}
                  className="absolute top-4 right-2 text-white bg-[#6B7280] hover:bg-[#4B5563] rounded-full p-1 transition-colors"
                  type="button"
                >
                  <XIcon size={12} />
                </button>
              )}
            </div>
          </div>

          <div className="w-full lg:col-span-1 grid items-center gap-2">
            <Label htmlFor="status" className="text-left block">
              Status
            </Label>
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="h-[50px] w-full px-3 font-[family-name:var(--font-poppins)] text-[#3D4F5C] border border-[#CCCCCC80] rounded-[8px] focus:outline-none focus:ring-1 focus:ring-[#0284B2]"
            >
              <option value="all">All Status</option>
              <option value="Successful">Successful</option>
              <option value="Failed">Failed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="w-full lg:col-span-1 grid items-center gap-2">
            <Label htmlFor="paymentType" className="text-left block">
              Payment Type
            </Label>
            <select
              value={paymentTypeFilter}
              onChange={(e) => handleFilterChange("paymentType", e.target.value)}
              className="h-[50px] w-full px-3 font-[family-name:var(--font-poppins)] text-[#3D4F5C] border border-[#CCCCCC80] rounded-[8px] focus:outline-none focus:ring-1 focus:ring-[#0284B2]"
            >
              <option value="all">All Payment Types</option>
              {paymentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full lg:col-span-1 grid items-center gap-2">
            <Label htmlFor="dateRange" className="text-left block">
              Date Range
            </Label>
            <DatePickerWithRange
              value={dateRangeFilter}
              onChange={(value) => {
                setDateRangeFilter(value);
                setCurrentPage(1);
              }}
              placeholder="Select date range"
              className="h-[50px] font-[family-name:var(--font-poppins)] text-[#3D4F5C] flex items-center"
            />
          </div>
        </div>
        
        {selectedPaymentId ? (
          <PaymentLogsTable
            data={paginatedLogs}
            isLoading={isLoadingHistory}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        ) : (
          <div className="text-center py-12 font-[family-name:var(--font-poppins)] text-[#464646]">
            Please select a Payment Type to view payment logs
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSummaryPage() {
  return (
    <Suspense
      fallback={
        <div className="px-[1rem] md:px-[2rem]">
          <div className="mt-[20px]">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
            <Skeleton className="h-96" />
          </div>
        </div>
      }
    >
      <PaymentSummaryPageContent />
    </Suspense>
  );
}
