"use client";
import Image from "next/image";

import { loginSchema, LoginValidation } from "@/schemas/loginSchema";
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
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import LoaderButton from "@/components/ui/loading-button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// COMMENTED OUT FOR TESTING
// import { useLoginMutation } from "@/query-options/authenticationQueryOption";
// import { APIError } from "@/types";

export default function Login() {
  const [passwordType, setPasswordType] = useState("password");
  const form = LoginValidation();
  const router = useRouter();
  // API CALL COMMENTED OUT FOR TESTING
  // const { mutate: loginMutation, isPending: isLoading } = useLoginMutation();
  const isLoading = false;

  const togglePasswordVisibility = () => {
    if (passwordType === "password") return setPasswordType("text");
    return setPasswordType("password");
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (_values: z.infer<typeof loginSchema>) => {
    form.clearErrors();

    // BYPASSING API CALL FOR TESTING - DIRECTLY REDIRECT TO DASHBOARD
    toast.success("Login successful!");
    router.push("/dashboard");
    return;

    // ORIGINAL API CALL CODE (COMMENTED OUT FOR TESTING)
    // loginMutation(values, {
    //   onSuccess: (data) => {
    //     const redirectRoles = ['Customer Experience', 'Tech Support', 'Operations', 'IT'];
    //     const userRoles = data.roles.map((role) => role.split('.').pop() || '');
    //     if (userRoles.some((role) => redirectRoles.includes(role))) {
    //       window.location.href = 'https://crm-ticket-dev.digitvant.com/dashboard';
    //     } else if (data.isNewUser) {
    //       toast.success("Login successful! Welcome back.");
    //       router.push(`/change-password?email=${form.getValues("username")}`);
    //     } else {
    //       router.push("/dashboard");
    //     }
    //   },
    //   onError: (error: APIError) => {
    //     const errorMessage =
    //       error.response?.message ||
    //       error.message ||
    //       "Something went wrong. Please try again.";

    //     form.setError("root", {
    //       type: "manual",
    //       message: errorMessage,
    //     });
    //     form.setError("password", {
    //       type: "manual",
    //       message: errorMessage,
    //     });
    //     toast.error(errorMessage);
    //   },
    // });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-[#0284B2] max-h-[100vh] gap-4 font-[family-name:var(--font-dm)] px-[1rem] md:px-[2rem]">
      <div className="bg-white max-h-full h-full hidden md:block">
        <div className="h-full md:flex flex-col justify-center items-center">
          <Image
            src="/illustrations/login/login.svg"
            alt="login screen"
            width={500}
            height={550}
            className="-translate-y-[50px]"
          />
        </div>
        <div className="font-[family-name:var(--font-dm)] text-center -translate-y-[170%]">
          <h4 className="font-[family-name:var(--font-dm)] text-center text-[#0284B2] text-[30px] font-[700] mb-[13px]">
            Welcome Back!
          </h4>
          <p className="font-[family-name:var(--font-dm)] text-[18px] text-[#0284B2]">
            We are delighted to have you back.
          </p>
          <p className="w-[260px] mx-auto font-[family-name:var(--font-dm)] text-[18px] text-[#0284B2]">
            Kindly login into your account to stay connected.
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
              Login into your account
            </h3>

            {/* {form.formState.errors.root && (
              <div className="bg-red-100 text-red-700 rounded px-4 py-2 my-4 text-sm">
                {form.formState.errors.root.message}
              </div>
            )} */}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full mt-[48px] text-left"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="font-[family-name:var(--font-dm)] mb-[24px]">
                      <FormControl>
                        <div className="relative">
                          <Mail
                            size={18}
                            className="absolute left-[15px] top-[30%] cursor-pointer text-[#A9A9A9]"
                          />
                          <Input
                            placeholder="Enter your email address"
                            className="pl-[42px] font-[500] text-[#A9A9A9] h-[56px] rounded-[4px] border-[1px] border-[#D3D3D3] focus-visible:ring-[1px] placeholder:text-[#A9A9A9] focus-visible:ring-[#0284B2]"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="font-[family-name:var(--font-dm)]">
                      <FormControl>
                        <div className="relative">
                          <Lock
                            size={18}
                            className="absolute left-[15px] top-[30%] cursor-pointer text-[#A9A9A9]"
                          />
                          <Input
                            placeholder="Enter your password"
                            className="h-[56px] font-[500] pl-[42px] text-[#A9A9A9] rounded-[4px] border-[1px] border-[#D3D3D3] focus-visible:ring-[1px] placeholder:text-[#A9A9A9] focus-visible:ring-[#0284B2]"
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
                <div className="my-[16px] text-right">
                  <Link
                    href="/forgot-password"
                    className="text-[#464646] cursor-pointer font-[family-name:var(--font-poppins)] text-[14px] text-right"
                  >
                    Forgot password?
                  </Link>
                </div>

                <LoaderButton
                  buttonText="Login"
                  isLoading={isLoading}
                  className="w-full bg-[#0284B2] hover:bg-[#0284B2] text-center h-[50px] mt-[15px] font-[family-name:var(--font-dm)]"
                />
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
