"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TransactionsApiResponse, Transaction } from "@/types/transactions";

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
import Link from "next/link";


interface DataTableProps {
  data: TransactionsApiResponse | undefined;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  currentPage: number;
}

export function TranascationsTable(props: DataTableProps) {
  const { data, isLoading, onPageChange, currentPage } = props;

  const transactions = data?.data?.data || [];
  const totalPages = data?.data?.totalPages || 0;
  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "financialDate",
      header: () => <div className="font-medium">Financial Date</div>,
      cell: ({ row }) => {
        const financialDate = row.getValue("financialDate") as string;
        if (!financialDate) return <div>N/A</div>;
        
        const date = new Date(financialDate);
        const formattedDateTime = date.toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        
        return (
          <Link
            href={`/transactions/${row.original.id}`}
            className="flex items-center gap-3"
          >
            <div>{formattedDateTime}</div>
          </Link>
        );
      },
    },
    {
      accessorKey: "transactionDate",
      header: () => <div className="font-medium">Transaction Date</div>,
      cell: ({ row }) => {
        const transactionDate = row.getValue("transactionDate") as string;
        if (!transactionDate) return <div>N/A</div>;
        
        const date = new Date(transactionDate);
        const formattedDateTime = date.toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        
        return <div>{formattedDateTime}</div>;
      },
    },
    {
      accessorKey: "accountNumber",
      header: () => <div className="font-medium">Account Number</div>,
      cell: ({ row }) => (
        <div>{row.getValue("accountNumber")}</div>
      ),
    },
    {
      accessorKey: "accountName",
      header: () => <div className="font-medium">Account Name</div>,
      cell: ({ row }) => (
        <div>{row.getValue("accountName")}</div>
      ),
    },
    {
      accessorKey: "postingReferenceNumber",
      header: () => <div className="font-medium">Transaction ID</div>,
      cell: ({ row }) => (
        <div className="text-[#0284B2]">
          {row.getValue("postingReferenceNumber")}
        </div>
      ),
    },
    {
      accessorKey: "narration",
      header: () => <div className="font-medium">Description</div>,
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.getValue("narration") as string}>
          {row.getValue("narration")}
        </div>
      ),
    },
    {
      accessorKey: "debit",
      header: () => <div className="font-medium">Debit</div>,
      cell: ({ row }) => {
        const debit = row.getValue("debit") as string;
        const numericDebit = parseFloat(debit) || 0;
        return (
          <div className="text-red-600">
            {numericDebit > 0 ? `₦${numericDebit.toLocaleString("en-NG")}` : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: "credit",
      header: () => <div className="font-medium">Credit</div>,
      cell: ({ row }) => {
        const credit = row.getValue("credit") as string;
        const numericCredit = parseFloat(credit) || 0;
        return (
          <div className="text-green-600">
            {numericCredit > 0 ? `₦${numericCredit.toLocaleString("en-NG")}` : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: "balance",
      header: () => <div className="font-medium">Balance</div>,
      cell: ({ row }) => {
        const balance = row.getValue("balance") as string;
        const numericBalance = parseFloat(balance) || 0;
        return (
          <div>
            ₦{numericBalance.toLocaleString("en-NG")}
          </div>
        );
      },
    },
    {
      accessorKey: "charge",
      header: () => <div className="font-medium">Charge</div>,
      cell: ({ row }) => {
        const charge = row.getValue("charge") as string;
        const numericCharge = parseFloat(charge) || 0;
        return (
          <div>
            {numericCharge > 0 ? `₦${numericCharge.toLocaleString("en-NG")}` : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: "entryCode",
      header: () => <div className="font-medium">Entry Code</div>,
      cell: ({ row }) => (
        <div>{row.getValue("entryCode")}</div>
      ),
    },
    {
      accessorKey: "instrumentNumber",
      header: () => <div className="font-medium">Instrument No.</div>,
      cell: ({ row }) => (
        <div>{row.getValue("instrumentNumber")}</div>
      ),
    },
    {
      accessorKey: "transactionChannel",
      header: () => <div className="font-medium">Channel</div>,
      cell: ({ row }) => {
        const channel = row.getValue("transactionChannel") as string;
        return (
          <div>
            {channel}
          </div>
        );
      },
    },
    {
      accessorKey: "recipientAccountNumber",
      header: () => <div className="font-medium">Recipient Account</div>,
      cell: ({ row }) => (
        <div>{row.getValue("recipientAccountNumber")}</div>
      ),
    },
    {
      accessorKey: "senderAccountNumber",
      header: () => <div className="font-medium">Sender Account</div>,
      cell: ({ row }) => (
        <div>{row.getValue("senderAccountNumber")}</div>
      ),
    },
    {
      accessorKey: "transactionStatus",
      header: () => <div className="font-medium">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue("transactionStatus") as string;
        const statusLower = status.toLowerCase();

        // Define status text colors
        const statusColors: Record<string, string> = {
          successful: "text-[#0284B2]", // Blue for successful
          pending: "text-[#FFC107]", // Yellow for pending
          failed: "text-[#FC5A5A]", // Red for failed
        };

        // Get the color class for the current status, default to pending color if not found
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
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      <div className="rounded-0 border-0 max-h-[400px] overflow-y-auto">
        <Table className="w-full text-left text-gray-500 rounded-t-lg">
          {/* Table Header (Sticky) */}
          <TableHeader className=" text-gray-700  bg-[#F0FCFF] sticky top-0 z-10">
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
          {/* Table Body */}
          <TableBody>
            {isLoading ? (
              // Show loading skeletons
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
            ) : transactions.length ? (
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

      {/* Simple Pagination Controls */}
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
          
                    {/* Page Numbers */}
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
