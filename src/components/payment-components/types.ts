export interface DashboardStats {
  total_transactions: number;
  pending_revenue: number;
  total_revenue: number;
  growth_rates: {
    transactions: number;
    pending: number;
    revenue: number;
  };
}

export interface Payment {
  id: string | number;
  member_name: string;
  member_email: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  created_at?: string | null;
  invoice_number?: string;
  application_id?: string;
  reference?: string;
  proof_of_payment?: string;
  user?: string;
  requires_document_review?: boolean;
  linked_document_id?: number | null;
  linked_document_status?: string | null;
}
