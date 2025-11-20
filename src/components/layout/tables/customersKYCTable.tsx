"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
import Image from "next/image";

export type CustomerDetails = {
  id: string;
  documentType?: string;
  userEmail?: string;
  customerId?: string;
  accountNo?: string;
  phoneNumber?: string;
  amount?: string;
  userName?: string;
  channel?: string;
  status?: string;
  dateCreated?: string;
};

interface DataTableProps {
  data: Array<CustomerDetails>;
  onDeleteTableProp: (id: string) => void;
  onEditTableProp?: (permission: CustomerDetails) => void;
}

export function CustomerKYCTable(props: DataTableProps) {
  const { data } = props;
  const columns: ColumnDef<CustomerDetails>[] = [
    {
      accessorKey: "documentType",
      header: () => <div className="p-[10px]">Document Type</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("documentType")}</div>
      ),
    },
    {
      accessorKey: "dateCreated",
      header: () => <div className="p-[10px]">Upload Date</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("dateCreated")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="p-[10px]">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusLower = status.toLowerCase();

        // Define status text colors
        const statusColors: Record<string, string> = {
          pending: "text-[#FFC107]",
          approved: "text-[#0284B2]",
          failed: "text-[#FC5A5A]",
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
      id: "actions",
      enableHiding: false,
      header: () => <div className=""></div>,
      cell: () => {
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="w-full cursor-pointer bg-[#0284B2] rounded-[5px] h-[48px] px-[20px] hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-[14px]"
                type="button"
              >
                View Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1050px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-semibold text-[28px] leading-[100%] tracking-[0px] font-dm-sans ml-4 mt-4">
                  Document Details
                </DialogTitle>
                <DialogClose className="bg-white mt-8 mr-8 cursor-pointer text-muted-foreground absolute top-4 right-4 rounded-xs [&_svg:not([class*='size-'])]:size-4">
                  <XIcon size={14} />
                </DialogClose>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="bg-white p-6 rounded-lg">
                  {/* Main grid for the header fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4 mb-[100px]">
                    {/* Document Type */}
                    <div className="flex flex-col">
                      <p className="text-[18px] font-bold">Document Type</p>
                      <p className="text-[18px] font-semibold text-[#A9A9A9] mt-0.5">
                        NIN
                      </p>
                    </div>

                    {/* Upload Date */}
                    <div className="flex flex-col">
                      <p className="text-[18px] font-bold">Upload Date</p>
                      <p className="text-[18px] font-semibold text-[#A9A9A9] mt-0.5">
                        24/03/2025
                      </p>
                    </div>

                    {/* Checked By */}
                    <div className="flex flex-col">
                      <p className="text-[18px] font-bold">Checked By</p>
                      <p className="text-[18px] font-semibold text-[#A9A9A9] mt-0.5">
                        John Smith
                      </p>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col">
                      <p className="text-[18px] font-bold">Status</p>
                      <p className="text-[18px] font-semibold text-[#FFC107] mt-0.5">
                        Pending
                      </p>
                    </div>
                  </div>

                  <div className="py-12 border mt-4 rounded-[8px] flex justify-center">
                    <Image
                      src="/illustrations/customer-management/nin.png"
                      alt="nin"
                      width={798}
                      height={396}
                    />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
      <div className="border p-4 rounded-[18px] mt-4">
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
