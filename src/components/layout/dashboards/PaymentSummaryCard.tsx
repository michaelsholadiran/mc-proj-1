"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, CreditCard } from "lucide-react";

interface PaymentSummaryData {
  totalPayments: number;
  totalAmount: string;
  successfulPayments: number;
  pendingPayments: number;
  failedPayments: number;
  monthlyGrowth: number;
}

// Mock data - no API calls needed
const mockPaymentData: PaymentSummaryData = {
  totalPayments: 1247,
  totalAmount: "₦2,450,000.00",
  successfulPayments: 1150,
  pendingPayments: 67,
  failedPayments: 30,
  monthlyGrowth: 12.5,
};

export default function PaymentSummaryCard() {
  const data = mockPaymentData;

  return (
    <Card className="w-full shadow-lg border-2 border-[#E7E7E7] hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-[#0284B2]/5 to-transparent border-b border-[#E7E7E7]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0284B2]/10 rounded-lg">
            <DollarSign className="h-6 w-6 text-[#0284B2]" />
          </div>
          <div>
            <CardTitle className="text-[#464646] text-2xl font-[family-name:var(--font-dm)] font-bold">
              Payment Summary
            </CardTitle>
            <CardDescription className="font-[family-name:var(--font-poppins)] mt-1">
              Overview of all payment transactions
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Total Amount */}
          <div className="p-6 bg-gradient-to-br from-[#0284B2]/10 to-[#0284B2]/5 rounded-xl border border-[#0284B2]/20 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#464646] font-[family-name:var(--font-poppins)] font-medium">
                Total Amount
              </p>
              {data.monthlyGrowth > 0 ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 rounded-full">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-600">
                    +{data.monthlyGrowth}%
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-100 rounded-full">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-semibold text-red-600">
                    {data.monthlyGrowth}%
                  </span>
                </div>
              )}
            </div>
            <p className="text-4xl font-bold text-[#0284B2] font-[family-name:var(--font-dm)]">
              {data.totalAmount}
            </p>
          </div>

          {/* Total Payments */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-blue-200 rounded-md">
                  <CreditCard className="h-4 w-4 text-[#0284B2]" />
                </div>
                <p className="text-xs text-[#464646] font-[family-name:var(--font-poppins)] font-medium uppercase tracking-wide">
                  Total Payments
                </p>
              </div>
              <p className="text-3xl font-bold text-[#464646] font-[family-name:var(--font-dm)]">
                {data.totalPayments.toLocaleString()}
              </p>
            </div>

            <div className="p-5 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-5 w-5 rounded-full bg-green-500 shadow-sm" />
                <p className="text-xs text-[#464646] font-[family-name:var(--font-poppins)] font-medium uppercase tracking-wide">
                  Successful
                </p>
              </div>
              <p className="text-3xl font-bold text-[#464646] font-[family-name:var(--font-dm)]">
                {data.successfulPayments.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="space-y-4">
            <p className="text-sm font-bold text-[#464646] font-[family-name:var(--font-poppins)] uppercase tracking-wide">
              Status Breakdown
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100/50 rounded-xl border-2 border-yellow-300 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full bg-yellow-500 shadow-sm ring-2 ring-yellow-200" />
                  <span className="text-sm font-semibold text-[#464646] font-[family-name:var(--font-poppins)]">
                    Pending
                  </span>
                </div>
                <span className="text-lg font-bold text-[#464646] font-[family-name:var(--font-dm)] bg-white px-3 py-1 rounded-lg">
                  {data.pendingPayments}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100/50 rounded-xl border-2 border-red-300 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full bg-red-500 shadow-sm ring-2 ring-red-200" />
                  <span className="text-sm font-semibold text-[#464646] font-[family-name:var(--font-poppins)]">
                    Failed
                  </span>
                </div>
                <span className="text-lg font-bold text-[#464646] font-[family-name:var(--font-dm)] bg-white px-3 py-1 rounded-lg">
                  {data.failedPayments}
                </span>
              </div>
            </div>
          </div>

          {/* Success Rate */}
          <div className="pt-6 border-t-2 border-[#E7E7E7]">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-[#464646] font-[family-name:var(--font-poppins)] uppercase tracking-wide">
                Success Rate
              </p>
              <p className="text-2xl font-bold text-[#0284B2] font-[family-name:var(--font-dm)]">
                {(
                  (data.successfulPayments / data.totalPayments) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
            <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-[#0284B2] to-[#0284B2]/80 h-4 rounded-full transition-all duration-500 shadow-sm"
                style={{
                  width: `${
                    (data.successfulPayments / data.totalPayments) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

