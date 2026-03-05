export type ArticleStatus = 'Published' | 'Draft' | 'Scheduled';


export type Category = 
  | 'Policy Update' 
  | 'Thought Leadership' 
  | 'Announcements' 
  | 'Ethics & Governance' 
  | 'SME Support';

export type BlockType = 'text' | 'image' | 'video' | 'attachment';

export interface ContentBlock {
  id: string;
  type: BlockType;
  value: string;     
  fileName?: string;  
  caption?: string;   
}

export interface NewsArticle {
  id: string;
  documentId?: string; 
  title: string;
  summary: string;    
  category: Category;
  status: ArticleStatus;
  date: string;        
  publishDate: string | null; 
  readTime: string;    
  isTopPick: boolean;  
  views: string | number;
  featuredImage?: string; 
  imageId?: number;   
  contentBlocks: ContentBlock[]; 
}