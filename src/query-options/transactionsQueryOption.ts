import { useQuery } from "@tanstack/react-query";
import { 
  TransactionQueryParams, 
  TransactionsApiResponse 
} from "@/types/transactions";

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

export const getTransactions = async (params: TransactionQueryParams): Promise<TransactionsApiResponse> => {
  const searchParams = new URLSearchParams();
  
  // Add parameters only if they have values
  if (params.pageNumber) searchParams.set('PageNumber', params.pageNumber.toString());
  if (params.pageSize) searchParams.set('PageSize', params.pageSize.toString());
  if (params.accountNumber) searchParams.set('AccountNumber', params.accountNumber);
  if (params.instrumentNumber) searchParams.set('InstrumentNumber', params.instrumentNumber);
  if (params.entryCode) searchParams.set('EntryCode', params.entryCode);
  if (params.batchCode) searchParams.set('BatchCode', params.batchCode);
  if (params.startDate) searchParams.set('StartDate', params.startDate);
  if (params.endDate) searchParams.set('EndDate', params.endDate);
  if (params.direction) searchParams.set('Direction', params.direction);
  if (params.postingReferenceNumber) searchParams.set('PostingReferenceNumber', params.postingReferenceNumber);
  if (params.financialDateFrom) searchParams.set('FinancialDateFrom', params.financialDateFrom);
  if (params.financialDateTo) searchParams.set('FinancialDateTo', params.financialDateTo);

  const url = `https://account-dev.digitvant.com/api/v1/report/account-history?${searchParams.toString()}`;
  
  // Get SSO token for transactions API
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
    if (data && data.data && data.data.data && Array.isArray(data.data.data)) {
      return data;
    } else {
      throw new Error(`HTTP error! status: ${response.status} - No data in response`);
    }
  }

  return data;
};

export const getTransactionsQueryOptions = (params: TransactionQueryParams) => ({
  queryKey: ['transactions', params],
  queryFn: () => getTransactions(params),
  staleTime: 5 * 60 * 1000, // 5 minutes
  enabled: true, // Ensure the query is enabled
});

export const useGetTransactionsQuery = (params: TransactionQueryParams) => {
  return useQuery(getTransactionsQueryOptions(params));
};
