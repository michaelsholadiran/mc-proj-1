"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
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
import Link from "next/link";

export type CustomerDetails = {
  id?: string;
  userName?: string;
  userEmail?: string;
  customerId?: string;
  accountNo?: string;
  phoneNumber?: string;
  channel?: string;
  status?: string;
  dateCreated?: string;
  amount?: string;
};

interface DataTableProps {
  data: Array<CustomerDetails>;
}

export function KYCApprovalSupervisorRequestTable(props: DataTableProps) {
  const { data } = props;
  const columns: ColumnDef<CustomerDetails>[] = [
    {
      id: "transactionId",
      header: () => <div className="p-[10px] text-left">Request ID</div>,
      cell: ({ row }) => (
        <div className="p-[10px] text-[#0284B2]">{row.original.id}</div>
      ),
    },
    {
      accessorKey: "customerId",
      header: () => <div className="p-[10px] text-left">Customer ID</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("customerId")}</div>
      ),
    },
    {
      accessorKey: "userName",
      header: () => <div className="p-[10px] text-left">Customer Name</div>,
      cell: ({ row }) => (
        <Link
          href={`/kyc-approval-supervisor/kyc-request-details/${row?.id}/personal-details`}
          className="flex items-center gap-3"
        >
          {" "}
          <div className="p-[10px]">{row.getValue("userName")}</div>
        </Link>
      ),
    },
    {
      accessorKey: "dateCreated",
      header: () => <div className="p-[10px] text-left">Submission Date</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("dateCreated")}</div>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <div className="p-[10px] text-left">SLA Countdown</div>,
      cell: ({ row }) => {
        const amount = row.getValue("amount") as string;

        if (!amount) {
          return <div className="p-[10px] text-gray-400">--:--:--</div>;
        }

        const timeParts = amount.split(":");
        const hours = parseInt(timeParts[0]);

        let color = "text-gray-900"; // Default black for normal state
        if (hours === 0) {
          color = "text-red-600"; // Red for critical (less than 1 hour)
        } else if (hours === 1) {
          color = "text-yellow-600"; // Yellow for warning (1 hour remaining)
        }

        return <div className={`p-[10px] font-mono ${color}`}>{amount}</div>;
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
      <div className="rounded-0  border p-4 rounded-[18px] mt-4">
        <Table className="border-0 rounded-0">
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
            {table.getRowModel().rows?.length ? (
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
