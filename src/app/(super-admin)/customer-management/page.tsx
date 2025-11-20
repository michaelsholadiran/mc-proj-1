"use client";

import { Suspense } from "react";
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

  CircleCheckBig,
  Download,
  Play,
  Search,
  XIcon,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  CustomerDetails,
  CustomerManagementDataTable,
} from "@/components/layout/tables/customer-management/customersTable";
import Image from "next/image";
import { SelectGroup } from "@radix-ui/react-select";
import { getCustomersQueryOptions, getCustomerAnalyticsQueryOptions, exportCustomers } from "@/query-options/customersQueryOption";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_PAGE_SIZE } from "@/constants/api";
import { CustomerQueryParams } from "@/types/customers";
import { useState, useEffect, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X, ChevronDown } from "lucide-react";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";
import { Skeleton } from "@/components/ui/skeleton";

function CustomerManagementPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);
  const [isDeleteCustomerModalOpen, setIsDeleteCustomerModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({} as CustomerDetails);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Filter states - initialize from URL params
  const [searchKeyword, setSearchKeyword] = useState<string>(
    searchParams.get("customerRef") || ""
  );
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get("status") || "all"
  );
  const [dateCreatedFilter] = useState<string>(
    searchParams.get("createdDate") || "all"
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [analyticsDateRangeValue, setAnalyticsDateRangeValue] = useState<{ from: Date; to?: Date } | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get("page") || "1")
  );

  const handleUpdateCustomer = () => {
    setIsEditCustomerModalOpen(false);
    setSuccessMessage("Customer Updated Successfully");
    setIsSuccessModalOpen(true);
  };

  const handleDeleteCustomer = () => {
    setIsDeleteCustomerModalOpen(false);
    setSuccessMessage("Customer Deleted Successfully");
    setIsSuccessModalOpen(true);
  };

  const handleEditClick = (customer: CustomerDetails) => {
    console.log("Editing customer with id:", customer.id);
    setSelectedCustomer(customer);
    setIsEditCustomerModalOpen(true);
  };

  const clearDate = () => {
    setSelectedDate(undefined);
  };

  const handleExportCustomers = async (exportFormat: "CSV" | "Excel") => {
    try {
      const blob = await exportCustomers(buildQueryParams(), exportFormat);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with current date and format
      const currentDate = new Date().toISOString().split('T')[0];
      const fileExtension = exportFormat === "CSV" ? "csv" : "xlsx";
      link.download = `customers-export-${currentDate}.${fileExtension}`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Show success message
      setSuccessMessage(`Customers exported successfully as ${exportFormat}`);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Export failed:', error);
      setSuccessMessage("Export failed. Please try again.");
      setIsSuccessModalOpen(true);
    }
  };

  // Build query parameters for API
  const buildQueryParams = useCallback((): CustomerQueryParams => {
    const params: CustomerQueryParams = {
      pageNumber: currentPage,
      pageSize: DEFAULT_PAGE_SIZE,
    };

    // Add search filters
    if (searchKeyword) {
      params.customerRef = searchKeyword;
    }

    // Add status filter
    if (statusFilter !== "all") {
      params.status = statusFilter;
    }

    // Add date created filter
    if (selectedDate) {
      // Format date as YYYY-MM-DD for API
      const formattedDate = selectedDate.toISOString().split('T')[0];
      params.createdDate = formattedDate;
    } else if (dateCreatedFilter !== "all") {
      params.createdDate = dateCreatedFilter;
    }

    return params;
  }, [currentPage, searchKeyword, statusFilter, dateCreatedFilter, selectedDate]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchKeyword) params.set("customerRef", searchKeyword);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      params.set("createdDate", formattedDate);
    } else if (dateCreatedFilter !== "all") {
      params.set("createdDate", dateCreatedFilter);
    }
    if (currentPage > 1) params.set("page", currentPage.toString());

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/customer-management${newUrl}`, { scroll: false });
  }, [searchKeyword, statusFilter, dateCreatedFilter, selectedDate, currentPage, router]);



  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Pending", label: "Pending" },
    { value: "Suspended", label: "Suspended" },
  ];

  // Fetch customers data using the new API
  const { data: customersResponse, isLoading: isLoadingCustomers } = useQuery(
    getCustomersQueryOptions(buildQueryParams())
  );

  // Build analytics query parameters
  const buildAnalyticsQueryParams = useCallback(() => {
    const params: Record<string, string> = {};
    
    // If no date range is selected, default to all time (beginning of Unix epoch)
    if (!analyticsDateRangeValue?.from) {
      params.startDate = '1970-01-01'; // Beginning of Unix epoch (all time)
      params.endDate = new Date().toISOString().split('T')[0]; // Current date
    } else {
      if (analyticsDateRangeValue.from) {
        params.startDate = analyticsDateRangeValue.from.toISOString().split('T')[0];
      }
      if (analyticsDateRangeValue.to) {
        params.endDate = analyticsDateRangeValue.to.toISOString().split('T')[0];
      }
    }
    
    return params;
  }, [analyticsDateRangeValue]);

  // Fetch analytics data
  const { data: analyticsResponse } = useQuery(
    getCustomerAnalyticsQueryOptions(buildAnalyticsQueryParams())
  );

  // Build analytics data from API response
  const customerAnalyticsData = analyticsResponse ? [
    {
      id: "total-customers",
      bgColor: "bg-[#F5FDFF]",
      title: "Total Customers",
      value: analyticsResponse.totalProfiles.toLocaleString(),
      subText: "(1,000 lost year)",
      trend: {
        imageSrc: "/illustrations/customer-management/trending-up.svg",
        imageAlt: "up arrow",
        percentage: "18.2%",
        textColor: "text-[#0284B2]",
      },
      type: "trend",
    },
    {
      id: "new-customers",
      bgColor: "bg-[#FFFAED]",
      title: "New Customers (sign ups)",
      value: analyticsResponse.accountsWithCompleteRegistration.toString(),
      subText: "(87.25% last year)",
      trend: {
        imageSrc: "/illustrations/customer-management/trending-down.svg",
        imageAlt: "down arrow",
        percentage: "25%",
        textColor: "text-[#FC5A5A]",
      },
      type: "trend",
    },
    {
      id: "active-customers",
      bgColor: "bg-[#F6F7FF]",
      title: "Active Customers",
      value: analyticsResponse.activeProfiles.toString(),
      iconList: {
        count: 4,
        imageSrc: "/illustrations/customer-management/user.svg",
        imageAlt: "user",
        subText: "+121",
        textColor: "text-[#A9A9A9]",
      },
      type: "icons",
    },
  ] : [
    {
      id: "total-customers",
      bgColor: "bg-[#F5FDFF]",
      title: "Total Customers",
      value: "loading",
      subText: "",
      trend: {
        imageSrc: "/illustrations/customer-management/trending-up.svg",
        imageAlt: "up arrow",
        percentage: "18.2%",
        textColor: "text-[#0284B2]",
      },
      type: "trend",
    },
    {
      id: "new-customers",
      bgColor: "bg-[#FFFAED]",
      title: "New Customers (sign ups)",
      value: "loading",
      subText: "",
      trend: {
        imageSrc: "/illustrations/customer-management/trending-down.svg",
        imageAlt: "down arrow",
        percentage: "25%",
        textColor: "text-[#FC5A5A]",
      },
      type: "trend",
    },
    {
      id: "active-customers",
      bgColor: "bg-[#F6F7FF]",
      title: "Active Customers",
      value: "loading",
      iconList: {
        count: 4,
        imageSrc: "/illustrations/customer-management/user.svg",
        imageAlt: "user",
        subText: "",
        textColor: "text-[#A9A9A9]",
      },
      type: "icons",
    },
  ];

  // Transform API customers to CustomerDetails format (commented out as not used)
  // const transformedCustomers: CustomerDetails[] =
  //   customersResponse?.data?.map((customer) => ({
  //     // All API fields
  //     id: customer.id,
  //     firstName: customer.firstName,
  //     lastName: customer.lastName,
  //     avatar: customer.avatar,
  //     bvnRealName: customer.bvnRealName,
  //     tier: customer.tier,
  //     accountNumber: customer.accountNumber,
  //     email: customer.email,
  //     dob: customer.dob,
  //     bvn: customer.bvn,
  //     bvnIsVerified: customer.bvnIsVerified,
  //     hasProfilePicture: customer.hasProfilePicture,
  //     hasAccountNumber: customer.hasAccountNumber,
  //     phoneVerified: customer.phoneVerified,
  //     transactionPinSet: customer.transactionPinSet,
  //     balance: customer.balance,
  //     profileType: customer.profileType,
  //     productType: customer.productType,
  //     phoneNumber: customer.phoneNumber,
  //     address: customer.address,
  //     coreBankId: customer.coreBankId,
  //     requiresOtp: customer.requiresOtp,
  //     totalLimit: customer.totalLimit,
  //     accruedLimit: customer.accruedLimit,
  //     addressDocumentSubmitted: customer.addressDocumentSubmitted,
  //     addressDocumentVerified: customer.addressDocumentVerified,
  //     totalReferrals: customer.totalReferrals,
  //     nin: customer.nin,
  //     bvnProfileUrl: customer.bvnProfileUrl,
  //     bvnUrlUpdated: customer.bvnUrlUpdated,
  //     referredBy: customer.referredBy,
  //     gender: customer.gender,
  //     referralCode: customer.referralCode,
  //     createdDate: customer.createdDate,
  //     status: customer.status,
  //     // Legacy fields for compatibility
  //     userName: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'N/A',
  //     userEmail: customer.email,
  //     customerId: customer.id,
  //     accountNo: customer.accountNumber || 'N/A',
  //     channel: customer.tier,
  //     dateCreated: customer.createdDate,
  //   })) || [];

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
                <BreadcrumbPage>Customer Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Content */}
      <div className="mt-[20px]">
        {/* Action */}
        <div className="flex gap-3 text-center justify-between items-center my-[26px]">
          <h4 className="font-[family-name:var(--font-dm)] text-[18px] font-[600] text-[#464646]">
            Analytics
          </h4>

          {/* Analytics Date Range filter */}
          <div className="col-span-1 grid items-center gap-2">
            <Label htmlFor="analyticsDateRange" className="text-left block text-[#464646]">
              Analytics Date Range
            </Label>
            <DatePickerWithRange
              value={analyticsDateRangeValue}
              onChange={setAnalyticsDateRangeValue}
              placeholder="Select date range"
              className="w-[236px] !h-[56px] font-poppins text-gray-700 flex justify-center items-center"
            />
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-30 mb-8 text-center">
          {customerAnalyticsData.map((card) => (
            <div
              key={card.id}
              className={`${card.bgColor} p-6 rounded-[20px] flex flex-col items-center gap-2 py-[40px]`}
            >
              <p className="font-medium text-[14px] leading-[100%] tracking-[%] font-dm-sans text-[#464646]">
                {card.title}
              </p>

              {/* Value */}
              {card.value === "loading" ? (
                <Skeleton className="h-6 w-16 mx-auto mt-2" />
              ) : (
              <p className="text-[#464646] font-medium text-[24px] leading-[100%] tracking-[0%] text-center font-poppins mt-2">
                {card.value}
              </p>
              )}

              {/* Conditional rendering for subText */}
              {card.value === "loading" ? (
                <Skeleton className="h-3 w-24 mx-auto mt-1" />
              ) : card.subText && (
                <p className="font-medium text-[12px] leading-[100%] tracking-[0%] font-poppins text-[#A9A9A9] mt-1">
                  {card.subText}
                </p>
              )}

              {/* Conditional Rendering for Trend or Icon List */}
              {card.value === "loading" ? (
                <Skeleton className="h-4 w-12 mx-auto mt-3" />
              ) : (
                <>
              {card.type === "trend" && card.trend && (
                <div className="flex items-center mt-3">
                  <Image
                    src={card.trend.imageSrc}
                    alt={card.trend.imageAlt}
                    width={20}
                    height={13}
                  />
                  <p
                    className={`font-medium text-[14px] leading-[100%] tracking-[0%] font-poppins ml-1 ${card.trend.textColor}`}
                  >
                    {card.trend.percentage}
                  </p>
                </div>
              )}

              {card.type === "icons" && card.iconList && (
                <div className="flex items-center mt-3">
                  <div className="inline-flex mr-1 items-center">
                    {Array.from({ length: card.iconList.count }).map(
                      (_, index) => (
                        <Image
                          key={index}
                          src={card.iconList.imageSrc}
                          alt={card.iconList.imageAlt}
                          width={24}
                          height={24}
                          className="inline-block"
                          style={{ marginLeft: index > 0 ? "0px" : "0" }}
                        />
                      )
                    )}
                  </div>
                  <p
                    className={`font-medium text-[12px] leading-[100%] tracking-[0%] font-poppins ml-1 ${card.iconList.textColor}`}
                  >
                    {card.iconList.subText}
                  </p>
                </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-5 gap-3 items-center py-4 mb-[20px] mt-[40px]">
          <div className="col-span-2 grid items-center gap-2">
            <Label htmlFor="keyword" className="text-left block">
              Keyword
            </Label>
            <div className="relative w-[300px]">
              <Search
                className="text-[#A9A9A9] absolute top-4 left-2"
                size={20}
              />
              <Input
                id="keyword"
                placeholder="Enter a keyword"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="max-w-md h-[50px] focus-visible:ring-0 rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)] pl-[35px] pr-[40px] text-[#A9A9A9] font-[500]"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword("")}
                  className="absolute top-4 right-2 text-white bg-[#6B7280] hover:bg-[#4B5563] rounded-full p-1 transition-colors"
                  type="button"
                >
                  <XIcon size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Status filter */}
          <div className="col-span-1 grid items-center gap-2">
            <Label htmlFor="status" className="text-left block text-[#464646]">
              Status
            </Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className="w-full font-poppins text-gray-700 !h-[50px]
                focus-visible:ring-offset-0
                focus-visible:ring-0
                focus-visible:outline-none
                focus-visible:ring-transparent
                border-[#CCCCCC80]
                focus-visible:border-[#CCCCCC80]
               "
              >
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="font-poppins text-[14px]">
                <SelectGroup>
                  {statusOptions.map((status) => (
                    <SelectItem
                      key={status.value}
                      value={status.value}
                      className="h-[36px]"
                    >
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Date Created filter */}
          <div className="col-span-1 grid items-center gap-2">
            <Label htmlFor="dateCreated" className="text-left block text-[#464646]">
              Date Created
            </Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="dateCreated"
                  className="w-full justify-between font-normal !h-[50px] font-poppins text-gray-700 border-[#CCCCCC80] focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-transparent focus-visible:border-[#CCCCCC80]"
                >
                  {selectedDate ? selectedDate.toLocaleDateString() : "Select date"}
                  <div className="flex items-center gap-2">
                    {selectedDate && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          clearDate();
                        }}
                        className="h-4 w-4 p-0 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200 flex items-center justify-center cursor-pointer"
                        title="Clear date"
                      >
                        <X className="h-3 w-3" />
                      </div>
                    )}
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    if (date instanceof Date) {
                      setSelectedDate(date);
                      setCalendarOpen(false);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Export customers */}
          <div className="col-span-1 grid items-center gap-2">
            <Label htmlFor="export" className="text-left block mt-2"></Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
            <Button className="cursor-pointer bg-[#0284B2] rounded-[5px] h-[48px] px-[20px] hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-[14px]">
              <Download />
              Export Customers
                  <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => handleExportCustomers("CSV")}
                  className="cursor-pointer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleExportCustomers("Excel")}
                  className="cursor-pointer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CustomerManagementDataTable
          data={customersResponse}
          isLoading={isLoadingCustomers}
          onPageChange={setCurrentPage}
          currentPage={currentPage}
          onEditTableProp={handleEditClick}
        />
      </div>

      {/* Edit Customer Modal */}
      <Dialog
        open={isEditCustomerModalOpen}
        onOpenChange={setIsEditCustomerModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#464646] font-[family-name:var(--font-dm)] font-[600]">
              Edit Customer
            </DialogTitle>
            <DialogClose className="bg-white text-muted-foreground absolute top-4 right-4 rounded-xs [&_svg:not([class*='size-'])]:size-4">
              <XIcon />
            </DialogClose>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-2">
              <Label htmlFor="customerName" className="text-left block">
                Name
              </Label>
              <Input
                id="customerName"
                placeholder="Enter customer name"
                className="col-span-3 h-[56px] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                value={selectedCustomer?.firstName || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setSelectedCustomer({
                    ...selectedCustomer,
                    firstName: e.target?.value,
                  });
                }}
              />
            </div>

            <div className="grid grid-cols-1 items-center gap-2">
              <Label htmlFor="customerEmail" className="text-left block">
                Email Address
              </Label>
              <Input
                id="customerEmail"
                placeholder="Enter a valid email address"
                className="col-span-3 h-[56px] text-[#A9A9A9] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                value={selectedCustomer?.email || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setSelectedCustomer({
                    ...selectedCustomer,
                    email: e.target?.value,
                  });
                }}
              />
            </div>

            <div className="grid grid-cols-1 items-center gap-2 mt-[10px]">
              <Label htmlFor="customerDepartment" className="text-left block">
                Department
              </Label>
              <Select>
                <SelectTrigger className="w-full !h-[50px] font-[family-name:var(--font-poppins)] text-[#A9A9A9]">
                  <SelectValue
                    placeholder="Select department"
                    className="text-[#A9A9A9]"
                  />
                </SelectTrigger>
                <SelectContent className="font-[family-name:var(--font-poppins)]">
                  <SelectItem value="it_support">IT Support</SelectItem>
                  <SelectItem value="customer_support">
                    Customer Support
                  </SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 items-center gap-2 mt-[10px]">
              <Label htmlFor="customerRole" className="text-left block">
                Role
              </Label>
              <Select>
                <SelectTrigger className="w-full !h-[50px] font-[family-name:var(--font-poppins)] text-[#A9A9A9]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="font-[family-name:var(--font-poppins)]">
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="rounded-[8px] bg-[#0284B2] py-[16px] px-[12px] cursor-pointer hover:bg-[#0284B2] font-[family-name:var(--font-poppins)]"
              onClick={handleUpdateCustomer}
            >
              Update Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#464646] font-[family-name:var(--font-dm)] font-[600]"></DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 justify-center text-center items-center gap-2 font-[family-name:var(--font-poppins)]">
              <CircleCheckBig
                strokeWidth={0.5}
                size={70}
                className="mx-auto text-[#0284B2]"
              />
              <h5 className="text-[22px] font-[500] text-[#464646] mt-[24px]">
                {successMessage}
              </h5>
            </div>
          </div>
          <DialogFooter className="flex sm:justify-center justify-center items-center w-full">
            <Button
              type="button"
              className="rounded-[8px] bg-[#0284B2] py-[20px] px-[32px] cursor-pointer hover:bg-[#0284B2] font-[family-name:var(--font-poppins)]"
              onClick={() => setIsSuccessModalOpen(false)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Modal */}
      <Dialog
        open={isDeleteCustomerModalOpen}
        onOpenChange={setIsDeleteCustomerModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#464646] font-[family-name:var(--font-dm)] font-[600]"></DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 justify-center text-center items-center gap-2 font-[family-name:var(--font-poppins)]">
              <h3 className="text-[26px] font-[600] text-[#464646] text-[#464646] font-[family-name:var(--font-dm)]">
                Delete Customer
              </h3>
              <h5 className="text-[18px] font-[500] text-[#464646] mt-[24px] text-[#464646]">
                Are you sure you want to delete this customer? This action cannot be
                undone.
              </h5>
              <p className="text-[12px] font-[500] text-[#FC5A5A] mt-[14px]">
                Disclaimer: Please note that once you delete a customer, the customer
                will no longer be available
              </p>
            </div>
          </div>
          <DialogFooter className="flex sm:justify-center">
            <Button
              type="button"
              className="rounded-[4px] text-white bg-[#FC5A5A] py-[20px] px-[34px] cursor-pointer hover:bg-[#FC5A5A] font-[family-name:var(--font-poppins)]"
              onClick={() => setIsDeleteCustomerModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-[4px] bg-[#0284B2] py-[20px] px-[34px] cursor-pointer hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-white"
              onClick={handleDeleteCustomer}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CustomerManagementPage() {
  return (
    <Suspense fallback={
      <div className="px-[1rem] md:px-[2rem]">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    }>
      <CustomerManagementPageContent />
    </Suspense>
  );
}
