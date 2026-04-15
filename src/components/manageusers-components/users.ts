
export interface User {
    id: string;
    name: string;
    email: string;
    status: 'Active' | 'Pending' | 'Expired' | 'Suspended';
    renewalDate: string;
    renewalStatus?: 'renewed' | 'overdue' | 'due_soon' | 'current' | 'unknown';
    hasDocuments?: boolean;
    documentCount?: number;
    lastDocumentUpload?: string;
    emailVerified?: boolean;
    mustChangePassword?: boolean;
  }
  
  export interface DashboardStats {
    totalUsers: number;
    pendingRenewals: number;
    expiredUsers: number;
    usersWithDocuments?: number;
    usersWithoutDocuments?: number;
  }