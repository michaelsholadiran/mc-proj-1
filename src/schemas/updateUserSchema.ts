import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const updateUserSchema = z.object({
  firstName: z.string().min(1, "First name is required").min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(1, "Last name is required").min(2, "Last name must be at least 2 characters"),
  otherName: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phoneNumber: z.string().min(1, "Phone number is required").min(10, "Phone number must be at least 10 digits"),
  departmentId: z.string().min(1, "Department is required"),
  role: z.string().min(1, "Role is required"),
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

export function useUpdateUserForm() {
  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      otherName: "",
      email: "",
      phoneNumber: "",
      departmentId: "",
      role: "",
    },
  });

  return form;
}
