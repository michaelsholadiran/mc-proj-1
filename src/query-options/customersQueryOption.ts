import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Customer,
  CustomerQueryParams, 
  CustomersApiResponse,
  CustomerAnalyticsQueryParams,
  CustomerAnalyticsResponse
} from "@/types/customers";

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

export const getCustomers = async (params: CustomerQueryParams): Promise<CustomersApiResponse> => {
  const searchParams = new URLSearchParams();
  
  // Add parameters only if they have values
  if (params.pageNumber) searchParams.set('PageNumber', params.pageNumber.toString());
  if (params.pageSize) searchParams.set('PageSize', params.pageSize.toString());
  if (params.customerRef) searchParams.set('CustomerRef', params.customerRef);
  if (params.status) searchParams.set('Status', params.status);
  if (params.createdDate) searchParams.set('CreatedDate', params.createdDate);

  const url = `https://profile-dev.digitvant.com/api/v1/administration/profiles?${searchParams.toString()}`;
  
  // Get SSO token for customers API
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

export const getCustomersQueryOptions = (params: CustomerQueryParams) => ({
  queryKey: ['customers', params],
  queryFn: () => getCustomers(params),
  staleTime: 5 * 60 * 1000, // 5 minutes
  enabled: true, // Ensure the query is enabled
});

export const useGetCustomersQuery = (params: CustomerQueryParams) => {
  return useQuery(getCustomersQueryOptions(params));
};

// Customer Analytics Functions
export const getCustomerAnalytics = async (params: CustomerAnalyticsQueryParams): Promise<CustomerAnalyticsResponse> => {
  const searchParams = new URLSearchParams();
  
  // Add parameters only if they have values
  if (params.startDate) searchParams.set('startDate', params.startDate);
  if (params.endDate) searchParams.set('endDate', params.endDate);

  const url = `https://profile-dev.digitvant.com/api/v1/analytics/get-summary?${searchParams.toString()}`;
  
  // Get SSO token for analytics API
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
  staleTime: 5 * 60 * 1000, // 5 minutes
  enabled: true,
});

export const useGetCustomerAnalyticsQuery = (params: CustomerAnalyticsQueryParams) => {
  return useQuery(getCustomerAnalyticsQueryOptions(params));
};

// Export Customers Function
export const exportCustomers = async (params: CustomerQueryParams, exportFormat: "CSV" | "Excel"): Promise<Blob> => {
  // Prepare request body with filter parameters
  const requestBody = {
    customerRef: params.customerRef || undefined,
    status: params.status || undefined,
    createdDate: params.createdDate || undefined,
    exportFormat: exportFormat,
    pageNumber: params.pageNumber || 1,
    pageSize: params.pageSize || 20
  };

  const url = `https://profile-dev.digitvant.com/api/v1/administration/export-profiles`;
  
  // Get SSO token for export API
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

// Get Single Customer Function
export const getSingleCustomer = async (email: string): Promise<Customer> => {
  const url = `https://profile-dev.digitvant.com/api/v1/administration/get-profile/${encodeURIComponent(email)}`;
  
  // Get SSO token for single customer API
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
  // Handle the new response structure with data wrapper
  return responseData.data;
};

export const getSingleCustomerQueryOptions = (email: string) => ({
  queryKey: ['singleCustomer', email],
  queryFn: () => getSingleCustomer(email),
  staleTime: 5 * 60 * 1000, // 5 minutes
  enabled: !!email, // Only run if email exists
});

export const useGetSingleCustomerQuery = (email: string) => {
  return useQuery(getSingleCustomerQueryOptions(email));
};

// Toggle Customer Status Function
export const toggleCustomerStatus = async (profileId: string): Promise<{ isSuccessful: boolean; message: string; code: string }> => {
  const url = `https://profile-dev.digitvant.com/api/v1/administration/toggle-profile`;
  
  // Get SSO token for toggle status API
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

// Toggle Customer Status Mutation Hook
export const useToggleCustomerStatusMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: toggleCustomerStatus,
    onSuccess: () => {
      // Invalidate and refetch customer data
      queryClient.invalidateQueries({ queryKey: ['singleCustomer'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};
