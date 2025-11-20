"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CircleCheckBig, Play, XIcon } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { AvatarIcon } from "@/components/icons";
import { Switch } from "@/components/ui/switch";
import {
  CustomerDetails,
  CustomerKYCTable,
} from "@/components/layout/tables/customersKYCTable";
import { TranascationsTable } from "@/components/layout/tables/customer-management/tranascationsTable";
import { useGetSingleCustomerQuery, useToggleCustomerStatusMutation } from "@/query-options/customersQueryOption";
import { useGetTransactionsQuery } from "@/query-options/transactionsQueryOption";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function UserDetailsPage() {
  const [userStatus] = useState(false);
  const [openGroupSuccessModal, setOpenGroupSuccessful] = useState(false);
  const [openEditPermissionModal, setEditPermissionModal] = useState(false);
  const [openDeletePermissionModal, setDeletePermissionModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const params = useParams();
  const { id } = params;
  
  // Decode the email from the URL parameter
  const email = decodeURIComponent(id as string);
  
  // Fetch customer data using email
  const { data: customer, isLoading } = useGetSingleCustomerQuery(email);
  
  // Fetch transactions for the customer using their account number
  const { data: transactionsData, isLoading: isLoadingTransactions } = useGetTransactionsQuery({
    accountNumber: customer?.accountNumber || undefined,
    pageNumber: 1,
    pageSize: 10
  });
  
  // Toggle customer status mutation
  const { mutate: toggleStatus, isPending: isTogglingStatus } = useToggleCustomerStatusMutation();

  const updatePermsissionGroup = () => {
    setEditPermissionModal(false);
    setSuccessMessage("Permission Updated Successfully");
    setOpenGroupSuccessful(true);
  };

  const handleToggleStatus = () => {
    setDeletePermissionModal(true);
  };

  const confirmToggleStatus = () => {
    setDeletePermissionModal(false);
    
    if (!customer?.id) {
      setSuccessMessage("Customer ID not found");
      setOpenGroupSuccessful(true);
      return;
    }
    
    toggleStatus(customer.id, {
      onSuccess: (data) => {
        if (data.isSuccessful) {
          setSuccessMessage(data.message || "Status updated successfully");
          setOpenGroupSuccessful(true);
        } else {
          setSuccessMessage("Failed to update status");
          setOpenGroupSuccessful(true);
        }
      },
      onError: (error) => {
        console.error("Error toggling status:", error);
        setSuccessMessage("Error updating status");
        setOpenGroupSuccessful(true);
      }
    });
  };

  const changeUserStatus = () => {
    handleToggleStatus();
  };

  const customerKYCData: CustomerDetails[] = [
    {
      id: "m5gr84i9",
      documentType: "NIN",
      status: "Pending",
      dateCreated: "02/04/2024",
    },
    {
      id: "3u1reuv4",
      documentType: "Driver's License",
      status: "Pending",
      dateCreated: "02/04/2024",
    },
    {
      id: "derv1ws0",
      documentType: "International Passport",

      status: "Approved",
      dateCreated: "02/04/2024",
    },
    {
      id: "5kma53ae",
      documentType: "Voter's Card",

      status: "Pending",
      dateCreated: "02/04/2024",
    },
    {
      id: "bhqecj4p",
      documentType: "NIN",

      status: "Failed",
      dateCreated: "02/04/2024",
    },
  ];

  // Get transactions data for the table - use raw API data
  const transactionsTableData = transactionsData?.data?.data || [];

  const handleEdit = (user: { id: string }) => {
    console.log("Editing row with id:", user.id);
    setEditPermissionModal(true);
  };

  return (
    <div className="px-[1rem] md:px-[2rem]">
      <div>
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList className="font-[family-name:var(--font-poppins)] font-[500]">
              <BreadcrumbItem className="text-[#A9A9A9]">
                <BreadcrumbLink href="/sa-admin">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Play className="text-[#CCCCCC]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem className="text-[#A9A9A9]">
                <BreadcrumbLink href="/customer-management">
                  Customer Management
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Play className="text-[#CCCCCC]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem className="text-[#464646]">
                <BreadcrumbPage>Customer Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="mt-[8px]">
          <h6 className="font-[family-name:var(--font-dm)] font-[600] text-[16px]">
            Customer Details
          </h6>
        </div>
      </div>

      {/* Content */}
      <div className="mt-[30px]">
        <div className="py-[16px]">
          <div className="border-1 border-[#CCCCCC] p-[24px] rounded-[8px] w-full sm:w-[100%]">
            <div className="flex gap-[16px] items-center">
              {customer?.avatar ? (
                <Image 
                  src={customer.avatar} 
                  alt="Customer Avatar" 
                  className="w-[82px] h-[82px] rounded-full object-cover"
                />
              ) : (
                <AvatarIcon size={82} />
              )}
              <div className="">
                {isLoading ? (
                  <>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </>
                ) : (
                  <>
                    <h3 className="text-[#464646] font-[family-name:var(--font-dm)] font-[600]">
                      {customer ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'N/A' : 'N/A'}
                    </h3>
                    <h5 className="font-[family-name:var(--font-dm)] text-[#464646] text-[14px] font-[600]">
                      {customer?.email || 'N/A'}
                    </h5>
                    <p className="text-[#A9A9A9] text-[10px] italic font-[family-name:var(--font-dm)]">
                      Customer ID: {customer?.id || 'N/A'}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-[30px]">
            <h4 className="text-[#464646] font-[family-name:var(--font-dm)] font-[600] text-[18px]">
              Personal Information
            </h4>
            <div className="mt-[24px] border-1 border-[#CCCCCC] p-[24px] rounded-[8px]">
              {isLoading ? (
                <div className="grid grid-cols-4 gap-[40px]">
                  {Array.from({ length: 16 }).map((_, index) => (
                    <div key={index}>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-[40px]">
                  <div>
                    <div>
                      <h4 className="text-[#464646] font-[600]">First Name</h4>
                      <p className="text-[#A9A9A9] font-[600]">{customer?.firstName || 'N/A'}</p>
                    </div>
                    <div className="mt-[30px]">
                      <h4 className="text-[#464646] font-[600]">Email Address</h4>
                      <p className="text-[#A9A9A9] font-[600]">{customer?.email || 'N/A'}</p>
                    </div>
                    <div className="mt-[30px]">
                      <h4 className="text-[#464646] font-[600]">Profile Type</h4>
                      <p className="text-[#A9A9A9] font-[600]">{customer?.profileType || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h4 className="text-[#464646] font-[600]">Last Name</h4>
                      <p className="text-[#A9A9A9] font-[600]">{customer?.lastName || 'N/A'}</p>
                    </div>
                    <div className="mt-[30px]">
                      <h4 className="text-[#464646] font-[600]">Customer ID</h4>
                      <p className="text-[#A9A9A9] font-[600]">{customer?.id || 'N/A'}</p>
                    </div>
                    <div className="mt-[30px]">
                      <h4 className="text-[#464646] font-[600]">Date Created</h4>
                      <div className="text-[#A9A9A9] font-[600]">
                        <p>{customer?.createdDate ? new Date(customer.createdDate).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h4 className="text-[#464646] font-[600]">Phone Number</h4>
                      <p className="text-[#A9A9A9] font-[600]">{customer?.phoneNumber || 'N/A'}</p>
                    </div>
                    <div className="mt-[30px]">
                      <h4 className="text-[#464646] font-[600]">Account Number</h4>
                      <p className="text-[#A9A9A9] font-[600]">{customer?.accountNumber || 'N/A'}</p>
                    </div>
                    <div className="mt-[30px]">
                      <h4 className="text-[#464646] font-[600]">Status</h4>
                      <p
                        className={`flex items-center gap-2 font-[600] ${
                          customer?.status?.toLowerCase() === 'active' ? "text-[#0284B2]" : "text-[#FC5A5A]"
                        }`}
                      >
                        {customer?.status || 'N/A'}
                        <Switch
                          className="data-[state=checked]:bg-[#0284B2]"
                          checked={customer?.status?.toLowerCase() === 'active'}
                          onCheckedChange={changeUserStatus}
                        />
                      </p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h4 className="text-[#464646] font-[600]">Tier</h4>
                      <p className="text-[#A9A9A9] font-[600]">{customer?.tier || 'N/A'}</p>
                    </div>
                    <div className="mt-[30px]">
                      <h4 className="text-[#464646] font-[600]">Balance</h4>
                      <p className="text-[#A9A9A9] font-[600]">₦{customer?.balance?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="mt-[30px]">
                      <h4 className="text-[#464646] font-[600]">BVN Verified</h4>
                      <p className={`font-[600] ${customer?.bvnIsVerified ? "text-[#0284B2]" : "text-[#FC5A5A]"}`}>
                        {customer?.bvnIsVerified ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[18px] leading-[100%] tracking-[0%] align-middle font-dm-sans mt-4">
              KYC Documents
            </h4>
            <CustomerKYCTable
              data={customerKYCData}
              onDeleteTableProp={handleToggleStatus}
              onEditTableProp={handleEdit}
            />
          </div>

          <TranascationsTable
            data={transactionsTableData}
            onDeleteTableProp={handleToggleStatus}
            isLoading={isLoadingTransactions}
            // onEditTableProp={handleEdit}
          />
        </div>
      </div>

      {/* Edit Permissions */}
      <Dialog
        open={openEditPermissionModal}
        onOpenChange={setEditPermissionModal}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#464646] font-[family-name:var(--font-dm)] font-[600]">
              Edit Permission Group
            </DialogTitle>
            <DialogClose className="bg-white text-muted-foreground absolute top-4 right-4 rounded-xs [&_svg:not([class*='size-'])]:size-4">
              <XIcon />
            </DialogClose>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-2">
              <Label htmlFor="group" className="text-left block text-[#464646]">
                Permission Name
              </Label>
              {/* <Input
                id="group"
                placeholder="Enter permission group name"
                value={permissionDetails?.group}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setPermissionDetails({
                    ...permissionDetails,
                    group: e.target?.value,
                  });
                }}
                className="col-span-3 h-[56px] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
              /> */}
            </div>

            <div className="grid grid-cols-1 items-center gap-2 mt-[10px]">
              <Label
                htmlFor="description"
                className="text-left block text-[#464646] font-[family-name:var(--font-poppins)]"
              >
                Permission Description
              </Label>
              <Textarea
                id="description"
                defaultValue=""
                placeholder="Enter description"
                className="focus-visible:ring-0 placeholder:text-[#909090] text-[#909090] text-[14px] font-[family-name:var(--font-poppins)]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="rounded-[8px] bg-[#0284B2] py-[16px] px-[12px] cursor-pointer hover:bg-[#0284B2] font-[family-name:var(--font-poppins)]"
              onClick={updatePermsissionGroup}
            >
              Update permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions created or updated successfully */}
      <Dialog
        open={openGroupSuccessModal}
        onOpenChange={setOpenGroupSuccessful}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#464646] font-[family-name:var(--font-dm)] font-[600]"></DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 justify-center text-center items-center gap-2 font-[family-name:var(--font-poppins)]">
              <CircleCheckBig
                strokeWidth={0.5}
                size={70}
                className="mx-auto text-[#0284B2]"
              />
              <h5 className="text-[22px] font-[500] text-[#464646] mt-[24px]">
                {successMessage}
              </h5>
            </div>
          </div>
          <DialogFooter className="flex sm:justify-center justify-center items-center w-full">
            <Button
              type="button"
              className="rounded-[8px] bg-[#0284B2] py-[20px] px-[32px] cursor-pointer hover:bg-[#0284B2] font-[family-name:var(--font-poppins)]"
              onClick={() => setOpenGroupSuccessful(false)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Permission */}
      <Dialog
        open={openDeletePermissionModal}
        onOpenChange={setDeletePermissionModal}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#464646] font-[family-name:var(--font-dm)] font-[600]"></DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 justify-center text-center items-center gap-2 font-[family-name:var(--font-poppins)]">
              <h3 className="text-[26px] font-[600] text-[#464646] text-[#464646] font-[family-name:var(--font-dm)]">
                {userStatus ? "Deactivate User" : "Reactivate User"}
              </h3>
              <h5 className="text-[18px] font-[500] text-[#464646] mt-[24px] text-[#464646]">
                {userStatus
                  ? `Are you sure you want to deactivate this user? This action cannot be undone.`
                  : `Are you sure you want to reactivate this user? This action cannot be undone.`}
              </h5>
              <p className="text-[12px] font-[500] text-[#FC5A5A] mt-[14px]">
                {userStatus
                  ? `Disclaimer: Please note that once you deactivate user, the user will no longer 
                    have access to the back office`
                  : `Disclaimer: Please note that once you reactivate user, the user immediately 
                    gain access to the back office`}
              </p>
            </div>
          </div>
          <DialogFooter className="flex sm:justify-center">
            <Button
              type="button"
              className="rounded-[4px] text-white bg-[#FC5A5A] py-[20px] px-[34px] cursor-pointer hover:bg-[#FC5A5A] font-[family-name:var(--font-poppins)]"
              onClick={() => setDeletePermissionModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-[4px] bg-[#0284B2] py-[20px] px-[34px] cursor-pointer hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-white"
              onClick={confirmToggleStatus}
              disabled={isTogglingStatus}
            >
              {isTogglingStatus ? "Updating..." : (customer?.status?.toLowerCase() === 'active' ? "Deactivate" : "Reactivate")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
