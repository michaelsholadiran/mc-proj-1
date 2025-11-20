"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().email(),
  password: z
    .string({ errorMap: () => ({ message: "Password is required" }) })
    .min(1),
});

export const LoginValidation = () =>
  useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
