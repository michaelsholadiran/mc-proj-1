"use client";

/* eslint-disable  @typescript-eslint/no-unused-vars */
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  CircleCheckBig,
  Download,
  Play,
  Search,
  XIcon,
} from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CustomerDetails } from "@/components/layout/tables/KYCSupervisorRequestTable";
import Image from "next/image";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";

import { KYCApprovalSupervisorRequestTable } from "@/components/layout/tables/KYCApprovalSupervisorRequestTable";

// Fake data for KYC pending requests
const kycPendingRequestsData: CustomerDetails[] = [
  {
    id: "#18",
    userName: "Adebisi Adeola",
    userEmail: "adebisi.adeola@email.com",
    customerId: "KYC4612580",
    accountNo: "15/03/2024",
    phoneNumber: "+2348160688825",
    channel: "Mobile App",
    status: "Pending Review",
    dateCreated: "Adebisi Adeola",
    amount: "04:22:56",
  },
  {
    id: "#19",
    userName: "Fatima Hassan",
    userEmail: "fatima.hassan@email.com",
    customerId: "KYC4612581",
    accountNo: "14/03/2024",
    phoneNumber: "+2348160688826",
    channel: "Web Portal",
    status: "Pending Review",
    dateCreated: "Fatima Hassan",
    amount: "01:22:56",
  },
  {
    id: "#20",
    userName: "Michael Johnson",
    userEmail: "michael.johnson@email.com",
    customerId: "KYC4612582",
    accountNo: "13/03/2024",
    phoneNumber: "+2348160688827",
    channel: "Mobile App",
    status: "Pending Review",
    dateCreated: "Michael Johnson",
    amount: "00:22:56",
  },
  {
    id: "#21",
    userName: "Sarah Williams",
    userEmail: "sarah.williams@email.com",
    customerId: "KYC4612583",
    accountNo: "12/03/2024",
    phoneNumber: "+2348160688828",
    channel: "Web Portal",
    status: "Pending Review",
    dateCreated: "Sarah Williams",
    amount: "02:45:30",
  },
  {
    id: "#22",
    userName: "David Chen",
    userEmail: "david.chen@email.com",
    customerId: "KYC4612584",
    accountNo: "11/03/2024",
    phoneNumber: "+2348160688829",
    channel: "Mobile App",
    status: "Pending Review",
    dateCreated: "David Chen",
    amount: "01:15:45",
  },
];

