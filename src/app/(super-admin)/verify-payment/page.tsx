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
import { useState } from "react";
import { Input } from "@/components/ui/input";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { VerifyPaymentTable, VerifyPaymentData } from "@/components/layout/tables/verifyPaymentTable";

// Mock data for verify payment
const generateMockVerifyData = (): VerifyPaymentData[] => {
  const statuses = ["Verified", "Pending", "Failed"];
  const channels = ["Mobile", "iBank", "ATM"];
  const verifiers = ["Admin User", "Super Admin", "Manager"];
  const data: VerifyPaymentData[] = [];

  for (let i = 1; i <= 25; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    data.push({
      id: `verify-${i}`,
      transactionId: `TXN${String(i).padStart(8, '0')}`,
      referenceNumber: `REF${String(i).padStart(10, '0')}`,
      amount: `₦${(Math.random() * 100000 + 1000).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
      customerName: `Customer ${i}`,
      accountNumber: `123456789${String(i).padStart(2, '0')}`,
      channel: channels[Math.floor(Math.random() * channels.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      verifiedDate: date.toLocaleDateString('en-NG', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      verifiedBy: verifiers[Math.floor(Math.random() * verifiers.length)],
    });
  }

  return data;
};

export default function VerifyPaymentPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<{from: Date, to?: Date} | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading] = useState(false);

  // Mock data
  const allVerifications = generateMockVerifyData();
  const totalPages = Math.ceil(allVerifications.length / 10);

  // Filter data based on filters
  const filteredVerifications = allVerifications.filter((verification) => {
    if (searchKeyword && !verification.transactionId.includes(searchKeyword) && !verification.referenceNumber.includes(searchKeyword)) {
      return false;
    }
    if (channelFilter !== "all" && verification.channel !== channelFilter) {
      return false;
    }
    if (statusFilter !== "all" && verification.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Paginate data
  const paginatedVerifications = filteredVerifications.slice((currentPage - 1) * 10, currentPage * 10);

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "channel") {
      setChannelFilter(value);
    } else if (filterType === "status") {
      setStatusFilter(value);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
                <BreadcrumbPage>Verify Payment</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="cursor-pointer bg-[#04B2F1] rounded-[5px] h-[48px] px-[20px] hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-[14px] flex items-center gap-2">
                  <Download size={16} />
                  Export Verifications
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
            Verify Payment
          </h6>
        </div>
      </div>

      {/* Content */}
      <div className="mt-[20px]">
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-3 items-center py-4 mb-[20px]">
          <div className="w-full lg:col-span-1 grid items-center gap-2">
            <Label htmlFor="transactionId" className="text-left block">
              Transaction ID
            </Label>
            <div className="relative w-full">
              <Search
                className="text-[#A9A9A9] absolute top-4 left-2"
                size={20}
              />
              <Input
                id="transactionId"
                placeholder="Enter transaction ID"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full h-[50px] focus-visible:ring-0 rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)] pl-[35px] pr-[40px] font-[500] border-[#CCCCCC80] focus-visible:border-[#CCCCCC80]"
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

          <div className="w-full lg:col-span-1 grid items-center gap-2">
            <Label htmlFor="channel" className="text-left block">
              Channel
            </Label>
            <select
              value={channelFilter}
              onChange={(e) => handleFilterChange("channel", e.target.value)}
              className="h-[50px] w-full px-3 font-[family-name:var(--font-poppins)] text-[#3D4F5C] border border-[#CCCCCC80] rounded-[8px] focus:outline-none focus:ring-1 focus:ring-[#0284B2]"
            >
              <option value="all">All Channels</option>
              <option value="Mobile">Mobile</option>
              <option value="iBank">iBank</option>
              <option value="ATM">ATM</option>
            </select>
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
              <option value="Verified">Verified</option>
              <option value="Failed">Failed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="w-full lg:col-span-2 grid items-center gap-2">
            <Label htmlFor="dateRange" className="text-left block">
              Date Range
            </Label>
            <DatePickerWithRange
              value={dateRangeFilter}
              onChange={setDateRangeFilter}
              placeholder="Select date range"
              className="h-[50px] font-[family-name:var(--font-poppins)] text-[#3D4F5C] flex items-center"
            />
          </div>
        </div>
        
        <VerifyPaymentTable
          data={paginatedVerifications}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
