"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CircleCheckBig, XIcon } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

import { CustomerDetails } from "@/components/layout/tables/KYCSupervisorRequestTable";
import Image from "next/image";
import { SelectGroup } from "@radix-ui/react-select";
import { KYCSupervisorRequestTable } from "@/components/layout/tables/KYCSupervisorRequestTable";
import { ApprovalRejectionChart } from "@/components/layout/charts/ApprovalRejectionChart";
import { TurnaroundTimeChart } from "@/components/layout/charts/TurnaroundTimeChart";
import { SLAHeatMapChart } from "@/components/layout/charts/SLAHeatMapChart";
import TeamMemberItem from "@/components/layout/features/TeamMemberItem";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  roleColor: string;
  percentage: string;
  avatarSrc: string;
}

interface KYCFinalApproverDashboardProps {
  kycRequestData?: CustomerDetails[];
  teamMembersData?: TeamMember[];
  title?: string;
  subtitle?: string;
  showBreadcrumb?: boolean;
  breadcrumbText?: string;
  showModals?: boolean;
  onEditUser?: (user: CustomerDetails) => void;
  onDeleteUser?: (user: CustomerDetails) => void;
}

const defaultKycRequestData: CustomerDetails[] = [
  {
    id: "18",
    userName: "Adebisi Adeola",
    userEmail: "adebisi.adeola@email.com",
    customerId: "KYC Supervisor",
    accountNo: "3110758413",
    phoneNumber: "+2348160688825",
    channel: "96%",
    status: "Pending Review",
    dateCreated: "Adebisi Adeola",
    amount: "00:13:45",
  },
  {
    id: "19",
    userName: "Fatima Hassan",
    userEmail: "fatima.hassan@email.com",
    customerId: "Field Officer",
    accountNo: "3110758414",
    phoneNumber: "+2348160688826",
    channel: "52%",
    status: "Approved",
    dateCreated: "Fatima Hassan",
    amount: "00:08:32",
  },
  {
    id: "20",
    userName: "Michael Johnson",
    userEmail: "michael.johnson@email.com",
    customerId: "Field Officer",
    accountNo: "3110758415",
    phoneNumber: "+2348160688827",
    channel: "15%",
    status: "Rejected",
    dateCreated: "Michael Johnson",
    amount: "00:25:18",
  },
  {
    id: "21",
    userName: "Sarah Williams",
    userEmail: "sarah.williams@email.com",
    customerId: "KYC Initiator",
    accountNo: "3110758416",
    phoneNumber: "+2348160688828",
    channel: "98%",
    status: "Pending Review",
    dateCreated: "Sarah Williams",
    amount: "00:06:45",
  },
  {
    id: "22",
    userName: "David Chen",
    userEmail: "david.chen@email.com",
    customerId: "KYC Supervisor",
    accountNo: "3110758417",
    phoneNumber: "+2348160688829",
    channel: "12%",
    status: "Approved",
    dateCreated: "David Chen",
    amount: "00:18:22",
  },
];

const defaultTeamMembersData: TeamMember[] = [
  {
    id: "tm_001",
    name: "John Smith",
    role: "KYC Supervisor",
    roleColor: "#F59E0B",
    percentage: "85%",
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "tm_002",
    name: "Maria Garcia",
    role: "Field Officer",
    roleColor: "#3B82F6",
    percentage: "92%",
    avatarSrc: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "tm_003",
    name: "Ahmed Hassan",
    role: "Field Officer",
    roleColor: "#3B82F6",
    percentage: "78%",
    avatarSrc: "https://randomuser.me/api/portraits/men/67.jpg",
  },
  {
    id: "tm_004",
    name: "Lisa Chen",
    role: "KYC Initiator",
    roleColor: "#06B6D4",
    percentage: "95%",
    avatarSrc: "https://randomuser.me/api/portraits/women/23.jpg",
  },
  {
    id: "tm_005",
    name: "Robert Wilson",
    role: "Field Officer",
    roleColor: "#EF4444",
    percentage: "65%",
    avatarSrc: "https://randomuser.me/api/portraits/men/89.jpg",
  },
];

