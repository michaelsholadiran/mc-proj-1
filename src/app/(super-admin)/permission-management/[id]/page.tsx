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
import { CircleCheckBig, Loader2, Play, Plus, XIcon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PermissionsTable } from "@/components/layout/tables/PermissionsTable";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  getPermissionsQueryOptions,
  useCreatePermissionMutation,
  useDeletePermissionMutation,
  useUpdatePermissionMutation,
} from "@/query-options/permissionsQueryOption";
import { APIError, Permission, PermissionGroup } from "@/types";
import {
  createPermissionGroupSchema,
  CreatePermissionGroupValidation,
} from "@/schemas/permissionSchema";

type PermissionFormValues = z.infer<typeof createPermissionGroupSchema> & {
  id?: string;
};

type PermissionGroupWithDescription = PermissionGroup & {
  description?: string;
};

// Sample data is no longer needed as we're fetching from the API

export default function SuperAdminSinglePermission() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openGroupSuccessModal, setOpenGroupSuccessful] = useState(false);
  const [openEditPermissionModal, setEditPermissionModal] = useState(false);
  const [openDeletePermissionModal, setDeletePermissionModal] = useState(false);
  const [permissionDetails, setPermissionDetails] =
    useState<PermissionFormValues>({ name: "", description: "" });
  const [permissionId, setPermissionId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const params = useParams();
  const { id } = params;
  const queryClient = useQueryClient();

  // Initialize forms
  const createForm = CreatePermissionGroupValidation();
  const editForm = CreatePermissionGroupValidation();

  // Update form values when permissionDetails change
  useEffect(() => {
    if (permissionDetails) {
      editForm.reset({
        name: permissionDetails.name,
        description: permissionDetails.description || "",
      });
    }
  }, [permissionDetails, editForm]);

  // API queries and mutations
  const { data: permissions, isLoading } = useQuery(
    getPermissionsQueryOptions(id as string)
  );
  const { mutate: createPermission, isPending: isCreating } =
    useCreatePermissionMutation();
  const { mutate: updatePermission, isPending: isUpdating } =
    useUpdatePermissionMutation();
  const { mutate: deletePermission, isPending: isDeleting } =
    useDeletePermissionMutation();

  // Handle form submissions
  const handleCreatePermission = (values: PermissionFormValues) => {
    const permissionData = {
      ...values,
      groupId: id as string, // Add groupId from URL params
    };

    createPermission(permissionData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["permissions"] });
        setOpenCreateModal(false);
        setSuccessMessage("Permission created successfully");
        setOpenGroupSuccessful(true);
        createForm.reset();
      },
      onError: (error: APIError) => {
        const message =
          error.response?.message || "Failed to create permission";

        // Set error on the name field if the error is related to the permission name
        if (
          message.toLowerCase().includes("name") ||
          message.toLowerCase().includes("permission")
        ) {
          createForm.setError("name", {
            type: "server",
            message: message,
          });
        } else {
          toast.error(message);
        }
      },
    });
  };

  const handleUpdatePermission = (values: PermissionFormValues) => {
    if (!permissionDetails?.id) return;

    updatePermission(
      { permissionId: permissionDetails.id, formData: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["permissions"] });
          setEditPermissionModal(false);
          setSuccessMessage("Permission updated successfully");
          setOpenGroupSuccessful(true);
          editForm.reset();
        },
        onError: (error: APIError) => {
          const message =
            error.response?.message || "Failed to update permission";

          // Set error on the name field if the error is related to the permission name
          if (
            message.toLowerCase().includes("name") ||
            message.toLowerCase().includes("permission")
          ) {
            editForm.setError("name", {
              type: "server",
              message: message,
            });
          } else {
            toast.error(message);
          }
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    setPermissionId(id);
    setDeletePermissionModal(true);
  };

  const handleEdit = (permission: Permission) => {
    setPermissionDetails({
      id: permission.permissionId,
      name: permission.name,
      description: permission.description || "",
    });
    setEditPermissionModal(true);
  };

  const handleDeletePermission = () => {
    deletePermission(permissionId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["permissions"] });
        setDeletePermissionModal(false);
        setSuccessMessage("Permission deleted successfully");
        setOpenGroupSuccessful(true);
      },
      onError: (error: APIError) => {
        const message =
          error.response?.message || "Failed to delete permission";
        toast.error(message);
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full p-4 px-[1rem] md:px-[2rem]">
      <div className="flex justify-between items-center">
        <Breadcrumb>
          <BreadcrumbList className="font-[family-name:var(--font-poppins)] font-[500]">
            <BreadcrumbItem className="text-[#A9A9A9]">
              <BreadcrumbLink href="/permission-management">
                Permission Management
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Play className="w-3 h-3 text-[#A9A9A9]" />
            </BreadcrumbSeparator>
            <BreadcrumbItem className="text-[#A9A9A9]">
              <BreadcrumbLink>Permission Groups</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Play className="w-3 h-3 text-[#A9A9A9]" />
            </BreadcrumbSeparator>
            <BreadcrumbItem className="text-[#464646]">
              <BreadcrumbPage>{id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div>
          <Dialog
            open={openCreateModal}
            onOpenChange={(isOpen) => {
              setOpenCreateModal(isOpen);
              if (isOpen) {
                createForm.reset();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="cursor-pointer bg-[#0284B2] rounded-[5px] h-[48px] px-[20px] hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-[14px] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Permission
              </Button>
            </DialogTrigger>
            <DialogContent
              onInteractOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
              className="sm:max-w-[600px]"
            >
              <DialogHeader className="justify-between items-center flex-row">
                <DialogTitle className="text-[#464646] text-[28px] font-[family-name:var(--font-dm)] font-[600]">
                  Create Permission
                </DialogTitle>
                <DialogClose className="bg-white text-muted-foreground rounded-xs [&_svg:not([class*='size-'])]:size-4 cursor-pointer">
                  <XIcon className="size-[20px]" />
                </DialogClose>
              </DialogHeader>
              <Form {...createForm}>
                <form
                  onSubmit={createForm.handleSubmit(handleCreatePermission)}
                  className="space-y-4"
                >
                  <div className="grid gap-4 py-4">
                    <FormField
                      control={createForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#464646]">
                            Permission Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Name"
                              className="text-[#464646] text-[16px] col-span-3 h-[56px] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#464646]">
                            Permission Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Enter description"
                              className="focus-visible:ring-0 placeholder:text-[#909090] text-[14px] font-[family-name:var(--font-poppins)] min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-[58px] float-right mt-8 rounded-[8px] bg-[#0284B2] py-[16px] px-[12px] cursor-pointer hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-white flex items-center gap-2"
                    disabled={isCreating}
                  >
                    {isCreating && <Loader2 className="animate-spin w-5 h-5" />}
                    Create permission
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-[8px] p-4">
        <PermissionsTable
          data={permissions?.data || []}
          isLoading={isLoading}
          onDeleteTableProp={handleDelete}
          onEditTableProp={handleEdit}
        />
      </div>

      {/* Success Dialog */}
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

      {/* Edit Permission Modal */}
      <Dialog
        open={openEditPermissionModal}
        onOpenChange={setEditPermissionModal}
      >
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="sm:max-w-[600px]"
        >
          <DialogHeader className="justify-between items-center flex-row">
            <DialogTitle className="text-[#464646] text-[28px] font-[family-name:var(--font-dm)] font-[600]">
              Edit Permission
            </DialogTitle>
            <DialogClose className="bg-white text-muted-foreground rounded-xs [&_svg:not([class*='size-'])]:size-4 cursor-pointer">
              <XIcon className="size-[20px]" />
            </DialogClose>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleUpdatePermission)}
              className="space-y-4"
            >
              <div className="grid gap-4 py-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#464646]">
                        Permission Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter permission name"
                          className="h-[56px] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#464646]">
                        Permission Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter description"
                          className="focus-visible:ring-0 placeholder:text-[#909090] text-[14px] font-[family-name:var(--font-poppins)] min-h-[100px]"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="h-[58px] float-right mt-8 rounded-[8px] bg-[#0284B2] py-[16px] px-[12px] cursor-pointer hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-white flex items-center gap-2"
                disabled={isUpdating}
              >
                {isUpdating && <Loader2 className="animate-spin w-5 h-5" />}
                Update permission
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Permission */}
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
              <h3 className="text-[28px] font-[600] text-[#464646] font-[family-name:var(--font-dm)]">
                Delete Permission
              </h3>
              <h5 className="text-[20px] font-[500] text-[#464646] mt-[24px]">
                Are you sure you want to delete this permission? This action
                cannot be undone.
              </h5>
              <p className="text-[14px] font-[500] text-[#FC5A5A] mt-[14px]">
                Disclaimer: Please note that once you delete a permission, the
                user assigned to the permission will no longer have access.
              </p>
            </div>
          </div>
          <DialogFooter className="flex sm:justify-center">
            <Button
              type="button"
              className="rounded-[4px] text-white h-[48px] bg-[#FC5A5A] py-[20px] px-[34px] cursor-pointer hover:bg-[#FC5A5A] font-[family-name:var(--font-poppins)]"
              onClick={() => setDeletePermissionModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-[4px] bg-[#0284B2] py-[20px] px-[34px] cursor-pointer hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-white h-[48px]"
              onClick={handleDeletePermission}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="animate-spin w-5 h-5" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
