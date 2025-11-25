"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentLog } from "@/types/payments";

interface PaymentLogsTableProps {
  data: PaymentLog[];
  isLoading: boolean;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
}

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

export function PaymentLogsTable(props: PaymentLogsTableProps) {
  const { data, isLoading, onPageChange, currentPage, totalPages } = props;

  return (
    <div className="w-full">
      <div className="rounded-0 border border-[#CCCCCC80] max-h-[500px] overflow-y-auto">
        <Table className="w-full text-left text-gray-500 rounded-t-lg">
          <TableHeader className="text-gray-700 bg-[#F0FCFF] sticky top-0 z-10">
            <TableRow className="border-0 hover:!bg-[#F0FCFF]">
              <TableHead className="px-[20px] py-[20px] font-medium">ID</TableHead>
              <TableHead className="px-[20px] py-[20px] font-medium">Date</TableHead>
              <TableHead className="px-[20px] py-[20px] font-medium">Description</TableHead>
              <TableHead className="px-[20px] py-[20px] font-medium">Student Name</TableHead>
              <TableHead className="px-[20px] py-[20px] font-medium">Registration ID/ Matric Number</TableHead>
              <TableHead className="px-[20px] py-[20px] font-medium">Payment Reference</TableHead>
              <TableHead className="px-[20px] py-[20px] font-medium">Payment ID</TableHead>
              <TableHead className="px-[20px] py-[20px] font-medium">Amount</TableHead>
              <TableHead className="px-[20px] py-[20px] font-medium">Commission</TableHead>
              <TableHead className="px-[20px] py-[20px] font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="even:bg-[#FCFCFC] w-full border-0">
                  {Array.from({ length: 10 }).map((_, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      className="px-[20px] py-[10px] text-[#464646] font-[family-name:var(--font-poppins)] font-[500]"
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length > 0 ? (
              data.map((log) => (
                <TableRow
                  key={log.id}
                  className="even:bg-[#FCFCFC] w-full border-0 hover:bg-gray-50"
                >
                  <TableCell className="px-[20px] py-[20px] text-[#464646] font-[family-name:var(--font-poppins)] font-[500]">
                    {log.id}
                  </TableCell>
                  <TableCell className="px-[20px] py-[20px] text-[#464646] font-[family-name:var(--font-poppins)] font-[500]">
                    {formatDate(log.financialDate)}
                  </TableCell>
                  <TableCell className="px-[20px] py-[20px] text-[#464646] font-[family-name:var(--font-poppins)] font-[500]">
                    {log.description}
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
                  <TableCell className="px-[20px] py-[20px] text-[#0284B2] font-[family-name:var(--font-poppins)] font-[500]">
                    {log.paymentId}
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
                  colSpan={10}
                  className="h-24 text-center font-[family-name:var(--font-poppins)] px-[20px] py-[10px]"
                >
                  No payment logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 cursor-pointer py-2 font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </Button>
          
          <div className="flex items-center space-x-1">
            {(() => {
              const renderPage = (pageNum: number) => (
                <Button
                  key={pageNum}
                  variant="ghost"
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-2 text-[16px] font-medium cursor-pointer ${
                    pageNum === currentPage
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {pageNum}
                </Button>
              );

              if (totalPages <= 7) {
                return Array.from({ length: totalPages }, (_, i) => renderPage(i + 1));
              }

              const pages = [renderPage(1)];
              const start = Math.max(2, currentPage - 1);
              const end = Math.min(totalPages - 1, currentPage + 1);

              if (start > 2) pages.push(<span key="..." className="px-2 text-gray-500">...</span>);
              
              for (let i = start; i <= end; i++) {
                pages.push(renderPage(i));
              }
              
              if (end < totalPages - 1) pages.push(<span key=".." className="px-2 text-gray-500">...</span>);
              if (totalPages > 1) pages.push(renderPage(totalPages));
              
              return pages;
            })()}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 cursor-pointer py-2 font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

