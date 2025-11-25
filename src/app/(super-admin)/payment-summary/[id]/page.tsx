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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useGetPaymentWithHistoryQuery } from "@/query-options/paymentsQueryOption";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function SinglePaymentSummaryPage() {
  const params = useParams();
  const paymentId = params.id as string;

  // Fetch payment with history from API
  const { data: paymentData, isLoading, error } = useGetPaymentWithHistoryQuery(paymentId);

  if (isLoading) {
    return (
      <div className="px-[1rem] md:px-[2rem]">
        <div className="mt-[20px]">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error || !paymentData?.data) {
    return (
      <div className="px-[1rem] md:px-[2rem]">
        <div className="mt-[20px] text-center">
          <p className="font-[family-name:var(--font-poppins)] text-[#464646]">
            {error ? "Error loading payment details" : "Payment not found"}
          </p>
        </div>
      </div>
    );
  }

  const payment = paymentData.data;
  const paymentLogs = payment.paymentLogs || [];

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format amount
  const formatAmount = (amount: number) => {
    return `₦${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    const statusColors: Record<string, string> = {
      successful: "text-[#0284B2]",
      pending: "text-[#FFC107]",
      failed: "text-[#FC5A5A]",
    };
    return statusColors[statusLower] || statusColors["pending"];
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
              <BreadcrumbItem className="text-[#A9A9A9]">
                <BreadcrumbLink href="/payment-summary">Payment Summary</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Play className="text-[#CCCCCC]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem className="text-[#464646]">
                <BreadcrumbPage>View Payment</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="cursor-pointer bg-[#04B2F1] rounded-[5px] h-[48px] px-[20px] hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-[14px] flex items-center gap-2">
                  <Download size={16} />
                  Export Payment
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
        {/* Payment Details Card */}
        <Card className="border border-[#CCCCCC80] shadow-sm mb-6">
          <CardContent className="pt-6">
            <h3 className="font-[family-name:var(--font-dm)] font-[600] text-[18px] mb-4">
              Payment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-[family-name:var(--font-poppins)] text-[#A9A9A9] font-medium mb-1">
                  Payment ID
                </p>
                <p className="text-base font-[family-name:var(--font-poppins)] text-[#464646]">
                  {payment.id}
                </p>
              </div>
              <div>
                <p className="text-sm font-[family-name:var(--font-poppins)] text-[#A9A9A9] font-medium mb-1">
                  Description
                </p>
                <p className="text-base font-[family-name:var(--font-poppins)] text-[#464646]">
                  {payment.description}
                </p>
              </div>
              <div>
                <p className="text-sm font-[family-name:var(--font-poppins)] text-[#A9A9A9] font-medium mb-1">
                  School ID
                </p>
                <p className="text-base font-[family-name:var(--font-poppins)] text-[#464646]">
                  {payment.schoolId}
                </p>
              </div>
              <div>
                <p className="text-sm font-[family-name:var(--font-poppins)] text-[#A9A9A9] font-medium mb-1">
                  Wallet ID
                </p>
                <p className="text-base font-[family-name:var(--font-poppins)] text-[#464646]">
                  {payment.walletId}
                </p>
              </div>
              <div>
                <p className="text-sm font-[family-name:var(--font-poppins)] text-[#A9A9A9] font-medium mb-1">
                  Start Date
                </p>
                <p className="text-base font-[family-name:var(--font-poppins)] text-[#464646]">
                  {formatDate(payment.startDate)}
                </p>
              </div>
              <div>
                <p className="text-sm font-[family-name:var(--font-poppins)] text-[#A9A9A9] font-medium mb-1">
                  End Date
                </p>
                <p className="text-base font-[family-name:var(--font-poppins)] text-[#464646]">
                  {formatDate(payment.endDate)}
                </p>
              </div>
              <div>
                <p className="text-sm font-[family-name:var(--font-poppins)] text-[#A9A9A9] font-medium mb-1">
                  Created Date
                </p>
                <p className="text-base font-[family-name:var(--font-poppins)] text-[#464646]">
                  {formatDate(payment.createdDate)}
                </p>
              </div>
              <div>
                <p className="text-sm font-[family-name:var(--font-poppins)] text-[#A9A9A9] font-medium mb-1">
                  Status
                </p>
                <p className={`text-base font-[family-name:var(--font-poppins)] font-medium ${payment.hasStopped ? "text-[#FC5A5A]" : "text-[#0284B2]"}`}>
                  {payment.hasStopped ? "Stopped" : "Active"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Amount and Commission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="border border-[#CCCCCC80] shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-[family-name:var(--font-poppins)] text-[#A9A9A9] font-medium">
                  Total Amount
                </p>
                <p className="text-2xl font-bold font-[family-name:var(--font-dm)] text-[#464646]">
                  {formatAmount(payment.totalAmount)}
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
                  {formatAmount(payment.totalCommission)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Logs Table */}
        <div className="mt-6">
          <h3 className="font-[family-name:var(--font-dm)] font-[600] text-[18px] mb-4">
            Payment Logs
          </h3>
          <div className="rounded-0 border border-[#CCCCCC80] max-h-[500px] overflow-y-auto">
            <Table className="w-full text-left text-gray-500 rounded-t-lg">
              <TableHeader className="text-gray-700 bg-[#F0FCFF] sticky top-0 z-10">
                <TableRow className="border-0 hover:!bg-[#F0FCFF]">
                  <TableHead className="px-[20px] py-[20px] font-medium">Date</TableHead>
                  <TableHead className="px-[20px] py-[20px] font-medium">Student Name</TableHead>
                  <TableHead className="px-[20px] py-[20px] font-medium">Student Reference</TableHead>
                  <TableHead className="px-[20px] py-[20px] font-medium">Payment Reference</TableHead>
                  <TableHead className="px-[20px] py-[20px] font-medium">Amount</TableHead>
                  <TableHead className="px-[20px] py-[20px] font-medium">Commission</TableHead>
                  <TableHead className="px-[20px] py-[20px] font-medium">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentLogs.length > 0 ? (
                  paymentLogs.map((log) => (
                    <TableRow
                      key={log.id}
                      className="even:bg-[#FCFCFC] w-full border-0 hover:bg-gray-50"
                    >
                      <TableCell className="px-[20px] py-[20px] text-[#464646] font-[family-name:var(--font-poppins)] font-[500]">
                        {formatDate(log.financialDate)}
                      </TableCell>
                      <TableCell className="px-[20px] py-[20px] text-[#464646] font-[family-name:var(--font-poppins)] font-[500]">
                        {log.fullName}
                      </TableCell>
                      <TableCell className="px-[20px] py-[20px] text-[#464646] font-[family-name:var(--font-poppins)] font-[500]">
                        {log.studentReference}
                      </TableCell>
                      <TableCell className="px-[20px] py-[20px] text-[#464646] font-[family-name:var(--font-poppins)] font-[500]">
                        {log.paymentReference}
                      </TableCell>
                      <TableCell className="px-[20px] py-[20px] text-[#464646] font-[family-name:var(--font-poppins)] font-semibold">
                        {formatAmount(log.amount)}
                      </TableCell>
                      <TableCell className="px-[20px] py-[20px] text-[#464646] font-[family-name:var(--font-poppins)] font-semibold">
                        {formatAmount(log.commission)}
                      </TableCell>
                      <TableCell className="px-[20px] py-[20px]">
                        <span className={`font-[family-name:var(--font-poppins)] font-medium ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center font-[family-name:var(--font-poppins)] px-[20px] py-[10px]"
                    >
                      No payment logs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
