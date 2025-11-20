"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

export const CreateRoleValidation = () =>
  useForm<z.infer<typeof createRoleSchema>>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: "",
      description: "",
      // permissions: [],
    },
  });

export const updateRoleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  permissionNames: z.array(z.string()).optional(),
});

export const UpdateRoleValidation = () =>
  useForm<z.infer<typeof updateRoleSchema>>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      name: "",
      description: "",
      // permissions: [],
    },
  });
