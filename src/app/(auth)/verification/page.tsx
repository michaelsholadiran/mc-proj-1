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
import {
  forgotPasswordCodeVerificationSchema,
  ForgotPasswordCodeVerificationValidation,
} from "@/schemas/forgotPasswordCodeVerificationSchema";

export default function ForgotPassword() {
  const form = ForgotPasswordCodeVerificationValidation();
  const router = useRouter();

  const onSubmit = async (
    values: z.infer<typeof forgotPasswordCodeVerificationSchema>
  ) => {
    console.log("Values", values);
    router.push("/reset-password");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-[#0284B2] max-h-[100vh] gap-4 font-[family-name:var(--font-dm)] px-[1rem] md:px-[2rem]">
      <div className="bg-white max-h-full h-full hidden md:block">
        <div className="h-full md:flex flex-col justify-center items-center">
          <Image
            src="/illustrations/login/login.svg"
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
                  isLoading={false}
                  className="w-full bg-[#0284B2] hover:bg-[#0284B2] text-center h-[50px] mt-[15px] font-[family-name:var(--font-dm)]"
                />

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
