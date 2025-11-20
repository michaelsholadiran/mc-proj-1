"use client";

import { KYCRequestTab } from "@/components/layout/tabs/KYCRequestTab";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Play } from "lucide-react";
import { useParams } from "next/navigation";

const kycDetailsSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  phoneNumber: z.string().optional(),
  emailAddress: z.string().email("Invalid email format.").optional(),
  accountNumber: z.string().optional(),
  customerID: z.string().optional(),
  dateOfSubmission: z.string().optional(),
  bvn: z.string().optional(),
  nin: z.string().optional(),
});

type KycDetailsFormData = z.infer<typeof kycDetailsSchema>;

export default function PersonalDetailsPage() {
  const params = useParams() as { id: string };

  const form = useForm<KycDetailsFormData>({
    resolver: zodResolver(kycDetailsSchema),
    defaultValues: {
      firstName: "Angela",
      lastName: "Bassey",
      middleName: "N/A",
      phoneNumber: "08160688825",
      emailAddress: "adebisideola@gmail.com",
      accountNumber: "3110758413",
      customerID: "#4612580",
      dateOfSubmission: "10/02/2024",
      bvn: "0123456789",
      nin: "0123456789",
    },
  });

  return (
    <div className="bg-white rounded-lg p-6 px-[1rem] md:px-[2rem]">
      <div>
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList className="font-[family-name:var(--font-poppins)] font-[500]">
              <BreadcrumbItem className="text-[#A9A9A9]">
                <BreadcrumbLink href="/kyci-dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Play className="text-[#CCCCCC]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="!text-[#A9A9A9]">
                  KYC Requests
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Play className="text-[#CCCCCC]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>KYC Request Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="mt-[26px]">
          <h6 className="font-[family-name:var(--font-dm)] font-[600] text-[16px]">
            KYC Request Details
          </h6>
        </div>
      </div>
      {/* Assuming KYCRequestTab is a valid component in your project */}
      <div>
        <KYCRequestTab id={params.id} />
      </div>

      <div className="space-y-4">
        <Form {...form}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    {/* Input is now editable and styled with Tailwind */}
                    <Input
                      {...field}
                      className="w-full h-14 rounded-lg border border-[#CCCCCC] px-3 py-4 font-poppins font-medium text-base text-[#A9A9A9]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full h-14 rounded-lg border border-[#CCCCCC] px-3 py-4 font-poppins font-medium text-base text-[#A9A9A9]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Middle Name */}
            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full h-14 rounded-lg border border-[#CCCCCC] px-3 py-4 font-poppins font-medium text-base text-[#A9A9A9]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full h-14 rounded-lg border border-[#CCCCCC] px-3 py-4 font-poppins font-medium text-base text-[#A9A9A9]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Address */}
            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full h-14 rounded-lg border border-[#CCCCCC] px-3 py-4 font-poppins font-medium text-base text-[#A9A9A9]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Account Number */}
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full h-14 rounded-lg border border-[#CCCCCC] px-3 py-4 font-poppins font-medium text-base text-[#A9A9A9]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Customer ID */}
            <FormField
              control={form.control}
              name="customerID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full h-14 rounded-lg border border-[#CCCCCC] px-3 py-4 font-poppins font-medium text-base text-[#A9A9A9]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Submission */}
            <FormField
              control={form.control}
              name="dateOfSubmission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Submission</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full h-14 rounded-lg border border-[#CCCCCC] px-3 py-4 font-poppins font-medium text-base text-[#A9A9A9]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bank Verification Number (BVN) */}
            <FormField
              control={form.control}
              name="bvn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Verification Number (BVN)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full h-14 rounded-lg border border-[#CCCCCC] px-3 py-4 font-poppins font-medium text-base text-[#A9A9A9]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* National Identification Number (NIN) */}
            <FormField
              control={form.control}
              name="nin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>National Identification Number (NIN)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full h-14 rounded-lg border border-[#CCCCCC] px-3 py-4 font-poppins font-medium text-base text-[#A9A9A9]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </div>
    </div>
  );
}
