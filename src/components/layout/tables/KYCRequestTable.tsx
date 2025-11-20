"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
// import { Download } from "lucide-react";

import {
  flexRender,
  getCoreRowModel,
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

export type KYCRequestDetails = {
  id: string;
  customerId: string;
  customerName: string;
  submissionDate: string;
  slaCountdown: string;
};

interface DataTableProps {
  data: Array<KYCRequestDetails>;
}

export function KYCRequestTable(props: DataTableProps) {
  const { data } = props;
  const columns: ColumnDef<KYCRequestDetails>[] = [
    {
      accessorKey: "id",
      header: () => <div className="p-[10px]">Request ID</div>,
      cell: ({ row }) => (
        <Link
          href={`/dashboard/kyc-requests/${row?.id}/personal-details`}
          className="flex items-center gap-3"
        >
          {" "}
          <div className="p-[10px]">{row.getValue("id")}</div>
        </Link>
      ),
    },
    {
      accessorKey: "customerId",
      header: () => <div className="p-[10px]">Customer ID</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("customerId")}</div>
      ),
    },
    {
      accessorKey: "customerName",
      header: () => <div className="p-[10px]">Customer Name</div>,
      cell: ({ row }) => (
        <div className="p-[10px] text-[#0284B2]">
          {row.getValue("customerName")}
        </div>
      ),
    },
    {
      accessorKey: "submissionDate",
      header: () => <div className="p-[10px] text-right">Submission Date</div>,
      cell: ({ row }) => {
        const submissionDate = row.getValue("submissionDate") as string;
        return (
          <div className="p-[10px] text-right">
            {submissionDate}
          </div>
        );
      },
    },
    {
      accessorKey: "slaCountdown",
      header: () => <div className="p-[10px]">SLA Countdown</div>,
      cell: ({ row }) => {
        const slaCountdown = row.getValue("slaCountdown") as string;
        
        // Determine color based on SLA countdown value
        let textColor = "text-[#464646]"; // Default color
        
        if (slaCountdown === "00:00:00") {
          textColor = "text-red-500"; // Red for expired (00:00:00)
        } else if (slaCountdown.startsWith("00:") || slaCountdown.startsWith("01:")) {
          textColor = "text-yellow-500"; // Yellow for warning (00:xx:xx or 01:xx:xx)
        }
        
        return (
          <div className={`p-[10px] ${textColor} font-medium`}>
            {slaCountdown}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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

    </div>
  );
}