export default function KYCFinalApproverDashboard({
  kycRequestData = defaultKycRequestData,
  teamMembersData = defaultTeamMembersData,
  title = "Performance Evaluation",
  subtitle = "Overall performance of all activities",
  showBreadcrumb = true,
  breadcrumbText = "Dashboard",
  showModals = true,
  onEditUser,
  onDeleteUser,
}: KYCFinalApproverDashboardProps) {
  const [openGroupSuccessModal, setOpenGroupSuccessful] = useState(false);
  const [openEditPermissionModal, setEditPermissionModal] = useState(false);
  const [openDeletePermissionModal, setDeletePermissionModal] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({} as CustomerDetails);
  const [successMessage, setSuccessMessage] = useState("");

  const updatePermsissionGroup = () => {
    setEditPermissionModal(false);
    setSuccessMessage("User Updated Successfully");
    setOpenGroupSuccessful(true);
    if (onEditUser) {
      onEditUser(customerDetails);
    }
  };

  const deletePermsissionGroup = () => {
    setDeletePermissionModal(false);
    setSuccessMessage("User Deleted Successfully");
    setOpenGroupSuccessful(true);
    if (onDeleteUser) {
      onDeleteUser(customerDetails);
    }
  };

  return (
    <div className="px-[1rem] md:px-[2rem]">
      {showBreadcrumb && (
        <div>
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList className="font-[family-name:var(--font-poppins)] font-[500]">
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[16px]">
                    {breadcrumbText}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mt-[20px]">
        <div className="flex gap-3 justify-between items-center my-[26px]">
          <h3>
            {title} <br />
            {subtitle}
          </h3>

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

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <div
              className={`shadow relative flex flex-col p-6 rounded-[20px] items-center  h-[183px]   gap-2 py-[40px]`}
            >
              <Image
                src="/illustrations/kyc-initiator/clock.svg"
                alt="leftIcon"
                width={48}
                height={48}
              />
              <Image
                className="absolute bottom-0 right-0"
                src="/illustrations/kyc-initiator/ellipse-02.svg"
                alt="ellipse"
                width={100}
                height={100}
              />
              <div className="text-center">
                <p className="text-[#464646] mb-4 font-medium text-[24px] leading-[100%] tracking-[0%]  font-poppins mt-2">
                  1,487
                </p>
                <p className="font-medium text-[14px] leading-[100%] tracking-[%] font-dm-sans text-[#464646]">
                  Total Number of Requests
                </p>

                {/* Value */}
              </div>
            </div>

            <div className="mt-8">
              <ApprovalRejectionChart />
              <div className="mt-4">
                <SLAHeatMapChart />
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto mb-6">
              {/* Header Section */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  TEAM PERFORMANCE
                </h1>
                <p className="text-sm text-gray-600">
                  The breakdown of approval and rejection rates to identify
                  trends and patterns
                </p>
              </div>

              {/* Filter/Search Section */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* Keywords Input */}
                <div className="relative flex-1">
                  <label
                    htmlFor="keywords"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Keywords
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="keywords"
                      placeholder="Enter a keyword"
                      onChange={(e) => {
                        const clearButton =
                          document.getElementById("clearButton");
                        if (clearButton) {
                          clearButton.style.display = e.target.value
                            ? "block"
                            : "none";
                        }
                      }}
                      className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                    {/* Search Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                    {/* Clear (x) Icon */}
                    <button
                      id="clearButton"
                      style={{ display: "none" }}
                      onClick={() => {
                        const input = document.getElementById(
                          "keywords"
                        ) as HTMLInputElement;
                        if (input) {
                          input.value = "";
                          const clearButton =
                            document.getElementById("clearButton");
                          if (clearButton) clearButton.style.display = "none";
                        }
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Role Dropdown */}
                <div className="relative flex-1">
                  <Label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Role
                  </Label>
                  <Select>
                    <SelectTrigger
                      className="w-full font-poppins text-gray-700 !h-[42px]
                        focus-visible:ring-offset-0
                        focus-visible:ring-0 
                        focus-visible:outline-none
                        focus-visible:ring-transparent
                        border-[#CCCCCC80]
                        focus-visible:border-[#CCCCCC80]"
                    >
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent className="font-poppins text-[14px]">
                      <SelectGroup>
                        <SelectItem value="supervisor">
                          KYC Supervisor
                        </SelectItem>
                        <SelectItem value="field_officer">
                          Field Officer
                        </SelectItem>
                        <SelectItem value="initiator">KYC Initiator</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Team Members List Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Team Members
                </h2>
                <div className="space-y-4">
                  {teamMembersData.map((member) => (
                    <TeamMemberItem
                      key={member.id}
                      avatarSrc={member.avatarSrc}
                      name={member.name}
                      role={member.role}
                      roleColor={member.roleColor}
                      percentage={member.percentage}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <TurnaroundTimeChart />
            </div>
          </div>
        </div>

        <KYCSupervisorRequestTable data={kycRequestData} />
        
        {/* View All Button */}
        <div className="flex items-center justify-center py-4">
          <Link href="/dashboard/kyc-requests">
            <Button
              className="cursor-pointer bg-[#0284B2] rounded-[5px] h-[48px] px-[20px] hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-[14px] text-white"
            >
              View All
            </Button>
          </Link>
        </div>
      </div>

      {/* Modals - Only show if showModals is true */}
      {showModals && (
        <>
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
        </>
      )}
    </div>
  );
}
