import { useQuery } from "@tanstack/react-query";
import { 
  TransactionQueryParams, 
  TransactionsApiResponse 
} from "@/types/transactions";
import { SSO_BASE_URL, ACCOUNT_BASE_URL } from "@/constants/api";

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

export const getTransactions = async (params: TransactionQueryParams): Promise<TransactionsApiResponse> => {
  const searchParams = new URLSearchParams();
  
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

  const url = `${ACCOUNT_BASE_URL}/report/account-history?${searchParams.toString()}`;
  
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
  staleTime: 5 * 60 * 1000,
  enabled: true,
});

export const useGetTransactionsQuery = (params: TransactionQueryParams) => {
  return useQuery(getTransactionsQueryOptions(params));
};