export default function SuperAdminRoleManagement() {
  // const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openGroupSuccessModal, setOpenGroupSuccessful] = useState(false);
  const [openEditPermissionModal, setEditPermissionModal] = useState(false);
  const [openDeletePermissionModal, setDeletePermissionModal] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({} as CustomerDetails);
  const [permissionId, setPermissionId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  // const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([""]);

  // const permissionLists = [
  //   { value: "create_role", label: "Create Role" },
  //   { value: "edit_role", label: "Edit Role" },
  //   { value: "delete_role", label: "Delete Role" },
  // ];

  // const createUser = () => {
  //   setOpenCreateModal(false);
  //   setSuccessMessage("User Created Successfully");
  //   setOpenGroupSuccessful(true);
  // };

  const updatePermsissionGroup = () => {
    setEditPermissionModal(false);
    setSuccessMessage("User Updated Successfully");
    setOpenGroupSuccessful(true);
  };

  const handleDelete = (id: string) => {
    setPermissionId(id);
    // perform delete logic here (API call, state update, etc.)
    setDeletePermissionModal(true);
  };

  const handleEdit = (user: CustomerDetails) => {
    console.log("Editing row with id:", user.id);
    setCustomerDetails(user);
    setEditPermissionModal(true);
  };

  const deletePermsissionGroup = () => {
    setDeletePermissionModal(false);
    setSuccessMessage("User Deleted Successfully");
    setOpenGroupSuccessful(true);
  };

  return (
    <div className="px-[1rem] md:px-[2rem]">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList className="font-[family-name:var(--font-poppins)] font-[500]">
            <BreadcrumbItem className="text-[#A9A9A9]">
              <BreadcrumbLink href="/kyci-dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Play className="text-[#CCCCCC]" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="!text-[#A9A9A9]">
                KYC Management
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Play className="text-[#CCCCCC]" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Pending KYC Requests</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Content */}
      <div className="mt-[20px]">
        {/* Action */}
        <div className="flex gap-3 justify-between items-center my-[26px]">
          <h3>Pending KYC Requests</h3>

          {/* Channel filter */}
          <div className="col-span-1 grid items-center gap-2">
            <div className="col-span-1 grid items-center gap-2">
              <Select>
                <SelectTrigger
                  className="w-[236px] font-poppins text-gray-700 !h-[56px]
                focus-visible:ring-offset-0
                focus-visible:ring-0
                focus-visible:outline-none
                focus-visible:ring-transparent
                border-[#CCCCCC80]
                focus-visible:border-[#CCCCCC80]/* THIS IS THE KEY ADDITION */
               "
                >
                  <SelectValue placeholder="Select Date Range" />
                </SelectTrigger>
                <SelectContent className="font-poppins text-[14px]">
                  <SelectGroup>
                    {[
                      { value: "today", label: "Today" },
                      { value: "yesterday", label: "Yesterday" },
                      { value: "last-7-days", label: "Last 7 Days" },
                      { value: "last-30-days", label: "Last 30 Days" },
                      { value: "this-month", label: "This Month" },
                      { value: "last-month", label: "Last Month" },
                      { value: "this-year", label: "This Year" },
                      { value: "last-year", label: "Last Year" },
                      { value: "all-time", label: "All Time" },
                    ].map((range) => (
                      <SelectItem
                        key={range.value}
                        value={range.value}
                        className="h-[36px]"
                      >
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-3 items-center py-4 mb-[20px] mt-[40px]">
          <div className="w-full lg:col-span-2 mb-4 lg:mb-0">
            <div className="relative">
              <Search
                className="text-[#A9A9A9] absolute top-4 left-2"
                size={20}
              />
              <Input
                id="keyword"
                placeholder="Enter a keyword"
                className="w-full h-[50px] focus-visible:ring-0 rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)] pl-[35px] text-[#A9A9A9] font-[500]"
              />
            </div>
          </div>

          <div className="w-full lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className=" lg:flex items-center justify-end pr-2 text-gray-400">
              Filter By :
            </div>
            <div className="w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-[50px] w-full sm:justify-between focus-visible:ring-1 font-[family-name:var(--font-poppins)] text-[#3D4F5C]"
                  >
                    Active <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[200px] text-[12px] font-[family-name:var(--font-poppins)] text-[#3D4F5C]"
                >
                  <DropdownMenuCheckboxItem>Active</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Inactive</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-[50px] w-full sm:justify-between focus-visible:ring-1 font-[family-name:var(--font-poppins)] text-[#3D4F5C]"
                  >
                    Active <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[200px] text-[12px] font-[family-name:var(--font-poppins)] text-[#3D4F5C]"
                >
                  <DropdownMenuCheckboxItem>Active</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Inactive</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-[50px] w-full sm:justify-between focus-visible:ring-1 font-[family-name:var(--font-poppins)] text-[#3D4F5C]"
                  >
                    Active <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[200px] text-[12px] font-[family-name:var(--font-poppins)] text-[#3D4F5C]"
                >
                  <DropdownMenuCheckboxItem>Active</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Inactive</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="w-full lg:col-span-3 flex flex-col sm:flex-row items-center gap-4 justify-end">
            <div className="text-right mb-2 sm:mb-0 text-gray-400">
              Sort By:
            </div>
            <div className="w-full sm:w-auto">
              <Select>
                <SelectTrigger
                  className="w-full sm:w-[236px] font-poppins text-gray-700 !h-[56px]
                focus-visible:ring-offset-0
                focus-visible:ring-0
                focus-visible:outline-none
                focus-visible:ring-transparent
                border-[#CCCCCC80]
                focus-visible:border-[#CCCCCC80]"
                >
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="font-poppins text-[14px]">
                  <SelectGroup>
                    {[
                      { value: "newest", label: "Newest" },
                      { value: "oldest", label: "Oldest" },
                      { value: "a-z", label: "A-Z" },
                      { value: "z-a", label: "Z-A" },
                    ].map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="h-[36px]"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <KYCApprovalSupervisorRequestTable data={kycPendingRequestsData} />
      </div>

      {/* Edit User */}
      <Dialog
        open={openEditPermissionModal}
        onOpenChange={setEditPermissionModal}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#464646] font-[family-name:var(--font-dm)] font-[600]">
              Edit User
            </DialogTitle>
            <DialogClose className="bg-white text-muted-foreground absolute top-4 right-4 rounded-xs [&_svg:not([class*='size-'])]:size-4">
              <XIcon />
            </DialogClose>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-2">
              <Label htmlFor="group" className="text-left block">
                Name
              </Label>
              <Input
                id="group"
                placeholder="Enter permission group name"
                className="col-span-3 h-[56px] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                value={customerDetails?.userName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setCustomerDetails({
                    ...customerDetails,
                    userName: e.target?.value,
                  });
                }}
              />
            </div>

            <div className="grid grid-cols-1 items-center gap-2">
              <Label htmlFor="emailAdress" className="text-left block">
                Email Address
              </Label>
              <Input
                id="emailAdress"
                placeholder="Enter a valid email address"
                className="col-span-3 h-[56px] text-[#A9A9A9] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                value={customerDetails?.userEmail}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setCustomerDetails({
                    ...customerDetails,
                    userEmail: e.target?.value,
                  });
                }}
              />
            </div>

            <div className="grid grid-cols-1 items-center gap-2 mt-[10px]">
              <Label htmlFor="department" className="text-left block">
                Department
              </Label>
              <Select>
                <SelectTrigger className="w-full !h-[50px] font-[family-name:var(--font-poppins)] text-[#A9A9A9]">
                  <SelectValue
                    placeholder="Select department"
                    className="text-[#A9A9A9]"
                  />
                </SelectTrigger>
                <SelectContent className="font-[family-name:var(--font-poppins)]">
                  <SelectItem value="it_support">IT Support</SelectItem>
                  <SelectItem value="customer_support">
                    Customer Support
                  </SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 items-center gap-2 mt-[10px]">
              <Label htmlFor="role" className="text-left block">
                Role
              </Label>
              <Select>
                <SelectTrigger className="w-full !h-[50px] font-[family-name:var(--font-poppins)] text-[#A9A9A9]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="font-[family-name:var(--font-poppins)]">
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="rounded-[8px] bg-[#0284B2] py-[16px] px-[12px] cursor-pointer hover:bg-[#0284B2] font-[family-name:var(--font-poppins)]"
              onClick={updatePermsissionGroup}
            >
              Update user
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User created successfully */}
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

      {/* Delete User */}
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
                Delete Role
              </h3>
              <h5 className="text-[18px] font-[500] text-[#464646] mt-[24px] text-[#464646]">
                Are you sure you want to delete this role? This action cannot be
                undone.
              </h5>
              <p className="text-[12px] font-[500] text-[#FC5A5A] mt-[14px]">
                Disclaimer: Please note that once you delete a role, the role
                will no longer be available
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
              onClick={deletePermsissionGroup}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
