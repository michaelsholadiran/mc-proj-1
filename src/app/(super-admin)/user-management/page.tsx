"use client";

import { Suspense } from "react";
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
import { ChangeEvent, useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import {

  UserManagementDataTable,
} from "@/components/layout/tables/usersTable";

import {
  useInviteUserForm,
  InviteUserFormValues,
} from "@/schemas/inviteUserSchema";
import {
  useUpdateUserForm,
  UpdateUserFormValues,
} from "@/schemas/updateUserSchema";
import { useInviteUserMutation, getUsersQueryOptions, useExportUsersMutation, useUpdateUserMutation } from "@/query-options/usersQueryOption";
import { UsersQueryParams } from "@/types";
import { getDepartmentsQueryOptions } from "@/query-options/departmentsQueryOption";
import { getRolesQueryOptions } from "@/query-options/rolesQueryOption";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { APIError, Department, InviteUserPayload, UpdateUserPayload, User } from "@/types";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_PAGE_SIZE } from "@/constants/api";

function UserManagementPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openGroupSuccessModal, setOpenGroupSuccessful] = useState(false);
  const [openEditPermissionModal, setEditPermissionModal] = useState(false);
  const [openDeletePermissionModal, setDeletePermissionModal] = useState(false);
  const [userDetails, setUserDetails] = useState({} as User);
  const [permissionId, setPermissionId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Filter states - initialize from URL params
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date } | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get("status") || "all"
  );
  const [roleFilter, setRoleFilter] = useState<string>(
    searchParams.get("role") || "all"
  );
  const [searchKeyword, setSearchKeyword] = useState<string>(
    searchParams.get("username") || ""
  );
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get("page") || "1")
  );
  const [pageSize, setPageSize] = useState<number>(
    parseInt(searchParams.get("pageSize") || DEFAULT_PAGE_SIZE.toString())
  );

  // Build query parameters for API
  const buildQueryParams = useCallback((): UsersQueryParams => {
    const params: UsersQueryParams = {
      pageNumber: currentPage,
      pageSize: pageSize,
      searchKeyword: searchKeyword || undefined,
    };

    // Add date filters
    if (dateRange?.from && dateRange?.to) {
      params.startDate = dateRange.from.toISOString().split('T')[0];
      params.endDate = dateRange.to.toISOString().split('T')[0];
    }

    // Add status filter only if not default "all"
    if (statusFilter !== "all") {
      params.status = statusFilter;
    }

    // Add role filter only if not default "all"
    if (roleFilter !== "all") {
      params.role = roleFilter;
    }

    return params;
  }, [dateRange, statusFilter, roleFilter, searchKeyword, currentPage, pageSize]);

  // Update URL when filters change
  const updateURL = useCallback((params: Partial<UsersQueryParams>) => {
    const newSearchParams = new URLSearchParams();
    
    // Only add parameters that differ from defaults
    if (params.pageNumber !== undefined && params.pageNumber !== 1) {
      newSearchParams.set("page", params.pageNumber.toString());
    }
    if (params.pageSize !== undefined && params.pageSize !== DEFAULT_PAGE_SIZE) {
      newSearchParams.set("pageSize", params.pageSize.toString());
    }
    if (params.searchKeyword !== undefined && params.searchKeyword !== "") {
      newSearchParams.set("username", params.searchKeyword);
    }
    if (params.status !== undefined && params.status !== "all") {
      newSearchParams.set("status", params.status);
    }
    if (params.role !== undefined && params.role !== "all") {
      newSearchParams.set("role", params.role);
    }
    if (params.startDate !== undefined && params.endDate !== undefined) {
      newSearchParams.set("startDate", params.startDate);
      newSearchParams.set("endDate", params.endDate);
    }
    
    // Only update URL if there are parameters to add
    const queryString = newSearchParams.toString();
    if (queryString) {
      router.push(`?${queryString}`);
    } else {
      // If no parameters, just go to the base route
      router.push("/user-management");
    }
  }, [router]);

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case "status":
        setStatusFilter(value);
        break;
      case "role":
        setRoleFilter(value);
        break;
    }
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle search
  const handleSearchChange = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  // Update URL when any filter changes
  useEffect(() => {
    const params = buildQueryParams();
    updateURL(params);
  }, [dateRange, statusFilter, roleFilter, searchKeyword, currentPage, pageSize, buildQueryParams, updateURL]);

  const queryParams = buildQueryParams();

  const { data: departments, isLoading: isLoadingDepartments } = useQuery(
    getDepartmentsQueryOptions()
  );
  const { data: roles, isLoading: isLoadingRoles } = useQuery(
    getRolesQueryOptions()
  );
  const { data: users, isLoading: isLoadingUsers, isFetching: isFetchingUsers } = useQuery(
    getUsersQueryOptions(queryParams)
  );
  

  const { mutate: inviteUser, isPending: isInvitingUser } =
    useInviteUserMutation();
  const { mutate: exportUsers, isPending: isExportingUsers } =
    useExportUsersMutation();
  const { mutate: updateUser, isPending: isUpdatingUser } =
    useUpdateUserMutation();
  const QueryClient = useQueryClient();

  const inviteUserForm = useInviteUserForm();
  const updateUserForm = useUpdateUserForm();

  const handleCreateUser = (values: InviteUserFormValues) => {
    const payload: InviteUserPayload = {
      ...values,
      otherName: values.otherName || "",
    };

    inviteUser(payload, {
      onSuccess: () => {
        QueryClient.invalidateQueries({
          queryKey: getUsersQueryOptions().queryKey,
        });
        setOpenCreateModal(false);
        setSuccessMessage("User Created Successfully");
        setOpenGroupSuccessful(true);
        inviteUserForm.reset();
      },
      onError: (error: APIError) => {
        const message =
          error.response?.message || error.message || "Failed to create user";

        inviteUserForm.setError("email", {
          type: "server",
          message,
        });

        toast.error(message);
      },
    });
  };

  const handleUpdateUser = (values: UpdateUserFormValues) => {
    if (!userDetails.id) {
      toast.error("User ID not found");
      return;
    }

    const payload: UpdateUserPayload = {
      email: values.email,
      phoneNumber: values.phoneNumber,
      lastName: values.lastName,
      firstName: values.firstName,
      otherName: values.otherName || "",
      departmentId: values.departmentId,
      role: values.role,
    };

    updateUser({ userId: userDetails.id, data: payload }, {
      onSuccess: () => {
        QueryClient.invalidateQueries({
          queryKey: getUsersQueryOptions().queryKey,
        });
        setEditPermissionModal(false);
        setSuccessMessage("User Updated Successfully");
        setOpenGroupSuccessful(true);
        updateUserForm.reset();
      },
      onError: (error: APIError) => {
        const message = error.response?.message || error.message || "Failed to update user";
        toast.error(message);
      },
    });
  };

  const handleDelete = (id: string) => {
    setPermissionId(id);
    // perform delete logic here (API call, state update, etc.)
    setDeletePermissionModal(true);
  };

  const handleEdit = (user: User) => {
    console.log("Editing row with id:", user.id);
    setUserDetails(user);
    
    // Populate form with user data
    updateUserForm.reset({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      otherName: user.otherName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      departmentId: user.departmentId || "",
      role: user.role || "",
    });
    
    setEditPermissionModal(true);
  };

  const deletePermsissionGroup = () => {
    setDeletePermissionModal(false);
    setSuccessMessage("User Deleted Successfully");
    setOpenGroupSuccessful(true);
  };

  const handleExportUsers = (format: 'csv' | 'xlsx') => {
    const exportParams: UsersQueryParams = {
      startDate: dateRange?.from ? dateRange.from.toISOString().split('T')[0] : undefined,
      endDate: dateRange?.to ? dateRange.to.toISOString().split('T')[0] : undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      role: roleFilter !== "all" ? roleFilter : undefined,
      searchKeyword: searchKeyword || undefined,
    };

    exportUsers({ params: exportParams, format }, {
      onSuccess: (blob) => {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Set file extension based on format
        const extension = format === 'csv' ? 'csv' : 'xlsx';
        link.download = `users-export-${new Date().toISOString().split('T')[0]}.${extension}`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success(`Users exported as ${format.toUpperCase()} successfully`);
      },
      onError: (error: APIError) => {
        const message = error.response?.message || error.message || "Failed to export users";
        toast.error(message);
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
                <BreadcrumbPage>User Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex gap-3">
            <Dialog
              open={openCreateModal}
              onOpenChange={(isOpen) => {
                setOpenCreateModal(isOpen);
                if (isOpen) {
                  inviteUserForm.reset();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button disabled className="cursor-pointer bg-[#0284B2] rounded-[5px] h-[48px] px-[20px] hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-[14px]">
                  <Plus />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="sm:max-w-[600px]"
              >
                <DialogHeader className="justify-between items-center flex-row">
                  <DialogTitle className="text-[#464646] text-[28px] font-[family-name:var(--font-dm)] font-[600]">
                    Create User
                  </DialogTitle>
                  <DialogClose className="bg-white text-muted-foreground rounded-xs [&_svg:not([class*='size-'])]:size-4 cursor-pointer">
                    <XIcon className="size-[20px]" />
                  </DialogClose>
                </DialogHeader>

                <Form {...inviteUserForm}>
                  <form
                    onSubmit={inviteUserForm.handleSubmit(handleCreateUser)}
                  >
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={inviteUserForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#464646]">
                                First Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter first name"
                                  className="h-[56px] text-[#464646] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={inviteUserForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#464646]">
                                Last Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter last name"
                                  className="h-[56px] text-[#464646] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={inviteUserForm.control}
                        name="otherName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#464646]">
                              Other Name (Optional)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter other name"
                                className="h-[56px] text-[#464646] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={inviteUserForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#464646]">
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter a valid email address"
                                className="h-[56px] text-[#464646] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={inviteUserForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#464646]">
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter phone number"
                                className="h-[56px] text-[#464646] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={inviteUserForm.control}
                          name="departmentId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#464646]">
                                Department
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className=" py-[28px]  w-full font-[family-name:var(--font-poppins)] text-[#464646]">
                                    <SelectValue placeholder="Select department" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="font-[family-name:var(--font-poppins)]">
                                  {departments?.data.map(
                                    (department: Department) => (
                                      <SelectItem
                                        key={department.departmentId}
                                        value={department.departmentId}
                                      >
                                        {department.departmentName}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={inviteUserForm.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#464646]">
                                Role
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className=" py-[28px]  w-full font-[family-name:var(--font-poppins)] text-[#464646]">
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="font-[family-name:var(--font-poppins)]">
                                  {roles?.data?.map((role) => (
                                    <SelectItem key={role.id} value={role.name}>
                                      {role.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        className="h-[58px] float-right mt-8 rounded-[8px] bg-[#0284B2] py-[16px] px-[12px] cursor-pointer hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-white flex items-center gap-2"
                        disabled={true}
                      >
                        {isInvitingUser && (
                          <Loader2 className="animate-spin w-5 h-5" />
                        )}
                        Create User
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  disabled={isExportingUsers}
                  className="cursor-pointer bg-[#04B2F1] rounded-[5px] h-[48px] px-[20px] hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-[14px] flex items-center gap-2"
                >
                  {isExportingUsers ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <Download />
                  )}
                  Export Users
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 font-[family-name:var(--font-poppins)]">
                <DropdownMenuItem
                  onSelect={() => handleExportUsers('csv')}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleExportUsers('xlsx')}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  Export as Excel (.xlsx)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-[8px]">
          <h6 className="font-[family-name:var(--font-dm)] font-[600] text-[16px]">
            Users
          </h6>
        </div>
      </div>

      {/* Content */}
      <div className="mt-[20px]">
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-3 items-center py-4 mb-[20px]">
          <div className="w-full lg:col-span-1 grid items-center gap-2">
            <Label htmlFor="keyword" className="text-left block text-[#464646]">
              Keyword
            </Label>
            <div className="relative">
              <Search
                className="text-[#A9A9A9] absolute top-4 left-2"
                size={20}
              />
              <Input
                id="keyword"
                placeholder="Enter a keyword"
                value={searchKeyword}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-[50px] focus-visible:ring-0 rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)] pl-[35px] pr-[40px] text-[#A9A9A9] font-[500] border-[#CCCCCC80] focus-visible:border-[#CCCCCC80]"
              />
              {searchKeyword && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute top-4 right-2 text-white bg-[#6B7280] hover:bg-[#4B5563] rounded-full p-1 transition-colors"
                  type="button"
                >
                  <XIcon size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Date created filter */}
          <div className="w-full lg:col-span-2 grid items-center gap-2">
            <Label htmlFor="dateCreated" className="text-left block text-[#464646]">
              Date Created
            </Label>
            <DatePickerWithRange
              value={dateRange}
              onChange={(newDateRange) => {
                setDateRange(newDateRange);
                // Reset to first page when clearing date filter
                if (!newDateRange) {
                  setCurrentPage(1);
                }
              }}
              placeholder="Select date range"
              className="!h-[50px] lg:text-[11px] xl:text-[16px] w-full font-[family-name:var(--font-poppins)] text-[#3D4F5C] focus-visible:ring-0 flex items-center border-[#CCCCCC80] focus-visible:border-[#CCCCCC80] rounded-[8px]"
            />
          </div>

          {/* Status filter */}
          <div className="w-full lg:col-span-1 grid items-center gap-2">
            <Label htmlFor="status" className="text-left block text-[#464646]">
              Status
            </Label>
            <Select
              value={statusFilter}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="!h-[50px] w-full font-[family-name:var(--font-poppins)] text-[#3D4F5C] focus-visible:ring-0 border-[#CCCCCC80] focus-visible:border-[#CCCCCC80] rounded-[8px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="font-[family-name:var(--font-poppins)] text-[12px] w-[200px]">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PendingInvite">Pending Invite</SelectItem>
                <SelectItem value="Temporary">Temporary</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Locked">Locked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Role filter */}
          <div className="w-full lg:col-span-1 grid items-center gap-2">
            <Label htmlFor="role" className="text-left block text-[#464646]">
              Role
            </Label>
            <Select
              value={roleFilter}
              onValueChange={(value) => handleFilterChange("role", value)}
            >
              <SelectTrigger className="!h-[50px] w-full font-[family-name:var(--font-poppins)] text-[#3D4F5C] focus-visible:ring-0 border-[#CCCCCC80] focus-visible:border-[#CCCCCC80] rounded-[8px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="font-[family-name:var(--font-poppins)] text-[12px] w-[200px]">
                <SelectItem value="all">All Roles</SelectItem>
                {roles?.data?.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <UserManagementDataTable
          data={users}
          isLoading={isLoadingUsers}
          onEditTableProp={handleEdit}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      </div>

      {/* Edit User */}
      <Dialog
        open={openEditPermissionModal}
        onOpenChange={(isOpen) => {
          setEditPermissionModal(isOpen);
          if (!isOpen) {
            updateUserForm.reset();
          }
        }}
      >
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="sm:max-w-[600px]"
        >
          <DialogHeader className="justify-between items-center flex-row">
            <DialogTitle className="text-[#464646] text-[28px] font-[family-name:var(--font-dm)] font-[600]">
              Edit User
            </DialogTitle>
            <DialogClose className="bg-white text-muted-foreground rounded-xs [&_svg:not([class*='size-'])]:size-4 cursor-pointer">
              <XIcon className="size-[20px]" />
            </DialogClose>
          </DialogHeader>
          <Form {...updateUserForm}>
            <form onSubmit={updateUserForm.handleSubmit(handleUpdateUser)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={updateUserForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#464646]">
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter first name"
                            className="h-[56px] text-[#464646] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={updateUserForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#464646]">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter last name"
                            className="h-[56px] text-[#464646] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={updateUserForm.control}
                  name="otherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#464646]">
                        Other Name (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter other name"
                          className="h-[56px] text-[#464646] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={updateUserForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#464646]">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter a valid email address"
                          className="h-[56px] text-[#464646] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={updateUserForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#464646]">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter phone number"
                          className="h-[56px] text-[#464646] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={updateUserForm.control}
                    name="departmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#464646]">
                          Department
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="!h-[56px] w-full font-[family-name:var(--font-poppins)] text-[#464646] focus-visible:ring-[1px]">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="font-[family-name:var(--font-poppins)]">
                            {departments?.data.map((department: Department) => (
                              <SelectItem
                                key={department.departmentId}
                                value={department.departmentId}
                              >
                                {department.departmentName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={updateUserForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#464646]">
                          Role
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="!h-[56px] w-full font-[family-name:var(--font-poppins)] text-[#464646] focus-visible:ring-[1px]">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="font-[family-name:var(--font-poppins)]">
                            {roles?.data?.map((role) => (
                              <SelectItem key={role.id} value={role.name}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="h-[58px] float-right mt-8 rounded-[8px] bg-[#0284B2] py-[16px] px-[12px] cursor-pointer hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-white flex items-center gap-2"
                  disabled={isUpdatingUser}
                >
                  {isUpdatingUser && (
                    <Loader2 className="animate-spin w-5 h-5" />
                  )}
                  Update User
                </Button>
              </DialogFooter>
            </form>
          </Form>
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
                Delete User
              </h3>
              <h5 className="text-[18px] font-[500] text-[#464646] mt-[24px] text-[#464646]">
                Are you sure you want to delete this user? This action cannot be
                undone.
              </h5>
              <p className="text-[12px] font-[500] text-[#FC5A5A] mt-[14px]">
                Disclaimer: Please note that once you delete a user, the user
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

export default function UserManagementPage() {
  return (
    <Suspense fallback={
      <div className="px-[1rem] md:px-[2rem]">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-64 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    }>
      <UserManagementPageContent />
    </Suspense>
  );
}
