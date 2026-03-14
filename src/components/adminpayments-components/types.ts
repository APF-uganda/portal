export interface Payment {
    id: number | string;
    member_name: string;
    member_email: string;
    invoice_number?: string | null;
    application_id?: string | null;
    description: string;
    amount: number;
    currency: string;
    status: string;
    created_at?: string | null;
    reference?: string;
    proof_of_payment?: string;
  }
  
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
