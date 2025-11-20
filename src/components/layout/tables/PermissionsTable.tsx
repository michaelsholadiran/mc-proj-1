"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { FilePenLine, MoreHorizontal, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
import { Permission } from "@/types";

interface DataTableProps {
  data: Array<Permission>;
  isLoading: boolean;
  onDeleteTableProp: (id: string) => void;
  onEditTableProp: (permission: Permission) => void;
}

export function PermissionsTable(props: DataTableProps) {
  const { data, isLoading, onDeleteTableProp, onEditTableProp } = props;
  const columns: ColumnDef<Permission>[] = [
    {
      id: "permission",
      header: () => <div className="p-[10px]">Permissions</div>,
      cell: ({ row }) => {
        const permission = row.original;

        return <div className="capitalize p-[10px]">{permission.name}</div>;
      },
    },
    {
      accessorKey: "dateCreated",
      header: () => {
        return <div className="p-[10px]">Date Created</div>;
      },
      cell: () => (
        <div className="lowercase p-[10px]">{"02/04/2024 11:08am"}</div>
      ),
    },
    {
      accessorKey: "noOfUsers",
      header: () => <div className="p-[10px]">Number of Users</div>,
      cell: () => {
        return (
          <div className="p-[10px]">
            {Math.floor(Math.random() * (10 - 3 + 1)) + 3}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="">Actions</div>,
      cell: ({ row }) => {
        const permission = row.original;

        return (
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
              <DropdownMenuItem
                onClick={() => onEditTableProp(permission)}
                className="text-[12px] text-[#3D4F5C] font-[family-name:var(--font-poppins)]"
              >
                <FilePenLine className="text-[#04B2F1]" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteTableProp(permission.permissionId)}
                className="text-[12px] text-[#3D4F5C] font-[family-name:var(--font-poppins)]"
              >
                <Trash2 className="text-[#FC5A5A]" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      <div className="rounded-0 border-0">
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
