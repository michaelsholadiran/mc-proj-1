"use client";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
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
import Image from "next/image";
import {
  CustomerDetails,
  CustomerKYCTable,
} from "@/components/layout/tables/customersKYCTable";
import { TranascationsTable } from "@/components/layout/tables/customer-management/tranascationsTable";
import { KYCRequestTab } from "@/components/layout/tabs/KYCRequestTab";

const tabs = [
  { name: "Personal Details", href: "personal-details" },
  { name: "Address Verification", href: "address-verification" },
  { name: "KYC Details", href: "kyc-details" },
  { name: "Additional Comment", href: "additional-comment" },
];

export default function UserDetailsPage() {
  const params = useParams() as { id: string };
  const pathname = usePathname();
  const segments = pathname.split("/");
  const currentTab =
    segments[segments.length - 1] === params.id
      ? "personal-details"
      : segments[segments.length - 1];
  const [userStatus, setUserStatus] = useState(false);
  const [openGroupSuccessModal, setOpenGroupSuccessful] = useState(false);
  const [openEditPermissionModal, setEditPermissionModal] = useState(false);
  const [openDeletePermissionModal, setDeletePermissionModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const updatePermsissionGroup = () => {
    setEditPermissionModal(false);
    setSuccessMessage("Permission Updated Successfully");
    setOpenGroupSuccessful(true);
  };

  const handleDelete = () => {
    setDeletePermissionModal(true);
  };

  const deletePermsissionGroup = () => {
    setDeletePermissionModal(false);
    if (userStatus) {
      setSuccessMessage("User Deactivated Successfully");
      setOpenGroupSuccessful(true);
      setUserStatus(false);
      return;
    }
    setSuccessMessage("User Reactivated Successfully");
    setOpenGroupSuccessful(true);
    setUserStatus(true);
  };

  const changeUserStatus = (e: boolean) => {
    handleDelete();
    console.log(e);
  };

  const handleEdit = (user: { id: string }) => {
    console.log("Editing row with id:", user.id);
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

  const transactionsData: CustomerDetails[] = [
    {
      id: "m5gr84i9",
      amount: "10000",
      userName: "Adebisi Adeola",
      userEmail: "adebisideola@gmail.com",
      customerId: "#4612580",
      accountNo: "3110758413",
      phoneNumber: "08160688825",
      channel: "Mobile",
      status: "Successful",
      dateCreated: "02/04/2024",
    },
    {
      id: "3u1reuv4",
      amount: "10000",
      userName: "Adebisi Adeola",
      userEmail: "adebisideola@gmail.com",
      customerId: "#4612580",
      accountNo: "3110758413",
      phoneNumber: "08160688825",
      channel: "iBank",
      status: "Failed",
      dateCreated: "02/04/2024",
    },
    {
      id: "derv1ws0",
      amount: "10000",
      userName: "Adebisi Adeola",
      userEmail: "adebisideola@gmail.com",
      customerId: "#4612580",
      accountNo: "3110758413",
      phoneNumber: "08160688825",
      channel: "Mobile",
      status: "Pending",
      dateCreated: "02/04/2024",
    },
    {
      id: "5kma53ae",
      amount: "10000",
      userName: "Adebisi Adeola",
      userEmail: "adebisideola@gmail.com",
      customerId: "#4612580",
      accountNo: "3110758413",
      phoneNumber: "08160688825",
      channel: "iBank",
      status: "Pending",
      dateCreated: "02/04/2024",
    },
    {
      id: "bhqecj4p",
      amount: "10000",
      userName: "Adebisi Adeola",
      userEmail: "adebisideola@gmail.com",
      customerId: "#4612580",
      accountNo: "3110758413",
      phoneNumber: "08160688825",
      channel: "Mobile",
      status: "Pending",
      dateCreated: "02/04/2024",
    },
  ];

  return (
    <div className="space-y-6 px-[1rem] md:px-[2rem]">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isCurrent = currentTab === tab.href;
            return (
              <Link
                key={tab.name}
                href={`/kyci-dashboard/kyc-request-details/${params.id}/${tab.href}`}
                className={cn(
                  isCurrent
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium"
                )}
                aria-current={isCurrent ? "page" : undefined}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>

        <div>
          <KYCRequestTab id={params.id} />
        </div>
      </div>

      {/* Main Content */}
      <div className="py-4">
        <div>
          <div>
            <div className="flex items-center justify-between">
              <Breadcrumb>
                <BreadcrumbList className="font-[family-name:var(--font-poppins)] font-[500]">
                  <BreadcrumbItem className="text-[#A9A9A9]">
                    <BreadcrumbLink href="/kyci-dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <Play className="text-[#CCCCCC]" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem className="text-[#A9A9A9]">
                    <BreadcrumbLink href="/kyci-dashboard">
                      KYC Requests
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <Play className="text-[#CCCCCC]" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem className="text-[#464646]">
                    <BreadcrumbPage>KYC Request Details</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="mt-[8px]">
              <h6 className="font-[family-name:var(--font-dm)] font-[600] text-[16px]">
                KYC Request Details
              </h6>
            </div>
          </div>

          {/* Content */}
          <div className="mt-[30px]">
            <div className="py-[16px]">
              <div className="border-1 border-[#CCCCCC] p-[24px] rounded-[8px] w-full sm:w-[100%]">
                <div className="flex gap-[16px] items-center">
                  <AvatarIcon size={82} />
                  <div className="">
                    <h3 className="text-[#464646] font-[family-name:var(--font-dm)] font-[600]">
                      Adebisi Adeola
                    </h3>
                    <h5 className="font-[family-name:var(--font-dm)] text-[#464646] text-[14px] font-[600]">
                      adebisideola@gmail.com
                    </h5>
                    <p className="text-[#A9A9A9] text-[10px] italic font-[family-name:var(--font-dm)]">
                      Last seen: 2 hours ago
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-[30px]">
                <h4 className="text-[#464646] font-[family-name:var(--font-dm)] font-[600] text-[18px]">
                  Personal Information
                </h4>
                <div className="mt-[24px] border-1 border-[#CCCCCC] p-[24px] rounded-[8px]">
                  <div className="grid grid-cols-4 gap-[40px]">
                    <div>
                      <div>
                        <h4 className="text-[#464646] font-[600]">
                          First Name
                        </h4>
                        <p className="text-[#A9A9A9] font-[600]">Adeola</p>
                      </div>
                      <div className="mt-[30px]">
                        <h4 className="text-[#464646] font-[600]">
                          Email Address
                        </h4>
                        <p className="text-[#A9A9A9] font-[600]">
                          adebisideola@gmail.com
                        </p>
                      </div>

                      <div className="mt-[30px]">
                        <h4 className="text-[#464646] font-[600]">Channel</h4>
                        <div className="w-[130px] text-[#A9A9A9] font-[600] ">
                          <div className="flex justify-between gap-[10px]">
                            <p>iBank</p>
                            <Image
                              alt="Unavailable"
                              src="/illustrations/customer-management/unavailable.svg"
                              width={24}
                              height={24}
                            />
                          </div>
                          <div className="flex  gap-[10px] justify-between mt-2">
                            <p>Mobile</p>
                            <Image
                              alt="Unavailable"
                              src="/illustrations/customer-management/unavailable.svg"
                              width={24}
                              height={24}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <h4 className="text-[#464646] font-[600]">Last Name</h4>
                        <p className="text-[#A9A9A9] font-[600]">Adebisi</p>
                      </div>
                      <div className="mt-[30px]">
                        <h4 className="text-[#464646] font-[600]">
                          Customer ID
                        </h4>
                        <p className="text-[#A9A9A9] font-[600]">#4612580</p>
                      </div>
                      <div className="mt-[30px]">
                        <h4 className="text-[#464646] font-[600]">
                          Date Created
                        </h4>
                        <div className="text-[#A9A9A9] font-[600]">
                          <p>02/04/2024</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <h4 className="text-[#464646] font-[600]">
                          Phone Number
                        </h4>
                        <p className="text-[#A9A9A9] font-[600]">08160688825</p>
                      </div>
                      <div className="mt-[30px]">
                        <h4 className="text-[#464646] font-[600]">
                          Account Number
                        </h4>
                        <p className="text-[#A9A9A9] font-[600]">3110758413</p>
                      </div>

                      <div className="mt-[30px]">
                        <h4 className="text-[#464646] font-[600]">Status</h4>
                        <p
                          className={`flex items-center gap-2 font-[600] ${
                            userStatus ? "text-[#0284B2]" : "text-[#FC5A5A]"
                          }`}
                        >
                          {userStatus ? "Active" : "Inactive"}
                          <Switch
                            className="data-[state=checked]:bg-[#0284B2]"
                            checked={userStatus}
                            onCheckedChange={changeUserStatus}
                          />
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end cursor-pointer">
                      <div>
                        <span className="text-[18px]">Edit</span>
                        <Image
                          className="inline ml-2 align-text-bottom"
                          alt="edit"
                          src="/illustrations/customer-management/edit.svg"
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <CustomerKYCTable
                data={customerKYCData}
                onDeleteTableProp={handleDelete}
                onEditTableProp={handleEdit}
              />

              <TranascationsTable
                data={transactionsData}
                onDeleteTableProp={handleDelete}
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
                  <Label
                    htmlFor="group"
                    className="text-left block text-[#464646]"
                  >
                    Permission Name
                  </Label>
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
                  onClick={deletePermsissionGroup}
                >
                  {userStatus ? "Deactivate" : "Reactivate"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
