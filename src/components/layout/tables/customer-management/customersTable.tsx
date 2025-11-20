"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { FilePenLine, MoreHorizontal, Calendar } from "lucide-react";
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
import Image from "next/image";

// Type definition for the customer details
export type CustomerDetails = {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  bvnRealName?: string | null;
  tier?: string;
  accountNumber?: string | null;
  email?: string;
  dob?: string;
  bvn?: string | null;
  bvnIsVerified?: boolean;
  hasProfilePicture?: boolean;
  hasAccountNumber?: boolean;
  phoneVerified?: boolean;
  transactionPinSet?: boolean;
  balance?: number;
  profileType?: string;
  productType?: string | null;
  phoneNumber?: string;
  address?: string | null;
  coreBankId?: string | null;
  requiresOtp?: boolean;
  totalLimit?: number;
  accruedLimit?: number;
  addressDocumentSubmitted?: boolean;
  addressDocumentVerified?: boolean;
  totalReferrals?: number;
  nin?: string | null;
  bvnProfileUrl?: string | null;
  bvnUrlUpdated?: boolean;
  referredBy?: string | null;
  gender?: string;
  referralCode?: string | null;
  createdDate?: string;
  status?: string;
  // Legacy fields for compatibility
  userName?: string;
  userEmail?: string;
  customerId?: string;
  accountNo?: string;
  channel?: string;
  dateCreated?: string;
};

// Interface for the component props, following transactions table pattern
interface DataTableProps {
  data: unknown; // CustomersApiResponse | undefined
  isLoading: boolean;
  onPageChange: (page: number) => void;
  currentPage: number;
  onEditTableProp: (permission: CustomerDetails) => void;
}

