"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

export type TransactionData = {
  id?: string;
  financialDate?: string;
  transactionDate?: string;
  accountNumber?: string;
  accountName?: string;
  branch?: string | null;
  postedBy?: string | null;
  approvedBy?: string | null;
  postingReferenceNumber?: string;
  debit?: string;
  credit?: string;
  narration?: string;
  entryCode?: string;
  instrumentNumber?: string;
  balance?: string;
  accessLevel?: number;
  identifier?: number;
  amount?: string;
  charge?: string;
  merchant?: string;
  recipientName?: string | null;
  senderName?: string | null;
  recipientBank?: string | null;
  senderBank?: string | null;
  transactionChannel?: string;
  transactionIconUrl?: string | null;
  recipientAccountNumber?: string;
  senderAccountNumber?: string;
  channelTransactionIdentifier?: string;
  transactionStatus?: string;
};

interface DataTableProps {
  data: Array<TransactionData>;
  onDeleteTableProp: (id: string) => void;
  onEditTableProp?: (permission: TransactionData) => void;
  isLoading?: boolean;
}

export function TranascationsTable(props: DataTableProps) {
  const { data, isLoading } = props;
  const columns: ColumnDef<TransactionData>[] = [
    {
      accessorKey: "financialDate",
      header: () => <div className="p-[10px]">Financial Date</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">
          {row.getValue("financialDate") ? 
            new Date(row.getValue("financialDate") as string).toLocaleDateString() : 
            'N/A'
          }
        </div>
      ),
    },
    {
      accessorKey: "transactionDate",
      header: () => <div className="p-[10px]">Transaction Date</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">
          {row.getValue("transactionDate") ? 
            new Date(row.getValue("transactionDate") as string).toLocaleString() : 
            'N/A'
          }
        </div>
      ),
    },
    {
      accessorKey: "accountNumber",
      header: () => <div className="p-[10px]">Account Number</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("accountNumber")}</div>
      ),
    },
    {
      accessorKey: "accountName",
      header: () => <div className="p-[10px]">Account Name</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("accountName")}</div>
      ),
    },
    {
      accessorKey: "postingReferenceNumber",
      header: () => <div className="p-[10px]">Reference Number</div>,
      cell: ({ row }) => (
        <div className="p-[10px] text-[#0284B2] font-mono">
          {row.getValue("postingReferenceNumber")}
        </div>
      ),
    },
    {
      accessorKey: "debit",
      header: () => <div className="p-[10px] text-right">Debit</div>,
      cell: ({ row }) => {
        const debit = row.getValue("debit") as string;
        return (
          <div className="p-[10px] text-right">
            {debit ? `₦${Number(debit).toLocaleString("en-NG")}` : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: "credit",
      header: () => <div className="p-[10px] text-right">Credit</div>,
      cell: ({ row }) => {
        const credit = row.getValue("credit") as string;
        return (
          <div className="p-[10px] text-right">
            {credit ? `₦${Number(credit).toLocaleString("en-NG")}` : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: () => <div className="p-[10px] text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = Number(row.getValue("amount"));
        return (
          <div className="p-[10px] text-right font-semibold">
            ₦{amount.toLocaleString("en-NG") || '0'}
          </div>
        );
      },
    },
    {
      accessorKey: "balance",
      header: () => <div className="p-[10px] text-right">Balance</div>,
      cell: ({ row }) => {
        const balance = row.getValue("balance") as string;
        return (
          <div className="p-[10px] text-right">
            ₦{Number(balance).toLocaleString("en-NG")}
          </div>
        );
      },
    },
    {
      accessorKey: "charge",
      header: () => <div className="p-[10px] text-right">Charge</div>,
      cell: ({ row }) => {
        const charge = row.getValue("charge") as string;
        return (
          <div className="p-[10px] text-right">
            {charge ? `₦${Number(charge).toLocaleString("en-NG")}` : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: "transactionChannel",
      header: () => <div className="p-[10px]">Channel</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("transactionChannel")}</div>
      ),
    },
    {
      accessorKey: "entryCode",
      header: () => <div className="p-[10px]">Entry Code</div>,
      cell: ({ row }) => (
        <div className="p-[10px] font-mono text-sm">{row.getValue("entryCode")}</div>
      ),
    },
    {
      accessorKey: "instrumentNumber",
      header: () => <div className="p-[10px]">Instrument Number</div>,
      cell: ({ row }) => (
        <div className="p-[10px] font-mono text-sm">{row.getValue("instrumentNumber")}</div>
      ),
    },
    {
      accessorKey: "transactionStatus",
      header: () => <div className="p-[10px]">Status</div>,
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
          <div className={`p-[10px] ${textColorClass} font-medium`}>
            {status}
          </div>
        );
      },
    },
    {
      accessorKey: "narration",
      header: () => <div className="p-[10px]">Narration</div>,
      cell: ({ row }) => (
        <div className="p-[10px] max-w-[200px] truncate" title={row.getValue("narration")}>
          {row.getValue("narration")}
        </div>
      ),
    },
    {
      accessorKey: "merchant",
      header: () => <div className="p-[10px]">Merchant</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("merchant") || '-'}</div>
      ),
    },
    {
      accessorKey: "recipientName",
      header: () => <div className="p-[10px]">Recipient</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("recipientName") || '-'}</div>
      ),
    },
    {
      accessorKey: "senderName",
      header: () => <div className="p-[10px]">Sender</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("senderName") || '-'}</div>
      ),
    },
    {
      accessorKey: "recipientAccountNumber",
      header: () => <div className="p-[10px]">Recipient Account</div>,
      cell: ({ row }) => (
        <div className="p-[10px] font-mono text-sm">{row.getValue("recipientAccountNumber") || '-'}</div>
      ),
    },
    {
      accessorKey: "senderAccountNumber",
      header: () => <div className="p-[10px]">Sender Account</div>,
      cell: ({ row }) => (
        <div className="p-[10px] font-mono text-sm">{row.getValue("senderAccountNumber") || '-'}</div>
      ),
    },
    {
      accessorKey: "recipientBank",
      header: () => <div className="p-[10px]">Recipient Bank</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("recipientBank") || '-'}</div>
      ),
    },
    {
      accessorKey: "senderBank",
      header: () => <div className="p-[10px]">Sender Bank</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("senderBank") || '-'}</div>
      ),
    },
    {
      accessorKey: "identifier",
      header: () => <div className="p-[10px]">Identifier</div>,
      cell: ({ row }) => (
        <div className="p-[10px] font-mono">{row.getValue("identifier")}</div>
      ),
    },
    {
      accessorKey: "accessLevel",
      header: () => <div className="p-[10px]">Access Level</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("accessLevel")}</div>
      ),
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
      <div className="rounded-0  border p-4 rounded-[18px] mt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-[18px] leading-[100%] tracking-[0%] align-middle font-dm-sans mt-4">
            Transactions
          </h4>
          <div>
            <div className="col-span-1 grid items-center gap-2">
              <Button
                onClick={() => {
                  alert("Export");
                }}
                className="cursor-pointer bg-[#0284B2] rounded-[5px] h-[48px] px-[20px] hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-[14px]"
              >
                <Download />
                Export Transactions
              </Button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table className="border-0 rounded-0 min-w-[2000px]">
          <TableHeader className="bg-[#F0FCFF] hover:!bg-[#F0FCFF] border-0 rounded-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-0 hover:!bg-[#F0FCFF]"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="px-[20px] py-[10px]">
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
          <TableBody className="">
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
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="even:bg-[#FCFCFC] w-full border-0"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-[20px] py-[10px] text-[#464646] font-[family-name:var(--font-poppins)] font-[500]"
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
                  className="h-24 text-center font-[family-name:var(--font-poppins)]"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  );
}
