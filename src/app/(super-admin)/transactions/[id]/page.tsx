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
  // DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { AvatarIcon } from "@/components/icons";
// import { Switch } from "@/components/ui/switch";

export default function UserDetailsPage() {
  const [userStatus, setUserStatus] = useState(false);
  const [openGroupSuccessModal, setOpenGroupSuccessful] = useState(false);
  const [openEditPermissionModal, setEditPermissionModal] = useState(false);
  const [openDeletePermissionModal, setDeletePermissionModal] = useState(false);
  // const [permissionDetails, setPermissionDetails] = useState({} as Payment);
  // const [permissionId, setPermissionId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // const params = useParams();
  // const { id } = params;

  const updatePermsissionGroup = () => {
    setEditPermissionModal(false);
    setSuccessMessage("Permission Updated Successfully");
    setOpenGroupSuccessful(true);
    // console.log("Permission details", permissionDetails);
  };

  // const handleDelete = () => {
  //   // perform delete logic here (API call, state update, etc.)
  //   setDeletePermissionModal(true);
  // };

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
                <BreadcrumbLink href="/user-management">
                  Transactions
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Play className="text-[#CCCCCC]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem className="text-[#464646]">
                <BreadcrumbPage>Transaction details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="mt-[8px]">
          <h6 className="font-[family-name:var(--font-dm)] font-[600] text-[16px]">
            Transaction details
          </h6>
        </div>
      </div>

      {/* Content */}
      <div className="mt-[30px]">
        <div className="py-[16px] w-full sm:w-[70%]">
          <div className="border-1 border-[#CCCCCC] p-[24px] rounded-[8px]">
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
              Transaction Details
            </h4>
            <div className="mt-[24px] border-1 border-[#CCCCCC] p-[24px] rounded-[8px]">
              <div className="grid grid-cols-3 gap-[40px]">
                <div>
                  <div>
                    <h4 className="text-[#464646] font-[600]">Customer ID</h4>
                    <p className="text-[#A9A9A9] font-[600]">#4612580</p>
                  </div>
                  <div className="mt-[30px]">
                    <h4 className="text-[#464646] font-[600]">Phone Number</h4>
                    <p className="text-[#A9A9A9] font-[600]">08160688825</p>
                  </div>
                  <div className="mt-[30px]">
                    <h4 className="text-[#464646] font-[600]">
                      Transaction ID
                    </h4>
                    <p className="text-[#A9A9A9] font-[600]">3FC157487U789</p>
                  </div>
                </div>
                <div>
                  <div>
                    <h4 className="text-[#464646] font-[600]">Customer Name</h4>
                    <p className="text-[#A9A9A9] font-[600]">Adebisi Adeola</p>
                  </div>
                  <div className="mt-[30px]">
                    <h4 className="text-[#464646] font-[600]">
                      Transaction Type
                    </h4>
                    <p className="text-[#A9A9A9] font-[600]">Airtime</p>
                  </div>
                  <div className="mt-[30px]">
                    <h4 className="text-[#464646] font-[600]">
                      Transaction Date
                    </h4>
                    <p className="text-[#A9A9A9] font-[600]">User Management</p>
                  </div>
                </div>
                <div>
                  <div>
                    <h4 className="text-[#464646] font-[600]">
                      Account Number
                    </h4>
                    <p className="text-[#A9A9A9] font-[600]">3110758413</p>
                  </div>
                  <div className="mt-[30px]">
                    <h4 className="text-[#464646] font-[600]">Amount</h4>
                    <p className="text-[#A9A9A9] font-[600]">N150,000.00</p>
                  </div>
                  <div className="mt-[30px]">
                    <h4 className="text-[#464646] font-[600]">Status</h4>
                    <p className="text-[#0284B2] font-[600] ">Successful</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              <h3 className="text-[26px] font-[600] text-[#464646] font-[family-name:var(--font-dm)]">
                {userStatus ? "Deactivate User" : "Reactivate User"}
              </h3>
              <h5 className="text-[18px] font-[500] mt-[24px] text-[#464646]">
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
  );
}