export function CustomerManagementDataTable(props: DataTableProps) {
  const { data, isLoading, onPageChange, currentPage, onEditTableProp } = props;

  const customers = (data as { data?: CustomerDetails[] })?.data || [];
  const totalPages = 1; // Since API doesn't return pagination info yet
  const columns: ColumnDef<CustomerDetails>[] = [
    {
      accessorKey: "id",
      header: () => <div className="p-[10px]">Customer ID</div>,
      cell: ({ row }) => {
        const customerId = row.getValue("id") as string;
        const email = row.getValue("email") as string;
        return (
          <div className="p-[10px] text-xs font-mono">
            {customerId && email ? (
              <Link 
                href={`/customer-management/${encodeURIComponent(email)}`}
                className="cursor-pointer"
              >
                {customerId}
              </Link>
            ) : (
              customerId || 'N/A'
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "firstName",
      header: () => <div className="p-[10px]">First Name</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("firstName") || 'N/A'}</div>
      ),
    },
    {
      accessorKey: "lastName",
      header: () => <div className="p-[10px]">Last Name</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("lastName") || 'N/A'}</div>
      ),
    },
    {
      accessorKey: "avatar",
      header: () => <div className="p-[10px]">Profile Picture</div>,
      cell: ({ row }) => {
        const avatar = row.getValue("avatar") as string;
        return (
          <div className="p-[10px]">
            {avatar ? (
              <Image src={avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                N/A
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "bvnRealName",
      header: () => <div className="p-[10px]">BVN Real Name</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("bvnRealName") || 'N/A'}</div>
      ),
    },
    {
      accessorKey: "tier",
      header: () => <div className="p-[10px]">Tier</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("tier") || 'N/A'}</div>
      ),
    },
    {
      accessorKey: "accountNumber",
      header: () => <div className="p-[10px]">Account Number</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("accountNumber") || 'N/A'}</div>
      ),
    },
    {
      accessorKey: "email",
      header: () => <div className="p-[10px]">Email Address</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("email") || 'N/A'}</div>
      ),
    },
    {
      accessorKey: "dob",
      header: () => <div className="p-[10px]">Date of Birth</div>,
      cell: ({ row }) => {
        const dob = row.getValue("dob") as string;
        return (
          <div className="p-[10px] text-xs">
            {dob ? new Date(dob).toLocaleDateString() : 'N/A'}
          </div>
        );
      },
    },
    {
      accessorKey: "bvn",
      header: () => <div className="p-[10px]">BVN</div>,
      cell: ({ row }) => (
        <div className="p-[10px] text-xs">{row.getValue("bvn") || 'N/A'}</div>
      ),
    },
    {
      accessorKey: "bvnIsVerified",
      header: () => <div className="p-[10px]">BVN Verified</div>,
      cell: ({ row }) => {
        const verified = row.getValue("bvnIsVerified") as boolean;
        return (
          <div className={`p-[10px] ${verified ? 'text-green-600' : 'text-red-600'}`}>
            {verified ? 'Yes' : 'No'}
          </div>
        );
      },
    },
    {
      accessorKey: "hasProfilePicture",
      header: () => <div className="p-[10px]">Has Profile Picture</div>,
      cell: ({ row }) => {
        const hasPicture = row.getValue("hasProfilePicture") as boolean;
        return (
          <div className={`p-[10px] ${hasPicture ? 'text-green-600' : 'text-red-600'}`}>
            {hasPicture ? 'Yes' : 'No'}
          </div>
        );
      },
    },
    {
      accessorKey: "hasAccountNumber",
      header: () => <div className="p-[10px]">Has Account</div>,
      cell: ({ row }) => {
        const hasAccount = row.getValue("hasAccountNumber") as boolean;
        return (
          <div className={`p-[10px] ${hasAccount ? 'text-green-600' : 'text-red-600'}`}>
            {hasAccount ? 'Yes' : 'No'}
          </div>
        );
      },
    },
    {
      accessorKey: "phoneVerified",
      header: () => <div className="p-[10px]">Phone Verified</div>,
      cell: ({ row }) => {
        const verified = row.getValue("phoneVerified") as boolean;
        return (
          <div className={`p-[10px] ${verified ? 'text-green-600' : 'text-red-600'}`}>
            {verified ? 'Yes' : 'No'}
          </div>
        );
      },
    },
    {
      accessorKey: "transactionPinSet",
      header: () => <div className="p-[10px]">PIN Set</div>,
      cell: ({ row }) => {
        const pinSet = row.getValue("transactionPinSet") as boolean;
        return (
          <div className={`p-[10px] ${pinSet ? 'text-green-600' : 'text-red-600'}`}>
            {pinSet ? 'Yes' : 'No'}
          </div>
        );
      },
    },
    {
      accessorKey: "balance",
      header: () => <div className="p-[10px]">Account Balance</div>,
      cell: ({ row }) => {
        const balance = row.getValue("balance") as number;
        return (
          <div className="p-[10px]">
            ₦{balance?.toLocaleString() || '0'}
          </div>
        );
      },
    },
    {
      accessorKey: "profileType",
      header: () => <div className="p-[10px]">Profile Type</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("profileType") || 'N/A'}</div>
      ),
    },
    {
      accessorKey: "productType",
      header: () => <div className="p-[10px]">Product Type</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("productType") || 'N/A'}</div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: () => <div className="p-[10px]">Phone Number</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("phoneNumber") || 'N/A'}</div>
      ),
    },
    {
      accessorKey: "address",
      header: () => <div className="p-[10px]">Address</div>,
      cell: ({ row }) => (
        <div className="p-[10px] max-w-[200px] truncate" title={row.getValue("address") as string}>
          {row.getValue("address") || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: "coreBankId",
      header: () => <div className="p-[10px]">Core Bank ID</div>,
      cell: ({ row }) => (
        <div className="p-[10px] text-xs">{row.getValue("coreBankId") || 'N/A'}</div>
      ),
    },
    {
      accessorKey: "requiresOtp",
      header: () => <div className="p-[10px]">Requires OTP</div>,
      cell: ({ row }) => {
        const requiresOtp = row.getValue("requiresOtp") as boolean;
        return (
          <div className={`p-[10px] ${requiresOtp ? 'text-green-600' : 'text-red-600'}`}>
            {requiresOtp ? 'Yes' : 'No'}
          </div>
        );
      },
    },
    {
      accessorKey: "totalLimit",
      header: () => <div className="p-[10px]">Total Limit</div>,
      cell: ({ row }) => {
        const limit = row.getValue("totalLimit") as number;
        return (
          <div className="p-[10px]">
            ₦{limit?.toLocaleString() || '0'}
          </div>
        );
      },
    },
    {
      accessorKey: "accruedLimit",
      header: () => <div className="p-[10px]">Accrued Limit</div>,
      cell: ({ row }) => {
        const limit = row.getValue("accruedLimit") as number;
        return (
          <div className="p-[10px]">
            ₦{limit?.toLocaleString() || '0'}
          </div>
        );
      },
    },
    {
      accessorKey: "addressDocumentSubmitted",
      header: () => <div className="p-[10px]">Address Doc Submitted</div>,
      cell: ({ row }) => {
        const submitted = row.getValue("addressDocumentSubmitted") as boolean;
        return (
          <div className={`p-[10px] ${submitted ? 'text-green-600' : 'text-red-600'}`}>
            {submitted ? 'Yes' : 'No'}
          </div>
        );
      },
    },
    {
      accessorKey: "addressDocumentVerified",
      header: () => <div className="p-[10px]">Address Doc Verified</div>,
      cell: ({ row }) => {
        const verified = row.getValue("addressDocumentVerified") as boolean;
        return (
          <div className={`p-[10px] ${verified ? 'text-green-600' : 'text-red-600'}`}>
            {verified ? 'Yes' : 'No'}
          </div>
        );
      },
    },
    {
      accessorKey: "totalReferrals",
      header: () => <div className="p-[10px]">Total Referrals</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("totalReferrals") || '0'}</div>
      ),
    },
    {
      accessorKey: "nin",
      header: () => <div className="p-[10px]">NIN</div>,
      cell: ({ row }) => (
        <div className="p-[10px] text-xs">{row.getValue("nin") || 'N/A'}</div>
      ),
    },
    {
      accessorKey: "bvnProfileUrl",
      header: () => <div className="p-[10px]">BVN Profile URL</div>,
      cell: ({ row }) => {
        const url = row.getValue("bvnProfileUrl") as string;
        return (
          <div className="p-[10px]">
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                View
              </a>
            ) : (
              'N/A'
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "bvnUrlUpdated",
      header: () => <div className="p-[10px]">BVN URL Updated</div>,
      cell: ({ row }) => {
        const updated = row.getValue("bvnUrlUpdated") as boolean;
        return (
          <div className={`p-[10px] ${updated ? 'text-green-600' : 'text-red-600'}`}>
            {updated ? 'Yes' : 'No'}
          </div>
        );
      },
    },
    {
      accessorKey: "referredBy",
      header: () => <div className="p-[10px]">Referred By</div>,
      cell: ({ row }) => (
        <div className="p-[10px] text-xs">{row.getValue("referredBy") || 'N/A'}</div>
      ),
    },
    {
      accessorKey: "gender",
      header: () => <div className="p-[10px]">Gender</div>,
      cell: ({ row }) => (
        <div className="p-[10px]">{row.getValue("gender") || 'N/A'}</div>
      ),
    },
    {
      accessorKey: "referralCode",
      header: () => <div className="p-[10px]">Referral Code</div>,
      cell: ({ row }) => (
        <div className="p-[10px] text-xs font-mono">{row.getValue("referralCode") || 'N/A'}</div>
      ),
    },
    {
      accessorKey: "createdDate",
      header: () => <div className="p-[10px]">Created Date</div>,
      cell: ({ row }) => {
        const date = row.getValue("createdDate") as string;
        return (
          <div className="p-[10px] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-xs">
              {date ? new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) : 'N/A'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="p-[10px]">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div
            className={`p-[10px] ${
              status?.toLowerCase() === "inactive"
                ? "text-[#FC5A5A]"
                : "text-[#0284B2]"
            }`}
          >
            {row.getValue("status")}
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
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      <div className="rounded-0 border-0 max-h-[400px] overflow-y-auto">
        <Table className="w-full text-left text-gray-500 rounded-t-lg">
          {/* Table Header (Sticky) */}
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
            ) : customers.length ? (
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
                  className="h-24 text-center font-[family-name:var(--font-poppins)] px-[20px] py-[20px]"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Simple Pagination Controls - Following transactions table pattern */}
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
