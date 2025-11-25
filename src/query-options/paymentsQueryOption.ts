import { useQuery } from "@tanstack/react-query";
import { 
  PaymentQueryParams, 
  PaymentsApiResponse,
  PaymentItem,
  PaymentWithHistoryApiResponse
} from "@/types/payments";
import { PaymentSummaryData } from "@/components/layout/tables/paymentSummaryTable";

// SSO Token interface
interface SSOTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Token cache to avoid repeated SSO requests
let tokenCache: { token: string; expiresAt: number } | null = null;

// Function to get SSO token with caching
const getSSOToken = async (): Promise<string> => {
  // Check if we have a valid cached token
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const formData = new URLSearchParams();
  formData.append('grant_type', 'client_credentials');
  formData.append('client_id', 'KuUmBOwOASN_gBm');
  formData.append('client_secret', 'OsZgDlbm2L4y6DCpkvklZ80sNHg6Q4BlvLYUn1viWQ9ifP5S50');

  const response = await fetch('https://sso-app-dev.digitvant.com/connect/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to get SSO token: ${response.status}`);
  }

  const data: SSOTokenResponse = await response.json();
  
  // Cache the token with expiration (subtract 5 minutes for safety)
  const expiresAt = Date.now() + (data.expires_in - 300) * 1000;
  tokenCache = {
    token: data.access_token,
    expiresAt,
  };

  return data.access_token;
};

// Map API PaymentItem to PaymentSummaryData
const mapPaymentToSummaryData = (payment: PaymentItem): PaymentSummaryData => {
  // Format amount with currency symbol
  const formattedAmount = `₦${payment.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  
  // Format commission amount
  const formattedCommissionAmount = `₦${payment.commissionAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  
  // Format dates
  const createdDate = new Date(payment.createdDate);
  const formattedDate = createdDate.toLocaleDateString('en-NG', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });

  const startDate = new Date(payment.startDate);
  const formattedStartDate = startDate.toLocaleDateString('en-NG', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });

  const endDate = new Date(payment.endDate);
  const formattedEndDate = endDate.toLocaleDateString('en-NG', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });

  // Determine status based on hasStopped
  const status = payment.hasStopped ? "Failed" : "Successful";

  return {
    id: payment.id,
    transactionId: payment.id.substring(0, 12).toUpperCase(), // Use first 12 chars of ID as transaction ID
    accountNumber: payment.walletId || "N/A",
    accountName: `Student ${payment.walletId || payment.id.substring(0, 8)}`, // Mock student name
    registrationId: payment.walletId || payment.id.substring(0, 8), // Use walletId or part of ID
    amount: formattedAmount,
    channel: "Mobile", // Default channel, can be updated if API provides it
    status: status,
    date: formattedDate,
    referenceNumber: payment.id.substring(0, 10).toUpperCase(), // Use part of ID as reference
    paymentType: payment.description || "Other", // Use description as payment type
    schoolId: payment.schoolId,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    commissionAmount: formattedCommissionAmount,
    hasCommission: payment.hasCommission,
    hasStopped: payment.hasStopped,
  };
};

export const getPayments = async (params: PaymentQueryParams): Promise<PaymentsApiResponse> => {
  const searchParams = new URLSearchParams();
  
  // Add parameters only if they have values
  if (params.PaymentId) searchParams.set('PaymentId', params.PaymentId);
  if (params.SchoolId) searchParams.set('SchoolId', params.SchoolId);
  if (params.MinAmount) searchParams.set('MinAmount', params.MinAmount.toString());
  if (params.MaxAmount) searchParams.set('MaxAmount', params.MaxAmount.toString());
  if (params.WalletId) searchParams.set('WalletId', params.WalletId);
  if (params.From) searchParams.set('From', params.From);
  if (params.To) searchParams.set('To', params.To);

  const url = `https://digitschool-dev.digitvant.com/api/v1/payments?${searchParams.toString()}`;
  
  // Get SSO token for payments API
  const ssoToken = await getSSOToken();
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ssoToken}`,
    },
  });

  const data = await response.json();

  // Handle 400 status but still return data if it exists
  if (!response.ok && response.status !== 400) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // For 400 status, check if we have data in the response
  if (response.status === 400) {
    if (data && data.data && data.data.items && Array.isArray(data.data.items)) {
      return data;
    } else {
      throw new Error(`HTTP error! status: ${response.status} - No data in response`);
    }
  }

  return data;
};

// Get payments and map to PaymentSummaryData format
export const getPaymentsMapped = async (params: PaymentQueryParams): Promise<{
  payments: PaymentSummaryData[];
  totalCount: number;
}> => {
  const response = await getPayments(params);
  
  const mappedPayments = response.data.items.map(mapPaymentToSummaryData);
  
  return {
    payments: mappedPayments,
    totalCount: response.data.totalCount,
  };
};

export const getPaymentsQueryOptions = (params: PaymentQueryParams) => ({
  queryKey: ['payments', params],
  queryFn: () => getPayments(params),
  staleTime: 5 * 60 * 1000, // 5 minutes
  enabled: true, // Ensure the query is enabled
});

export const getPaymentsMappedQueryOptions = (params: PaymentQueryParams) => ({
  queryKey: ['paymentsMapped', params],
  queryFn: () => getPaymentsMapped(params),
  staleTime: 5 * 60 * 1000, // 5 minutes
  enabled: true, // Ensure the query is enabled
});

export const useGetPaymentsQuery = (params: PaymentQueryParams) => {
  return useQuery(getPaymentsQueryOptions(params));
};

export const useGetPaymentsMappedQuery = (params: PaymentQueryParams) => {
  return useQuery(getPaymentsMappedQueryOptions(params));
};

// Get Payment with History
export const getPaymentWithHistory = async (paymentId: string): Promise<PaymentWithHistoryApiResponse> => {
  const url = `https://digitschool-dev.digitvant.com/api/v1/payments-with-history/${paymentId}`;
  
  // Get SSO token for payments API
  const ssoToken = await getSSOToken();
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ssoToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok && response.status !== 400) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // For 400 status, check if we have data in the response
  if (response.status === 400) {
    if (data && data.data) {
      return data;
    } else {
      throw new Error(`HTTP error! status: ${response.status} - No data in response`);
    }
  }

  return data;
};

export const getPaymentWithHistoryQueryOptions = (paymentId: string) => ({
  queryKey: ['paymentWithHistory', paymentId],
  queryFn: () => getPaymentWithHistory(paymentId),
  staleTime: 5 * 60 * 1000, // 5 minutes
  enabled: !!paymentId, // Only run if paymentId exists
});

export const useGetPaymentWithHistoryQuery = (paymentId: string) => {
  return useQuery(getPaymentWithHistoryQueryOptions(paymentId));
};

