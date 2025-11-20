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
import { CircleCheckBig, Loader2, Play, Plus, XIcon } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { PermissionGroupsTable } from "@/components/layout/tables/PermissionGroupsTable";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  getPermissionGroupsQueryOptions,
  useCreatePermissionGroupMutation,
  useDeletePermissionGroupMutation,
} from "@/query-options/permissionGroupsQueryOption";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreatePermissionGroupValidation,
  UpdatePermissionGroupValidation,
} from "@/schemas/permissionGroupSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  APIError,
  CreatePermissionGroupPayload,
  PermissionGroup,
} from "@/types";

export default function SuperAdminPermission() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openGroupSuccessModal, setOpenGroupSuccessful] = useState(false);
  const [openEditPermissionModal, setEditPermissionModal] = useState(false);
  const [openDeletePermissionModal, setDeletePermissionModal] = useState(false);
  const [permissionId, setPermissionId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { data: permissionGroups, isLoading: isLoadingPermissionGroup } =
    useQuery(getPermissionGroupsQueryOptions());
  const {
    mutate: createPermissionGroup,
    isPending: isCreatingPermissionGroup,
  } = useCreatePermissionGroupMutation();
  const {
    mutate: deletePermissionGroup,
    isPending: isDeletingPermissionGroup,
  } = useDeletePermissionGroupMutation();

  const QueryClient = useQueryClient();

  const createPermissionGroupForm = CreatePermissionGroupValidation();

  const updatePermissionGroupForm = UpdatePermissionGroupValidation();

  const handleCreatePermissionGroup = (
    values: CreatePermissionGroupPayload
  ) => {
    createPermissionGroup(values, {
      onSuccess: () => {
        QueryClient.invalidateQueries({
          queryKey: getPermissionGroupsQueryOptions().queryKey,
        });
        setOpenCreateModal(false);
        setSuccessMessage("Permission Group Created Successfully");
        setOpenGroupSuccessful(true);
        createPermissionGroupForm.reset();
      },
      onError: (error: APIError) => {
        const message =
          error.response?.message || error.message || "Failed to create group";

        createPermissionGroupForm.setError("name", {
          type: "server",
          message,
        });

        toast.error(message);
      },
    });
  };

  const handleUpdatePermissionGroup = (
    values: CreatePermissionGroupPayload
  ) => {
    console.log(values);
    setEditPermissionModal(false);
  };

  const handleEdit = (permission: PermissionGroup) => {
    updatePermissionGroupForm.setValue("name", permission.name);
    setEditPermissionModal(true);
  };

  const handleDelete = (id: string) => {
    console.log("Deleting row with id:", id);
    setPermissionId(id);
    setDeletePermissionModal(true);
  };

  const handleDeletePermissionGroup = () => {
    deletePermissionGroup(permissionId, {
      onSuccess: () => {
        QueryClient.invalidateQueries({
          queryKey: getPermissionGroupsQueryOptions().queryKey,
        });
        setDeletePermissionModal(false);
        setSuccessMessage("Permission Group Deleted Successfully");
        setOpenGroupSuccessful(true);
      },
      onError: (error: APIError) => {
        toast.error(
          error.response?.message || "Failed to delete permission group"
        );
      },
    });
  };

  return (
    <div className="px-[1rem] md:px-[2rem]">
      <div>
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList className="font-[family-name:var(--font-poppins)] font-[500]">
              <BreadcrumbItem className="text-[#A9A9A9]">
                <BreadcrumbLink href="/permission-management">
                  Permissions Management
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Play className="text-[#CCCCCC]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem className="text-[#464646]">
                <BreadcrumbPage>Permission Groups</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Dialog
            open={openCreateModal}
            onOpenChange={(isOpen) => {
              setOpenCreateModal(isOpen);
              if (isOpen) {
                createPermissionGroupForm.reset();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="cursor-pointer bg-[#0284B2] rounded-[5px] h-[48px] px-[20px] hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-[14px]">
                <Plus />
                Create Permission Group
              </Button>
            </DialogTrigger>
            <DialogContent
              onInteractOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
              className="sm:max-w-[600px] "
            >
              <DialogHeader className="justify-between items-center flex-row">
                <DialogTitle className="text-[#464646] text-[28px] font-[family-name:var(--font-dm)] font-[600]">
                  Create Permission Group
                </DialogTitle>
                <DialogClose className="bg-white text-muted-foreground rounded-xs [&_svg:not([class*='size-'])]:size-4 cursor-pointer">
                  <XIcon className="size-[20px]" />
                </DialogClose>
              </DialogHeader>

              <Form {...createPermissionGroupForm}>
                <form
                  onSubmit={createPermissionGroupForm.handleSubmit(
                    handleCreatePermissionGroup
                  )}
                >
                  <FormField
                    control={createPermissionGroupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="mt-6">
                        <FormLabel className="text-[#464646]">
                          Permission Group
                        </FormLabel>
                        <FormControl>
                          <Input
                            className=" text-[#464646] text-[16px]  col-span-3 h-[56px] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                            placeholder="Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="h-[58px] float-right mt-8 rounded-[8px] bg-[#0284B2] py-[16px] px-[12px] cursor-pointer hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-white flex items-center gap-2"
                    disabled={isCreatingPermissionGroup}
                  >
                    {isCreatingPermissionGroup && (
                      <Loader2 className="animate-spin w-5 h-5" />
                    )}
                    Create permission group
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-[8px]">
          <h6 className="font-[family-name:var(--font-dm)] font-[600] text-[16px]">
            Permission Groups
          </h6>
        </div>
      </div>

      {/* Content */}
      <div className="mt-[20px]">
        <PermissionGroupsTable
          data={permissionGroups?.data ?? []}
          isLoading={isLoadingPermissionGroup}
          onDeleteTableProp={handleDelete}
          onEditTableProp={handleEdit}
        />
      </div>

      {/* Edit Permission Group */}
      <Dialog
        open={openEditPermissionModal}
        onOpenChange={setEditPermissionModal}
      >
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="sm:max-w-[600px] "
        >
          <DialogHeader className="justify-between items-center flex-row">
            <DialogTitle className="text-[#464646] text-[28px] font-[family-name:var(--font-dm)] font-[600]">
              Edit Permission Group
            </DialogTitle>
            <DialogClose className="bg-white text-muted-foreground rounded-xs [&_svg:not([class*='size-'])]:size-4 cursor-pointer">
              <XIcon className="size-[20px]" />
            </DialogClose>
          </DialogHeader>

          <Form {...updatePermissionGroupForm}>
            <form
              onSubmit={updatePermissionGroupForm.handleSubmit(
                handleUpdatePermissionGroup
              )}
            >
              <FormField
                control={updatePermissionGroupForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel className="text-[#464646]">
                      Permission Group
                    </FormLabel>
                    <FormControl>
                      <Input
                        className=" text-[#464646] text-[16px]  col-span-3 h-[56px] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                        placeholder="Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="h-[58px] float-right mt-8 rounded-[8px] bg-[#0284B2] py-[16px] px-[12px] cursor-pointer hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-white flex items-center gap-2"
                disabled={isCreatingPermissionGroup}
              >
                {isCreatingPermissionGroup && (
                  <Loader2 className="animate-spin w-5 h-5" />
                )}
                Update permission group
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Group created successfully */}
      <Dialog
        open={openGroupSuccessModal}
        onOpenChange={setOpenGroupSuccessful}
      >
        <DialogContent className="sm:max-w-[582px]">
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
              <h5 className="text-[22px] font-[500] text-[#464646] mt-[24px] w-[300px] mx-auto">
                {successMessage}
              </h5>
            </div>
          </div>
          <DialogFooter className="flex sm:justify-center justify-center items-center w-full">
            <Button
              type="button"
              className="rounded-[8px] bg-[#0284B2] py-[20px] px-[32px] h-[48px] cursor-pointer hover:bg-[#0284B2] font-[family-name:var(--font-poppins)]"
              onClick={() => setOpenGroupSuccessful(false)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Permission Group */}
      <Dialog
        open={openDeletePermissionModal}
        onOpenChange={setDeletePermissionModal}
      >
        <DialogContent className="sm:max-w-[533px]">
          <DialogHeader>
            <DialogTitle className="text-[#464646] font-[family-name:var(--font-dm)] font-[600]"></DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 justify-center text-center items-center gap-2 font-[family-name:var(--font-poppins)]">
              <h3 className="text-[28px] font-[600] text-[#464646]font-[family-name:var(--font-dm)]">
                Delete Permission Group
              </h3>
              <h5 className="text-[20px] font-[500] text-[#464646] mt-[24px]">
                Are you sure you want to delete this permission group? This
                action cannot be undone.
              </h5>
              <p className="text-[14px] font-[500] text-[#FC5A5A] mt-[14px]">
                Disclaimer: Please note that once you delete a permission group,
                the user assigned to the permission group will no longer have
                access.
              </p>
            </div>
          </div>
          <DialogFooter className="flex sm:justify-center">
            <Button
              type="button"
              className="rounded-[4px] text-white h-[48px] bg-[#FC5A5A] py-[20px] px-[34px] cursor-pointer hover:bg-[#FC5A5A] font-[family-name:var(--font-poppins)]"
              onClick={() => setDeletePermissionModal(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              className="rounded-[4px] bg-[#0284B2] py-[20px] px-[34px] cursor-pointer hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-white h-[48px]"
              onClick={handleDeletePermissionGroup}
              disabled={isDeletingPermissionGroup}
            >
              {isDeletingPermissionGroup && (
                <Loader2 className="animate-spin w-5 h-5" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
