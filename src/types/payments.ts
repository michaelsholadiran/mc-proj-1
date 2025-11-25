// Payment API Response Types
export interface PaymentItem {
  id: string;
  description: string;
  amount: number;
  schoolId: string;
  startDate: string;
  endDate: string;
  hasStopped: boolean;
  hasCommission: boolean;
  commissionAmount: number;
  walletId: string;
  createdDate: string;
}

export interface PaymentsData {
  items: PaymentItem[];
  totalCount: number;
}

export interface PaymentsApiResponse {
  data: PaymentsData;
  isSuccessful: boolean;
  message: string;
  code: string;
}

// Query Parameters for Payments API
export interface PaymentQueryParams {
  PaymentId?: string;
  SchoolId?: string;
  MinAmount?: number;
  MaxAmount?: number;
  WalletId?: string;
  From?: string; // Date string
  To?: string; // Date string
}

// Payment with History API Response Types
export interface PaymentLog {
  id: string;
  description: string;
  fullName: string;
  studentReference: string;
  paymentReference: string;
  amount: number;
  commission: number;
  status: string;
  paymentId: string;
  financialDate: string;
}

export interface PaymentWithHistoryData {
  totalAmount: number;
  totalCommission: number;
  paymentLogs: PaymentLog[];
  id: string;
  description: string;
  amount: number;
  schoolId: string;
  startDate: string;
  endDate: string;
  hasStopped: boolean;
  hasCommission: boolean;
  commissionAmount: number;
  walletId: string;
  createdDate: string;
}

export interface PaymentWithHistoryApiResponse {
  data: PaymentWithHistoryData;
  isSuccessful: boolean;
  message: string;
  code: string;
}

