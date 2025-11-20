export interface CustomerQueryParams {
  pageNumber?: number;
  pageSize?: number;
  customerRef?: string;
  status?: string;
  createdDate?: string;
}

export interface Customer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  bvnRealName: string | null;
  tier: string;
  accountNumber: string | null;
  email: string;
  dob: string;
  bvn: string | null;
  bvnIsVerified: boolean;
  hasProfilePicture: boolean;
  hasAccountNumber: boolean;
  phoneVerified: boolean;
  transactionPinSet: boolean;
  balance: number;
  profileType: string;
  productType: string | null;
  phoneNumber: string;
  address: string | null;
  coreBankId: string | null;
  requiresOtp: boolean;
  totalLimit: number;
  accruedLimit: number;
  addressDocumentSubmitted: boolean;
  addressDocumentVerified: boolean;
  totalReferrals: number;
  nin: string | null;
  bvnProfileUrl: string | null;
  bvnUrlUpdated: boolean;
  referredBy: string | null;
  gender: string;
  referralCode: string | null;
  createdDate: string;
  status: string;
}

export interface CustomersApiResponse {
  data: Customer[];
  isSuccessful: boolean;
  message: string;
  code: string;
}

// Customer Analytics Types
export interface CustomerAnalyticsResponse {
  totalUnfilteredProfiles: number;
  totalProfiles: number;
  activeProfiles: number;
  inactiveProfiles: number;
  verifiedBvnCount: number;
  migratedAccounts: number;
  totalReferralCount: number;
  accountsWithCompleteRegistration: number;
  tierDistribution: Array<{
    tier: string;
    count: number;
  }>;
  genderDistribution: Array<{
    gender: string;
    count: number;
  }>;
  recentProfiles: Array<{
    fullName: string;
    email: string;
    phoneNumber: string;
    status: string;
    tier: string;
    registeredDate: string;
  }>;
}

export interface CustomerAnalyticsQueryParams {
  startDate?: string;
  endDate?: string;
}
