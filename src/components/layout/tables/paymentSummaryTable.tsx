"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type PaymentSummaryData = {
  id: string;
  transactionId: string;
  accountNumber: string;
  accountName: string;
  registrationId: string;
  amount: string;
  channel: string;
  status: string;
  date: string;
  referenceNumber: string;
};

interface DataTableProps {
  data: PaymentSummaryData[];
  isLoading: boolean;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
}

export function PaymentSummaryTable(props: DataTableProps) {
  const { data, isLoading, onPageChange, currentPage, totalPages } = props;

  const columns: ColumnDef<PaymentSummaryData>[] = [
    {
      accessorKey: "date",
      header: () => <div className="font-medium">Date</div>,
      cell: ({ row }) => {
        const date = row.getValue("date") as string;
        return <div>{date}</div>;
      },
    },
    {
      accessorKey: "transactionId",
      header: () => <div className="font-medium">Transaction ID</div>,
      cell: ({ row }) => (
        <div className="text-[#0284B2]">
          {row.getValue("transactionId")}
        </div>
      ),
    },
    {
      accessorKey: "referenceNumber",
      header: () => <div className="font-medium">Reference Number</div>,
      cell: ({ row }) => (
        <div>{row.getValue("referenceNumber")}</div>
      ),
    },
    {
      accessorKey: "registrationId",
      header: () => <div className="font-medium">Registration ID/ Matric Number</div>,
      cell: ({ row }) => (
        <div>{row.getValue("registrationId")}</div>
      ),
    },
    {
      accessorKey: "accountName",
      header: () => <div className="font-medium">Student Name</div>,
      cell: ({ row }) => (
        <div>{row.getValue("accountName")}</div>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <div className="font-medium">Amount</div>,
      cell: ({ row }) => {
        const amount = row.getValue("amount") as string;
        return (
          <div className="font-semibold">
            {amount}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="font-medium">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusLower = status.toLowerCase();

        const statusColors: Record<string, string> = {
          successful: "text-[#0284B2]",
          pending: "text-[#FFC107]",
          failed: "text-[#FC5A5A]",
        };

        const textColorClass =
          statusColors[statusLower] || statusColors["pending"];

        return (
          <div className={`${textColorClass} font-medium`}>
            {status}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      <div className="rounded-0 border-0 max-h-[400px] overflow-y-auto">
        <Table className="w-full text-left text-gray-500 rounded-t-lg">
          <TableHeader className="text-gray-700 bg-[#F0FCFF] sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-0 hover:!bg-[#F0FCFF]"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} scope="col" className="px-[20px] py-[20px]">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="even:bg-[#FCFCFC] w-full border-0">
                  {columns.map((_, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      className="px-[20px] py-[10px] text-[#464646] font-[family-name:var(--font-poppins)] font-[500]"
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="even:bg-[#FCFCFC] w-full border-0 hover:bg-gray-50"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-[20px] py-[20px] text-[#464646] font-[family-name:var(--font-poppins)] font-[500]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center font-[family-name:var(--font-poppins)] px-[20px] py-[10px]"
                >
                  No results.
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

