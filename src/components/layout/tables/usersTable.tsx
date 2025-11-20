"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { FilePenLine, MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

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
import { StaticImageData } from "next/image";
import { AvatarIcon } from "@/components/icons";
import { User } from "@/types";
import { PaginatedResponse } from "@/types";

export type UserDetails = {
  id: string;
  role: string;
  userName: string;
  userEmail: string;
  image?: StaticImageData | string;
  status: string;
  dateCreated: string;
};

interface DataTableProps {
  data: PaginatedResponse<User> | undefined;
  isLoading: boolean;
  onEditTableProp: (permission: User) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
}

export function UserManagementDataTable(props: DataTableProps) {
  const { 
    data, 
    isLoading,
    onEditTableProp, 
    onPageChange, 
    currentPage
  } = props;

  const users = data?.data?.data || [];
  const totalPages = data?.data?.totalPages || 0;

  const columns: ColumnDef<User>[] = [
    {
      id: "user",
      header: () => <div className="py-[10px] font-medium">User Name</div>,
      meta: { width: "30%" },
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="capitalize  flex items-center gap-3">
            <Link href={`/user-management/${user?.id}`} className="flex items-center gap-3">
              <div className="h-[50px] w-[50px] rounded-full">
                <AvatarIcon />
              </div>
              <div>
                <p className="text-[#464646] font-[family-name:var(--font-poppins)]">
                  {`${user?.firstName} ${user?.lastName}`}
                </p>
                <span className="text-[#A9A9A9] font-[family-name:var(--font-poppins)] lowercase">
                  {user?.email}
                </span>
              </div>
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "roles",
      header: () => {
        return <div className="py-[10px] font-medium">Roles</div>;
      },
      meta: { width: "20%" },
      cell: ({ row }) => {
        const roles = row.getValue("roles") as string[] | undefined;
        
        if (!roles || roles.length === 0) {
          return <div className="">No Roles Assigned</div>;
        }
        
        return (
          <div className="flex flex-wrap gap-1">
            {roles.map((role, index) => (
              <span
                key={index}
                className="inline-block bg-[#E3F2FD] text-[#0284B2] px-2 py-1 rounded-full text-xs font-medium"
              >
                {role}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="py-[10px] font-medium">Status</div>,
      meta: { width: "10%" },
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        
        // Define status colors based on the status value
        const getStatusColor = (status: string) => {
          switch (status.toLowerCase()) {
            case "active":
              return "text-[#0284B2]  py-1 rounded-full  font-medium";
            case "temporary":
              return "text-[#F59E0B]   py-1 rounded-full  font-medium";
            case "pendinginvite":
              return "text-[#6B7280]   py-1 rounded-full  font-medium";
            case "inactive":
              return "text-[#EF4444]   py-1 rounded-full  font-medium";
            default:
              return "text-[#6B7280]   py-1 rounded-full  font-medium";
          }
        };

        return (
          <div className="">
            <span className={getStatusColor(status)}>
              {status}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdDate",
      header: () => {
        return <div className="py-[10px] font-medium">Date Created</div>;
      },
      meta: { width: "20%" },
      cell: ({ row }) => {
        const createdDate = row.getValue("createdDate") as string;
        if (!createdDate) return <div className=" text-[#464646]">N/A</div>;
        
        const date = new Date(createdDate);
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        
        return (
          <div className=" text-[#464646]">
            {formattedDate}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="py-[10px] font-medium">Actions</div>,
      meta: { width: "20%" },
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
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: users,
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
              <TableRow key={headerGroup.id} className="border-0 hover:!bg-[#F0FCFF]">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} scope="col" className="px-[20px] py-[10px]">
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
              {/* Conditional rendering for the loading state */}
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
            ) : // Check if there are any rows to display
            table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="even:bg-[#FCFCFC] w-full border-0 hover:bg-gray-50"
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
                // Display "No results" if there is no data
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

              if (start > 2) pages.push(<span key="..." className=" text-gray-500">...</span>);
              
              for (let i = start; i <= end; i++) {
                pages.push(renderPage(i));
              }
              
              if (end < totalPages - 1) pages.push(<span key=".." className=" text-gray-500">...</span>);
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
