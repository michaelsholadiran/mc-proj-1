"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { FilePenLine, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export function KYCSupervisorRequestTable(props: DataTableProps) {
  const { data } = props;
  const columns: ColumnDef<CustomerDetails>[] = [
    {
      accessorKey: "dateCreated",
      header: () => <div className="p-[10px]">Personnel Name</div>,
      cell: ({ row }) => (
        <Link
          href={`/dashboard/kyc-requests/${row?.id}/personal-details`}
          className="flex items-center gap-3"
        >
          {" "}
          <div className="p-[10px]">{row.getValue("dateCreated")}</div>
        </Link>
      ),
    },
    {
      accessorKey: "customerId",
      header: () => <div className="p-[10px]">Role</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("customerId")}</div>
      ),
    },
    {
      id: "transactionId",
      header: () => <div className="p-[10px]">Requests</div>,
      cell: ({ row }) => (
        <div className="p-[10px] text-[#0284B2]">{row.original.id}</div>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <div className="p-[10px] ">Response Time</div>,
      cell: ({ row }) => {
        const amount = row.getValue("amount") as string;
        return <div className="p-[10px] ">{amount}</div>;
      },
    },
    {
      accessorKey: "channel",
      header: () => <div className="p-[10px]">SLA Compliance</div>,
      cell: ({ row }) => {
        const percentage = row.getValue("channel") as string;
        const percentageValue = parseInt(percentage.replace("%", ""));

        let color = "#0284B2"; // Default blue for 94% above
        if (percentageValue >= 49 && percentageValue < 94) {
          color = "#FFC300"; // Orange/Yellow for 49% above
        } else if (percentageValue < 20) {
          color = "#FC5A5A"; // Red for 20% below
        }

        return (
          <div className="flex items-center">
            <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-4">
              <div
                className="h-2.5 rounded-full"
                style={{ width: `${percentageValue}%`, backgroundColor: color }}
              ></div>
            </div>
            <div>{percentage}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: () => <div className="p-[10px]">Actions</div>,
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 focus-visible:ring-0"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-[12px] text-[#3D4F5C] font-[family-name:var(--font-poppins)]">
              <FilePenLine className="text-[#04B2F1]" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[12px] text-[#3D4F5C] font-[family-name:var(--font-poppins)]">
              <Trash2 className="text-[#FC5A5A]" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
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
