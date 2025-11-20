export interface TransactionQueryParams {
  pageNumber?: number;
  pageSize?: number;
  postingReferenceNumber?: string;
  instrumentNumber?: string;
  entryCode?: string;
  batchCode?: string;
  startDate?: string;
  endDate?: string;
  direction?: string;
  accountNumber?: string;
  financialDateFrom?: string;
  financialDateTo?: string;
}

export interface Transaction {
  id: string;
  postingReferenceNumber: string;
  instrumentNumber: string;
  entryCode: string;
  batchCode: string;
  accountNumber: string;
  amount: string;
  direction: string;
  financialDate: string;
  postingDate: string;
  description: string;
  status: string;
}

export interface TransactionsResponse {
  data: Transaction[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface TransactionsApiResponse {
  data: TransactionsResponse;
  isSuccessful: boolean;
  message: string;
  code: string;
}
