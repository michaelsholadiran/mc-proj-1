"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Current password is required.",
    }),
    newPassword: z.string().min(1, {
      message: "Enter Password.",
    }),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      return data.newPassword === data.confirmPassword;
    },
    {
      message: "Password does not match",
      path: ["confirmPassword"],
    }
  );

export const ChangePasswordValidation = () =>
  useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
