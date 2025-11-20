"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Loader2, CheckCircle2, XCircle } from "lucide-react";

const verifyPaymentSchema = z.object({
  transactionId: z
    .string()
    .min(1, "Transaction ID is required")
    .max(100, "Transaction ID too long"),
  referenceNumber: z
    .string()
    .min(1, "Reference number is required")
    .max(100, "Reference number too long"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
});

type VerifyPaymentFormValues = z.infer<typeof verifyPaymentSchema>;

interface VerificationResult {
  status: "success" | "failed" | null;
  message: string;
  transactionDetails?: {
    transactionId: string;
    referenceNumber: string;
    amount: string;
    status: string;
    date: string;
    customerName: string;
  };
}

export default function VerifyPaymentCard() {
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm<VerifyPaymentFormValues>({
    resolver: zodResolver(verifyPaymentSchema),
    defaultValues: {
      transactionId: "",
      referenceNumber: "",
      amount: "",
    },
  });

  const handleSubmit = async (values: VerifyPaymentFormValues) => {
    setIsVerifying(true);
    setVerificationResult(null);

    // Simulate API call - no actual API needed
    setTimeout(() => {
      // Mock verification logic
      const isValid =
        values.transactionId.length > 5 &&
        values.referenceNumber.length > 5 &&
        parseFloat(values.amount) > 0;

      if (isValid) {
        setVerificationResult({
          status: "success",
          message: "Payment verified successfully",
          transactionDetails: {
            transactionId: values.transactionId,
            referenceNumber: values.referenceNumber,
            amount: `₦${parseFloat(values.amount).toLocaleString("en-NG", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            status: "Verified",
            date: new Date().toLocaleDateString("en-NG"),
            customerName: "John Doe",
          },
        });
        toast.success("Payment verified successfully!");
        form.reset();
      } else {
        setVerificationResult({
          status: "failed",
          message: "Payment verification failed. Please check the details.",
        });
        toast.error("Payment verification failed");
      }
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <Card className="w-full shadow-lg border-2 border-[#E7E7E7] hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-[#0284B2]/5 to-transparent border-b border-[#E7E7E7]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0284B2]/10 rounded-lg">
            <Shield className="h-6 w-6 text-[#0284B2]" />
          </div>
          <div>
            <CardTitle className="text-[#464646] text-2xl font-[family-name:var(--font-dm)] font-bold">
              Verify Payment
            </CardTitle>
            <CardDescription className="font-[family-name:var(--font-poppins)] mt-1">
              Verify payment transaction details
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="transactionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#464646] font-[family-name:var(--font-poppins)]">
                    Transaction ID
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter transaction ID"
                      className="h-[48px] text-[#464646] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="referenceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#464646] font-[family-name:var(--font-poppins)]">
                    Reference Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter reference number"
                      className="h-[48px] text-[#464646] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#464646] font-[family-name:var(--font-poppins)]">
                    Amount
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter amount (e.g., 1000.00)"
                      className="h-[48px] text-[#464646] focus-visible:ring-[1px] rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-poppins)]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-[48px] rounded-[8px] bg-[#0284B2] hover:bg-[#0284B2]/90 font-[family-name:var(--font-poppins)] text-white"
              disabled={isVerifying}
            >
              {isVerifying && (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              )}
              {isVerifying ? "Verifying..." : "Verify Payment"}
            </Button>
          </form>
        </Form>

        {/* Verification Result */}
        {verificationResult && (
          <div className="mt-6 pt-6 border-t-2 border-[#E7E7E7]">
            {verificationResult.status === "success" &&
              verificationResult.transactionDetails && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border-2 border-green-300 mb-4">
                    <div className="p-2 bg-green-200 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="font-bold text-green-700 font-[family-name:var(--font-poppins)] text-lg">
                      {verificationResult.message}
                    </p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-green-50 to-green-100/30 rounded-xl border-2 border-green-200 shadow-md space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#A9A9A9] font-[family-name:var(--font-poppins)] mb-1">
                          Transaction ID
                        </p>
                        <p className="text-sm font-semibold text-[#464646] font-[family-name:var(--font-dm)]">
                          {
                            verificationResult.transactionDetails
                              .transactionId
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#A9A9A9] font-[family-name:var(--font-poppins)] mb-1">
                          Reference Number
                        </p>
                        <p className="text-sm font-semibold text-[#464646] font-[family-name:var(--font-dm)]">
                          {
                            verificationResult.transactionDetails
                              .referenceNumber
                          }
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#A9A9A9] font-[family-name:var(--font-poppins)] mb-1">
                          Amount
                        </p>
                        <p className="text-sm font-semibold text-[#464646] font-[family-name:var(--font-dm)]">
                          {verificationResult.transactionDetails.amount}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#A9A9A9] font-[family-name:var(--font-poppins)] mb-1">
                          Status
                        </p>
                        <p className="text-sm font-semibold text-green-600 font-[family-name:var(--font-dm)]">
                          {verificationResult.transactionDetails.status}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#A9A9A9] font-[family-name:var(--font-poppins)] mb-1">
                          Date
                        </p>
                        <p className="text-sm font-semibold text-[#464646] font-[family-name:var(--font-dm)]">
                          {verificationResult.transactionDetails.date}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#A9A9A9] font-[family-name:var(--font-poppins)] mb-1">
                          Customer Name
                        </p>
                        <p className="text-sm font-semibold text-[#464646] font-[family-name:var(--font-dm)]">
                          {
                            verificationResult.transactionDetails
                              .customerName
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {verificationResult.status === "failed" && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-red-100/50 rounded-xl border-2 border-red-300">
                <div className="p-2 bg-red-200 rounded-full">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <p className="font-bold text-red-700 font-[family-name:var(--font-poppins)] text-lg">
                  {verificationResult.message}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

