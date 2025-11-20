"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, UserPlus } from "lucide-react";

const inviteUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(11, "Phone number must be at least 11 characters")
    .max(15, "Phone number too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name too long"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  otherName: z.string().max(50, "Other name too long").optional(),
  departmentId: z.string().min(1, "Department is required"),
  role: z.string().min(1, "Role is required"),
});

type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

// Mock data for testing without API
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

export default function InviteUserCard() {
  const [isInvitingUser, setIsInvitingUser] = useState(false);

  const form = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      phoneNumber: "",
      lastName: "",
      firstName: "",
      otherName: "",
      departmentId: "",
      role: "",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = async (_values: InviteUserFormValues) => {
    setIsInvitingUser(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("User invited successfully!");
      form.reset();
      setIsInvitingUser(false);
    }, 1500);
  };

  return (
    <Card className="w-full shadow-lg border-2 border-[#E7E7E7] hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-[#0284B2]/5 to-transparent border-b border-[#E7E7E7]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0284B2]/10 rounded-lg">
            <UserPlus className="h-6 w-6 text-[#0284B2]" />
          </div>
          <div>
            <CardTitle className="text-[#464646] text-2xl font-[family-name:var(--font-dm)] font-bold">
              Invite User
            </CardTitle>
            <CardDescription className="font-[family-name:var(--font-poppins)] mt-1">
              Add a new user to your system
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#464646] font-[family-name:var(--font-poppins)]">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter first name"
                        className="h-[48px] text-[#464646] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#464646] font-[family-name:var(--font-poppins)]">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter last name"
                        className="h-[48px] text-[#464646] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="otherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#464646] font-[family-name:var(--font-poppins)]">
                    Other Name (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter other name"
                      className="h-[48px] text-[#464646] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#464646] font-[family-name:var(--font-poppins)]">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter a valid email address"
                      className="h-[48px] text-[#464646] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#464646] font-[family-name:var(--font-poppins)]">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter phone number"
                      className="h-[48px] text-[#464646] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#464646] font-[family-name:var(--font-poppins)]">
                      Department
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-[48px] w-full font-[family-name:var(--font-poppins)] text-[#464646]">
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
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#464646] font-[family-name:var(--font-poppins)]">
                      Role
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-[48px] w-full font-[family-name:var(--font-poppins)] text-[#464646]">
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

            <Button
              type="submit"
              className="w-full h-[48px] rounded-[8px] bg-[#0284B2] hover:bg-[#0284B2]/90 font-[family-name:var(--font-poppins)] text-white"
              disabled={isInvitingUser}
            >
              {isInvitingUser && (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              )}
              {isInvitingUser ? "Inviting..." : "Invite User"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

