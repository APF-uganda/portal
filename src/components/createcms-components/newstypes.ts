export type ArticleStatus = 'Published' | 'Draft' | 'Scheduled';


export type Category = 'Policy Update' | 'Thought Leadership' | 'Announcements' | 'SME Support';

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
  title: string;
  
 
  description: string; 
  
  
  news: Category | number; 
  
  status: ArticleStatus;
  
  
  publishDate: string | null; 
  
  
  isFeatured: boolean; 
  
  views: string;
  
 
  featuredImage?: string | number; 
  
 
  contentBlocks: ContentBlock[]; 
  
 
  readTime?: number;
}