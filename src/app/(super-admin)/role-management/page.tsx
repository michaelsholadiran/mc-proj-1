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
  Loader2,
  Play,
  Plus,
  Search,
  XIcon,
  ChevronRight,
} from "lucide-react";

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
import { ChangeEvent, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { RolesTable } from "@/components/layout/tables/rolesTable";
import { Textarea } from "@/components/ui/textarea";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MultiSelect } from "@/components/ui/multi-select";
import {
  CreateRoleValidation,
  UpdateRoleValidation,
  createRoleSchema,
} from "@/schemas/roleSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRolesQueryOptions,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useUpdateRoleMutation,
} from "@/query-options/rolesQueryOption";
import { getPermissionGroupsWithPermissionsQueryOptions } from "@/query-options/permissionGroupsQueryOption";
import { toast } from "sonner";
import { APIError, CreateRolePayload, Role } from "@/types";

// Type for permission structure in the UI
interface UIPermission {
  id: string;
  name: string;
  description?: string;
}

interface UIPermissionGroup {
  id: string;
  name: string;
  children: UIPermission[];
}

export default function SuperAdminRoleManagement() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openGroupSuccessModal, setOpenGroupSuccessful] = useState(false);
  const [openEditRoleModal, setEditRoleModal] = useState(false);
  const [openDeleteRoleModal, setDeleteRoleModal] = useState(false);
  const [roleId, setRoleId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [permissionSearch, setPermissionSearch] = useState<string>("");
  const [expandedPermissions, setExpandedPermissions] = useState<Set<string>>(new Set());
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

  const { data: roles, isLoading: isLoadingRoles } = useQuery(
    getRolesQueryOptions()
  );

  const { data: permissionGroupsData, isLoading: isLoadingPermissionGroups } = useQuery(
    getPermissionGroupsWithPermissionsQueryOptions()
  );

  // Expand first group when data loads
  useEffect(() => {
    if (permissionGroupsData?.data && permissionGroupsData.data.length > 0) {
      setExpandedPermissions(new Set([permissionGroupsData.data[0].groupId]));
    }
  }, [permissionGroupsData]);
  const { mutate: createRole, isPending: isCreatingRole } =
    useCreateRoleMutation();
  const { mutate: updateRole, isPending: isUpdatingRole } =
    useUpdateRoleMutation();
  const { mutate: deleteRole, isPending: isDeletingRole } =
    useDeleteRoleMutation();

  const queryClient = useQueryClient();

  const createRoleForm = CreateRoleValidation();
  const updateRoleForm = UpdateRoleValidation();

  const permissionLists = [
    { value: "create_role", label: "Create Role" },
    { value: "edit_role", label: "Edit Role" },
    { value: "delete_role", label: "Delete Role" },
  ];

  // Transform API data to permissions tree structure
  const permissionsTree = permissionGroupsData?.data?.map(group => ({
    id: group.groupId,
    name: group.name,
    children: group.permissions.map(permission => ({
      id: permission.permissionId,
      name: permission.name,
      description: permission.description
    }))
  })) || [];

  // Filter permissions based on search
  const filteredPermissions = permissionsTree.filter(permission =>
    permission.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
    permission.children.some(child =>
      child.name.toLowerCase().includes(permissionSearch.toLowerCase())
    )
  );

  // Toggle permission expansion
  const togglePermissionExpansion = (permissionId: string) => {
    const newExpanded = new Set(expandedPermissions);
    if (newExpanded.has(permissionId)) {
      newExpanded.delete(permissionId);
    } else {
      newExpanded.add(permissionId);
    }
    setExpandedPermissions(newExpanded);
  };

  // Toggle permission selection
  const togglePermissionSelection = (permissionName: string, parentPermission?: UIPermissionGroup) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionName)) {
      newSelected.delete(permissionName);
    } else {
      newSelected.add(permissionName);
    }
    
    // If this is a child permission, check if we need to update the parent
    if (parentPermission) {
      const allChildrenSelected = parentPermission.children.every((child: UIPermission) => 
        child.name === permissionName ? newSelected.has(permissionName) : newSelected.has(child.name)
      );
      
      if (allChildrenSelected) {
        newSelected.add(parentPermission.name);
      } else {
        newSelected.delete(parentPermission.name);
      }
    }
    
    setSelectedPermissions(newSelected);
  };

  // Check if all children of a permission are selected
  const areAllChildrenSelected = (permission: UIPermissionGroup) => {
    return permission.children.every((child: UIPermission) => selectedPermissions.has(child.name));
  };

  // Check if some children are selected (for indeterminate state)
  const areSomeChildrenSelected = (permission: UIPermissionGroup) => {
    return permission.children.some((child: UIPermission) => selectedPermissions.has(child.name));
  };

  // Toggle parent permission selection (selects/deselects all children)
  const toggleParentPermissionSelection = (permission: UIPermissionGroup) => {
    const newSelected = new Set(selectedPermissions);
    const isParentSelected = newSelected.has(permission.name);
    
    if (isParentSelected) {
      // If parent is selected, deselect parent and all children
      newSelected.delete(permission.name);
      permission.children.forEach((child: UIPermission) => {
        newSelected.delete(child.name);
      });
    } else {
      // If parent is not selected, select parent and all children
      newSelected.add(permission.name);
      permission.children.forEach((child: UIPermission) => {
        newSelected.add(child.name);
      });
    }
    
    setSelectedPermissions(newSelected);
  };

  const handleCreateRole = (values: CreateRolePayload) => {
    console.log("Form values:", values);
    console.log("Selected permissions:", Array.from(selectedPermissions));

    // Validate that at least one permission is selected
    if (selectedPermissions.size === 0) {
      toast.error("Please select at least one permission");
      return;
    }

    const payload = {
      ...values,
      permissionNames: Array.from(selectedPermissions)
    };

    console.log("API payload:", payload);
    console.log("About to call createRole mutation...");

    createRole(payload, {
      onSuccess: (data) => {
        console.log("Role created successfully:", data);
        queryClient.invalidateQueries({
          queryKey: getRolesQueryOptions().queryKey,
        });
        setOpenCreateModal(false);
        setSuccessMessage("Role Created Successfully");
        setOpenGroupSuccessful(true);
        createRoleForm.reset();
        setSelectedPermissions(new Set());
        setPermissionSearch("");
      },
      onError: (error: APIError) => {
        console.error("Role creation failed:", error);
        const message =
          error.response?.message || error.message || "Failed to create role";

        createRoleForm.setError("name", {
          type: "server",
          message,
        });

        toast.error(message);
      },
    });
  };

  // const handleUpdateRole = (values: CreateRolePayload) => {
  //   updateRole(values, {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({
  //         queryKey: getRolesQueryOptions().queryKey,
  //       });
  //       setEditRoleModal(false);
  //       setSuccessMessage("Role Updated Successfully");
  //       setOpenGroupSuccessful(true);
  //     },
  //     onError: (error: APIError) => {
  //       toast.error(error.response?.message || "Failed to update role");
  //     },
  //   });
  // };

  const handleEdit = (role: Role) => {
    updateRoleForm.setValue("name", role.name);
    updateRoleForm.setValue("description", role.description || "");
    // updateRoleForm.setValue("id", role.id);
    setEditRoleModal(true);
  };

  const handleDelete = (id: string) => {
    setRoleId(id);
    setDeleteRoleModal(true);
  };

  const handleDeleteRole = () => {
    deleteRole(roleId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getRolesQueryOptions().queryKey,
        });
        setDeleteRoleModal(false);
        setSuccessMessage("Role Deleted Successfully");
        setOpenGroupSuccessful(true);
      },
      onError: (error: APIError) => {
        toast.error(error.response?.message || "Failed to delete role");
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
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Play className="text-[#CCCCCC]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem className="text-[#464646]">
                <BreadcrumbPage>Role Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex gap-3">
            <Dialog
              open={openCreateModal}
              onOpenChange={(isOpen) => {
                setOpenCreateModal(isOpen);
                if (isOpen) {
                  createRoleForm.reset();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="cursor-pointer bg-[#0284B2] rounded-[5px] h-[48px] px-[20px] hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-[14px]">
                  <Plus />
                  Create Role
                </Button>
              </DialogTrigger>
              <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto"
              >
                <DialogHeader className="justify-between items-center flex-row">
                  <DialogTitle className="text-[#464646] text-[28px] font-[family-name:var(--font-dm)] font-[600]">
                    Create Role
                  </DialogTitle>
                  <DialogClose className="bg-white text-muted-foreground rounded-xs [&_svg:not([class*='size-'])]:size-4 cursor-pointer">
                    <XIcon className="size-[20px]" />
                  </DialogClose>
                </DialogHeader>
                <Form {...createRoleForm}>
                  <form
                    onSubmit={createRoleForm.handleSubmit(handleCreateRole)}
                  >
                    <FormField
                      control={createRoleForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="mt-6">
                          <FormLabel className="text-[#464646]">
                            Role Name
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

                    <FormField
                      control={createRoleForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="mt-6">
                          <FormLabel className="text-[#464646]">
                            Role Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className="focus-visible:ring-0 placeholder:text-[#909090] text-[#909090] text-[14px] font-[family-name:var(--font-poppins)]"
                              placeholder="Enter Description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Permissions Section */}
                    <div className="mt-6">
                      <h3 className="text-[#464646] font-[600] text-[16px] mb-4">
                        Permissions
                      </h3>
                      
                      {/* Search Bar */}
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search"
                          value={permissionSearch}
                          onChange={(e) => setPermissionSearch(e.target.value)}
                          className="pl-10 pr-8 h-[40px] text-[14px] font-[family-name:var(--font-poppins)]"
                        />
                        {permissionSearch && (
                          <button
                            onClick={() => setPermissionSearch("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <XIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Permissions Tree */}
                      <div className="border rounded-lg max-h-[300px] overflow-y-auto">
                        {isLoadingPermissionGroups ? (
                          <div className="p-4 text-center text-gray-500">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                            Loading permissions...
                          </div>
                        ) : filteredPermissions.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            No permissions found
                          </div>
                        ) : (
                          filteredPermissions.map((permission) => (
                          <div key={permission.id} className="border-b last:border-b-0">
                            {/* Parent Permission */}
                            <div className="flex items-center p-3 hover:bg-gray-50">
                              <button
                                onClick={() => togglePermissionExpansion(permission.id)}
                                className="mr-2 p-1 hover:bg-gray-200 rounded"
                              >
                                {expandedPermissions.has(permission.id) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </button>
                              <input
                                type="checkbox"
                                checked={selectedPermissions.has(permission.name)}
                                ref={(el) => {
                                  if (el) {
                                    el.indeterminate = areSomeChildrenSelected(permission) && !areAllChildrenSelected(permission);
                                  }
                                }}
                                onChange={() => toggleParentPermissionSelection(permission)}
                                className="mr-3 w-4 h-4 text-[#0284B2] focus:ring-[#0284B2] border-gray-300 rounded"
                              />
                              <span className="text-[#464646] font-[500] text-[14px]">
                                {permission.name}
                              </span>
                            </div>

                            {/* Child Permissions */}
                            {expandedPermissions.has(permission.id) && (
                              <div className="bg-gray-50">
                                {permission.children.map((child) => (
                                  <div key={child.id} className="flex items-center p-3 pl-12 hover:bg-gray-100">
                                    <input
                                      type="checkbox"
                                      checked={selectedPermissions.has(child.name)}
                                      onChange={() => togglePermissionSelection(child.name, permission)}
                                      className="mr-3 w-4 h-4 text-[#0284B2] focus:ring-[#0284B2] border-gray-300 rounded"
                                    />
                                    <span className="text-[#464646] font-[500] text-[14px]">
                                      {child.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )))}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="h-[58px] float-right mt-8 rounded-[8px] bg-[#0284B2] py-[16px] px-[12px] cursor-pointer hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-white flex items-center gap-2"
                      disabled={isCreatingRole}
                    >
                      {isCreatingRole && (
                        <Loader2 className="animate-spin w-5 h-5" />
                      )}
                      Create Role
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button className="cursor-pointer bg-[#04B2F1] rounded-[5px] h-[48px] px-[20px] hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-[14px]">
              <Download />
              Export Roles
            </Button>
          </div>
        </div>
        <div className="mt-[8px]">
          <h6 className="font-[family-name:var(--font-dm)] font-[600] text-[16px]">
            Roles
          </h6>
        </div>
      </div>

      {/* Content */}
      <div className="mt-[20px]">
        <div className="grid grid-cols-5 gap-3 items-center py-4 mb-[20px]">
          <div className="col-span-2 grid items-center gap-2">
            <Label htmlFor="keyword" className="text-left block">
              Keyword
            </Label>
            <div className="relative w-[350px]">
              <Search
                className="text-[#A9A9A9] absolute top-4 left-2"
                size={20}
              />
              <Input
                id="keyword"
                placeholder="Enter a keyword"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="max-w-md h-[50px] focus-visible:ring-0 rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)] pl-[35px] pr-[40px] text-[#A9A9A9] font-[500]"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword("")}
                  className="absolute top-4 right-2 text-white bg-[#6B7280] hover:bg-[#4B5563] rounded-full p-1 transition-colors"
                  type="button"
                >
                  <XIcon size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Date created filter */}
          <div className="col-span-1 grid items-center gap-2">
            <Label htmlFor="keyword" className="text-left block">
              Date Created
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-[50px] sm:justify-between focus-visible:ring-1 font-[family-name:var(--font-poppins)] text-[#3D4F5C]"
                >
                  Today <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="font-[family-name:var(--font-poppins)] text-[12px] w-[200px]"
              >
                <DropdownMenuCheckboxItem></DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status filter */}
          <div className="col-span-1 grid items-center gap-2">
            <Label htmlFor="keyword" className="text-left block">
              Status
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-[50px] sm:justify-between focus-visible:ring-1 font-[family-name:var(--font-poppins)] text-[#3D4F5C]"
                >
                  Active <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-full text-[12px] font-[family-name:var(--font-poppins)] w-[200px] text-[#3D4F5C]"
              >
                <DropdownMenuCheckboxItem>Active</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Inactive</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Date modified filter */}
          <div className="col-span-1 grid items-center gap-2">
            <Label htmlFor="keyword" className="text-left block">
              Date Modified
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-[50px] sm:justify-between focus-visible:ring-1 font-[family-name:var(--font-poppins)] text-[#3D4F5C]"
                >
                  Today <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="font-[family-name:var(--font-poppins)] text-[12px] w-[200px]"
              >
                <DropdownMenuCheckboxItem></DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <RolesTable
          data={roles?.data ?? []}
          isLoading={isLoadingRoles}
          onDeleteTableProp={handleDelete}
          onEditTableProp={handleEdit}
        />
      </div>

      {/* Edit Role */}
      <Dialog open={openEditRoleModal} onOpenChange={setEditRoleModal}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="sm:max-w-[600px] "
        >
          <DialogHeader className="justify-between items-center flex-row">
            <DialogTitle className="text-[#464646] text-[28px] font-[family-name:var(--font-dm)] font-[600]">
              Edit Role
            </DialogTitle>
            <DialogClose className="bg-white text-muted-foreground rounded-xs [&_svg:not([class*='size-'])]:size-4 cursor-pointer">
              <XIcon className="size-[20px]" />
            </DialogClose>
          </DialogHeader>
          <Form {...updateRoleForm}>
            <form>
              <FormField
                control={updateRoleForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel className="text-[#464646]">Role Name</FormLabel>
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

              <FormField
                control={updateRoleForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel className="text-[#464646]">
                      Role Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="focus-visible:ring-0 placeholder:text-[#909090] text-[#909090] text-[14px] font-[family-name:var(--font-poppins)]"
                        placeholder="Enter description"
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
                disabled={isUpdatingRole}
              >
                {isUpdatingRole && <Loader2 className="animate-spin w-5 h-5" />}
                Update role
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

      {/* Delete Role */}
      <Dialog open={openDeleteRoleModal} onOpenChange={setDeleteRoleModal}>
        <DialogContent className="sm:max-w-[533px]">
          <DialogHeader>
            <DialogTitle className="text-[#464646] font-[family-name:var(--font-dm)] font-[600]"></DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 justify-center text-center items-center gap-2 font-[family-name:var(--font-poppins)]">
              <h3 className="text-[28px] font-[600] text-[#464646]font-[family-name:var(--font-dm)]">
                Delete Role
              </h3>
              <h5 className="text-[20px] font-[500] text-[#464646] mt-[24px]">
                Are you sure you want to delete this role? This action cannot be
                undone.
              </h5>
              <p className="text-[14px] font-[500] text-[#FC5A5A] mt-[14px]">
                Disclaimer: Please note that once you delete a role, the role
                will no longer be available
              </p>
            </div>
          </div>
          <DialogFooter className="flex sm:justify-center">
            <Button
              type="button"
              className="rounded-[4px] text-white h-[48px] bg-[#FC5A5A] py-[20px] px-[34px] cursor-pointer hover:bg-[#FC5A5A] font-[family-name:var(--font-poppins)]"
              onClick={() => setDeleteRoleModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-[4px] bg-[#0284B2] py-[20px] px-[34px] cursor-pointer hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-white h-[48px]"
              onClick={handleDeleteRole}
              disabled={isDeletingRole}
            >
              {isDeletingRole && <Loader2 className="animate-spin w-5 h-5" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
