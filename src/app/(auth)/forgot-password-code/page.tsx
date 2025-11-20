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
import Link from "next/link";
import { Shield } from "lucide-react";
import LoaderButton from "@/components/ui/loading-button";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useVerifyOtpMutation } from "@/query-options/authenticationQueryOption";
import { useInitiatePasswordResetMutation } from "@/query-options/authenticationQueryOption";
import { toast } from "sonner";
import React, { useEffect, useState } from 'react';

const codeVerificationSchema = z.object({
  code: z.string().min(1, {
    message: "Code is required.",
  }),
});

const CodeVerificationValidation = () =>
  useForm<z.infer<typeof codeVerificationSchema>>({
    resolver: zodResolver(codeVerificationSchema),
    defaultValues: {
      code: "",
    },
  });

export default function ForgotPasswordCode() {
  const form = CodeVerificationValidation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: verifyOtp, status } = useVerifyOtpMutation();
  const isVerifying = status === 'pending';

  const onSubmit = async (values: z.infer<typeof codeVerificationSchema>) => {
    const retrievalCode = searchParams.get("retrievalCode");

    if (!retrievalCode) {
      form.setError("code", { type: "manual", message: "Retrieval code missing." });
      return;
    }

    verifyOtp({
      retrievalCode,
      otpCode: values.code,
    }, {
      onSuccess: () => {
        const existingParams = new URLSearchParams(searchParams.toString());
        existingParams.set("code", values.code);
        router.push(`/reset-password?${existingParams.toString()}`);
      },
      onError: (error) => {
        const errorMessage = error?.response?.message || "Verification failed.";
        form.setError("code", { type: "manual", message: errorMessage });
        toast(errorMessage);
      },
    });
  };

  const { mutate: resendOtp, status: resendStatus } = useInitiatePasswordResetMutation();

  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  const resendOTP = () => {
    const email = searchParams.get("email");
    if (!email) {
      toast("Email is missing.");
      return;
    }

    resendOtp({ "username":email }, {
      onSuccess: (data) => {
        if (data && data.isSuccessful) {
          const retrievalCode = data.data.retrievalCode;
          const passwordResetToken = data.data.passwordResetToken;
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.set("retrievalCode", retrievalCode);
          newParams.set("passwordResetToken", passwordResetToken);
          router.replace(`/forgot-password-code?${newParams.toString()}`);
          toast("OTP resent successfully! You can resend again in 60 seconds.");
          setTimer(60);
        } else {
          toast("Failed to resend OTP.");
        }
      },
      onError: () => {
        toast("Failed to resend OTP.");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-[#0284B2] max-h-[100vh] gap-4 font-[family-name:var(--font-dm)] px-[1rem] md:px-[2rem]">
      <div className="bg-white max-h-full h-full hidden md:block">
        <div className="h-full md:flex flex-col justify-center items-center">
          <Image
            src="/illustrations/forgot-password/forgot-password.svg"
            alt="forgot password screen"
            width={500}
            height={550}
            className="-translate-y-[50px]"
          />
        </div>
        <div className="font-[family-name:var(--font-dm)] text-center -translate-y-[150%]">
          <h4 className="font-[family-name:var(--font-dm)] text-center text-[#0284B2] text-[30px] font-[700] mb-[13px]">
            Forgot Password
          </h4>
          <p className="w-[300px] mx-auto font-[family-name:var(--font-dm)] font-[600] text-[18px] text-[#0284B2]">
            It sucks to hear that you forgot your password. Kindly follow these
            steps to reset your password
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

          <div className="relative font-[family-name:var(--font-poppins)] w-full">
            <h3 className="text-[#0284B2] text-[30px] font-[700]">
              Enter the 6-digit verification code sent to your email address
            </h3>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full mt-[48px] text-left"
              >
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="font-[family-name:var(--font-dm)] mb-[24px]">
                      <FormControl>
                        <div className="relative">
                          <Shield
                            size={20}
                            className="absolute left-[15px] top-[30%] cursor-pointer text-[#A9A9A9]"
                          />
                          <Input
                            placeholder="Enter code"
                            className="pl-[42px] font-[500] text-[#A9A9A9] h-[56px] rounded-[4px] border-[1px] border-[#D3D3D3] focus-visible:ring-[1px] placeholder:text-[#A9A9A9] focus-visible:ring-[#0284B2]"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <LoaderButton
                  buttonText="Verify Code"
                  isLoading={isVerifying}
                  className="w-full bg-[#0284B2] hover:bg-[#0284B2] text-center h-[50px] mt-[15px] font-[family-name:var(--font-dm)]"
                />

                <div className="my-[16px] text-center">
                  <button type="button" onClick={resendOTP} disabled={resendStatus === 'pending' || timer > 0}
                      className="text-[#0284B2] cursor-pointer font-[500] text-[14px]">
                    {timer > 0 ? `Please wait ${timer}s to resend` : "Resend OTP"}
                  </button>
                </div>

                <div className="my-[16px] text-center">
                  <Link
                    href="/login"
                    className="text-[#464646] cursor-pointer font-[family-name:var(--font-poppins)] font-[500] text-[14px] text-right"
                  >
                    Back to Login
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
