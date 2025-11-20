"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export const ForgotPasswordValidation = () =>
  useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
