"use client";

import { KYCRequestTab } from "@/components/layout/tabs/KYCRequestTab";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";

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

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CircleCheckBig, CircleX, Play } from "lucide-react";
import { useParams } from "next/navigation";

const kycDetailsSchema = z.object({
  firstName: z.string().optional(),
  additionalComments: z.string().optional(),
});
type KycDetailsFormData = z.infer<typeof kycDetailsSchema>;

const rejectionSchema = z.object({
  rejectionReason: z
    .string()
    .min(1, "Reason for rejection is required.")
    .max(500, "Reason cannot exceed 500 characters."),
});
type RejectionFormData = z.infer<typeof rejectionSchema>;

export default function AdditionalCommentPage() {
  const params = useParams() as { id: string };
  const [isFormSubmitModalOpen, setIsFormSubmitModalOpen] = useState(false);
  const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [isRejectedSuccessModalOpen, setIsRejectedSuccessModalOpen] =
    useState(false);

  const form = useForm<KycDetailsFormData>({
    resolver: zodResolver(kycDetailsSchema),
    defaultValues: {
      firstName: "Angela",
      additionalComments:
        "The house is a bungalow and it is opposite NNPC filling station. It has a black gate and it is fully fenced",
    },
  });

  const rejectionForm = useForm<RejectionFormData>({
    resolver: zodResolver(rejectionSchema),
    defaultValues: {
      rejectionReason: "",
    },
  });

  function onSubmit(data: KycDetailsFormData) {
    console.log("Main form submitted with:", data);
  }

  const handleApproveClick = () => {
    setIsFormSubmitModalOpen(false);
    setIsApprovedModalOpen(true);
  };

  const handleRejectSubmit = (data: RejectionFormData) => {
    console.log("Rejection reason submitted:", data);
    setIsRejectionModalOpen(false);

    setIsRejectedSuccessModalOpen(true);
    rejectionForm.reset();
  };

  return (
    <div className="bg-white rounded-lg p-6 px-[1rem] md:px-[2rem]">
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
      <div>
        <KYCRequestTab id={params.id} />
      </div>
      <div className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name Field */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
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

            {/* Additional Comments/Description (Textarea) Field */}
            <div className="mt-6">
              <FormField
                control={form.control}
                name="additionalComments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comments</FormLabel>
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

            {/* Form Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              {/* NEW: Dialog for "Cancel Request" (Rejection Reason) */}
              <Dialog
                open={isRejectionModalOpen}
                onOpenChange={setIsRejectionModalOpen}
              >
                <DialogTrigger asChild>
                  <Button className="cursor-pointer bg-[#FC5A5A] rounded-[5px] h-[48px] px-[20px] hover:bg-amber-700 font-[family-name:var(--font-poppins)] text-[14px]">
                    Cancel Request
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader className="mb-4">
                    <DialogTitle>Confirm Request Rejection</DialogTitle>
                    <p className="mt-4 text-[25px] text-center">
                      Are you sure you want to reject this request?
                    </p>
                  </DialogHeader>
                  {/* Form for Rejection Reason */}
                  <Form {...rejectionForm}>
                    <form
                      onSubmit={rejectionForm.handleSubmit(handleRejectSubmit)}
                    >
                      <FormField
                        control={rejectionForm.control}
                        name="rejectionReason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[14px]">
                              Reason for Rejection
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="min-h-[100px] w-full rounded-lg border border-[#CCCCCC] px-3 py-4 font-poppins text-base text-[#464646]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter className="flex sm:justify-center justify-center items-center w-full mt-4">
                        <DialogClose asChild>
                          <Button
                            type="button"
                            variant="secondary"
                            className="bg-[#FC5A5A] text-white  hover:bg-amber-700 cursor-pointer rounded-[5px] h-[48px] px-[20px] font-[family-name:var(--font-poppins)] text-[14px]"
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          className="cursor-pointer bg-[#0284B2] rounded-[5px] h-[48px] px-[20px] hover:bg-[#0283b299] font-[family-name:var(--font-poppins)] text-[14px]"
                        >
                          Reject
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>{" "}
              {/* End of Rejection Reason Dialog */}
              {/* FIRST DIALOG: Confirmation/Action Choice (triggered by main form submission) */}
              <Dialog
                open={isFormSubmitModalOpen}
                onOpenChange={setIsFormSubmitModalOpen}
              >
                <DialogTrigger asChild>
                  <Button className="cursor-pointer bg-[#0284B2] rounded-[5px] h-[48px] px-[20px] hover:bg-[#0283b299] font-[family-name:var(--font-poppins)] text-[14px]">
                    Approve Request
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-[#464646] font-[family-name:var(--font-dm)] font-[600]"></DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 justify-center text-center items-center gap-2 font-[family-name:var(--font-poppins)]">
                      <h5 className="text-[22px] font-[500] text-[#464646] mt-[24px]">
                        Confirm Request Approval
                      </h5>
                      <p>Are you sure you want to approve this request?</p>
                    </div>
                  </div>
                  <DialogFooter className="flex sm:justify-center justify-center items-center w-full">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        className="bg-[#FC5A5A] text-white  hover:bg-amber-700 cursor-pointer rounded-[5px] h-[48px] px-[20px] font-[family-name:var(--font-poppins)] text-[14px]"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="button"
                      className="cursor-pointer bg-[#0284B2] rounded-[5px] h-[48px] px-[20px] hover:bg-[#0283b299] font-[family-name:var(--font-poppins)] text-[14px]"
                      onClick={handleApproveClick}
                    >
                      Approved
                    </Button>

                    {/* Button for "Approved" (closes this modal, opens the "Request Approved" modal) */}
                  </DialogFooter>
                </DialogContent>
              </Dialog>{" "}
              {/* End of First Confirmation Dialog */}
            </div>
          </form>
        </Form>
      </div>
      {/* SECOND DIALOG: Request Approved Confirmation (opened by "Approved" button) */}
      <Dialog open={isApprovedModalOpen} onOpenChange={setIsApprovedModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#464646] font-[family-name:var(--font-dm)] font-[600]"></DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 justify-center text-center items-center gap-2 font-[family-name:var(--font-poppins)]">
              <CircleCheckBig
                strokeWidth={0.5}
                size={70}
                className="mx-auto text-[#0284B2]"
              />
              <h5 className="text-[22px] font-[500] text-[#464646] mt-[24px]">
                Request Approved!
              </h5>
            </div>
          </div>
          <DialogFooter className="flex sm:justify-center justify-center items-center w-full">
            <DialogClose asChild>
              <Button
                type="button"
                className="cursor-pointer bg-[#0284B2] rounded-[5px] h-[48px] px-[20px] hover:bg-[#0283b299] font-[family-name:var(--font-poppins)] text-[14px]"
              >
                Done
              </Button>
            </DialogClose>

            {/* Button for "Approved" (closes this modal, opens the "Request Approved" modal) */}
          </DialogFooter>
        </DialogContent>
      </Dialog>{" "}
      {/* End of Request Approved Dialog */}
      {/* NEW: THIRD DIALOG: Request Rejected Success (opened by "Reject" button) */}
      <Dialog
        open={isRejectedSuccessModalOpen}
        onOpenChange={setIsRejectedSuccessModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#464646] font-[family-name:var(--font-dm)] font-[600]"></DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 justify-center text-center items-center gap-2 font-[family-name:var(--font-poppins)]">
              {/* <CircleCheckBig
                strokeWidth={0.5}
                size={70}
                className="mx-auto text-[#0284B2]"
              /> */}
              <CircleX
                strokeWidth={0.5}
                size={70}
                className="mx-auto text-[#FC5A5A]"
              />
              <h5 className="text-[22px] font-[500] text-[#464646] mt-[24px]">
                Request Rejected!
              </h5>
            </div>
          </div>
          <DialogFooter className="flex sm:justify-center justify-center items-center w-full">
            <DialogClose asChild>
              <Button
                type="button"
                className="cursor-pointer bg-[#FC5A5A] rounded-[5px] h-[48px] px-[20px] hover:bg-amber-700 font-[family-name:var(--font-poppins)] text-[14px]"
              >
                Back
              </Button>
            </DialogClose>

            {/* Button for "Approved" (closes this modal, opens the "Request Approved" modal) */}
          </DialogFooter>
        </DialogContent>
      </Dialog>{" "}
      {/* End of Request Rejected Dialog */}
    </div>
  );
}
