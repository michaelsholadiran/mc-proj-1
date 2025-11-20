"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const inviteUserSchema = z.object({
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

export type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

export const useInviteUserForm = () =>
  useForm<InviteUserFormValues>({
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
