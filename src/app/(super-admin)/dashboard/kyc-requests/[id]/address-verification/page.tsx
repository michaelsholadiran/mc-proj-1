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
import { Textarea } from "@/components/ui/textarea";
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
  streetAddress: z.string().optional(),
  unitApartmentNumber: z.string().optional(),
  city: z.string().optional(),
  stateProvince: z.string().optional(),
  country: z.string().optional(),
  postalZipCode: z.string().optional(),
  nearestLandmark: z.string().optional(),
  yearsLivedAtAddress: z.string().optional(),
  additionalComments: z.string().optional(),
});

type KycDetailsFormData = z.infer<typeof kycDetailsSchema>;

export default function AddressVerificationPage() {
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
      streetAddress: "No 2. Hakeem Balogun Street, Agidingbi",
      unitApartmentNumber: "N/A",
      city: "Ikeja",
      stateProvince: "Lagos",
      country: "Nigeria",
      postalZipCode: "1000121",
      nearestLandmark: "Addas Mall",
      yearsLivedAtAddress: "3 years",
      additionalComments:
        "The house is a bungalow and it is opposite NNPC filling station. It has a black gate and it is fully fenced",
    },
  });

  return (
    <div className="bg-white rounded-lg p-6 px-[1rem] md:px-[2rem]">
      {/* Assuming KYCRequestTab is a valid component in your project */}

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
      <div>
        <KYCRequestTab id={params.id} />
      </div>

      <div className="space-y-4">
        <Form {...form}>
          {/* New Section for Address Details */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Street Address */}
            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
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

            {/* Unit/Apartment Number */}
            <FormField
              control={form.control}
              name="unitApartmentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit/Apartment Number</FormLabel>
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

            {/* City */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
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

            {/* State/Province */}
            <FormField
              control={form.control}
              name="stateProvince"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State/Province</FormLabel>
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

            {/* Country */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
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

            {/* Postal / Zip code */}
            <FormField
              control={form.control}
              name="postalZipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal / Zip code</FormLabel>
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

            {/* Nearest Landmark */}
            <FormField
              control={form.control}
              name="nearestLandmark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nearest Landmark</FormLabel>
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

            {/* How long have you lived at this address */}
            <FormField
              control={form.control}
              name="yearsLivedAtAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How long have you lived at this address</FormLabel>
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

          {/* Additional Comments/Description (Textarea) */}
          <div className="mt-6">
            <FormField
              control={form.control}
              name="additionalComments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Please provide any additional comments/notes or detailed
                    description regarding your address
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="w-full min-h-[100px] rounded-lg border border-[#CCCCCC] px-3 py-4 font-poppins font-medium text-base text-[#A9A9A9]"
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
