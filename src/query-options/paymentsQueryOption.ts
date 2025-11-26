import { useQuery } from "@tanstack/react-query";
import { 
  PaymentQueryParams, 
  PaymentsApiResponse,
  PaymentItem,
  PaymentWithHistoryApiResponse
} from "@/types/payments";
import { PaymentSummaryData } from "@/components/layout/tables/paymentSummaryTable";
import { SSO_BASE_URL, PAYMENTS_BASE_URL } from "@/constants/api";

interface SSOTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

let tokenCache: { token: string; expiresAt: number } | null = null;

const getSSOToken = async (): Promise<string> => {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const formData = new URLSearchParams();
  formData.append('grant_type', 'client_credentials');
  formData.append('client_id', 'KuUmBOwOASN_gBm');
  formData.append('client_secret', 'OsZgDlbm2L4y6DCpkvklZ80sNHg6Q4BlvLYUn1viWQ9ifP5S50');

  const response = await fetch(`${SSO_BASE_URL}/connect/token`, {
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
  
  const expiresAt = Date.now() + (data.expires_in - 300) * 1000;
  tokenCache = {
    token: data.access_token,
    expiresAt,
  };

  return data.access_token;
};

const mapPaymentToSummaryData = (payment: PaymentItem): PaymentSummaryData => {
  const formattedAmount = `₦${payment.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  
  const formattedCommissionAmount = `₦${payment.commissionAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  
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

  const status = payment.hasStopped ? "Failed" : "Successful";

  return {
    id: payment.id,
    transactionId: payment.id.substring(0, 12).toUpperCase(),
    accountNumber: payment.walletId || "N/A",
    accountName: `Student ${payment.walletId || payment.id.substring(0, 8)}`,
    registrationId: payment.walletId || payment.id.substring(0, 8),
    amount: formattedAmount,
    channel: "Mobile",
    status: status,
    date: formattedDate,
    referenceNumber: payment.id.substring(0, 10).toUpperCase(),
    paymentType: payment.description || "Other",
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
  
  if (params.PaymentId) searchParams.set('PaymentId', params.PaymentId);
  if (params.SchoolId) searchParams.set('SchoolId', params.SchoolId);
  if (params.MinAmount) searchParams.set('MinAmount', params.MinAmount.toString());
  if (params.MaxAmount) searchParams.set('MaxAmount', params.MaxAmount.toString());
  if (params.WalletId) searchParams.set('WalletId', params.WalletId);
  if (params.From) searchParams.set('From', params.From);
  if (params.To) searchParams.set('To', params.To);

  const url = `${PAYMENTS_BASE_URL}/payments?${searchParams.toString()}`;
  
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

  if (response.status === 400) {
    if (data && data.data && data.data.items && Array.isArray(data.data.items)) {
      return data;
    } else {
      throw new Error(`HTTP error! status: ${response.status} - No data in response`);
    }
  }

  return data;
};

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
  staleTime: 5 * 60 * 1000,
  enabled: true,
});

export const getPaymentsMappedQueryOptions = (params: PaymentQueryParams) => ({
  queryKey: ['paymentsMapped', params],
  queryFn: () => getPaymentsMapped(params),
  staleTime: 5 * 60 * 1000,
  enabled: true,
});

export const useGetPaymentsQuery = (params: PaymentQueryParams) => {
  return useQuery(getPaymentsQueryOptions(params));
};

export const useGetPaymentsMappedQuery = (params: PaymentQueryParams) => {
  return useQuery(getPaymentsMappedQueryOptions(params));
};

export const getPaymentWithHistory = async (paymentId: string): Promise<PaymentWithHistoryApiResponse> => {
  const url = `${PAYMENTS_BASE_URL}/payments-with-history/${paymentId}`;
  
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
  staleTime: 5 * 60 * 1000,
  enabled: !!paymentId,
});

export const useGetPaymentWithHistoryQuery = (paymentId: string) => {
  return useQuery(getPaymentWithHistoryQueryOptions(paymentId));
};

