"use client";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock } from "lucide-react";
import LoaderButton from "@/components/ui/loading-button";
import { useRouter } from "next/navigation";
import {
  resetPasswordSchema,
  ResetPasswordValidation,
} from "@/schemas/resetPasswordSchema";
import { useResetPasswordMutation } from "@/query-options/authenticationQueryOption";
import { APIError } from "@/types";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import PasswordValidation from '@/components/forms/PasswordValidation';


export default function ResetPassword() {
  const [passwordType, setPasswordType] = useState("password");
  const [passwordConfirmType, setPasswordConfirmType] = useState("password");
  const form = ResetPasswordValidation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { mutate: resetPassword, isPending: isResettingPassword } =
    useResetPasswordMutation();

  const togglePasswordVisibility = () => {
    if (passwordType === "password") return setPasswordType("text");
    return setPasswordType("password");
  };

  const togglePasswordConfirmVisibility = () => {
    if (passwordConfirmType === "password")
      return setPasswordConfirmType("text");
    return setPasswordConfirmType("password");
  };

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    form.clearErrors();

    const username = searchParams.get("email");
    const passwordResetToken = searchParams.get("passwordResetToken");
    const retrievalCode = searchParams.get("retrievalCode");
    const otp = searchParams.get("code");

    if (!username || !passwordResetToken || !retrievalCode || !otp) {
      form.setError("root", {
        type: "manual",
        message:
          "Required parameters are missing. Please use the correct link from your email.",
      });
      return;
    }

    const payload = {
      username,
      passwordResetToken,
      newPassword: values.newPassword,
      validationReference: retrievalCode
    };

    resetPassword(payload, {
      onSuccess: () => {
        if (searchParams.get("redirectfrom") === "crm") {
          window.location.href = "https://crm-ticket-dev.digitvant.com/login";
        } else {
          router.push("/reset-password-successful");
        }
      },
      onError: (error: APIError) => {
        const message =
          error.response?.message ||
          error.message ||
          "Failed to reset password";

        form.setError("root", {
          type: "manual",
          message,
        });

        toast.error(message);
      },
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-[#0284B2] max-h-[100vh] gap-4 font-[family-name:var(--font-dm)] px-[1rem] md:px-[2rem]">
      <div className="bg-white max-h-full h-full hidden md:block">
        <div className="h-full md:flex flex-col justify-center items-center">
          <Image
            src="/illustrations/reset-password/reset-password.svg"
            alt="reset password screen"
            width={500}
            height={550}
            className="-translate-y-[50px]"
          />
        </div>
        <div className="font-[family-name:var(--font-dm)] text-center -translate-y-[170%]">
          <h4 className="font-[family-name:var(--font-dm)] text-center text-[#0284B2] text-[30px] font-[700] mb-[13px]">
            Change Password
          </h4>
          <p className="font-[family-name:var(--font-dm)] text-[18px] text-[#0284B2]">
            We are happy to have you onboard.
          </p>
          <p className="w-[260px] mx-auto font-[family-name:var(--font-dm)] text-[18px] text-[#0284B2]">
            Kindly change your password to stay connected.
          </p>
        </div>
      </div>
      <div className="bg-white text-center flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center h-[500px] w-[70%] my-auto mx-auto">
          <div className="mb-[50px] relative w-full">
            <Image
              src="/logo-text.svg"
              alt="credlanche logo"
              height={55}
              width={180}
              className="mx-auto"
            />
          </div>

          <div className="relative font-[family-name:var(--font-dm)] w-full">
            <h3 className="text-[#0284B2] text-[30px] font-[700]">
              Reset your password
            </h3>

            {form.formState.errors.root && (
              <div className="bg-red-100 text-red-700 rounded px-4 py-2 my-4 text-sm">
                {form.formState.errors.root.message}
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full mt-[48px] text-left"
              >
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="font-[family-name:var(--font-dm)] mb-[24px]">
                      <FormControl>
                        <div className="relative">
                          <Lock
                            size={18}
                            className="absolute left-[15px] top-[30%] cursor-pointer text-[#A9A9A9]"
                          />
                          <Input
                            placeholder="Enter password"
                            className="pl-[42px] font-[500] text-[#A9A9A9] h-[56px] rounded-[4px] border-[1px] border-[#D3D3D3] focus-visible:ring-[1px] placeholder:text-[#A9A9A9] focus-visible:ring-[#0284B2]"
                            type={passwordType}
                            {...field}
                          />
                          {passwordType === "password" ? (
                            <Eye
                              size={20}
                              className="absolute right-[15px] top-[30%] cursor-pointer"
                              onClick={() => togglePasswordVisibility()}
                            />
                          ) : (
                            <EyeOff
                              size={20}
                              className="absolute right-[15px] top-[30%] cursor-pointer"
                              onClick={() => togglePasswordVisibility()}
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="font-[family-name:var(--font-dm)]">
                      <FormControl>
                        <div className="relative">
                          <Lock
                            size={18}
                            className="absolute left-[15px] top-[30%] cursor-pointer text-[#A9A9A9]"
                          />
                          <Input
                            placeholder="Confirm your password"
                            className="h-[56px] font-[500] pl-[42px] text-[#A9A9A9] rounded-[4px] border-[1px] border-[#D3D3D3] focus-visible:ring-[1px] placeholder:text-[#A9A9A9] focus-visible:ring-[#0284B2]"
                            type={passwordConfirmType}
                            {...field}
                          />
                          {passwordConfirmType === "password" ? (
                            <Eye
                              size={20}
                              className="absolute right-[15px] top-[30%] cursor-pointer"
                              onClick={() => togglePasswordConfirmVisibility()}
                            />
                          ) : (
                            <EyeOff
                              size={20}
                              className="absolute right-[15px] top-[30%] cursor-pointer"
                              onClick={() => togglePasswordConfirmVisibility()}
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="my-[16px] text-right">
                  <Link
                    href="/forgot-password"
                    className="text-[#464646] cursor-pointer font-[family-name:var(--font-dm)] text-[14px] text-right"
                  >
                    Forgot password?
                  </Link>
                </div>

                <LoaderButton
                  buttonText="Reset Password"
                  isLoading={isResettingPassword}
                  className="w-full bg-[#0284B2] hover:bg-[#0284B2] text-center h-[50px] mt-[15px] font-[family-name:var(--font-dm)]"
                />
                <PasswordValidation fieldNames={["newPassword", "confirmPassword"]} />
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
