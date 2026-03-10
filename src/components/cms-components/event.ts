export interface PortalEvent {
  id: string; 
  documentId: string; 
  title: string;
  description: string;
  startDate: string; // ISO format (from date + time)
  endDate?: string;
  time: string; 
  location: string;
  isVirtual: boolean;
  meetingLink?: string;
  cpdPoints: number;
  featuredImage: string; // The resolved URL
  isFeatured: boolean;
  status: 'Published' | 'Draft' | 'Cancelled';
  
 
  isPaid: boolean;
  memberPrice: number;
  nonMemberPrice: number;
}