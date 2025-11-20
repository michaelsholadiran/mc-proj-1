"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const forgotPasswordCodeVerificationSchema = z.object({
  code: z
    .string()
    .min(6, { message: "Verification code must be at least 6 characters" })
    .max(6, { message: "Verification code must be exactly 6 characters" })
    .regex(/^\d+$/, { message: "Verification code must contain only numbers" }),
});

export const ForgotPasswordCodeVerificationValidation = () =>
  useForm<z.infer<typeof forgotPasswordCodeVerificationSchema>>({
    resolver: zodResolver(forgotPasswordCodeVerificationSchema),
    defaultValues: {
      code: "",
    },
  });
