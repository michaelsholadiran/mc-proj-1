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
import { CircleCheckBig, Play, XIcon, Loader2 } from "lucide-react";

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
import { useParams } from "next/navigation";
// import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AvatarIcon } from "@/components/icons";
import { Switch } from "@/components/ui/switch";
import { useGetUserByIdQuery } from "@/query-options/usersQueryOption";

export default function UserDetailsPage() {
  const params = useParams();
  const { id } = params;
  const userId = Array.isArray(id) ? id[0] : id;

  const { data: userResponse, isLoading, error } = useGetUserByIdQuery(userId || "");
  const user = userResponse?.data;

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

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin w-5 h-5" />
          Loading user details...
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Failed to load user details</p>
          <p className="text-gray-500 text-sm mt-2">
            {error?.message || "User not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-[1rem] md:px-[2rem]">
      <div>
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList className="font-[family-name:var(--font-poppins)] font-[500]">
              <BreadcrumbItem className="text-[#A9A9A9]">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Play className="text-[#CCCCCC]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem className="text-[#A9A9A9]">
                <BreadcrumbLink href="/user-management">
                  User Management
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Play className="text-[#CCCCCC]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem className="text-[#464646]">
                <BreadcrumbPage>User Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="mt-[8px]">
          <h6 className="font-[family-name:var(--font-dm)] font-[600] text-[16px]">
            User Details
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
                  {`${user.firstName} ${user.lastName}`}
                </h3>
                <h5 className="font-[family-name:var(--font-dm)] text-[#464646] text-[14px] font-[600]">
                  {user.email}
                </h5>
                <p className="text-[#A9A9A9] text-[10px] italic font-[family-name:var(--font-dm)]">
                  Username: {user.username}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-[30px]">
            <h4 className="text-[#464646] font-[family-name:var(--font-dm)] font-[600] text-[18px]">
              Personal Information
            </h4>
            <div className="mt-[24px] border-1 border-[#CCCCCC] p-[24px] rounded-[8px]">
              <div className="grid grid-cols-2 gap-[40px]">
                <div>
                  <div>
                    <h4 className="text-[#464646] font-[600]">First Name</h4>
                    <p className="text-[#A9A9A9] font-[600]">{user.firstName}</p>
                  </div>
                  <div className="mt-[30px]">
                    <h4 className="text-[#464646] font-[600]">Email Address</h4>
                    <p className="text-[#A9A9A9] font-[600]">{user.email}</p>
                  </div>
                  <div className="mt-[30px]">
                    <h4 className="text-[#464646] font-[600]">Phone Number</h4>
                    <p className="text-[#A9A9A9] font-[600]">{user.phoneNumber}</p>
                  </div>
                  <div className="mt-[30px]">
                    <h4 className="text-[#464646] font-[600]">User Type</h4>
                    <p className="text-[#A9A9A9] font-[600]">{user.userType}</p>
                  </div>
                </div>
                <div>
                  <div>
                    <h4 className="text-[#464646] font-[600]">Last Name</h4>
                    <p className="text-[#A9A9A9] font-[600]">{user.lastName}</p>
                  </div>
                  <div className="mt-[30px]">
                    <h4 className="text-[#464646] font-[600]">Role</h4>
                    <p className="text-[#A9A9A9] font-[600]">
                      {user.defaultRole || "No Role Assigned"}
                    </p>
                  </div>
                  <div className="mt-[30px]">
                    <h4 className="text-[#464646] font-[600]">Department ID</h4>
                    <p className="text-[#A9A9A9] font-[600]">{user.departmentId}</p>
                  </div>
                  <div className="mt-[30px]">
                    <h4 className="text-[#464646] font-[600]">Status</h4>
                    <p
                      className={`flex items-center gap-2 font-[600] ${
                        user.status === "Active" ? "text-[#0284B2]" : "text-[#FC5A5A]"
                      }`}
                    >
                      {user.status}
                      {(user.status === "Active" || user.status === "Inactive") && (
                        <Switch
                          className="data-[state=checked]:bg-[#0284B2]"
                          checked={user.status === "Active"}
                          onCheckedChange={changeUserStatus}
                        />
                      )}
                    </p>
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
  );
}
