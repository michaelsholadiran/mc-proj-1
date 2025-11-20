"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const createPermissionGroupSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const CreatePermissionGroupValidation = () =>
  useForm<z.infer<typeof createPermissionGroupSchema>>({
    resolver: zodResolver(createPermissionGroupSchema),
    defaultValues: {
      name: "",
    },
  });

export const updatePermissionGroupSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const UpdatePermissionGroupValidation = () =>
  useForm<z.infer<typeof updatePermissionGroupSchema>>({
    resolver: zodResolver(updatePermissionGroupSchema),
    defaultValues: {
      name: "",
    },
  });
