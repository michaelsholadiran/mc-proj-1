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
import {
  ChevronDown,
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
import { useState } from "react";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useInviteUserForm, InviteUserFormValues } from "@/schemas/inviteUserSchema";
import { toast } from "sonner";
import { UserManagementDataTable } from "@/components/layout/tables/usersTable";
import { User } from "@/types";

// Mock data for testing
const mockDepartments = [
  { departmentId: "1", departmentName: "IT" },
  { departmentId: "2", departmentName: "HR" },
  { departmentId: "3", departmentName: "Finance" },
  { departmentId: "4", departmentName: "Operations" },
];

const mockRoles = [
  { id: "1", name: "Super Admin" },
  { id: "2", name: "Admin" },
  { id: "3", name: "User" },
  { id: "4", name: "Manager" },
];

// Mock user data for testing
const generateMockUsers = (): User[] => {
  const statuses = ["Active", "PendingInvite", "Inactive", "Temporary"];
  const rolesList = ["Super Admin", "Admin", "User", "Manager"];
  const users: User[] = [];

  for (let i = 1; i <= 25; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    
    users.push({
      id: `user-${i}`,
      firstName: `John`,
      lastName: `Doe${i}`,
      email: `user${i}@example.com`,
      phoneNumber: `0801234567${String(i).padStart(2, '0')}`,
      username: `user${i}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      roles: [rolesList[Math.floor(Math.random() * rolesList.length)]],
      departmentId: String(Math.floor(Math.random() * 4) + 1),
      role: rolesList[Math.floor(Math.random() * rolesList.length)],
      createdDate: date.toISOString(),
      otherName: i % 3 === 0 ? `Middle${i}` : undefined,
      defaultRole: rolesList[Math.floor(Math.random() * rolesList.length)],
      userType: "Standard",
    });
  }

  return users;
};

export default function InviteUserPage() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [isInvitingUser, setIsInvitingUser] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date } | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading] = useState(false);

  const inviteUserForm = useInviteUserForm();

  // Mock data
  const allUsers = generateMockUsers();
  // const totalPages = Math.ceil(allUsers.length / 10); // Not used, calculated in mockUsersData

  // Filter data based on filters
  const filteredUsers = allUsers.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email?.toLowerCase() || "";
    const searchLower = searchKeyword.toLowerCase();
    
    if (searchKeyword && !fullName.includes(searchLower) && !email.includes(searchLower)) {
      return false;
    }
    if (statusFilter !== "all" && user.status !== statusFilter) {
      return false;
    }
    if (roleFilter !== "all" && user.role !== roleFilter) {
      return false;
    }
    if (dateRange?.from && dateRange?.to) {
      const userDate = new Date(user.createdDate || "");
      if (userDate < dateRange.from || userDate > dateRange.to) {
        return false;
      }
    }
    return true;
  });

  // Paginate data
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * 10, currentPage * 10);

  // Mock API response structure
  const mockUsersData = {
    data: {
      data: paginatedUsers,
      totalPages: Math.ceil(filteredUsers.length / 10),
      totalCount: filteredUsers.length,
      pageNumber: currentPage,
      pageSize: 10,
    },
    isSuccessful: true,
    message: "Success",
    code: "200",
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCreateUser = (_values: InviteUserFormValues) => {
    setIsInvitingUser(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("User invited successfully!");
      setOpenCreateModal(false);
      inviteUserForm.reset();
      setIsInvitingUser(false);
    }, 1500);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "status") {
      setStatusFilter(value);
    } else if (filterType === "role") {
      setRoleFilter(value);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (user: User) => {
    // Handle edit - can be implemented later
    toast.info(`Edit user: ${user.firstName} ${user.lastName}`);
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
                <BreadcrumbPage>Invite User</BreadcrumbPage>
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
                                  <SelectTrigger className="py-[28px] w-full font-[family-name:var(--font-poppins)] text-[#464646]">
                                    <SelectValue placeholder="Select department" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="font-[family-name:var(--font-poppins)]">
                                  {mockDepartments.map((department) => (
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
                                  <SelectTrigger className="py-[28px] w-full font-[family-name:var(--font-poppins)] text-[#464646]">
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="font-[family-name:var(--font-poppins)]">
                                  {mockRoles.map((role) => (
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
                  className="cursor-pointer bg-[#04B2F1] rounded-[5px] h-[48px] px-[20px] hover:bg-[#0284B2] font-[family-name:var(--font-poppins)] text-[14px] flex items-center gap-2"
                >
                  <Download />
                  Export Users
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 font-[family-name:var(--font-poppins)]">
                <DropdownMenuItem
                  onSelect={() => toast.success("Exporting as CSV...")}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => toast.success("Exporting as Excel...")}
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
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="h-[50px] focus-visible:ring-0 rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)] pl-[35px] pr-[40px] text-[#A9A9A9] font-[500] border-[#CCCCCC80] focus-visible:border-[#CCCCCC80]"
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
                {mockRoles.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <UserManagementDataTable
          data={mockUsersData}
          isLoading={isLoading}
          onEditTableProp={handleEdit}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}
