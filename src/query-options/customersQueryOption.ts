import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Customer,
  CustomerQueryParams, 
  CustomersApiResponse,
  CustomerAnalyticsQueryParams,
  CustomerAnalyticsResponse
} from "@/types/customers";
import { SSO_BASE_URL, PROFILE_BASE_URL } from "@/constants/api";

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

export const getCustomers = async (params: CustomerQueryParams): Promise<CustomersApiResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params.pageNumber) searchParams.set('PageNumber', params.pageNumber.toString());
  if (params.pageSize) searchParams.set('PageSize', params.pageSize.toString());
  if (params.customerRef) searchParams.set('CustomerRef', params.customerRef);
  if (params.status) searchParams.set('Status', params.status);
  if (params.createdDate) searchParams.set('CreatedDate', params.createdDate);

  const url = `${PROFILE_BASE_URL}/administration/profiles?${searchParams.toString()}`;
  
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

export const getCustomersQueryOptions = (params: CustomerQueryParams) => ({
  queryKey: ['customers', params],
  queryFn: () => getCustomers(params),
  staleTime: 5 * 60 * 1000,
  enabled: true,
});

export const useGetCustomersQuery = (params: CustomerQueryParams) => {
  return useQuery(getCustomersQueryOptions(params));
};

export const getCustomerAnalytics = async (params: CustomerAnalyticsQueryParams): Promise<CustomerAnalyticsResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params.startDate) searchParams.set('startDate', params.startDate);
  if (params.endDate) searchParams.set('endDate', params.endDate);

  const url = `${PROFILE_BASE_URL}/analytics/get-summary?${searchParams.toString()}`;
  
  const ssoToken = await getSSOToken();
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ssoToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const getCustomerAnalyticsQueryOptions = (params: CustomerAnalyticsQueryParams) => ({
  queryKey: ['customerAnalytics', params],
  queryFn: () => getCustomerAnalytics(params),
  staleTime: 5 * 60 * 1000,
  enabled: true,
});

export const useGetCustomerAnalyticsQuery = (params: CustomerAnalyticsQueryParams) => {
  return useQuery(getCustomerAnalyticsQueryOptions(params));
};

export const exportCustomers = async (params: CustomerQueryParams, exportFormat: "CSV" | "Excel"): Promise<Blob> => {
  const requestBody = {
    customerRef: params.customerRef || undefined,
    status: params.status || undefined,
    createdDate: params.createdDate || undefined,
    exportFormat: exportFormat,
    pageNumber: params.pageNumber || 1,
    pageSize: params.pageSize || 20
  };

  const url = `${PROFILE_BASE_URL}/administration/export-profiles`;
  
  const ssoToken = await getSSOToken();
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ssoToken}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.blob();
};

export const getSingleCustomer = async (email: string): Promise<Customer> => {
  const url = `${PROFILE_BASE_URL}/administration/get-profile/${encodeURIComponent(email)}`;
  
  const ssoToken = await getSSOToken();
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ssoToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const responseData = await response.json();
  return responseData.data;
};

export const getSingleCustomerQueryOptions = (email: string) => ({
  queryKey: ['singleCustomer', email],
  queryFn: () => getSingleCustomer(email),
  staleTime: 5 * 60 * 1000,
  enabled: !!email,
});

export const useGetSingleCustomerQuery = (email: string) => {
  return useQuery(getSingleCustomerQueryOptions(email));
};

export const toggleCustomerStatus = async (profileId: string): Promise<{ isSuccessful: boolean; message: string; code: string }> => {
  const url = `${PROFILE_BASE_URL}/administration/toggle-profile`;
  
  const ssoToken = await getSSOToken();
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ssoToken}`,
    },
    body: JSON.stringify({ profileId }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const responseData = await response.json();
  return responseData;
};

export const useToggleCustomerStatusMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: toggleCustomerStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['singleCustomer'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};
